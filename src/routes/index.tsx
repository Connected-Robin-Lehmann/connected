import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Portfolio } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connected Webdesign — Modernes Webdesign aus Heidelberg" },
      {
        name: "description",
        content:
          "Connected Webdesign — Freelance Webdesign aus Heidelberg von Robin Lehmann. Schnelle, moderne Websites für kleine Unternehmen.",
      },
      { property: "og:title", content: "Connected Webdesign — Webdesign aus Heidelberg" },
      {
        property: "og:description",
        content: "Professionelles Webdesign für kleine Unternehmen in Heidelberg.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
