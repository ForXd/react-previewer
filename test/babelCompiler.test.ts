import { afterEach, describe, expect, it, vi } from 'vitest';
import { BabelPreviewCompiler } from '../src/lib/ReactPreview/preview/compilers/babelCompiler';

describe('Babel preview compiler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['18.3.1', '19.2.8'])('compiles TSX without a React import using the requested React %s runtime', async (version) => {
    const outputBlobs: Blob[] = [];
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      outputBlobs.push(blob);
      return `blob:preview-${outputBlobs.length}`;
    });
    const compiler = new BabelPreviewCompiler();
    await compiler.initialize();
    await compiler.compile({
      entryFile: 'App.tsx',
      depsInfo: { react: version },
      files: {
        'App.tsx': `import { ReactNode } from 'react';
const label: ReactNode = 'Stable runtime';
export default function App() { return <main>{label}</main>; }`
      }
    });
    const output = await outputBlobs[0].text();
    expect(output).toContain(`react@${version}/jsx-runtime`);
    expect(output).not.toContain('jsx-dev-runtime');
    expect(output).not.toContain('ReactNode');
    expect(output).not.toContain('React.createElement');
    expect(output).toContain('data-preview-file');
  });

  it('resolves package subpath imports from the declared base package version', async () => {
    const outputBlobs: Blob[] = [];
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      outputBlobs.push(blob);
      return `blob:preview-${outputBlobs.length}`;
    });
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

    const compiler = new BabelPreviewCompiler();
    await compiler.initialize();
    const result = await compiler.compile({
      entryFile: 'App.tsx',
      depsInfo: { '@arco-design/web-react': '^2.45.0' },
      files: {
        'App.tsx': `
import React from 'react';
import { IconPlus } from '@arco-design/web-react/icon';
export default function App() { return <IconPlus />; }
`
      }
    });

    const output = await outputBlobs[0].text();
    expect(output).toContain(
      'https://esm.sh/@arco-design/web-react@2.45.0/icon?target=es2022&external=react%2Creact-dom'
    );
    expect(output).not.toContain('from "@arco-design/web-react/icon"');

    compiler.cleanup(result);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-1');
  });

  it('keeps runtime statement line numbers aligned with the source file', async () => {
    const outputBlobs: Blob[] = [];
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      outputBlobs.push(blob);
      return `blob:preview-${outputBlobs.length}`;
    });

    const source = [
      "import React from 'react';",
      '',
      'export default function App() {',
      "  const name = 'Northstar';",
      "  throw new Error('Demo runtime crash');",
      '',
      '  return <main>{name}</main>;',
      '}'
    ].join('\n');
    const compiler = new BabelPreviewCompiler();
    await compiler.initialize();
    await compiler.compile({
      entryFile: 'App.tsx',
      depsInfo: {},
      files: { 'App.tsx': source }
    });

    const output = await outputBlobs[0].text();
    expect(output.split('\n')[4]).toContain(
      "throw new Error('Demo runtime crash')"
    );
  });

  it.each([
    ["import Missing from './Missing';", './Missing'],
    ["import Missing from '@example/missing';", '@example/missing']
  ])(
    'reports unresolved import %s as a dependency error',
    async (importStatement, dependencyName) => {
      const compiler = new BabelPreviewCompiler();
      await compiler.initialize();

      await expect(
        compiler.compile({
          entryFile: 'App.tsx',
          depsInfo: {},
          files: {
            'App.tsx': `${importStatement}\nexport default function App() { return <Missing />; }`
          }
        })
      ).rejects.toMatchObject({
        name: 'PreviewDependencyError',
        dependencyName,
        fileName: 'App.tsx',
        lineNumber: 1,
        columnNumber: 1
      });
    }
  );

  it('releases already-created module URLs when a later module fails', async () => {
    const create = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:partial');
    const revoke = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);
    const compiler = new BabelPreviewCompiler();
    await compiler.initialize();
    await expect(
      compiler.compile({
        entryFile: 'App.tsx',
        depsInfo: {},
        files: {
          'Card.tsx': 'export default () => <div>Card</div>',
          'App.tsx':
            "import Card from './Card'; import Missing from 'undeclared-package'; export default () => <><Card /><Missing /></>"
        }
      })
    ).rejects.toThrow();
    expect(create).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledWith('blob:partial');
  });
});
