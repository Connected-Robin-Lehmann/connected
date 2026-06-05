import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ---------- Types ----------

export type DsgvoStatus = "ok" | "warn" | "fail";

export interface DsgvoFinding {
  key:
    | "https"
    | "cookies"
    | "external"
    | "trackers"
    | "legal"
    | "headers";
  label: string;
  status: DsgvoStatus;
  summary: string;
  details: string[];
}

export interface DsgvoResult {
  url: string;
  finalUrl: string;
  score: number;
  rating: string;
  findings: DsgvoFinding[];
}

// ---------- Constants ----------

const TRACKER_HOSTS: { pattern: RegExp; name: string }[] = [
  { pattern: /(^|\.)google-analytics\.com$/i, name: "Google Analytics" },
  { pattern: /(^|\.)googletagmanager\.com$/i, name: "Google Tag Manager" },
  { pattern: /(^|\.)doubleclick\.net$/i, name: "Google DoubleClick" },
  { pattern: /(^|\.)connect\.facebook\.net$/i, name: "Facebook Pixel" },
  { pattern: /(^|\.)facebook\.com$/i, name: "Facebook" },
  { pattern: /(^|\.)hotjar\.com$/i, name: "Hotjar" },
  { pattern: /(^|\.)clarity\.ms$/i, name: "Microsoft Clarity" },
  { pattern: /(^|\.)matomo\.(cloud|org)$/i, name: "Matomo" },
  { pattern: /(^|\.)linkedin\.com$/i, name: "LinkedIn Insight" },
  { pattern: /(^|\.)tiktok\.com$/i, name: "TikTok Pixel" },
  { pattern: /(^|\.)bing\.com$/i, name: "Bing Ads" },
  { pattern: /(^|\.)pinterest\.com$/i, name: "Pinterest" },
  { pattern: /(^|\.)snapchat\.com$/i, name: "Snapchat" },
];

const EXTERNAL_RISK_HOSTS: { pattern: RegExp; name: string }[] = [
  { pattern: /(^|\.)fonts\.googleapis\.com$/i, name: "Google Fonts (CSS)" },
  { pattern: /(^|\.)fonts\.gstatic\.com$/i, name: "Google Fonts (Schriftdateien)" },
  { pattern: /(^|\.)youtube(-nocookie)?\.com$/i, name: "YouTube Embed" },
  { pattern: /(^|\.)maps\.google(apis)?\.com$/i, name: "Google Maps" },
  { pattern: /(^|\.)maps\.gstatic\.com$/i, name: "Google Maps" },
  { pattern: /(^|\.)gravatar\.com$/i, name: "Gravatar" },
  { pattern: /(^|\.)cloudflareinsights\.com$/i, name: "Cloudflare Insights" },
  { pattern: /(^|\.)recaptcha\.net$/i, name: "Google reCAPTCHA" },
  { pattern: /(^|\.)gstatic\.com$/i, name: "Google Static" },
];

const TRACKING_COOKIE_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /^_ga(_|$)/, name: "Google Analytics (_ga)" },
  { pattern: /^_gid$/, name: "Google Analytics (_gid)" },
  { pattern: /^_gat/, name: "Google Analytics (_gat)" },
  { pattern: /^_fbp$/, name: "Facebook Pixel (_fbp)" },
  { pattern: /^_fbc$/, name: "Facebook Click (_fbc)" },
  { pattern: /^_hj/, name: "Hotjar" },
  { pattern: /^MUID$/, name: "Microsoft (MUID)" },
  { pattern: /^IDE$/, name: "DoubleClick (IDE)" },
  { pattern: /^NID$/, name: "Google (NID)" },
];

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./,
  /^\[?::1\]?$/,
  /^\[?fc/i,
  /^\[?fd/i,
];

// ---------- Helpers ----------

function isPrivateHost(host: string) {
  return PRIVATE_HOST_PATTERNS.some((re) => re.test(host));
}

function validateTarget(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Nur http:// oder https:// URLs sind erlaubt.");
  }
  if (isPrivateHost(url.hostname)) {
    throw new Error("Private und lokale Hosts sind nicht erlaubt.");
  }
  return url;
}

const UA = "ConnectedWebsiteCheck/1.0 (+https://connected-heidelberg.de)";

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 15000, ...rest } = init;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...rest,
      signal: ctrl.signal,
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "de,en;q=0.8",
        ...(rest.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

// Extract attribute values matching a tag/attribute pair
function extractAttrs(html: string, tag: string, attr: string): string[] {
  const re = new RegExp(
    `<${tag}\\b[^>]*?\\b${attr}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "gi",
  );
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const v = m[2] ?? m[3] ?? m[4] ?? "";
    if (v) out.push(v);
  }
  return out;
}

function extractAnchors(html: string): { href: string; text: string }[] {
  const re = /<a\b[^>]*?\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi;
  const out: { href: string; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[2] ?? m[3] ?? m[4] ?? "";
    const text = (m[5] ?? "").replace(/<[^>]+>/g, "").trim();
    if (href) out.push({ href, text });
  }
  return out;
}

function resolveUrl(base: URL, href: string): URL | null {
  try {
    return new URL(href, base);
  } catch {
    return null;
  }
}

function isSameSite(base: URL, host: string) {
  const baseHost = base.hostname.replace(/^www\./, "");
  const h = host.replace(/^www\./, "");
  return h === baseHost || h.endsWith(`.${baseHost}`);
}

// Worker-safe Set-Cookie parsing (header may be folded into a single comma-joined string)
function getSetCookies(res: Response): string[] {
  const anyHeaders = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie();
  }
  const raw = res.headers.get("set-cookie");
  if (!raw) return [];
  // Split safely: cookies are separated by comma, but Expires=... also contains commas.
  return raw.split(/,(?=\s*[A-Za-z0-9_\-]+\s*=)/);
}

function parseCookieName(cookie: string): string {
  const eq = cookie.indexOf("=");
  return (eq >= 0 ? cookie.slice(0, eq) : cookie).trim();
}

// ---------- Server Function ----------

export const checkDsgvo = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        url: z
          .string()
          .trim()
          .min(1)
          .max(500)
          .regex(/^https?:\/\//i, "URL muss mit http:// oder https:// beginnen"),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<DsgvoResult> => {
    const target = validateTarget(data.url);

    // 1) HTTPS redirect check (only if the input was http://)
    let httpRedirectsToHttps: boolean | null = null;
    if (target.protocol === "http:") {
      try {
        const probe = await fetchWithTimeout(target.toString(), {
          method: "GET",
          redirect: "manual",
          timeoutMs: 8000,
        });
        const loc = probe.headers.get("location");
        httpRedirectsToHttps = !!loc && /^https:\/\//i.test(loc);
      } catch {
        httpRedirectsToHttps = false;
      }
    }

    // 2) Full GET (follow redirects)
    let response: Response;
    try {
      response = await fetchWithTimeout(target.toString(), { redirect: "follow" });
    } catch (e) {
      throw new Error(
        `Seite nicht erreichbar: ${e instanceof Error ? e.message : "Unbekannter Fehler"}`,
      );
    }

    const finalUrl = new URL(response.url || target.toString());
    const html = await response.text();

    // 3) Cookies
    const setCookies = getSetCookies(response);
    const cookieNames = setCookies.map(parseCookieName).filter(Boolean);
    const trackingCookies = cookieNames.flatMap((n) =>
      TRACKING_COOKIE_PATTERNS.filter((p) => p.pattern.test(n)).map((p) => `${n} – ${p.name}`),
    );

    // 4) Collect external resources
    const scriptSrcs = extractAttrs(html, "script", "src");
    const linkHrefs = extractAttrs(html, "link", "href");
    const imgSrcs = extractAttrs(html, "img", "src");
    const iframeSrcs = extractAttrs(html, "iframe", "src");

    const allUrls = [...scriptSrcs, ...linkHrefs, ...imgSrcs, ...iframeSrcs]
      .map((h) => resolveUrl(finalUrl, h))
      .filter((u): u is URL => u !== null && (u.protocol === "http:" || u.protocol === "https:"));

    const externalHosts = new Map<string, number>();
    for (const u of allUrls) {
      if (!isSameSite(finalUrl, u.hostname)) {
        externalHosts.set(u.hostname, (externalHosts.get(u.hostname) ?? 0) + 1);
      }
    }

    const trackerHits = new Map<string, string>();
    const riskHits = new Map<string, string>();
    for (const host of externalHosts.keys()) {
      const t = TRACKER_HOSTS.find((p) => p.pattern.test(host));
      if (t) {
        trackerHits.set(host, t.name);
        continue;
      }
      const r = EXTERNAL_RISK_HOSTS.find((p) => p.pattern.test(host));
      if (r) riskHits.set(host, r.name);
    }

    // Also catch scripts loaded from tracker hosts even if same-site rewrite
    for (const src of scriptSrcs) {
      const u = resolveUrl(finalUrl, src);
      if (!u) continue;
      const t = TRACKER_HOSTS.find((p) => p.pattern.test(u.hostname));
      if (t) trackerHits.set(u.hostname, t.name);
    }

    // 5) Impressum & Datenschutz
    const anchors = extractAnchors(html);
    const hasImpressum = anchors.some(
      (a) => /impressum|imprint/i.test(a.href) || /impressum|imprint/i.test(a.text),
    );
    const hasDatenschutz = anchors.some(
      (a) =>
        /datenschutz|privacy/i.test(a.href) || /datenschutz|privacy(?:.{0,15}policy)?/i.test(a.text),
    );

    // 6) Security headers
    const secHeaders: Record<string, string | null> = {
      "Strict-Transport-Security": response.headers.get("strict-transport-security"),
      "Content-Security-Policy": response.headers.get("content-security-policy"),
      "X-Content-Type-Options": response.headers.get("x-content-type-options"),
      "Referrer-Policy": response.headers.get("referrer-policy"),
      "X-Frame-Options": response.headers.get("x-frame-options"),
    };
    const presentHeaders = Object.entries(secHeaders).filter(([, v]) => !!v);
    const missingHeaders = Object.entries(secHeaders).filter(([, v]) => !v).map(([k]) => k);

    // ---------- Build findings ----------

    const findings: DsgvoFinding[] = [];

    // HTTPS
    {
      const isHttps = finalUrl.protocol === "https:";
      const status: DsgvoStatus = isHttps ? "ok" : "fail";
      const details: string[] = [];
      details.push(`Finale URL: ${finalUrl.toString()}`);
      if (httpRedirectsToHttps !== null) {
        details.push(
          httpRedirectsToHttps
            ? "http:// wird automatisch auf https:// weitergeleitet."
            : "http:// wird NICHT auf https:// weitergeleitet.",
        );
      }
      findings.push({
        key: "https",
        label: "HTTPS / SSL-Verschlüsselung",
        status,
        summary: isHttps
          ? "Seite ist verschlüsselt erreichbar."
          : "Seite wird unverschlüsselt ausgeliefert.",
        details,
      });
    }

    // Cookies
    {
      let status: DsgvoStatus = "ok";
      let summary = "Keine Cookies beim Seitenaufruf gesetzt.";
      const details: string[] = [];
      if (cookieNames.length > 0) {
        details.push(`${cookieNames.length} Cookie(s) gesetzt: ${cookieNames.join(", ")}`);
        if (trackingCookies.length > 0) {
          status = "fail";
          summary = `${trackingCookies.length} Tracking-Cookie(s) ohne Einwilligung gesetzt.`;
          details.push(...trackingCookies.map((c) => `Tracking-Cookie: ${c}`));
        } else {
          status = "warn";
          summary = `${cookieNames.length} Cookie(s) vor Einwilligung gesetzt — Zweck prüfen.`;
        }
      }
      findings.push({ key: "cookies", label: "Cookies beim Laden", status, summary, details });
    }

    // External resources
    {
      const externalCount = externalHosts.size;
      const riskCount = riskHits.size;
      let status: DsgvoStatus = "ok";
      let summary = "Keine externen Drittanbieter-Ressourcen erkannt.";
      const details: string[] = [];
      if (externalCount > 0) {
        details.push(
          `${externalCount} externer Host(s): ${Array.from(externalHosts.keys()).slice(0, 12).join(", ")}${externalCount > 12 ? " …" : ""}`,
        );
      }
      if (riskCount > 0) {
        status = "warn";
        summary = `${riskCount} datenschutzrelevante(r) Drittanbieter eingebunden.`;
        details.push(
          ...Array.from(riskHits.entries()).map(([host, name]) => `${name} (${host})`),
        );
      } else if (externalCount > 0) {
        status = "warn";
        summary = `${externalCount} externe Ressource(n) — bitte AV-Verträge prüfen.`;
      }
      findings.push({
        key: "external",
        label: "Externe Ressourcen",
        status,
        summary,
        details,
      });
    }

    // Trackers
    {
      let status: DsgvoStatus = "ok";
      let summary = "Keine bekannten Tracker erkannt.";
      const details: string[] = [];
      if (trackerHits.size > 0) {
        status = "fail";
        summary = `${trackerHits.size} bekannte Tracking-Skripte gefunden.`;
        details.push(
          ...Array.from(trackerHits.entries()).map(([host, name]) => `${name} (${host})`),
        );
        details.push(
          "Tracking-Skripte dürfen erst nach aktiver Einwilligung (Opt-In) geladen werden.",
        );
      }
      findings.push({
        key: "trackers",
        label: "Tracking-Skripte",
        status,
        summary,
        details,
      });
    }

    // Legal pages
    {
      let status: DsgvoStatus = "ok";
      const details: string[] = [];
      details.push(hasImpressum ? "✓ Link zum Impressum gefunden." : "✗ Kein Impressum-Link gefunden.");
      details.push(
        hasDatenschutz ? "✓ Link zur Datenschutzerklärung gefunden." : "✗ Kein Datenschutz-Link gefunden.",
      );
      let summary: string;
      if (hasImpressum && hasDatenschutz) {
        summary = "Impressum und Datenschutzerklärung verlinkt.";
      } else if (!hasImpressum && !hasDatenschutz) {
        status = "fail";
        summary = "Weder Impressum noch Datenschutz verlinkt.";
      } else {
        status = "fail";
        summary = hasImpressum ? "Datenschutzerklärung fehlt." : "Impressum fehlt.";
      }
      findings.push({ key: "legal", label: "Impressum & Datenschutz", status, summary, details });
    }

    // Security headers
    {
      const present = presentHeaders.length;
      const total = Object.keys(secHeaders).length;
      let status: DsgvoStatus = "ok";
      if (present === 0) status = "fail";
      else if (present < total) status = "warn";
      findings.push({
        key: "headers",
        label: "Security-Header",
        status,
        summary: `${present} von ${total} empfohlenen Sicherheits-Headern gesetzt.`,
        details: [
          ...presentHeaders.map(([k, v]) => `✓ ${k}: ${(v ?? "").slice(0, 80)}`),
          ...missingHeaders.map((k) => `✗ ${k} fehlt`),
        ],
      });
    }

    // ---------- Score ----------
    const weights: Record<DsgvoStatus, number> = { ok: 1, warn: 0.5, fail: 0 };
    const weighted = findings.reduce((acc, f) => acc + weights[f.status], 0);
    const score = Math.round((weighted / findings.length) * 100);
    const rating =
      score >= 90
        ? "Sehr gut"
        : score >= 70
          ? "Gut"
          : score >= 50
            ? "Verbesserungswürdig"
            : "Kritisch";

    return {
      url: target.toString(),
      finalUrl: finalUrl.toString(),
      score,
      rating,
      findings,
    };
  });
