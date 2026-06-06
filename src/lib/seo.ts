import ogImage from "@/assets/og-image.jpg";

const OG_PATH = ogImage; // bundled URL (z. B. /assets/og-image-xxxx.jpg)

interface PageSeoInput {
  origin: string;
  path: string; // muss mit "/" beginnen
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article" | "profile";
  noindex?: boolean;
  /** Zusätzliche JSON-LD-Blöcke für diese Route */
  jsonLd?: object[];
}

const SITE_NAME = "Connected";

function abs(origin: string, path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  if (!origin) return path;
  return `${origin}${path}`;
}

/**
 * Baut meta / links / scripts für eine Leaf-Route. canonical und og:image
 * werden absolut, sofern eine `origin` per Loader bereitsteht.
 */
export function buildPageHead(input: PageSeoInput) {
  const {
    origin,
    path,
    title,
    description,
    ogTitle = title,
    ogDescription = description,
    ogType = "website",
    noindex = false,
    jsonLd = [],
  } = input;

  const url = abs(origin, path);
  const imageUrl = abs(origin, OG_PATH);

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: noindex ? "noindex,follow" : "index,follow" },

    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "de_DE" },
    { property: "og:type", content: ogType },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${SITE_NAME} — Webdesign aus Heidelberg` },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: ogTitle },
    { name: "twitter:description", content: ogDescription },
    { name: "twitter:image", content: imageUrl },
  ];

  const links = [{ rel: "canonical", href: url }];

  const scripts = jsonLd.map((data) => ({
    type: "application/ld+json",
    children: JSON.stringify(data),
  }));

  return { meta, links, scripts };
}

export function breadcrumbList(origin: string, items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: abs(origin, item.path),
    })),
  };
}
