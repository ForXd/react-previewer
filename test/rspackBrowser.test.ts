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

    const externals = config.externals as Array<(
      context: { request?: string },
      callback: (error?: Error | null, result?: string, type?: string) => void
    ) => void>;
    let callbackArgs: [Error | null | undefined, string | undefined, string | undefined] | null = null;
    externals[0]?.({ request: 'antd' }, (error, result, type) => {
      callbackArgs = [error, result, type];
    });

    expect(callbackArgs).toEqual([null, 'antd', 'module']);
    expect(config.plugins).toHaveLength(1);
  });

  it('preserves local imports, converts CSS imports, and returns rspack output', async () => {
    const volume = new FakeVolume();
    const captured: { config?: Record<string, unknown> } = {};
    const fakeRspack: RspackBrowserModule = {
      builtinMemFs: { volume },
      BrowserHttpImportEsmPlugin: FakeBrowserHttpImportEsmPlugin,
      rspack(config, callback) {
        captured.config = config;
        expect(volume.files['/src/App.tsx']).toContain("from './Button'");
        expect(volume.files['/src/App.tsx']).toContain('__reactPreviewInjectStyle');
        volume.files['/dist/preview.js'] = 'export default function App() { return null; }';
        callback(null, { hasErrors: () => false });
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
