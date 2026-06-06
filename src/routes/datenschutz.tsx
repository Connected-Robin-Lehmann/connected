import { createFileRoute } from "@tanstack/react-router";
import { Hero as PageHero } from "@/components/site/PageHero";
import { getRequestOrigin } from "@/lib/origin.functions";
import { buildPageHead, breadcrumbList } from "@/lib/seo";

export const Route = createFileRoute("/datenschutz")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "";
    return buildPageHead({
      origin,
      path: "/datenschutz",
      title: "Datenschutz | Connected",
      description:
        "Datenschutzerklärung von Connected – Robin Lehmann, Heidelberg.",
      noindex: true,
      jsonLd: [
        breadcrumbList(origin, [
          { name: "Start", path: "/" },
          { name: "Datenschutz", path: "/datenschutz" },
        ]),
      ],
    });
  },
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
              Ausführliche Informationen entnehmen Sie den folgenden Abschnitten.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Datenerfassung auf dieser Website</h3>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist der Websitebetreiber
              (siehe Abschnitt 3 sowie das Impressum). Beim bloßen Besuch der Website werden
              automatisch technische Daten (z. B. IP-Adresse) durch unseren Hosting-Anbieter
              erfasst. Personenbezogene Daten erheben wir nur, wenn Sie uns diese aktiv mitteilen
              (z. B. per E-Mail oder über das Kontaktformular).
            </p>
          </Block>

          <Block title="2. Hosting">
            <h3 className="text-foreground font-semibold">Externes Hosting</h3>
            <p>
              Diese Website wird bei der Lovable GmbH („Lovable", https://lovable.dev)
              gehostet, die ihrerseits eine global verteilte Edge-Infrastruktur einsetzt.
              Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den
              Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen,
              Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten,
              Namen, Websitezugriffe und sonstige über eine Website generierte Daten handeln.
            </p>
            <p>
              Die Nutzung des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
              potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse
              einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots
              durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO). Mit dem Hoster
              wurde ein Vertrag über die Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO
              geschlossen.
            </p>
          </Block>


          <Block title="3. Allgemeine Hinweise und Pflichtinformationen">
            <h3 className="text-foreground font-semibold">Datenschutz</h3>
            <p>
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und behandeln Ihre
              personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften (DSGVO, BDSG) sowie dieser Datenschutzerklärung.
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
            <h3 className="text-foreground font-semibold mt-4">Speicherdauer</h3>
            <p>
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
              wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
              Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen
              oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht,
              sofern keine gesetzlichen Aufbewahrungspflichten (z. B. handels- oder
              steuerrechtliche Aufbewahrungsfristen) entgegenstehen.
            </p>
            <h3 className="text-foreground font-semibold mt-4">SSL-/TLS-Verschlüsselung</h3>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
              vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
              Verbindung erkennen Sie an „https://" in der Adresszeile Ihres Browsers.
            </p>
          </Block>

          <Block title="4. Datenerfassung auf dieser Website">
            <h3 className="text-foreground font-semibold">Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in
              sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt (Browsertyp
              und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden
              Rechners, Uhrzeit der Serveranfrage, IP-Adresse). Eine Zusammenführung dieser Daten
              mit anderen Datenquellen findet nicht statt. Die Erfassung erfolgt auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO; der Websitebetreiber hat ein berechtigtes Interesse an
              der technisch fehlerfreien Darstellung und Sicherheit seiner Website.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Kontaktformular</h3>
            <p>
              Wenn Sie uns über das Kontaktformular eine Nachricht zukommen lassen, werden Ihre
              Angaben aus dem Formular (Name, E-Mail-Adresse, ggf. Telefonnummer sowie Ihre
              Nachricht) zum Zwecke der Bearbeitung Ihrer Anfrage und für den Fall von
              Anschlussfragen bei uns gespeichert. Die Übermittlung erfolgt SSL-/TLS-verschlüsselt
              über unseren Server an unseren E-Mail-Versanddienstleister.
            </p>
            <p>
              Für den Versand der Kontaktanfragen als E-Mail nutzen wir den Dienst{" "}
              <strong>Resend</strong> (Resend, Inc., 2261 Market Street #4667, San Francisco,
              CA 94114, USA). Resend verarbeitet hierbei die im Formular eingegebenen Daten in
              unserem Auftrag (Art. 28 DSGVO). Die Übertragung in die USA erfolgt auf Grundlage
              des EU-US Data Privacy Framework sowie ergänzender Standardvertragsklauseln.
            </p>
            <p>
              Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Bearbeitung
              vorvertraglicher Anfragen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
              an der effektiven Bearbeitung von Kontaktanfragen). Die Daten verbleiben bei uns,
              bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen
              oder der Zweck für die Datenspeicherung entfällt – zwingende gesetzliche
              Aufbewahrungspflichten bleiben unberührt.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Anfrage per E-Mail oder Telefon</h3>
            <p>
              Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller
              daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der
              Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Rechtsgrundlage ist
              Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche bzw. vertragliche Maßnahmen) sowie
              Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung Ihrer
              Anfrage). Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>

          </Block>

          <Block title="5. Plugins und Tools">
            <h3 className="text-foreground font-semibold">Schriftarten (lokal eingebunden)</h3>
            <p>
              Diese Website nutzt zur einheitlichen Darstellung von Schriftarten die Schriftarten
              „Inter" und „Space Grotesk". Diese werden ausschließlich lokal von unserem Server
              ausgeliefert. Eine Verbindung zu Servern Dritter (z. B. Google Fonts) findet
              <strong> nicht</strong> statt. Es werden in diesem Zusammenhang keine
              personenbezogenen Daten an Dritte übermittelt.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Keine Cookies, kein Tracking</h3>
            <p>
              Diese Website setzt keine Cookies und nutzt keine Analyse-, Tracking- oder
              Marketing-Tools (z. B. Google Analytics, Facebook Pixel). Es findet keine
              automatisierte Auswertung Ihres Nutzungsverhaltens statt.
            </p>
            <h3 className="text-foreground font-semibold mt-4">Google PageSpeed Insights (Website-Check)</h3>
            <p>
              Auf unserer Startseite bieten wir einen freiwilligen Website-Check an. Wenn Sie eine
              URL eingeben und die Analyse starten, wird diese URL zusammen mit Ihrer IP-Adresse
              direkt aus Ihrem Browser an die Google PageSpeed Insights API (Google Ireland
              Limited, Gordon House, Barrow Street, Dublin 4, Irland) übermittelt, um die
              Analyse-Ergebnisse abzurufen. Es werden keine personenbezogenen Daten von Ihrer
              Person an Google übertragen, die über die technisch notwendige Verbindung
              hinausgehen. Die Nutzung erfolgt nur auf Ihre aktive Anforderung hin auf Grundlage
              von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Klick auf den Analyse-Button)
              sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung
              dieses Werkzeugs). Details: {" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                policies.google.com/privacy
              </a>
              .
            </p>

          </Block>

          <Block title="6. Ihre Rechte">
            <p>
              Ihnen stehen jederzeit folgende Rechte zu: Recht auf Auskunft (Art. 15 DSGVO),
              Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der
              Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch
              gegen die Verarbeitung (Art. 21 DSGVO). Wenn Sie eine Einwilligung erteilt haben,
              können Sie diese jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>
            <p>
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit
              unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen
              ein Beschwerderecht bei der zuständigen Datenschutz-Aufsichtsbehörde zu. Zuständig
              ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg (
              <a
                href="https://www.baden-wuerttemberg.datenschutz.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                baden-wuerttemberg.datenschutz.de
              </a>
              ).
            </p>
          </Block>

          <Block title="7. Aktualität und Änderung dieser Datenschutzerklärung">
            <p>
              Diese Datenschutzerklärung ist aktuell gültig. Durch die Weiterentwicklung unserer
              Website oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es
              notwendig werden, diese Datenschutzerklärung zu ändern.
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
