import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Portfolio } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { Contact } from "@/components/site/Contact";
import { WebsiteCheck } from "@/components/site/WebsiteCheck";
import { getRequestOrigin } from "@/lib/origin.functions";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) =>
    buildPageHead({
      origin: loaderData?.origin ?? "",
      path: "/",
      title: "Connected — Webdesign & Webentwicklung aus Heidelberg",
      description:
        "Freelance Webentwicklung aus Heidelberg von Robin Lehmann — schnelle, moderne Websites für kleine Unternehmen, persönlich betreut.",
      ogTitle: "Connected — Webdesign aus Heidelberg",
      ogDescription:
        "Professionelle Webentwicklung für kleine Unternehmen in Heidelberg.",
    }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <WebsiteCheck />
      <Services compact />
      <About compact />
      <Portfolio compact />
      <Process />
      <Contact compact />
    </main>
  );
}
