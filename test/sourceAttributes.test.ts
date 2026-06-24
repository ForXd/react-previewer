import { describe, expect, it } from 'vitest';
import { injectJSXSourceInfo } from '../src/lib/ReactPreview/compiler/ast/processors';
import { HTMLGenerator } from '../src/lib/ReactPreview/preview/utils/HTMLGenerator';

describe('source metadata attributes', () => {
  it('uses data-preview attributes by default for injection and runtime lookup', () => {
    const code = injectJSXSourceInfo(
      'export default function App() { return <button>Save</button>; }',
      { filename: 'App.tsx', files: {} }
    );
    const html = new HTMLGenerator().generatePreviewHTML('blob:app', {}, {}, '/');

    expect(code).toContain('data-preview-file="App.tsx"');
    expect(code).toContain('data-preview-line=');
    expect(html).toContain('data-preview-file');
    expect(html).not.toContain('pipo');
  });

  it('supports custom source metadata attributes for injection and runtime lookup', () => {
    const sourceAttributeNames = {
      line: 'data-source-line',
      column: 'data-source-column',
      endLine: 'data-source-end-line',
      endColumn: 'data-source-end-column',
      file: 'data-source-file'
    };
    const code = injectJSXSourceInfo(
      'export default function App() { return <button>Save</button>; }',
      { filename: 'App.tsx', files: {}, sourceAttributeNames }
    );
    const html = new HTMLGenerator().generatePreviewHTML('blob:app', {}, {}, '/', sourceAttributeNames);

    expect(code).toContain('data-source-file="App.tsx"');
    expect(code).not.toContain('data-preview-file');
    expect(html).toContain('data-source-file');
    expect(html).not.toContain('data-preview-file');
  });
});
