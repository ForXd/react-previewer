const RELOAD_STORAGE_KEY = 'react-previewer:coi-serviceworker-reload';

export async function ensureCrossOriginIsolation(): Promise<void> {
  if (!import.meta.env.PROD) {
    return;
  }

  if (
    typeof window === 'undefined' ||
    !window.isSecureContext ||
    window.crossOriginIsolated ||
    !('serviceWorker' in navigator)
  ) {
    clearReloadMarker();
    return;
  }

  try {
    await navigator.serviceWorker.register(
      new URL('./coi-serviceworker.js', window.location.href),
      { scope: './' }
    );
    await navigator.serviceWorker.ready;

    if (!window.crossOriginIsolated && !hasReloadedForServiceWorker()) {
      markReloadedForServiceWorker();
      window.location.reload();
    }
  } catch (error) {
    console.warn('Failed to enable cross-origin isolation for Rspack browser compilation.', error);
    clearReloadMarker();
  }
}

function hasReloadedForServiceWorker(): boolean {
  return window.sessionStorage.getItem(RELOAD_STORAGE_KEY) === '1';
}

function markReloadedForServiceWorker(): void {
  window.sessionStorage.setItem(RELOAD_STORAGE_KEY, '1');
}

function clearReloadMarker(): void {
  window.sessionStorage.removeItem(RELOAD_STORAGE_KEY);
}
