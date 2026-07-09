/** @vitest-environment jsdom */

import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ReactPreviewer,
  type PreviewCompileResult,
  type PreviewCompiler
} from '../src/lib/ReactPreview';

const files = {
  'App.tsx': [
    "import Button from './Button';",
    '',
    'export default function App() {',
    '  return <Button />;',
    '}'
  ].join('\n'),
  'Button.tsx': [
    'export default function Button() {',
    "  const label = 'Save';",
    '',
    '  if (!label) return null;',
    "  throw new Error('Demo runtime crash');",
    '}'
  ].join('\n')
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function createCompiler(result: PreviewCompileResult): PreviewCompiler & { compile: ReturnType<typeof vi.fn> } {
  return {
    compile: vi.fn(async () => result)
  };
}

function postPreviewMessage(
  iframe: HTMLIFrameElement,
  type: string,
  data: Record<string, unknown>
) {
  act(() => {
    window.dispatchEvent(new MessageEvent('message', {
      source: iframe.contentWindow,
      data: { type, data }
    }));
  });
}

describe('ReactPreviewer error presentation', () => {
  it('shows compiler diagnostics with one-based source coordinates', async () => {
    const onError = vi.fn();
    const compiler: PreviewCompiler = {
      async compile() {
        throw new Error([
          'Failed to transform App.tsx: SyntaxError: /App.tsx: Unexpected token (7:14)',
          '  6 |   return (',
          '> 7 |     <main broken=>',
          '    |              ^'
        ].join('\n'));
      }
    };

    render(
      <ReactPreviewer
        files={files}
        compiler={compiler}
        compileDelay={0}
        onError={onError}
      />
    );

    expect(await screen.findByText('Compile error')).toBeTruthy();
    expect(screen.getByText('App.tsx:7:15')).toBeTruthy();
    expect(screen.getByText((_, element) => (
      element?.tagName === 'PRE' && element.textContent?.includes('> 7 |     <main broken=>') === true
    ))).toBeTruthy();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        type: 'compile',
        fileName: 'App.tsx',
        lineNumber: 7,
        columnNumber: 15
      })
    );
  });

  it.each(['dependency-error', 'resource-error'])('shows %s messages as dependency errors', async (type) => {
    const onError = vi.fn();
    const compiler = createCompiler({
      entryFile: 'App.tsx',
      fileUrls: new Map([['App.tsx', 'blob:preview-entry']]),
      transformedFiles: 2
    });

    render(
      <ReactPreviewer
        files={files}
        compiler={compiler}
        compileDelay={0}
        iframeTitle="dependency preview"
        onError={onError}
      />
    );
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());

    const iframe = screen.getByTitle('dependency preview') as HTMLIFrameElement;
    postPreviewMessage(iframe, type, {
      name: '@example/missing',
      url: 'https://esm.sh/@example/missing@1.0.0',
      error: 'Failed to fetch dynamically imported module'
    });

    expect(await screen.findByText('Dependency error')).toBeTruthy();
    expect(screen.getByText('@example/missing')).toBeTruthy();
    expect(screen.getByText('https://esm.sh/@example/missing@1.0.0')).toBeTruthy();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        type: 'dependency',
        dependencyName: '@example/missing'
      })
    );
  });

  it('maps a bundled runtime stack back to the original secondary file', async () => {
    const sourceMap = JSON.stringify({
      version: 3,
      sources: ['webpack:///./src/Button.tsx'],
      names: [],
      mappings: ';AAIE',
      sourcesContent: [files['Button.tsx']]
    });
    const compiler = createCompiler({
      entryFile: 'App.tsx',
      fileUrls: new Map([
        ['App.tsx', 'blob:rspack-bundle'],
        ['main.js', 'blob:rspack-bundle']
      ]),
      sourceMaps: new Map([['blob:rspack-bundle', sourceMap]]),
      transformedFiles: 2
    });

    render(
      <ReactPreviewer
        files={files}
        compiler={compiler}
        compileDelay={0}
        iframeTitle="runtime preview"
      />
    );
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());

    const iframe = screen.getByTitle('runtime preview') as HTMLIFrameElement;
    postPreviewMessage(iframe, 'runtime-error', {
      filename: 'blob:rspack-bundle',
      lineno: 99,
      colno: 999,
      message: 'Demo runtime crash',
      stack: 'Error: Demo runtime crash\n    at Button (blob:rspack-bundle:2:10)'
    });

    expect(await screen.findByText('Runtime error')).toBeTruthy();
    expect(screen.getByText('Button.tsx:5:3')).toBeTruthy();
    expect(screen.getByText((_, element) => (
      element?.tagName === 'CODE'
      && element.textContent?.includes("throw new Error('Demo runtime crash');") === true
    ))).toBeTruthy();
  });
});
