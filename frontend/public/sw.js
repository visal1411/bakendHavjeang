self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      title: 'New update',
      body: event.data ? event.data.text() : 'You have a new notification.',
    };
  }

  const title = payload.title || 'Hav Jeang';
  const body = payload.body || payload.message || 'You have a new notification.';
  const data = payload.data || {};

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.type || 'general',
      renotify: true,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetPath = event.notification?.data?.path || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            client.navigate(targetPath);
          }
          return;
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetPath);
      }

      return undefined;
    }),
  );
});
