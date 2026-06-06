import { createFileRoute } from "@tanstack/react-router";
import { Hero as PageHero } from "@/components/site/PageHero";
import { getRequestOrigin } from "@/lib/origin.functions";
import { buildPageHead, breadcrumbList } from "@/lib/seo";

export const Route = createFileRoute("/impressum")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    return buildPageHead({
      origin,
      path: "/impressum",
      title: "Impressum | Connected",
      description: "Impressum von Connected – Robin Lehmann, Heidelberg.",
      noindex: true,
      jsonLd: [
        breadcrumbList(origin, [
          { name: "Start", path: "/" },
          { name: "Impressum", path: "/impressum" },
        ]),
      ],
    });
  },
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <main>
      <PageHero eyebrow="Rechtliches" title="Impressum." />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 prose-invert space-y-10 text-muted-foreground leading-relaxed">
          <Block title="Angaben gemäß § 5 TMG">
            <p>
              Connected<br />
              Inhaber: Robin Lehmann<br />
              Dürerstraße 10<br />
              69126 Heidelberg
            </p>
          </Block>

          <Block title="Kontakt">
            <p>
              E-Mail:{" "}
              <a className="text-foreground hover:text-primary transition" href="mailto:robin.lehmann@connected-webdesign.de">
                robin.lehmann@connected-webdesign.de
              </a>
            </p>
          </Block>

          <Block title="Redaktionell verantwortlich">
            <p>
              Robin Lehmann<br />
              Dürerstraße 10, 69126 Heidelberg
            </p>
          </Block>

          <Block title="EU-Streitschlichtung">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                ec.europa.eu/consumers/odr
              </a>
              .<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </Block>

          <Block title="Verbraucherstreitbeilegung / Universalschlichtungsstelle">
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Block>

          <Block title="Haftung für Inhalte">
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
              Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
              als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
              fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>
          </Block>

          <Block title="Haftung für Links">
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
              Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </Block>

          <Block title="Urheberrecht">
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
              bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </Block>
        </div>
      </section>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-foreground mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
