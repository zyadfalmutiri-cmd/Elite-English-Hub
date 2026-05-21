// هذا الكود يُدمج مع service worker الذي ينتجه vite-plugin-pwa
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: "VOT for English", body: event.data.text() }; }

  const { title = "VOT for English", body = "", url = "/", icon = "/pwa-192.png", badge = "/pwa-192.png" } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      vibrate: [200, 100, 200],
      tag: "streak-reminder",
      renotify: true,
      data: { url },
      actions: [
        { action: "open", title: "تدرّب الآن 🔥" },
        { action: "dismiss", title: "تجاهل" },
      ],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
