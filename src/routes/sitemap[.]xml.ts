import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// TODO: durch die Custom-Domain ersetzen, sobald sie verbunden ist
// (z. B. "https://connected-webdesign.de"). Leer lassen für relative URLs
// solange noch keine eigene Domain aktiv ist.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/references", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
  { path: "/impressum", changefreq: "yearly", priority: "0.3" },
  { path: "/datenschutz", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base =
          BASE_URL ||
          (() => {
            try {
              const u = new URL(request.url);
              return `${u.protocol}//${u.host}`;
            } catch {
              return "";
            }
          })();
        const lastmod = new Date().toISOString().slice(0, 10);

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${base}${e.path}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
