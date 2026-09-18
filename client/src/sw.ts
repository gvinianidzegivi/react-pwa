import { BackgroundSyncPlugin } from "workbox-background-sync";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, Route, registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, NetworkOnly } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope & {
  skipWaiting(): Promise<void>;
};

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

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
    return request.url === import.meta.env.VITE_API_BASE_URL + "/tasks";
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST",
);
registerRoute(taskSubmitRoute);

const editTaskRoute = new Route(
  ({ request }) => {
    return request.url.includes(import.meta.env.VITE_API_BASE_URL + "/tasks");
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PATCH",
);
registerRoute(editTaskRoute);
