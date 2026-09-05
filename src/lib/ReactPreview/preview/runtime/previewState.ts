import type { PreviewRouteState, PreviewStatus } from '../types';

export const createInitialStatus = (): PreviewStatus => ({
  isLoading: true,
  phase: 'compiling',
  error: null,
  compileDuration: null,
  transformedFiles: 0,
  resourceTotal: 0,
  resourceLoaded: 0,
  resourceProgress: 0,
  currentResource: undefined
});

export function normalizePreviewPath(path = '/'): string {
  try {
    const url = new URL(path.trim() || '/', 'https://preview.local');
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}

export function toRouteState(data: Record<string, unknown>): PreviewRouteState {
  const pathname =
    typeof data.pathname === 'string' && data.pathname ? data.pathname : '/';
  const search = typeof data.search === 'string' ? data.search : '';
  const hash = typeof data.hash === 'string' ? data.hash : '';
  return { pathname, search, hash, href: `${pathname}${search}${hash}` };
}

export function resourceStatus(
  data: Record<string, unknown>
): Pick<
  PreviewStatus,
  'resourceTotal' | 'resourceLoaded' | 'resourceProgress' | 'currentResource'
> {
  const finite = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value)
      ? Math.max(0, value)
      : 0;
  const resourceTotal = finite(data.resourceTotal);
  return {
    resourceTotal,
    resourceLoaded: Math.min(resourceTotal, finite(data.resourceLoaded)),
    resourceProgress: Math.min(100, finite(data.resourceProgress)),
    currentResource:
      typeof data.currentResource === 'string'
        ? data.currentResource
        : undefined
  };
}
