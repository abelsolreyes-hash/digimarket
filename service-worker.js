const CACHE_NAME = "digi-market-v1";
const urlsToCache = [
  "index.html",
  "app.html",
  "styles.css",
  "script.js",
  "app.js",
  "apps.json",
  "imgs/log.png",
  "imgs/icon2.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});