// Service Worker配置
const CACHE_NAME = 'h5-activity-cache-v1';
const OFFLINE_URL = '/404.html';

// 预缓存静态资源列表
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/manifest.json',
  '/src/styles/reset.css',
  '/src/styles/style.css',
  '/src/index.js',
  '/src/assets/images/banner1.svg',
  '/src/assets/images/activity1.svg',
  '/src/assets/images/activity2.svg',
  '/src/assets/images/activity3.svg',
  '/src/assets/images/app-icon-192.png',
  '/src/assets/images/app-icon-512.png'
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opening cache and adding resources');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // 跳过等待，立即激活
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      })
      .then(() => self.clients.claim())
  );
});

// 拦截请求
self.addEventListener('fetch', event => {
  // 跳过不支持缓存的请求
  if (
    event.request.method !== 'GET' || // 只缓存GET请求
    event.request.url.startsWith('chrome-extension://') ||
    event.request.url.includes('extension') ||
    !(event.request.url.startsWith('http'))
  ) {
    return;
  }
  
  // 获取请求的URL路径
  const requestURL = new URL(event.request.url);
  
  // 静态资源 - 缓存优先
  if (PRECACHE_ASSETS.includes(requestURL.pathname) || 
      requestURL.pathname.startsWith('/src/assets/images/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // 返回缓存的资源
            return cachedResponse;
          }
          
          // 如果缓存中没有，则从网络获取
          return fetch(event.request)
            .then(response => {
              // 检查响应是否有效
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // 克隆响应，因为我们要同时使用它
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  // 将响应添加到缓存
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            });
        })
    );
  } 
  // HTML和API请求 - 网络优先
  else {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200) {
            throw new Error('Network response was not ok');
          }
          
          // 克隆响应，因为我们要同时使用它
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // 将响应添加到缓存
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(error => {
          console.log('Fetch failed; returning offline page instead.', error);
          
          // 检查缓存中是否有此请求
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // 如果没有缓存，则返回离线页面
              return caches.match(OFFLINE_URL);
            });
        })
    );
  }
});

// 后台同步事件
self.addEventListener('sync', event => {
  if (event.tag === 'sync-activities') {
    event.waitUntil(syncActivities());
  }
});

// 推送通知事件
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/src/assets/images/app-icon-192.png',
    badge: '/src/assets/images/app-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// 同步活动数据
async function syncActivities() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch('/api/activities');
    
    if (response.ok) {
      await cache.put('/api/activities', response);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Background sync failed:', error);
    return false;
  }
} 