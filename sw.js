/* NVISION - Service Worker de la PWA.
   Estrategia: páginas (navegación) red primero con respaldo en caché;
   recursos del propio sitio (CSS, JS, imágenes) caché primero y
   actualización en segundo plano. Lo de otros dominios (Supabase,
   fuentes, imágenes externas) NO se toca. */
'use strict';

var CACHE = 'nvision-pwa-v3';

var SHELL = [
  '/',
  '/index.html',
  '/hardware.html',
  '/redes.html',
  '/recursos.html',
  '/mantenimiento-software.html',
  '/pc3d.html',
  '/wifi.html',
  '/ruta.html',
  '/examenes.html',
  '/cuenta.html',
  '/workshop/',
  '/workshop/index.html',
  '/redes_challenge/',
  '/redes_challenge/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/og-image.jpg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: red primero; si no hay internet, la copia en caché.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
          return res;
        })
        .catch(function () {
          return caches.match(req, { ignoreSearch: true })
            .then(function (hit) { return hit || caches.match('/index.html'); });
        })
    );
    return;
  }

  // Recursos propios: caché primero (URL exacta, el sitio versiona con ?v=),
  // red en segundo plano para refrescar la copia.
  event.respondWith(
    caches.match(req).then(function (hit) {
      var network = fetch(req)
        .then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
          }
          return res;
        })
        .catch(function () { return hit; });
      return hit || network;
    })
  );
});
