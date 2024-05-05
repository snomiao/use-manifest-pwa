import { useEffect } from "react";
// - [FetchEvent: FetchEvent() constructor - Web APIs \| MDN]( https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/FetchEvent )
export declare class FetchEvent extends Event {
  respondWith(response: Response | Promise<Response>): void;
  get request(): Request;
}

export default function useServiceWorker(worker: () => void) {
  const swjs = "(" + worker.toString() + ")()";
  useEffect(() => {
    const ourl = URL.createObjectURL(new Blob([swjs]));
    console.log(ourl, swjs);
    const swPromise = navigator.serviceWorker.register(ourl);
    return () => {
      swPromise
        .then((e) => e.unregister())
        .finally(() => {
          URL.revokeObjectURL(ourl);
        });
    };
  }, [swjs]);
}
function useDefer(effect: (defer: () => void) => () => void) {}
