import { useEffect } from "react";
import type { Manifest } from "./Manifest";

/**
 *
 * Required manifest members
 * Chromium-based browsers, including Google Chrome, Samsung Internet, and Microsoft Edge, require that the manifest includes the following members:
 *
 * name
 * icons
 * start_url
 * display and/or display_override
 * 
 * @param manifest
 * @returns
 */
export default function useManifestPWA(
  manifest: Manifest & Required<Pick<Manifest, "name" | "icons" | "start_url">>
) {
  useEffect(() => {
    if(!window) return; // ssr
    const stringManifest = JSON.stringify(manifest);
    const blob = new Blob([stringManifest], { type: "application/json" });
    const manifestURL = URL.createObjectURL(blob);
    const manifestLinkElement = (document.head.querySelector(
      `link[rel=manifest]`
    ) ??
      document.head.appendChild(
        Object.assign(document.createElement("link"), { rel: "manifest" })
      )) as HTMLLinkElement;
    manifestLinkElement.href = manifestURL;
  }, [manifest]);
}
