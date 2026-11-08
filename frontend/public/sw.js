// Service worker de Vecinos App: guarda la app en el celular para que
// abra aunque no haya internet. Los DATOS se guardan aparte (src/lib/cache.ts).
// Si cambias este archivo, sube el número de versión para renovar la caché.
const CACHE = 'vecinos-app-v1';
const SHELL = ['/', '/index.html', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// La página nos manda la lista de archivos que ya cargó para guardarlos de una vez
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) => Promise.all(event.data.urls.map((url) => cache.add(url).catch(() => null)))),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // La API de Supabase NO pasa por aquí (solo se guardan sus imágenes)
  if (url.hostname.endsWith('supabase.co') && !url.pathname.startsWith('/storage/')) return;

  // Páginas: primero internet; sin señal, la última versión guardada
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/'))),
    );
    return;
  }

  // Archivos (JS, CSS, fuentes, imágenes): lo guardado al instante y se actualiza por detrás
  const isAsset =
    url.origin === self.location.origin ||
    ['image', 'font', 'style', 'script'].includes(request.destination);
  if (!isAsset) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok || response.type === 'opaque') {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
