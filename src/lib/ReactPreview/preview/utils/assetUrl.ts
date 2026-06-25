const JSDELIVR_GITHUB_PAGE_ASSET_PATH = /^\/gh\/[^/]+\/([^/@]+)@.+\/page\//;

export function resolveSameOriginGitHubPageAssetUrl(assetUrl: URL, pageOrigin: string): URL {
  const origin = new URL(pageOrigin).origin;

  if (assetUrl.origin === origin) {
    return assetUrl;
  }

  const match = assetUrl.pathname.match(JSDELIVR_GITHUB_PAGE_ASSET_PATH);
  if (!match) {
    return assetUrl;
  }

  const [, repository] = match;
  const assetPath = assetUrl.pathname.slice(match[0].length);
  const sameOriginUrl = new URL(`/${repository}/${assetPath}`, origin);
  sameOriginUrl.search = assetUrl.search;
  sameOriginUrl.hash = assetUrl.hash;

  return sameOriginUrl;
}
