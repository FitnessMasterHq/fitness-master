const CACHE="fitness-master-v7";
const CORE=[
  "./","./index.html","./style.css","./app.js",
  "./firebase-auth.js","./data/training.js","./data/nutrition.js",
  "./manifest.json","./assets/omron-2026-08-20.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Never cache Firebase/Google external resources.
  if (url.origin !== self.location.origin) return;

  // Always obtain the application/auth JS from the network first.
  // This prevents an old cached auth implementation from surviving
  // a GitHub Pages deployment.
  const pathname = url.pathname;
  if (
    pathname.endsWith("/firebase-auth.js") ||
    pathname.endsWith("/app.js") ||
    pathname.endsWith("/index.html")
  ) {
    e.respondWith(
      fetch(e.request, {cache:"no-store"})
        .then(r => {
          if (r.ok) {
            const copy = r.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return r;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
