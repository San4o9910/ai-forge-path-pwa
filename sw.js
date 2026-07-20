const CACHE = 'ai-forge-path-v2';
const CORE_ASSETS = [
  './', './index.html', './styles.css', './app.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  './assets/infographics/hero-path.svg', './assets/infographics/focus-target.svg',
  './assets/infographics/timer-hourglass.svg', './assets/infographics/python.svg',
  './assets/infographics/libraries.svg', './assets/infographics/ai-fundamentals.svg',
  './assets/infographics/prompting.svg', './assets/infographics/llm.svg',
  './assets/infographics/rag.svg', './assets/infographics/agents.svg',
  './assets/infographics/frameworks.svg', './assets/infographics/backend.svg',
  './assets/infographics/deployment.svg', './assets/infographics/projects.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
      return cached || network.catch(() => caches.match('./index.html'));
    })
  );
});
