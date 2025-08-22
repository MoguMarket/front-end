/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

// 최소 설정(compat로 백그라운드 수신만)
firebase.initializeApp({
  apiKey: "ignored-in-sw",
  projectId: "ignored-in-sw",
  messagingSenderId: "ignored-in-sw",
  appId: "ignored-in-sw",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "알림", {
    body: body || "",
    icon: "/icons/icon-192.png",
  });
});
