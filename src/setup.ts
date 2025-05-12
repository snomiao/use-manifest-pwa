import { Window } from "happy-dom";

const window = new Window({
  url: "http://localhost",
  width: 1024,
  height: 768,
});

globalThis.window = window as unknown as Window & typeof globalThis;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.HTMLLinkElement = window.HTMLLinkElement;
globalThis.URL = window.URL;
globalThis.Blob = window.Blob;
