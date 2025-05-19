// Имя вашего кэша. Изменяйте его при каждом обновлении файлов приложения.
const CACHE_NAME = 'tictactoe-deluxe-cache-v1';

// Список файлов, которые нужно кэшировать при установке service worker'а (App Shell)
const urlsToCache = [
  './', // Кэшируем корневой путь (если tictactoe.html находится в корне)
  './tictactoe.html',
  './style.css', // Если у вас внешний файл стилей, добавьте его сюда
  './script.js', // Если у вас внешний файл скриптов, добавьте его сюда
  './music.mp3', // Добавьте путь к вашей музыке
  './icons/icon-48x48.png', // Добавьте все используемые иконки
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-144x144.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // Добавьте сюда любые другие статические ресурсы (изображения, шрифты и т.д.)
];

// Событие 'install': кэшируем App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Кэшируем App Shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Событие 'activate': удаляем старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Удаляем старый кэш', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Событие 'fetch': перехватываем сетевые запросы
self.addEventListener('fetch', (event) => {
  // Пытаемся найти ресурс в кэше
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кэше, отдаем его
        if (response) {
          // console.log('Service Worker: Отдаем из кэша', event.request.url);
          return response;
        }
        // Если ресурс не найден в кэше, идем в сеть
        // console.log('Service Worker: Идем в сеть за', event.request.url);
        return fetch(event.request);
      })
  );
});