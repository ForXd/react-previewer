import { describe, expect, it } from 'vitest';
import { resolveSameOriginGitHubPageAssetUrl } from '../src/lib/ReactPreview/preview/utils/assetUrl';

describe('asset url helpers', () => {
  it('keeps same-origin assets unchanged', () => {
    const assetUrl = new URL('https://forxd.github.io/react-previewer/assets/worker.js');
    const result = resolveSameOriginGitHubPageAssetUrl(assetUrl, 'https://forxd.github.io');

    expect(result).toBe(assetUrl);
  });

  it('maps jsDelivr GitHub page assets back to the GitHub Pages origin', () => {
    const result = resolveSameOriginGitHubPageAssetUrl(
      new URL('https://fastly.jsdelivr.net/gh/ForXd/react-previewer@main/page/assets/rspackBrowser.worker-BFJxaqLJ.js?x=1#worker'),
      'https://forxd.github.io'
    );

    expect(result.href).toBe('https://forxd.github.io/react-previewer/assets/rspackBrowser.worker-BFJxaqLJ.js?x=1#worker');
  });

  it('keeps non-GitHub-page cross-origin assets unchanged', () => {
    const assetUrl = new URL('https://cdn.example.com/assets/worker.js');
    const result = resolveSameOriginGitHubPageAssetUrl(assetUrl, 'https://forxd.github.io');

    expect(result).toBe(assetUrl);
  });
});
