// ==================== Service Worker - زادي ====================
// استراتيجية: Cache First للأصول الثابتة، Network First مع fallback للبيانات الديناميكية (أوقات الصلاة، أسعار الصرف)

const CACHE_VERSION = 'zadi-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ---- Install: تخزين الأصول الأساسية مسبقاً ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ---- Activate: حذف أي نسخ كاش قديمة من إصدارات سابقة ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('zadi-') && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ---- Fetch: التعامل مع الطلبات ----
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // طلبات API الخارجية (أوقات الصلاة، أسعار الصرف، الموقع، القرآن) → Network First
  // لأن هذه بيانات تتغيّر، لكن نوفّر fallback من الكاش إن لم يوجد إنترنت
  const isDynamicAPI = /aladhan\.com|nominatim\.openstreetmap\.org|exchangerate|alquran\.cloud|quran/.test(url.hostname + url.pathname);

  if (isDynamicAPI) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // باقي الطلبات (الملف نفسه، الخطوط، الأيقونات) → Cache First مع تحديث في الخلفية
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
