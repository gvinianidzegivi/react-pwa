import { NavigationRoute, registerRoute, Route } from "workbox-routing";
import { skipWaiting } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

skipWaiting();

const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "image";
  },
  new CacheFirst({
    cacheName: "images",
  }),
);

registerRoute(imageRoute);

const fetchTasksRoute = new Route(
  ({ request }) => {
    return request.url === import.meta.env.VITE_API_BASE_URL + "/tasks";
  },
  new NetworkFirst({
    cacheName: "api/fetch-tasks",
  }),
);
registerRoute(fetchTasksRoute);

const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigation",
    networkTimeoutSeconds: 3,
  }),
);
registerRoute(navigationRoute);

const bgSyncPlugin = new BackgroundSyncPlugin("backgroundSyncQueue", {
  maxRetentionTime: 24 * 60,
});

const taskSubmitRoute = new Route(
  ({ request }) => {
    return request.url === import.meta.env.VITE_API_BASE_URL + "/task/create";
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST",
);
registerRoute(taskSubmitRoute);

const editTaskRoute = new Route(
  ({ request }) => {
    return request.url.includes(import.meta.env.VITE_API_BASE_URL + "/task");
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PATCH",
);
registerRoute(editTaskRoute);
