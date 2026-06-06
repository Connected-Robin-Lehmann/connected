import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/site/Portfolio";
import { Hero as PageHero } from "@/components/site/PageHero";
import { getRequestOrigin } from "@/lib/origin.functions";
import { buildPageHead, breadcrumbList } from "@/lib/seo";

export const Route = createFileRoute("/references")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    return buildPageHead({
      origin,
      path: "/references",
      title: "Referenzen & Projekte | Connected Webdesign Heidelberg",
      description:
        "Ausgewählte Webprojekte von Connected aus Heidelberg — Websites, die funktionieren.",
      ogTitle: "Referenzen | Connected Webdesign",
      ogDescription: "Websites, die funktionieren – für zufriedene Kunden.",
      jsonLd: [
        breadcrumbList(origin, [
          { name: "Start", path: "/" },
          { name: "Referenzen", path: "/references" },
        ]),
      ],
    });
  },
  component: ReferencesPage,
});

function ReferencesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Referenzen"
        title="Unsere Projekte."
        subtitle="Websites, die funktionieren – für zufriedene Kunden."
      />
      <Portfolio />
    </main>
  );
}
