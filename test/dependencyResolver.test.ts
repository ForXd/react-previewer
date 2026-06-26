import { describe, expect, it } from 'vitest';
import {
  generateDynamicDependencyLoader,
  resolveDependencyUrl,
  transformDepsToEsmLinks
} from '../src/lib/ReactPreview/preview/DependencyResolver';

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

  it('normalizes npm range versions when creating esm.sh URLs', () => {
    const result = transformDepsToEsmLinks({
      '@arco-design/web-react': '^2.45.0'
    });

    expect(result.dependencies['@arco-design/web-react']).toContain(
      'https://esm.sh/@arco-design/web-react@2.45.0'
    );
    expect(result.dependencies['@arco-design/web-react']).not.toContain('@^2.45.0');
  });

  it('resolves package subpath URLs from the base package version', () => {
    expect(resolveDependencyUrl(
      '@arco-design/web-react/icon',
      { '@arco-design/web-react': '^2.45.0' }
    )).toBe('https://esm.sh/@arco-design/web-react@2.45.0/icon?target=es2022');
  });
});
