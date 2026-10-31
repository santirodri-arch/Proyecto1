'use strict';
// No se guardan en caché fichas, sesiones, respuestas de Supabase ni HTML de la aplicación.
// Solo recursos estáticos y una página informativa sin datos de equipos.
const PREFIX = 'uegir-pwa-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + 'v1';
const ASSETS = ['offline.html', 'pwa.css', 'pwa.js', 'manifest.webmanifest',
 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
const URLS = new Set(ASSETS.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
 event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(ASSETS.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' })));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch', event => {
 const req = event.request;
 if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
 if (req.mode === 'navigate') {
  event.respondWith((async () => {
   try { return await fetch(req); }
   catch { return (await caches.match(new URL('offline.html', self.registration.scope).href)) || Response.error(); }
  })());
 } else if (URLS.has(req.url)) {
  event.respondWith((async () => {
   const cache = await caches.open(CACHE);
   return (await cache.match(req)) || fetch(req);
  })());
 }
});
