(function registerCrossOriginIsolation() {
  if (typeof window !== 'undefined') {
    registerServiceWorkerFromPage();
    return;
  }

  self.addEventListener('install', () => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener('fetch', (event) => {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
      return;
    }

    event.respondWith(addCrossOriginIsolationHeaders(event.request));
  });
})();

function registerServiceWorkerFromPage() {
  if (window.crossOriginIsolated !== false) {
    clearReloadAttempts();
    return;
  }

  if (!window.isSecureContext || !navigator.serviceWorker) {
    return;
  }

  const scriptUrl = document.currentScript?.src ?? new URL('./coi-serviceworker.js', window.location.href).href;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    reloadForCrossOriginIsolation('controllerchange');
  });

  navigator.serviceWorker.register(scriptUrl, { scope: './' })
    .then((registration) => {
      watchInstallingWorker(registration.installing);

      registration.addEventListener('updatefound', () => {
        watchInstallingWorker(registration.installing);
      });

      registration.update?.();

      if (navigator.serviceWorker.controller) {
        reloadForCrossOriginIsolation('controlled');
        return;
      }

      if (registration.active) {
        reloadForCrossOriginIsolation('active');
      }
    })
    .catch((error) => {
      console.warn('Failed to register cross-origin isolation service worker.', error);
    });
}

function watchInstallingWorker(worker) {
  worker?.addEventListener('statechange', () => {
    if (worker.state === 'activated') {
      reloadForCrossOriginIsolation('updated');
    }
  });
}

async function addCrossOriginIsolationHeaders(request) {
  const response = await fetch(request);

  if (response.status === 0) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function reloadForCrossOriginIsolation(reason) {
  if (window.crossOriginIsolated !== false) {
    clearReloadAttempts();
    return;
  }

  const attempts = Number(window.sessionStorage.getItem(getReloadAttemptsKey()) ?? '0');
  if (attempts >= 2) {
    console.warn(`Cross-origin isolation service worker did not enable isolation after ${attempts} reloads.`);
    return;
  }

  window.sessionStorage.setItem(getReloadAttemptsKey(), String(attempts + 1));
  window.sessionStorage.setItem('react-previewer:coi-reload-reason', reason);
  window.location.reload();
}

function clearReloadAttempts() {
  window.sessionStorage.removeItem(getReloadAttemptsKey());
  window.sessionStorage.removeItem('react-previewer:coi-reload-reason');
}

function getReloadAttemptsKey() {
  return `react-previewer:coi-reload-attempts:${new URL('./coi-serviceworker.js', window.location.href).href}`;
}
