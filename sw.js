// sw.js — Service Worker for offline capability & local caching

const CACHE_NAME = 'prawo-jazdy-offline-v3';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './manifest.json',
  './src/styles.css',
  './src/app.js',
  './src/compendium-data.js',
  './src/signs-data.js',
  './src/icons/icon-192.png',
  './src/icons/icon-512.png',
  './src/icons/apple-touch-icon.png',
  './src/icons/favicon.png',
  './data/meta.json',
  './data/B.json',
  './data/A.json',
  './data/A1.json',
  './data/A2.json',
  './data/AM.json',
  './data/B1.json',
  './data/C.json',
  './data/C1.json',
  './data/D.json',
  './data/D1.json',
  './data/PT.json',
  './data/T.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Robust caching: add each asset individually so one network issue won't abort the entire cache
      await Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn(`[SW] Cache error for ${url}:`, err);
          })
        )
      );
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // 1. Navigation requests (HTML page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          if (cached) return cached;
          return caches.match('./index.html').then(idx => {
            if (idx) return idx;
            return caches.match('./');
          });
        })
        .then(cached => {
          // If cached, return immediately and fetch update in background
          if (cached) {
            fetch(event.request).then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
              }
            }).catch(() => {});
            return cached;
          }
          // If not in cache, fetch from network with offline fallback
          return fetch(event.request).catch(async () => {
            return (await caches.match('./index.html')) || (await caches.match('./'));
          });
        })
    );
    return;
  }

  // 2. Same-origin assets (JS, CSS, JSON question files, icons)
  if (requestUrl.origin === location.origin) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(cached => {
        if (cached) {
          // Revalidate in background if online
          fetch(event.request).then(response => {
            if (response && response.status === 200 && response.type === 'basic') {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            }
          }).catch(() => {});
          return cached;
        }

        // Cache miss: fetch from network and store in cache
        return fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        }).catch(err => {
          console.warn('[SW] Fetch failed for:', event.request.url, err);
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
    );
    return;
  }

  // 3. External assets (CDN images & videos)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        return new Response('', { status: 408, statusText: 'Offline Media' });
      });
    })
  );
});
