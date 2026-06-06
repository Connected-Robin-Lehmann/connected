## Ziel
Alle SEO/Meta-Punkte aus dem Pre-Launch-Check umsetzen: vollständige Per-Route-Metadaten, canonical & og:url, OG-Bild, JSON-LD (Organization + LocalBusiness + WebSite + BreadcrumbList), sitemap.xml, robots.txt, Web-Manifest und Favicon-Setup.

## 1. OG-Image (gebrandet, 1200×630)
- Erzeugung via `imagegen` (premium, da Text), Datei `src/assets/og-image.jpg`
- Motiv: dunkler Hintergrund mit Primary-Akzent, Wortmarke „Connected." groß, Subline „Webdesign & Webentwicklung aus Heidelberg", dezenter Code-/Browser-Hint
- Import als ES6-Asset, URL via Vite-Import in `og:image`/`twitter:image` (absolut zur Origin gebaut, siehe Punkt 6)

## 2. Per-Route head() vervollständigen
Für jede Route (`/`, `/about`, `/services`, `/references`, `/contact`, `/impressum`, `/datenschutz`):
- `title`, `description`, `og:title`, `og:description` (bereits vorhanden, leicht geschärft)
- **neu**: `og:url` (relativer Pfad), `og:image`, `twitter:image`, `twitter:card: summary_large_image`, `og:locale: de_DE`
- **neu**: `<link rel="canonical">` in `links` (nur Leaf-Routes, relativ)
- `/impressum` und `/datenschutz` bekommen zusätzlich `robots: noindex,follow` (rechtliche Seiten gehören nicht in Suchergebnisse, sind aber crawlbar)

## 3. Root-Head bereinigen & sitewide Defaults setzen (`src/routes/__root.tsx`)
- `og:site_name: "Connected"` + `og:locale: de_DE` ergänzen
- `twitter:card` von `summary` auf `summary_large_image` heben
- `og:image` **nicht** in Root setzen (würde Leaf-Bilder überschreiben — laut head-meta-Regel)
- Canonical NICHT in Root (Dedupe-Caveat)
- Favicon-/Manifest-Links ergänzen: `icon`, `apple-touch-icon`, `manifest`, `theme-color`
- JSON-LD-Scripts (siehe Punkt 4) im Root via `scripts`-Array

## 4. JSON-LD strukturierte Daten
- **Root**: `Organization` + `WebSite` (mit `potentialAction` für Sitelinks-Searchbox auf später vorbereitet, hier weglassen da keine interne Suche)
- **Root zusätzlich**: `LocalBusiness` (Subtyp `ProfessionalService`) — Name, Inhaber, Adresse (Dürerstraße 10, 69126 Heidelberg), E-Mail, `areaServed: Heidelberg/Rhein-Neckar`, `serviceType`, `url`
- **/services**: `Service`-Array (Webdesign, Webentwicklung, Wartung) mit `provider`-Referenz
- **/contact**: `ContactPage` + `ContactPoint`
- **Deep-Routes** (`/about`, `/services`, `/references`, `/contact`, `/impressum`, `/datenschutz`): `BreadcrumbList` (Start → Seite)

## 5. sitemap.xml (Server-Route)
- Neu: `src/routes/sitemap[.]xml.ts` mit `BASE_URL = ""` (TODO-Kommentar bleibt, da noch keine Custom-Domain)
- Entries: `/`, `/about`, `/services`, `/references`, `/contact` (rechtliche Seiten weglassen, da noindex)
- Priorities/changefreq sinnvoll gesetzt

## 6. robots.txt
- Neu: `public/robots.txt` mit `User-agent: *` / `Allow: /` — kein `Sitemap:`-Eintrag, solange keine Custom-Domain (laut sitemap-robots-Regel)

## 7. Favicon & Web-Manifest
- `public/favicon.svg` — minimaler Primary-Punkt im „Connected." Stil (SVG, schnell)
- `public/apple-touch-icon.png` — 180×180 (Primary-Hintergrund mit weißem Punkt, via imagegen fast)
- `public/site.webmanifest` mit `name`, `short_name`, `theme_color`, `background_color`, Icon-Referenzen
- Verlinkung in `__root.tsx` (`links`)

## 8. Helper: absolute URL zur Request-Origin
- Neu: `src/lib/origin.functions.ts` mit `getRequestOrigin` Server-Fn (liest `host` + `x-forwarded-proto`)
- Wird in Routes per Loader aufgerufen, an `head()` via `loaderData` weitergegeben, damit `og:image`/`og:url`/`canonical` **absolute** URLs sind (Social-Crawler verlangen das)
- Fallback: wenn Origin leer, relative Pfade

## Technische Details
- Canonical nur in Leaf-Routes (TanStack Concat-Bug bei `links`)
- `og:image` nur in Leaves, nie im Root
- Relative Pfade in `og:url`/`canonical` falls Loader/Origin nicht greift; sonst absolut über `loaderData.origin`
- Kein neues npm-Paket nötig

## Geänderte / neue Dateien
- neu: `src/assets/og-image.jpg`
- neu: `src/lib/origin.functions.ts`
- neu: `src/routes/sitemap[.]xml.ts`
- neu: `public/robots.txt`
- neu: `public/favicon.svg`
- neu: `public/apple-touch-icon.png`
- neu: `public/site.webmanifest`
- bearbeitet: `src/routes/__root.tsx` (Defaults, Favicon-Links, JSON-LD Organization/LocalBusiness/WebSite, twitter:card)
- bearbeitet: `src/routes/index.tsx` (canonical, og:url, og:image, Loader für origin)
- bearbeitet: `src/routes/about.tsx` (dito + Person-JSON-LD optional, BreadcrumbList)
- bearbeitet: `src/routes/services.tsx` (dito + Service-JSON-LD, BreadcrumbList)
- bearbeitet: `src/routes/references.tsx` (dito + BreadcrumbList)
- bearbeitet: `src/routes/contact.tsx` (dito + ContactPage-JSON-LD, BreadcrumbList)
- bearbeitet: `src/routes/impressum.tsx` (canonical, noindex, BreadcrumbList)
- bearbeitet: `src/routes/datenschutz.tsx` (canonical, noindex, BreadcrumbList)

## Out of Scope
- Echte Inhalte/Texte ändern (nur Meta)
- Bildergenerierung für Hero/Portfolio
- Kontaktformular, Rate-Limit, Analytics (separate Schritte aus dem Pre-Launch-Check)