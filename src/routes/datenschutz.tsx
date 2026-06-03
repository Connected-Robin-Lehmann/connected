import { createFileRoute } from "@tanstack/react-router";
import { Hero as PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz | Connected" },
      { name: "description", content: "Datenschutzerklärung von Connected – Robin Lehmann, Heidelberg." },
    ],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <main>
      <PageHero eyebrow="Rechtliches" title="Datenschutz." />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-10 text-muted-foreground leading-relaxed">
          <Block title="1. Datenschutz auf einen Blick">
            <h3 className="text-foreground font-semibold">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Datenerfassung auf dieser Website</h3>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
              Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
          </Block>

          <Block title="2. Hosting">
            <h3 className="text-foreground font-semibold">Externes Hosting</h3>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die
              personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den
              Servern des Hosters gespeichert.
            </p>
          </Block>

          <Block title="3. Allgemeine Hinweise und Pflichtinformationen">
            <h3 className="text-foreground font-semibold">Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
              Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der
              gesetzlichen Datenschutzvorschriften.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Connected<br />
              Robin Lehmann<br />
              Dürerstraße 10, 69126 Heidelberg<br />
              E-Mail:{" "}
              <a className="text-foreground hover:text-primary transition" href="mailto:robin.lehmann@connected-webdesign.de">
                robin.lehmann@connected-webdesign.de
              </a>
            </p>
          </Block>

          <Block title="4. Datenerfassung auf dieser Website">
            <h3 className="text-foreground font-semibold">Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus
              dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks
              Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Anfrage per E-Mail oder Telefon</h3>
            <p>
              Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller
              daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der
              Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet.
            </p>
          </Block>

          <Block title="5. Ihre Rechte">
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und
              Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem
              ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Hierzu sowie
              zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
              Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde
              zu.
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
