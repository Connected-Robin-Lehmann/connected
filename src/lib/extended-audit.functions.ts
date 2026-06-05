import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ---------- Types ----------

export type AuditStatus = "ok" | "warn" | "fail";

export interface AuditItem {
  label: string;
  status: AuditStatus;
  detail: string;
}

export interface AuditSection {
  score: number;
  rating: string;
  items: AuditItem[];
}

export interface ExtendedAuditResult {
  finalUrl: string;
  seo: AuditSection;
  mobile: AuditSection;
  perf: AuditSection & {
    ttfbMs: number | null;
    externalRequests: number;
    htmlSizeKb: number;
  };
}

// ---------- Helpers ----------

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

async function probeHead(url: string, timeoutMs = 6000): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(url, { method: "GET", timeoutMs, redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

function extractTag(html: string, tag: string): string | null {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = re.exec(html);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : null;
}

function extractMeta(html: string, attr: "name" | "property", value: string): string | null {
  const re = new RegExp(
    `<meta\\b[^>]*?\\b${attr}\\s*=\\s*["']${value}["'][^>]*?\\bcontent\\s*=\\s*("([^"]*)"|'([^']*)')`,
    "i",
  );
  const m = re.exec(html);
  if (!m) {
    const re2 = new RegExp(
      `<meta\\b[^>]*?\\bcontent\\s*=\\s*("([^"]*)"|'([^']*)')[^>]*?\\b${attr}\\s*=\\s*["']${value}["']`,
      "i",
    );
    const m2 = re2.exec(html);
    return m2 ? m2[2] ?? m2[3] ?? null : null;
  }
  return m[2] ?? m[3] ?? null;
}

function extractAllTags(html: string, tag: string): string[] {
  const re = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  return html.match(re) ?? [];
}

function extractAttr(tagHtml: string, attr: string): string | null {
  const re = new RegExp(`\\b${attr}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const m = re.exec(tagHtml);
  return m ? m[2] ?? m[3] ?? m[4] ?? null : null;
}

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

function extractJsonLdTypes(html: string): string[] {
  const re = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const types: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1].trim());
      const collect = (node: unknown) => {
        if (!node || typeof node !== "object") return;
        const obj = node as Record<string, unknown>;
        if (typeof obj["@type"] === "string") types.push(obj["@type"]);
        else if (Array.isArray(obj["@type"]))
          obj["@type"].forEach((t) => typeof t === "string" && types.push(t));
        Object.values(obj).forEach(collect);
      };
      if (Array.isArray(data)) data.forEach(collect);
      else collect(data);
    } catch {
      /* ignore */
    }
  }
  return Array.from(new Set(types));
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

function scoreFromItems(items: AuditItem[]): number {
  const weights: Record<AuditStatus, number> = { ok: 1, warn: 0.5, fail: 0 };
  if (items.length === 0) return 100;
  const sum = items.reduce((a, i) => a + weights[i.status], 0);
  return Math.round((sum / items.length) * 100);
}

function ratingFromScore(score: number): string {
  if (score >= 90) return "Sehr gut";
  if (score >= 70) return "Gut";
  if (score >= 50) return "Verbesserungswürdig";
  return "Kritisch";
}

// ---------- Server Function ----------

export const extendedAudit = createServerFn({ method: "POST" })
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
  .handler(async ({ data }): Promise<ExtendedAuditResult> => {
    const target = validateTarget(data.url);

    // Main fetch with TTFB measurement
    const t0 = performance.now();
    let response: Response;
    try {
      response = await fetchWithTimeout(target.toString(), { redirect: "follow" });
    } catch (e) {
      throw new Error(
        `Seite nicht erreichbar: ${e instanceof Error ? e.message : "Unbekannter Fehler"}`,
      );
    }
    const ttfbMs = Math.round(performance.now() - t0);
    const finalUrl = new URL(response.url || target.toString());
    const html = await response.text();
    const htmlSizeKb = Math.round((new TextEncoder().encode(html).length / 1024) * 10) / 10;

    // ----- SEO -----
    const seoItems: AuditItem[] = [];

    const title = extractTag(html, "title");
    if (!title) seoItems.push({ label: "Title-Tag", status: "fail", detail: "Kein <title> gefunden." });
    else if (title.length < 30 || title.length > 60)
      seoItems.push({
        label: "Title-Tag",
        status: "warn",
        detail: `"${title}" (${title.length} Zeichen — empfohlen 30–60)`,
      });
    else
      seoItems.push({
        label: "Title-Tag",
        status: "ok",
        detail: `"${title}" (${title.length} Zeichen)`,
      });

    const desc = extractMeta(html, "name", "description");
    if (!desc)
      seoItems.push({ label: "Meta-Description", status: "fail", detail: "Keine Meta-Description." });
    else if (desc.length < 70 || desc.length > 160)
      seoItems.push({
        label: "Meta-Description",
        status: "warn",
        detail: `${desc.length} Zeichen — empfohlen 70–160.`,
      });
    else
      seoItems.push({
        label: "Meta-Description",
        status: "ok",
        detail: `${desc.length} Zeichen, gut.`,
      });

    const langMatch = /<html\b[^>]*\blang\s*=\s*("([^"]*)"|'([^']*)')/i.exec(html);
    const lang = langMatch ? (langMatch[2] ?? langMatch[3] ?? "") : "";
    seoItems.push(
      lang
        ? { label: "HTML lang-Attribut", status: "ok", detail: `lang="${lang}"` }
        : { label: "HTML lang-Attribut", status: "warn", detail: "Kein lang-Attribut am <html>." },
    );

    const h1Tags = extractAllTags(html, "h1");
    const h2Tags = extractAllTags(html, "h2");
    const h3Tags = extractAllTags(html, "h3");
    seoItems.push(
      h1Tags.length === 1
        ? {
            label: "Überschriften-Struktur",
            status: "ok",
            detail: `1× H1, ${h2Tags.length}× H2, ${h3Tags.length}× H3`,
          }
        : {
            label: "Überschriften-Struktur",
            status: h1Tags.length === 0 ? "fail" : "warn",
            detail: `${h1Tags.length}× H1, ${h2Tags.length}× H2, ${h3Tags.length}× H3 — genau ein H1 empfohlen.`,
          },
    );

    const ogTitle = extractMeta(html, "property", "og:title");
    const ogDesc = extractMeta(html, "property", "og:description");
    const ogImage = extractMeta(html, "property", "og:image");
    const ogPresent = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
    seoItems.push(
      ogPresent === 3
        ? { label: "Open Graph", status: "ok", detail: "og:title, og:description, og:image gesetzt." }
        : ogPresent === 0
          ? { label: "Open Graph", status: "fail", detail: "Keine Open-Graph-Tags." }
          : {
              label: "Open Graph",
              status: "warn",
              detail: `Nur ${ogPresent} von 3 OG-Tags vorhanden.`,
            },
    );

    const twitterCard = extractMeta(html, "name", "twitter:card");
    seoItems.push(
      twitterCard
        ? { label: "Twitter Card", status: "ok", detail: `card="${twitterCard}"` }
        : { label: "Twitter Card", status: "warn", detail: "Kein twitter:card Meta-Tag." },
    );

    const canonical = /<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*\bhref\s*=\s*("([^"]*)"|'([^']*)')/i.exec(
      html,
    );
    seoItems.push(
      canonical
        ? { label: "Canonical-Tag", status: "ok", detail: canonical[2] ?? canonical[3] ?? "gesetzt" }
        : { label: "Canonical-Tag", status: "warn", detail: "Kein <link rel=\"canonical\"> gefunden." },
    );

    const ldTypes = extractJsonLdTypes(html);
    seoItems.push(
      ldTypes.length > 0
        ? {
            label: "Strukturierte Daten (JSON-LD)",
            status: "ok",
            detail: `Typen: ${ldTypes.slice(0, 6).join(", ")}`,
          }
        : {
            label: "Strukturierte Daten (JSON-LD)",
            status: "warn",
            detail: "Keine JSON-LD strukturierten Daten gefunden.",
          },
    );

    const imgTags = extractAllTags(html, "img");
    const imgsWithoutAlt = imgTags.filter((t) => {
      const alt = extractAttr(t, "alt");
      return alt === null;
    }).length;
    if (imgTags.length === 0) {
      seoItems.push({ label: "Bild-Alt-Texte", status: "ok", detail: "Keine <img>-Tags gefunden." });
    } else if (imgsWithoutAlt === 0) {
      seoItems.push({
        label: "Bild-Alt-Texte",
        status: "ok",
        detail: `Alle ${imgTags.length} Bilder mit alt-Attribut.`,
      });
    } else {
      seoItems.push({
        label: "Bild-Alt-Texte",
        status: imgsWithoutAlt / imgTags.length > 0.3 ? "fail" : "warn",
        detail: `${imgsWithoutAlt} von ${imgTags.length} Bildern ohne alt-Attribut.`,
      });
    }

    const [robotsOk, sitemapOk] = await Promise.all([
      probeHead(new URL("/robots.txt", finalUrl).toString()),
      probeHead(new URL("/sitemap.xml", finalUrl).toString()),
    ]);
    seoItems.push(
      robotsOk
        ? { label: "robots.txt", status: "ok", detail: "Erreichbar unter /robots.txt" }
        : { label: "robots.txt", status: "warn", detail: "/robots.txt nicht erreichbar." },
    );
    seoItems.push(
      sitemapOk
        ? { label: "sitemap.xml", status: "ok", detail: "Erreichbar unter /sitemap.xml" }
        : { label: "sitemap.xml", status: "warn", detail: "/sitemap.xml nicht erreichbar." },
    );

    const seoScore = scoreFromItems(seoItems);

    // ----- Mobile / UX -----
    const mobileItems: AuditItem[] = [];

    const viewport = extractMeta(html, "name", "viewport");
    if (!viewport)
      mobileItems.push({
        label: "Viewport-Meta",
        status: "fail",
        detail: "Kein viewport Meta-Tag — Seite nicht mobiloptimiert.",
      });
    else if (!/width\s*=\s*device-width/i.test(viewport))
      mobileItems.push({
        label: "Viewport-Meta",
        status: "warn",
        detail: `"${viewport}" — width=device-width fehlt.`,
      });
    else
      mobileItems.push({ label: "Viewport-Meta", status: "ok", detail: `"${viewport}"` });

    const iconLinks = extractAttrs(html, "link", "rel").some((r) => /icon/i.test(r));
    const faviconAccessible = iconLinks || (await probeHead(new URL("/favicon.ico", finalUrl).toString()));
    mobileItems.push(
      faviconAccessible
        ? { label: "Favicon", status: "ok", detail: "Favicon vorhanden." }
        : { label: "Favicon", status: "warn", detail: "Kein Favicon erkannt." },
    );

    if (htmlSizeKb > 500)
      mobileItems.push({
        label: "HTML-Dokumentgröße",
        status: "fail",
        detail: `${htmlSizeKb} KB — sehr groß (Soll < 200 KB).`,
      });
    else if (htmlSizeKb > 200)
      mobileItems.push({
        label: "HTML-Dokumentgröße",
        status: "warn",
        detail: `${htmlSizeKb} KB — etwas groß (Soll < 200 KB).`,
      });
    else
      mobileItems.push({
        label: "HTML-Dokumentgröße",
        status: "ok",
        detail: `${htmlSizeKb} KB.`,
      });

    const mobileScore = scoreFromItems(mobileItems);

    // ----- Performance extras -----
    const scriptSrcs = extractAttrs(html, "script", "src");
    const linkHrefs = extractAttrs(html, "link", "href");
    const imgSrcs = extractAttrs(html, "img", "src");
    const iframeSrcs = extractAttrs(html, "iframe", "src");
    const allUrls = [...scriptSrcs, ...linkHrefs, ...imgSrcs, ...iframeSrcs]
      .map((h) => resolveUrl(finalUrl, h))
      .filter((u): u is URL => u !== null && (u.protocol === "http:" || u.protocol === "https:"));
    const externalHostSet = new Set<string>();
    for (const u of allUrls) {
      if (!isSameSite(finalUrl, u.hostname)) externalHostSet.add(u.hostname);
    }
    const externalRequests = externalHostSet.size;

    const perfItems: AuditItem[] = [];

    if (ttfbMs < 200)
      perfItems.push({
        label: "TTFB (Server-Antwortzeit)",
        status: "ok",
        detail: `${ttfbMs} ms — schnell.`,
      });
    else if (ttfbMs < 600)
      perfItems.push({
        label: "TTFB (Server-Antwortzeit)",
        status: "warn",
        detail: `${ttfbMs} ms — akzeptabel (Soll < 200 ms).`,
      });
    else
      perfItems.push({
        label: "TTFB (Server-Antwortzeit)",
        status: "fail",
        detail: `${ttfbMs} ms — langsam (Soll < 200 ms).`,
      });

    if (externalRequests <= 5)
      perfItems.push({
        label: "Externe Hosts",
        status: "ok",
        detail: `${externalRequests} externe(r) Host(s).`,
      });
    else if (externalRequests <= 15)
      perfItems.push({
        label: "Externe Hosts",
        status: "warn",
        detail: `${externalRequests} externe Hosts — jeder zusätzliche kostet Performance.`,
      });
    else
      perfItems.push({
        label: "Externe Hosts",
        status: "fail",
        detail: `${externalRequests} externe Hosts — sehr viele Drittanbieter.`,
      });

    const encoding = response.headers.get("content-encoding") ?? "";
    if (/br|gzip|zstd/i.test(encoding))
      perfItems.push({
        label: "Kompression",
        status: "ok",
        detail: `content-encoding: ${encoding}`,
      });
    else
      perfItems.push({
        label: "Kompression",
        status: "warn",
        detail: "Keine gzip/brotli-Kompression erkannt.",
      });

    const perfScore = scoreFromItems(perfItems);

    return {
      finalUrl: finalUrl.toString(),
      seo: { score: seoScore, rating: ratingFromScore(seoScore), items: seoItems },
      mobile: { score: mobileScore, rating: ratingFromScore(mobileScore), items: mobileItems },
      perf: {
        score: perfScore,
        rating: ratingFromScore(perfScore),
        items: perfItems,
        ttfbMs,
        externalRequests,
        htmlSizeKb,
      },
    };
  });
