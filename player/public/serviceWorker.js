let CACHE_NAME = "my-site-cache-v1";
const urlsToCache = ["/", "/index.html"];
self.addEventListener("install", function (event) {
  // Perform install steps

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

self.addEventListener("notificationclick", (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (clients.length) {
        // check if at least one tab is already open
        clients[0].focus();
      } else {
        self.clients.openWindow("/");
      }
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
