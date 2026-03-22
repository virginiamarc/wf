const CACHE_NAME = "wheelfoodie-cache-v1";
const ASSETS = [
  "/WheelFoodie/",
  "/WheelFoodie/index.html",
  "/WheelFoodie/menu.html",
  "/WheelFoodie/specials.html",
  "/WheelFoodie/locations.html",
  "/WheelFoodie/about.html",
  "/WheelFoodie/booking.html",
  "/WheelFoodie/assets/css/style.css",
  "/WheelFoodie/assets/media/logo.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});