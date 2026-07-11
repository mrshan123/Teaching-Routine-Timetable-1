const CACHE_NAME = 'timetable-offline-v1';
const ASSETS = [
  './',
  './index.html'
];

// Install လုပ်တဲ့အခါ index.html ကို Cache ထဲ သိမ်းမယ်
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS);
    })
  );
});

// Offline ဖြစ်ရင် Cache ထဲကပဲ ပြန်ပြမယ်
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache ထဲမှာရှိရင် Cache ကနေပြန်ပြမယ်၊ မရှိရင် အင်တာနက်ကနေ Fetch လုပ်မယ်
      return response || fetch(event.request);
    })
  );
});

// Cache အဟောင်းတွေကို ဖျက်ပေးခြင်း (Update လုပ်တဲ့အခါ အသုံးဝင်တယ်)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
