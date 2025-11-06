importScripts(
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js"
);

firebase.initializeApp(__FIREBASE_CONFIG__);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon192.png",
    data: payload.data, // 링크 정보를 notification 객체에 함께 저장
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("On notification click: ", event.notification.tag);
  event.notification.close();

  const link =
    event.notification.data && event.notification.data.link
      ? event.notification.data.link
      : "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === link && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(link);
      })
  );
});
