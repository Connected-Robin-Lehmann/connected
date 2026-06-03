import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Portfolio } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { Contact } from "@/components/site/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connected — Webdesign & Webentwicklung aus Heidelberg" },
      {
        name: "description",
        content:
          "Connected Webdesign — Freelance Webentwicklung aus Heidelberg von Robin Lehmann. Schnelle, moderne Websites für kleine Unternehmen.",
      },
      { property: "og:title", content: "Connected — Webdesign aus Heidelberg" },
      {
        property: "og:description",
        content: "Professionelle Webentwicklung für kleine Unternehmen in Heidelberg.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <Services compact />
      <About compact />
      <Portfolio compact />
      <Process />
      <Contact compact />
    </main>
  );
}
