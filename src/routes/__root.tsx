import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";

function NotFoundComponent() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold glow-text">404</h1>
          <h2 className="mt-4 text-xl font-semibold">Seite nicht gefunden</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Diese Seite konnte leider nicht gefunden werden.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium hover:brightness-110 transition"
            >
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Diese Seite konnte nicht geladen werden
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Etwas ist schiefgelaufen. Bitte versuche es erneut oder gehe zurück zur Startseite.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Connected",
  founder: { "@type": "Person", name: "Robin Lehmann" },
  email: "robin.lehmann@connected-webdesign.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dürerstraße 10",
    postalCode: "69126",
    addressLocality: "Heidelberg",
    addressCountry: "DE",
  },
};

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Connected — Webdesign & Webentwicklung",
  description:
    "Webdesign, Webentwicklung und Betreuung aus Heidelberg von Robin Lehmann.",
  founder: { "@type": "Person", name: "Robin Lehmann" },
  email: "robin.lehmann@connected-webdesign.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dürerstraße 10",
    postalCode: "69126",
    addressLocality: "Heidelberg",
    addressCountry: "DE",
  },
  areaServed: [
    { "@type": "City", name: "Heidelberg" },
    { "@type": "AdministrativeArea", name: "Rhein-Neckar" },
    { "@type": "Country", name: "Deutschland" },
  ],
  serviceType: [
    "Webdesign",
    "Webentwicklung",
    "Website-Wartung",
    "Website-Betreuung",
  ],
  priceRange: "€€",
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Connected",
  inLanguage: "de-DE",
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Robin Lehmann" },
      { name: "theme-color", content: "#0a0f1c" },
      { property: "og:site_name", content: "Connected" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORGANIZATION_LD) },
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_LD) },
      { type: "application/ld+json", children: JSON.stringify(WEBSITE_LD) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteLayout() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteLayout />
    </QueryClientProvider>
  );
}
