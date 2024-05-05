const iconTextEncoded = encodeURIComponent(`demo`);

// - [Web app manifest does not meet the installability requirements  \|  Lighthouse  |  Chrome for Developers]( https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest?hl=en )
/** @type {import('./Manifest').Manifest} */
const manifest = {
  name: document.title,
  short_name: location.hostname,
  icons: [
    ...[16, 24, 32, 64, 192, 512].map((size) => {
      return {
        src: `https://placehold.co/${size}x${size}/000000/FFFFFF?text=${iconTextEncoded}&font=consolas`,
        sizes: `${size}x${size}`,
        type: "image/png",
      };
    }),
  ],
  start_url: location.href,
  display: "standalone",
};
const stringManifest = JSON.stringify(manifest);
const manifestURL = URL.createObjectURL(
  new Blob([stringManifest], { type: "application/json" })
);
/** @type {HTMLLinkElement} */
const manifestLinkElement =
  document.head.querySelector<HTMLLinkElement>(`link[rel=manifest]`) ??
  document.head.appendChild(
    Object.assign(document.createElement("link"), { rel: "manifest" })
  );
manifestLinkElement.href = manifestURL;

// window.open(manifest.icons[0].src)
