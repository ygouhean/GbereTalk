const CACHE_NAME = 'gberetalk-cache-v1';
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/css/app.min.css',
  '/assets/css/bootstrap.min.css',
  '/assets/css/icons.min.css',
  '/assets/js/app.min.js',
  '/assets/libs/bootstrap/js/bootstrap.bundle.min.js',
  '/assets/libs/jquery/jquery.min.js',
  '/assets/libs/simplebar/simplebar.min.js',
  '/assets/images/favicon.png',
  '/assets/images/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const isGET = request.method === 'GET';
  const isAPI = request.url.includes('/api/');

  if (!isGET) return; // ne pas mettre en cache les autres méthodes

  // Réseau d'abord pour l'API, sinon cache d'abord avec mise à jour
  if (isAPI) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});


