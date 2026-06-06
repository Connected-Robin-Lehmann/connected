import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Contact";
import { Hero as PageHero } from "@/components/site/PageHero";
import { getRequestOrigin } from "@/lib/origin.functions";
import { buildPageHead, breadcrumbList } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    return buildPageHead({
      origin,
      path: "/contact",
      title: "Kontakt – Webdesign & Webentwicklung Heidelberg | Connected",
      description:
        "Kontakt zu Robin Lehmann — Webentwickler aus Heidelberg. Schreiben Sie mir für ein kostenloses Erstgespräch.",
      ogTitle: "Kontakt | Connected Webdesign Heidelberg",
      ogDescription:
        "Haben Sie Fragen oder möchten Sie ein Projekt besprechen?",
      jsonLd: [
        breadcrumbList(origin, [
          { name: "Start", path: "/" },
          { name: "Kontakt", path: "/contact" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Kontakt — Connected",
          mainEntity: {
            "@type": "Organization",
            name: "Connected",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "robin.lehmann@connected-webdesign.de",
              areaServed: "DE",
              availableLanguage: ["de"],
            },
          },
        },
      ],
    });
  },
  component: ContactPage,
});

function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Kontakt"
        title="Kontakt."
        subtitle="Haben Sie Fragen oder möchten Sie ein Projekt besprechen? Ich freue mich auf Ihre Nachricht!"
      />
      <Contact />
    </main>
  );
}
