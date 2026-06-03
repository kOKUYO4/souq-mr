const CACHE = "souq-mr-v1";
const STATIC = [
  "/",
  "/annonces",
  "/aide",
  "/manifest.json",
  "/icon-192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC.map(u => new Request(u, { cache: "reload" })).filter(() => true)).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request).then((res) => {
            c.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((c) => c || caches.match("/")))
  );
});
