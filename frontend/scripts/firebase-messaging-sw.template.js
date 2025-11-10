importScripts(
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js"
);

firebase.initializeApp(__FIREBASE_CONFIG__);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.data.title;
  const body = payload.data.body;

  const options = {
    body: body,
    data: {
      link: payload.data.link,
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const path = event.notification.data.link;
  if (!path) return;

  const targetUrl = `${self.location.origin}${path}`;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client)
            return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
      })
  );
});
