import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/**
 * Liefert die Request-Origin (Protokoll + Host), damit Meta-Tags wie
 * og:image, og:url und canonical absolute URLs verwenden können —
 * Social Crawler (FB, LinkedIn, Twitter) verlangen das.
 */
export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  try {
    const req = getRequest();
    const proto =
      req.headers.get("x-forwarded-proto") ??
      (req.url.startsWith("https") ? "https" : "http");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (!host) return "";
    return `${proto}://${host}`;
  } catch {
    return "";
  }
});
