import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { Hero as PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Webentwickler Heidelberg – Robin Lehmann | Connected" },
      {
        name: "description",
        content:
          "Robin Lehmann — Webentwickler & Digital Consultant aus Heidelberg. Persönlicher Ansprechpartner für professionelle Webentwicklung.",
      },
      { property: "og:title", content: "Über mich – Robin Lehmann | Connected" },
      {
        property: "og:description",
        content: "Ihr persönlicher Ansprechpartner für professionelle Webentwicklung.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Über mich"
        title="Über mich."
        subtitle="Ihr persönlicher Ansprechpartner für professionelle Webentwicklung."
      />
      <About />
    </main>
  );
}
