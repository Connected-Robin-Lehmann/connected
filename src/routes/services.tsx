import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Services";
import { CodeShowcase } from "@/components/site/CodeShowcase";
import { Hero as PageHero } from "@/components/site/PageHero";
import { LighthouseStats } from "@/components/site/LighthouseStats";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Leistungen – Webdesign & Webentwicklung Heidelberg | Connected" },
      {
        name: "description",
        content:
          "Webdesign, Webentwicklung, Wartung und Betreuung aus Heidelberg — professionelle Websites von der ersten Idee bis zur langfristigen Pflege.",
      },
      { property: "og:title", content: "Leistungen | Connected Webdesign Heidelberg" },
      {
        property: "og:description",
        content: "Professionelle Webseiten, Webentwicklung und Betreuung aus Heidelberg.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Leistungen"
        title="Webdesign & Webentwicklung"
        highlight="aus Heidelberg."
        subtitle="Professionelle Webseiten, Webentwicklung und Betreuung – von der ersten Idee bis zur langfristigen Pflege."
      />
      <Services />
      <CodeShowcase />
    </main>
  );
}
