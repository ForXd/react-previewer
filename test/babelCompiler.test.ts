import { afterEach, describe, expect, it, vi } from 'vitest';
import { BabelPreviewCompiler } from '../src/lib/ReactPreview/preview/compilers/babelCompiler';

describe('Babel preview compiler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
});
