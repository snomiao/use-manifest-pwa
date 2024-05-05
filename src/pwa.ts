// service worker
const offlineCacheWorker = () => {
  /** @type {(request: Request)=> Promise<Response>} */
  async function cacheThenNetwork(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log("Found response in cache:", cachedResponse);
      return cachedResponse;
    }
    console.log("Falling back to network");
    return fetch(request);
  }
  /** @type {(event: import("./useServiceWorker").FetchEvent)=> void} */
  const fetchHandler = (event) => {
    console.log(`Handling fetch event for ${event.request.url}`);
    event.respondWith(cacheThenNetwork(event.request));
  };
  self.addEventListener("fetch", fetchHandler);
  self.addEventListener("installed", (event) => {
    // - [ServiceWorkerGlobalScope: install event - Web APIs \| MDN]( https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event )
    console.log("installed");
  });
};
// register the worker
const swjs = `(${offlineCacheWorker.toString()})()`;
const swUrl = URL.createObjectURL(
  new Blob([swjs], { type: "text/javascript" })
);
navigator.serviceWorker.register(swUrl); // todo: clean // not supported protocol

