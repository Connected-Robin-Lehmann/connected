import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/site/Portfolio";
import { Hero as PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/references")({
  head: () => ({
    meta: [
      { title: "Referenzen & Projekte | Connected Webdesign" },
      {
        name: "description",
        content: "Ausgewählte Webprojekte von Connected aus Heidelberg — Websites, die funktionieren.",
      },
      { property: "og:title", content: "Referenzen | Connected Webdesign" },
      { property: "og:description", content: "Websites, die funktionieren – für zufriedene Kunden." },
    ],
  }),
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
