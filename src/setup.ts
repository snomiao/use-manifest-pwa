import { Window } from "happy-dom";

const window = new Window({
  url: "http://localhost",
  width: 1024,
  height: 768,
});

const g = globalThis as any;
g.window = window;
g.document = window.document;
g.HTMLElement = window.HTMLElement;
g.HTMLLinkElement = window.HTMLLinkElement;
g.URL = window.URL;
g.Blob = window.Blob;
