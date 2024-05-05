import { FetchEvent } from "./useServiceWorker";


export const offlineCacheWorker = () => {
    async function cacheThenNetwork(request: Request) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log("Found response in cache:", cachedResponse);
            return cachedResponse;
        }
        console.log("Falling back to network");
        return fetch(request);
    }
    self.addEventListener("fetch", (event) => {
        const fetchEvent = event as FetchEvent;
        console.log(`Handling fetch event for ${fetchEvent.request.url}`);
        fetchEvent.respondWith(cacheThenNetwork(fetchEvent.request));
    });
    self.addEventListener("installed", (event) => {
        // - [ServiceWorkerGlobalScope: install event - Web APIs \| MDN]( https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event )
        console.log("installed");
    });
};
