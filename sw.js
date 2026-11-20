// Service worker : rend les pages installables (plein ecran) et les garde en cache si le reseau coupe.
// Pour les fichiers du site, on REVALIDE toujours aupres du serveur (cache: 'no-cache') : les modifs arrivent des qu'il y a du reseau.
const C = 'vroom-v3';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png'])).catch(() => {}));
});
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const same = new URL(e.request.url).origin === location.origin;
  e.respondWith(
    fetch(e.request, same ? { cache: 'no-cache' } : undefined).then(r => {
      if (same) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
