/*
  Service worker.

  It was written as a cache-first-everything worker, which breaks the moment
  there is more than one language: the first visit precached `/`, so an English
  visitor who had ever opened the Spanish site kept being served the Spanish
  home page, and a page that had been updated in `main` kept serving the copy
  that happened to be in the cache.

  What it does now, per resource class:

  - HTML is network-first with a cache fallback. The Spanish and English trees
    are separate paths and the cache key is the full URL, so neither can be
    served for the other. Going to the network first is what keeps a page that
    was updated in `main` from surviving a deploy because someone had it open.
  - Everything else is cache-first, with the entry written after a successful
    fetch. The site's images, stylesheets and scripts are content-addressed or
    fingerprinted, so a changed one is a different URL and the stale copy is
    never asked for again.

  The old cache names are dropped on activate, so the precache-first behaviour
  does not survive from an earlier visit.
*/

const VERSION = 'v2';
const STATIC_CACHE = `vasakos-static-${VERSION}`;
const PAGE_CACHE = `vasakos-pages-${VERSION}`;
const KEEP = new Set([STATIC_CACHE, PAGE_CACHE]);

self.addEventListener('install', (event) => {
  // Nothing is precached. An empty install step that resolves immediately is
  // better than one that fetches `/` and pins whichever language got there
  // first.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isPageRequest(request) {
  // Only same-origin navigations. A cross-origin request never gets a cache
  // lookup that could put a third party's response under our origin.
  if (request.mode === 'navigate') return true;
  if (new URL(request.url).origin !== self.location.origin) return false;
  return (request.headers.get('accept') || '').includes('text/html');
}

function isStaticAsset(url) {
  return /\.(?:css|js|svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for pages: fresh when the network is there, and the last
  // known copy when it is not.
  if (isPageRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response?.ok) {
            const copy = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Cache-first for assets: they are fingerprinted, so a hit is correct.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response?.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
