const CACHE_NAME = 'gemini-calculator-v1';
// This list should include all the files needed for the app to run offline.
const urlsToCache = [
  './',
  './index.html',
  './metadata.json',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants/index.ts',
  './contexts/LanguageContext.tsx',
  './contexts/ThemeContext.tsx',
  './utils/index.ts',
  './components/AppHeader.tsx',
  './components/CalculatorButton.tsx',
  './components/CalculatorView.tsx',
  './components/HistoryView.tsx',
  './components/MainView.tsx',
  './components/SettingsView.tsx',
  './components/UnitSelectionModal.tsx',
  // CDN resources from index.html
  'https://cdn.tailwindcss.com?plugins=forms,container-queries',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
  // CDN resources from importmap
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/react@^19.2.0/',
  'https://aistudiocdn.com/react@^19.2.0'
];

// Install event: open a cache and add all the files to it
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Failed to cache all resources:', error);
        });
      })
  );
});

// Fetch event: serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network and cache it
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      }
    )
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
