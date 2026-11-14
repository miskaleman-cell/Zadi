// Service Worker - زادي | v2.0.19
// Static assets: cache-first. Quran API: network-first with successful-response fallback.
// Volatile APIs (prayer times, exchange rates, geocoding): never persist in cache.
const CACHE_VERSION = 'zadi-v2-0-19';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const STATIC_ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('zadi-') && key !== STATIC_CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isQuranAPI = /alquran\.cloud|quran/.test(url.hostname + url.pathname);
  const isVolatileAPI = /aladhan\.com|gold-api\.com|nominatim\.openstreetmap\.org|exchangerate/.test(url.hostname + url.pathname);

  if (isVolatileAPI) {
    // Always require fresh network data; do not silently reuse stale prayer/price/location values.
    event.respondWith(fetch(request));
    return;
  }
  if (isQuranAPI) {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok && response.type !== 'opaque') {
        const copy = response.clone();
        caches.open(STATIC_CACHE).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      return new Response('Quran data unavailable offline', {status: 503, headers: {'Content-Type':'text/plain; charset=utf-8'}});
    }));
    return;
  }

  event.respondWith(caches.match(request).then(cached => {
    const network = fetch(request).then(response => {
      if (response && response.ok && response.type !== 'opaque') {
        const copy = response.clone();
        caches.open(STATIC_CACHE).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    }).catch(() => cached || new Response('Resource unavailable offline', {status:503}));
    return cached || network;
  }));
});
