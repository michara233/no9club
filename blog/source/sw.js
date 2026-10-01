// 让博客可以"安装"成手机 App 的 Service Worker。
// 策略：页面（导航请求）网络优先，断网时回退缓存；其余同源静态资源先用缓存、后台更新
// （stale-while-revalidate），这样换了图片/样式后刷新一两次就是最新的，不会长期卡旧版本。
//
// 改了缓存策略或想让所有访客强制刷新缓存时，把 VERSION 加一即可。

const VERSION = "v1";
const CACHE_NAME = `no9club-${VERSION}`;

// 首次安装时预缓存的最小集合（首页 + 图标），断网时至少能看到外壳
const PRECACHE_URLS = [
  "/",
  "/images/pwa-icon-192.png",
  "/images/pwa-icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // 单个资源失败不影响整体安装
      await Promise.all(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => undefined)),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // 只处理同源请求，也不缓存 Service Worker 自身（否则更新会卡住）
  if (url.origin !== self.location.origin || url.pathname === "/sw.js") {
    return;
  }

  // 页面请求：网络优先
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
          return response;
        } catch (error) {
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          throw error;
        }
      })(),
    );
    return;
  }

  // 静态资源：先用缓存，后台更新
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })(),
  );
});
