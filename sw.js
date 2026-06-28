const CACHE_VERSION = 'v2';
const SHELL_CACHE = `flag-trainer-shell-${CACHE_VERSION}`;
const FLAG_CACHE = `flag-trainer-flags-${CACHE_VERSION}`;

const SHELL_ASSETS = [
    './',
    './index.html',
    './login/',
    './login/index.html',
    './countries/',
    './countries/index.html',
    './settings/',
    './settings/index.html',
    './css/styles.css',
    './css/index.css',
    './css/login.css',
    './css/menu.css',
    './css/countries.css',
    './css/settings.css',
    './js/paths.js',
    './js/profiles.js',
    './js/i18n.js',
    './js/menu.js',
    './js/app.js',
    './js/login.js',
    './js/countries.js',
    './js/settings.js',
    './js/pwa.js',
    './data/flags.json',
    './locales/en.json',
    './locales/uk.json',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE)
            .then((cache) => cache.addAll(SHELL_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key.startsWith('flag-trainer-') && key !== SHELL_CACHE && key !== FLAG_CACHE)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (url.hostname === 'flagcdn.com') {
        event.respondWith(cacheFirst(request, FLAG_CACHE));
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
    }
});

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    const response = await fetch(request);

    if (response.ok) {
        await cache.put(request, response.clone());
    }

    return response;
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const networkPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    });

    return cached || networkPromise;
}
