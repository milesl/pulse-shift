const CACHE_NAME = 'pulse-shift-v3';
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/reset.css',
  'css/tokens.css',
  'css/components.css',
  'css/layout.css',
  'css/checkin.css',
  'css/diet.css',
  'css/recovery.css',
  'css/dashboard.css',
  'css/settings.css',
  'js/store.js',
  'js/nudges.js',
  'js/app.js',
  'js/components/TabBar.js',
  'js/components/Header.js',
  'js/components/NudgeCard.js',
  'js/components/MealRater.js',
  'js/components/FeelingPicker.js',
  'js/components/ToggleGroup.js',
  'js/components/StatBox.js',
  'js/components/WeekStrip.js',
  'js/screens/SetupWizard.js',
  'js/screens/CheckinScreen.js',
  'js/screens/DietScreen.js',
  'js/screens/InjuriesScreen.js',
  'js/screens/DashboardScreen.js',
  'js/screens/SettingsScreen.js',
  'icons/logo.svg',
  'icons/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-first for HTML (pick up updates)
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
