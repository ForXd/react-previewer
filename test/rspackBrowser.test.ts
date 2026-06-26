import { describe, expect, it, vi } from 'vitest';
import { FileProcessor } from '../src/lib/ReactPreview/preview/utils/FileProcessor';
import {
  compileRspackBrowserProject,
  createRspackBrowserConfig,
  type RspackBrowserModule
} from '../src/lib/ReactPreview/preview/compilers/rspackBrowser';

class FakeVolume {
  files: Record<string, string> = {};

  reset(): void {
    this.files = {};
  }

  fromJSON(json: Record<string, string>): void {
    this.files = { ...json };
  }

  readFileSync(path: string): string {
    const file = this.files[path];
    if (typeof file !== 'string') {
      throw new Error(`Missing fake memfs file: ${path}`);
    }
    return file;
  }
}

class FakeBrowserHttpImportEsmPlugin {
  options: unknown;

  constructor(options: unknown) {
    this.options = options;
  }

  apply(): void {
    return;
  }
}

describe('rspack browser compiler support', () => {
  it('creates an ESM rspack config with known preview dependencies externalized', () => {
    const config = createRspackBrowserConfig(
      {
        files: { 'App.tsx': 'export default function App() { return null; }' },
        entryFile: 'App.tsx',
        depsInfo: { antd: '5.18.0' }
      },
      { cdnDomain: 'https://cdn.example.test' },
      { BrowserHttpImportEsmPlugin: FakeBrowserHttpImportEsmPlugin }
    );

    expect(config.entry).toBe('/src/App.tsx');
    expect(config.output).toMatchObject({
      path: '/dist',
      filename: 'main.js',
      module: true,
      library: { type: 'module' }
    });
    expect(config.experiments).toMatchObject({
      outputModule: true,
      buildHttp: { allowedUris: ['https://'] }
    });
    expect(config.module).toMatchObject({
      rules: [
        expect.objectContaining({
          use: [
            expect.objectContaining({
              loader: 'builtin:swc-loader',
              options: expect.objectContaining({
                jsc: expect.objectContaining({
                  transform: expect.objectContaining({
                    react: expect.objectContaining({
                      runtime: 'automatic',
                      development: false
                    })
                  })
                })
              })
            })
          ]
        }),
        expect.objectContaining({
          type: 'css/auto'
        })
      ]
    });

    const externals = config.externals as Array<(
      context: { request?: string },
      callback: (error?: Error | null, result?: string, type?: string) => void
    ) => void>;
    let callbackArgs: [Error | null | undefined, string | undefined, string | undefined] | null = null;
    externals[0]?.({ request: 'antd' }, (error, result, type) => {
      callbackArgs = [error, result, type];
    });

    expect(callbackArgs).toEqual([null, 'antd', 'module']);
    externals[0]?.({ request: 'react/jsx-dev-runtime' }, (error, result, type) => {
      callbackArgs = [error, result, type];
    });

    expect(callbackArgs).toEqual([null, 'react/jsx-dev-runtime', 'module']);
    expect(config.plugins).toHaveLength(1);
  });

  it('preserves module imports and rewrites local css imports for preview injection', async () => {
    const volume = new FakeVolume();
    const captured: { config?: Record<string, unknown> } = {};
    const fakeRspack: RspackBrowserModule = {
      builtinMemFs: { volume },
      BrowserHttpImportEsmPlugin: FakeBrowserHttpImportEsmPlugin,
      rspack(config, callback) {
        captured.config = config;
        expect(volume.files['/src/App.tsx']).toContain("from './Button'");
        expect(volume.files['/src/App.tsx']).not.toContain("import './style.css'");
        expect(volume.files['/src/App.tsx']).toContain('__reactPreviewInjectStyle');
        expect(volume.files['/src/App.tsx']).toContain('button { color: red; }');
        expect(volume.files['/src/App.tsx']).toContain('data-preview-file="App.tsx"');
        expect(volume.files['/src/Button.tsx']).toContain('data-preview-file="Button.tsx"');
        expect(volume.files['/src/Button.tsx']).toContain('data-preview-line=');
        volume.files['/dist/preview.js'] = 'export default function App() { return null; }';
        callback(null, {
          hasErrors: () => false,
          toJson: () => ({
            assets: [
              { name: 'preview.js' }
            ]
          })
        });
        return null;
      }
    };

    const result = await compileRspackBrowserProject(
      {
        entryFile: 'App.tsx',
        depsInfo: { '@arco-design/web-react': '2.66.1' },
        files: {
          'App.tsx': `
import Button from './Button';
import './style.css';

export default function App() {
  return <Button />;
}
`,
          'Button.tsx': `
export default function Button() {
  return <button>Save</button>;
}
`,
          'style.css': 'button { color: red; }'
        }
      },
      { outputFileName: 'preview.js', useWorker: false },
      fakeRspack
    );

    expect(captured.config?.entry).toBe('/src/App.tsx');
    expect(result).toEqual({
      outputFileName: 'preview.js',
      output: 'export default function App() { return null; }',
      transformedFiles: 3
    });
  });

  it('rewrites package css imports before rspack compilation', async () => {
    const volume = new FakeVolume();
    const fakeRspack: RspackBrowserModule = {
      builtinMemFs: { volume },
      rspack(_config, callback) {
        expect(volume.files['/src/App.tsx']).not.toContain("import '@arco-design/web-react/dist/css/arco.css'");
        expect(volume.files['/src/App.tsx']).toContain('__reactPreviewLoadStyle');
        expect(volume.files['/src/App.tsx']).toContain('https://esm.sh/@arco-design/web-react@2.66.1/dist/css/arco.css');
        expect(volume.files['/src/App.tsx']).toContain('"@arco-design/web-react/dist/css/arco.css"');
        volume.files['/dist/preview.js'] = 'export default function App() { return null; }';
        callback(null, { hasErrors: () => false });
        return null;
      }
    };

    await compileRspackBrowserProject(
      {
        entryFile: 'App.tsx',
        depsInfo: { '@arco-design/web-react': '2.66.1' },
        files: {
          'App.tsx': `
import '@arco-design/web-react/dist/css/arco.css';

export default function App() {
  return <button>Save</button>;
}
`
        }
      },
      { outputFileName: 'preview.js', useWorker: false },
      fakeRspack
    );
  });

  it('rewrites local css imports that include resource queries', async () => {
    const volume = new FakeVolume();
    const fakeRspack: RspackBrowserModule = {
      builtinMemFs: { volume },
      rspack(_config, callback) {
        expect(volume.files['/src/App.tsx']).not.toContain("import './style.css?inline'");
        expect(volume.files['/src/App.tsx']).toContain('__reactPreviewInjectStyle');
        expect(volume.files['/src/App.tsx']).toContain('button { color: green; }');
        volume.files['/dist/preview.js'] = 'export default function App() { return null; }';
        callback(null, { hasErrors: () => false });
        return null;
      }
    };

    await compileRspackBrowserProject(
      {
        entryFile: 'App.tsx',
        depsInfo: {},
        files: {
          'App.tsx': `
import './style.css?inline';

export default function App() {
  return <button>Save</button>;
}
`,
          'style.css': 'button { color: green; }'
        }
      },
      { outputFileName: 'preview.js', useWorker: false },
      fakeRspack
    );
  });

  it('rewrites external import specifiers in the rspack output to CDN URLs', async () => {
    const volume = new FakeVolume();
    const fakeRspack: RspackBrowserModule = {
      builtinMemFs: { volume },
      rspack(_config, callback) {
        volume.files['/dist/preview.js'] = [
          'import * as ArcoIcon from "@arco-design/web-react/icon";',
          'import * as React from "react";',
          'export default function App() { return React.createElement(ArcoIcon.IconPlus); }'
        ].join('\n');
        callback(null, { hasErrors: () => false });
        return null;
      }
    };

    const result = await compileRspackBrowserProject(
      {
        entryFile: 'App.tsx',
        depsInfo: { '@arco-design/web-react': '^2.45.0' },
        files: {
          'App.tsx': `
import { IconPlus } from '@arco-design/web-react/icon';

export default function App() {
  return <IconPlus />;
}
`
        }
      },
      { outputFileName: 'preview.js', useWorker: false },
      fakeRspack
    );

    expect(result.output).not.toContain('from "@arco-design/web-react/icon"');
    expect(result.output).toContain(
      'from "https://esm.sh/@arco-design/web-react@2.45.0/icon?target=es2022&external=react%2Creact-dom"'
    );
    expect(result.output).toContain('from "https://esm.sh/react@18.2.0?target=es2022"');
  });

  it('supports custom source metadata attribute names', async () => {
    const volume = new FakeVolume();
    const fakeRspack: RspackBrowserModule = {
      builtinMemFs: { volume },
      rspack(_config, callback) {
        expect(volume.files['/src/App.tsx']).toContain('data-source-file="App.tsx"');
        expect(volume.files['/src/App.tsx']).toContain('data-source-line=');
        expect(volume.files['/src/App.tsx']).not.toContain('data-preview-file');
        volume.files['/dist/preview.js'] = 'export default function App() { return null; }';
        callback(null, { hasErrors: () => false });
        return null;
      }
    };

    await compileRspackBrowserProject(
      {
        entryFile: 'App.tsx',
        depsInfo: {},
        sourceAttributeNames: {
          line: 'data-source-line',
          column: 'data-source-column',
          endLine: 'data-source-end-line',
          endColumn: 'data-source-end-column',
          file: 'data-source-file'
        },
        files: {
          'App.tsx': 'export default function App() { return <button>Save</button>; }'
        }
      },
      { outputFileName: 'preview.js', useWorker: false },
      fakeRspack
    );
  });

  it('fails early with a clear error when cross-origin isolation is missing', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crossOriginIsolated');
    Object.defineProperty(globalThis, 'crossOriginIsolated', {
      configurable: true,
      value: false
    });

    try {
      await expect(
        compileRspackBrowserProject({
          entryFile: 'App.tsx',
          depsInfo: {},
          files: {
            'App.tsx': 'export default function App() { return null; }'
          }
        })
      ).rejects.toThrow('requires cross-origin isolation');
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, 'crossOriginIsolated', descriptor);
      } else {
        delete (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated;
      }
    }
  });

  it('allows FileProcessor to use a custom compiler and release its result', async () => {
    const cleanup = vi.fn();
    const compile = vi.fn(async () => ({
      fileUrls: new Map([['Custom.tsx', 'blob:custom']]),
      entryFile: 'Custom.tsx',
      transformedFiles: 1,
      cleanup
    }));
    const processor = new FileProcessor({ compile });

    const result = await processor.processFiles(
      { 'Custom.tsx': 'export default function Custom() { return null; }' },
      {},
      'Custom.tsx'
    );

    expect(result.entryFile).toBe('Custom.tsx');
    expect(compile).toHaveBeenCalledOnce();

    await processor.cleanup();
    expect(cleanup).toHaveBeenCalledOnce();
  });
});
