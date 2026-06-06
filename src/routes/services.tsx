import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Services";
import { CodeShowcase } from "@/components/site/CodeShowcase";
import { Hero as PageHero } from "@/components/site/PageHero";
import { LighthouseStats } from "@/components/site/LighthouseStats";
import { getRequestOrigin } from "@/lib/origin.functions";
import { buildPageHead, breadcrumbList } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    const provider = {
      "@type": "ProfessionalService",
      name: "Connected",
      areaServed: "Heidelberg",
    };
    return buildPageHead({
      origin,
      path: "/services",
      title: "Leistungen – Webdesign & Webentwicklung Heidelberg | Connected",
      description:
        "Webdesign, Webentwicklung, Wartung und Betreuung aus Heidelberg — professionelle Websites von der ersten Idee bis zur langfristigen Pflege.",
      ogTitle: "Leistungen | Connected Webdesign Heidelberg",
      ogDescription:
        "Professionelle Webseiten, Webentwicklung und Betreuung aus Heidelberg.",
      jsonLd: [
        breadcrumbList(origin, [
          { name: "Start", path: "/" },
          { name: "Leistungen", path: "/services" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Webdesign",
          serviceType: "Webdesign",
          areaServed: "Heidelberg",
          provider,
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Webentwicklung",
          serviceType: "Webentwicklung",
          areaServed: "Heidelberg",
          provider,
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Website-Wartung & Betreuung",
          serviceType: "Website-Wartung",
          areaServed: "Heidelberg",
          provider,
        },
      ],
    });
  },
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
      <LighthouseStats />
    </main>
  );
}
