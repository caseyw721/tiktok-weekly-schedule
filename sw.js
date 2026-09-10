// Service worker for the Weekly Filming Checklist PWA. Handles nothing but
// push notifications -- no offline caching, since the page is trivially
// small and always wants the latest slot data. Hand-edited (not generated
// by weekly_page.py) since it never depends on slot data.

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
  var data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {}

  var title = data.title || "Weekly Filming Checklist";
  var options = {
    body: data.body || "A post is coming up.",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    data: { url: data.url || "./" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
