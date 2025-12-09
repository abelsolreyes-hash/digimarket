// Service worker actualizado:
// - No intercepta requests cross-origin (p.ej. releases/objects.githubusercontent.com)
// - Network-first para navegaciones (document)
// - Cache-first para assets same-origin
// - Limpieza de caches antiguos

const CACHE_NAME = 'digi-market-v2'; // bump para forzar actualización de cache
const urlsToCache = [
  'index.html',
  'app.html',
  'style.css',
  'styles.css', // por si hay variantes
  'script.js',
  'app.js',
  'apps.json',
  'downloads.html',
  'imgs/log.png',
  'imgs/icon2.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Elimina caches antiguos
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return Promise.resolve();
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 1) No interferir con peticiones cross-origin (GitHub, CDN, etc.)
  if (url.origin !== location.origin) {
    // Dejar que la red maneje estas peticiones (si falla, intentar cache como fallback)
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // 2) Navegaciones/documents -> network-first (asegura que la página se actualice)
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Actualizar cache con la respuesta de red
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  // 3) Otros assets same-origin -> cache-first para rendimiento
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
