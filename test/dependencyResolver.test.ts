import { describe, expect, it } from 'vitest';
import { generateDynamicDependencyLoader } from '../src/lib/ReactPreview/preview/DependencyResolver';

describe('dynamic dependency loader', () => {
  it('loads cross-origin stylesheet and script resources with CORS enabled', () => {
    const loader = generateDynamicDependencyLoader(
      { react: '18.2.0' },
      {},
      [
        {
          name: '@arco-design/web-react',
          url: 'https://esm.sh/@arco-design/web-react@2.66.1/dist/css/arco.min.css'
        }
      ]
    );

    expect(loader).toContain("element.crossOrigin = 'anonymous'");
    expect(loader).toContain('applyCrossOrigin(link, url)');
    expect(loader).toContain('applyCrossOrigin(script, tailwindResource.url)');
    expect(loader).toContain('https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.10');
  });
});
