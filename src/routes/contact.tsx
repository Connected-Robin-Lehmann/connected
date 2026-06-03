import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Contact";
import { Hero as PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakt – Webdesign & Webentwicklung Heidelberg | Connected" },
      {
        name: "description",
        content:
          "Kontakt zu Robin Lehmann — Webentwickler aus Heidelberg. Schreiben Sie mir für ein kostenloses Erstgespräch.",
      },
      { property: "og:title", content: "Kontakt | Connected Webdesign Heidelberg" },
      {
        property: "og:description",
        content: "Haben Sie Fragen oder möchten Sie ein Projekt besprechen?",
      },
    ],
  }),
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
