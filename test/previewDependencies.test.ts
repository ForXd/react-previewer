import { describe, expect, it } from 'vitest';
import { HTMLGenerator } from '../src/lib/ReactPreview/preview/utils/HTMLGenerator';

describe('preview React versions', () => {
  it.each([
    [{}, '19.2.8'],
    [{ react: '18.3.1' }, '18.3.1'],
    [{ 'react-dom': '18.3.1' }, '18.3.1'],
    [{ react: '^19.2.8', 'react-dom': '^19.2.8' }, '19.2.8']
  ])('keeps the renderer and JSX entry points aligned for %j', (dependencies, version) => {
    const html = new HTMLGenerator().generatePreviewHTML('blob:app', dependencies);
    const importMap = JSON.parse(html.match(/<script type="importmap">([\s\S]*?)<\/script>/)![1]);
    for (const [name, path] of Object.entries({
      react: `react@${version}?`,
      'react-dom': `react-dom@${version}?`,
      'react-dom/client': `react-dom@${version}/client?`,
      'react/jsx-runtime': `react@${version}/jsx-runtime?`,
      'react/jsx-dev-runtime': `react@${version}/jsx-dev-runtime?`
    })) {
      expect(importMap.imports[name]).toContain(path);
    }
  });
});
