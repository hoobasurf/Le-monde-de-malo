const CACHE_NAME = ‘malo-world-v1’;
const ASSETS = [
‘/’,
‘/index.html’,
‘/manifest.json’,
‘/js/melody.js’,
‘/games/bulles.html’,
‘/games/animaux.html’,
‘/games/puzzle.html’,
‘/games/comptines.html’,
‘/games/marin.html’,
‘/games/cuisine.html’,
‘/games/tracteur.html’
];

self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
);
self.skipWaiting();
});

self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
)
);
self.clients.claim();
});

self.addEventListener(‘fetch’, e => {
e.respondWith(
caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match(’/index.html’)))
);
});
