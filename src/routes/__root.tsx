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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Connected — Webdesign & Webentwicklung aus Heidelberg" },
      {
        name: "description",
        content:
          "Connected — Webdesign, Webentwicklung und Betreuung aus Heidelberg von Robin Lehmann.",
      },
      { name: "author", content: "Robin Lehmann" },
      { property: "og:title", content: "Connected — Webdesign aus Heidelberg" },
      {
        property: "og:description",
        content: "Professionelle Webentwicklung und Betreuung für kleine Unternehmen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
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
