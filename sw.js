// ══════════════════════════════════════════════
// Beydun Agriculture System — Service Worker
// ══════════════════════════════════════════════

// ⚠️ رقم الإصدار يُحدَّث تلقائياً من index.html عبر postMessage
// لتغيير الإصدار يدوياً: غيّر APP_VERSION في index.html فقط
let CACHE_NAME = 'beydun-agro-v28';

// Local app shell + CDN assets to pre-cache for offline use
const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-192.png',
  'icon-maskable-512.png',
  'icon-180.png',
  'favicon-32.png',
  'favicon-16.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5/files/cairo-arabic-400-normal.woff2',
  'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5/files/cairo-arabic-700-normal.woff2',
  'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5/files/cairo-arabic-900-normal.woff2',
  'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5/files/cairo-latin-400-normal.woff2',
  'https://cdn.jsdelivr.net/npm/@fontsource/cairo@5/files/cairo-latin-700-normal.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache each resource individually, ignore individual failures
      return Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => console.log('SW: skip', url)))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;
  const url = e.request.url;
  // Skip non-http(s) requests (e.g. chrome-extension://)
  if (!url.startsWith('http')) return;

  const isCDN = url.includes('cdn.jsdelivr.net') || url.includes('cdnjs.cloudflare.com');

  if (isCDN) {
    // Cache-first for CDN assets (fonts, xlsx lib) — they rarely change
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => cached || new Response('', { status: 503 }));
      })
    );
  } else {
    // Network-first for the app itself, falling back to cache when offline
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(cached => cached || new Response('', { status: 503 })))
    );
  }
});

// Listen for messages from the main app
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
  // رقم الإصدار يُرسَل من index.html عند التسجيل
  // يُستخدم لتسمية الكاش تلقائياً دون تعديل يدوي في هذا الملف
  if (e.data && e.data.type === 'SET_VERSION') {
    const newCache = 'beydun-agro-v' + e.data.version;
    if (newCache !== CACHE_NAME) {
      const oldCache = CACHE_NAME;
      CACHE_NAME = newCache;
      // حذف الكاش القديم فوراً
      caches.delete(oldCache).then(() => {
        console.log('SW: cache updated to', CACHE_NAME);
      });
    }
  }
});
