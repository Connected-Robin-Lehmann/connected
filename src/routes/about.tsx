import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { Hero as PageHero } from "@/components/site/PageHero";
import { getRequestOrigin } from "@/lib/origin.functions";
import { buildPageHead, breadcrumbList } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    return buildPageHead({
      origin,
      path: "/about",
      title: "Über mich – Robin Lehmann | Connected Heidelberg",
      description:
        "Robin Lehmann — Webentwickler & Digital Consultant aus Heidelberg. Persönlicher Ansprechpartner für professionelle Webentwicklung.",
      ogTitle: "Über mich – Robin Lehmann | Connected",
      ogDescription:
        "Ihr persönlicher Ansprechpartner für professionelle Webentwicklung.",
      jsonLd: [
        breadcrumbList(origin, [
          { name: "Start", path: "/" },
          { name: "Über mich", path: "/about" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Robin Lehmann",
          jobTitle: "Webentwickler & Digital Consultant",
          email: "robin.lehmann@connected-webdesign.de",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Heidelberg",
            addressCountry: "DE",
          },
          worksFor: { "@type": "Organization", name: "Connected" },
        },
      ],
    });
  },
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
