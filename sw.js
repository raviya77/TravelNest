const CACHE_NAME = 'travelnest-v1';

const ASSETS = [
    '/',
    '/index.html',
    '/destinations.html',
    '/budget.html',
    '/generator.html',
    '/mood.html',
    '/feedback.html',
    '/css/style.css',
    '/js/data.js',
    '/js/main.js',
    '/manifest.json',
    '/icon.png',
    '/audio/Rain.mp3',
    '/audio/Beach.mp3',
    '/audio/Forest.mp3',
    '/audio/City.mp3',
    '/audio/Cafe.mp3',
];

// Cache all app shell assets on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Remove stale caches on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Only handle same-origin requests
    if (url.origin !== location.origin) return;

    if (event.request.destination === 'document') {
        // Network-first for HTML pages so content stays fresh
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        // Cache-first for all other assets (CSS, JS, audio, images)
        event.respondWith(
            caches.match(event.request).then(cached => cached || fetch(event.request))
        );
    }
});
