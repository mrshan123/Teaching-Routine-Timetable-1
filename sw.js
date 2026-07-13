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

// အတန်းချိန် သတိပေးချက် Noti ကို လက်ခံရယူခြင်း
self.addEventListener('push', (event) => {
    let notificationData = {};
    
    // Server ကနေ data ပို့လာရင် ဖတ်မယ် (မရှိရင် default တန်ဖိုးသုံးမယ်)
    if (event.data) {
        notificationData = event.data.json();
    }

    const options = {
        body: notificationData.body || "သင်တန်းချိန် ၁၅ မိနစ်အလို ရောက်ပါပြီ။",
        icon: 'icon.png', // မင်းရဲ့ icon ပုံ
        badge: 'icon.png',
        data: {
            url: '/' // Noti ကိုနှိပ်ရင် ဘယ်သွားမလဲဆိုတာ
        }
    };

    event.waitUntil(
        self.registration.showNotification(notificationData.title || "အတန်းချိန် သတိပေးချက်", options)
    );
});

// Noti ကို နှိပ်လိုက်ရင် ဝဘ်ဆိုက်ကို ပြန်ဖွင့်ပေးခြင်း
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
