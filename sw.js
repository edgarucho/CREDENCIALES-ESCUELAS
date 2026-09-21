/* ============================================================
   ALUM-NA — trabajador de segundo plano
   Guarda la aplicacion en el aparato para que abra sin internet.
   Sube el numero de abajo cada vez que cambie index.html.
   ============================================================ */

var VERSION = 'alumna-v35';

var BASICOS = [
  './',
  './index.html',
  './config.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', function (ev) {
  ev.waitUntil(
    caches.open(VERSION).then(function (c) {
      // uno por uno: si alguno falla, los demas igual se guardan
      return Promise.all(BASICOS.map(function (u) {
        return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(
    caches.keys().then(function (llaves) {
      return Promise.all(llaves.map(function (k) {
        if (k !== VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (ev) {
  if (ev.data === 'yaVete') self.skipWaiting();
});

function esApi(url) {
  return url.indexOf('script.google.com') >= 0 ||
         url.indexOf('googleusercontent.com') >= 0;
}

self.addEventListener('fetch', function (ev) {
  var req = ev.request;
  if (req.method !== 'GET') return;             // lo que se manda a Google, derecho
  if (esApi(req.url)) return;

  // Abrir la pagina: se intenta la red y si no hay, sale la copia guardada.
  if (req.mode === 'navigate') {
    ev.respondWith(
      fetch(req).then(function (r) {
        var copia = r.clone();
        caches.open(VERSION).then(function (c) { c.put('./index.html', copia); });
        return r;
      }).catch(function () {
        return caches.match('./index.html').then(function (r) {
          return r || new Response('Sin conexión y sin copia guardada.',
            { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        });
      })
    );
    return;
  }

  // Todo lo demas: primero lo guardado, y de paso se refresca para la proxima.
  ev.respondWith(
    caches.match(req).then(function (guardado) {
      var red = fetch(req).then(function (r) {
        if (r && (r.ok || r.type === 'opaque')) {
          var copia = r.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copia); });
        }
        return r;
      }).catch(function () { return guardado; });
      return guardado || red;
    })
  );
});
