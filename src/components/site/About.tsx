import robin from "@/assets/robin.jpg";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Target, Handshake, Zap } from "lucide-react";

const values = [
  { icon: Target, title: "Zielorientiert", desc: "Jedes Projekt wird strategisch geplant und auf deine Geschäftsziele ausgerichtet." },
  { icon: Handshake, title: "Persönlich", desc: "Direkter Kontakt mit mir während des gesamten Projekts — keine Hotline, kein Ticketsystem." },
  { icon: Zap, title: "Effizient", desc: "Schnelle Umsetzung ohne Kompromisse bei Qualität und Detailgenauigkeit." },
];

const steps = [
  { n: 1, title: "Erstkontakt", desc: "Anfrage & Kennenlernen" },
  { n: 2, title: "Beratung", desc: "Ziele & Strategie" },
  { n: 3, title: "Konzept", desc: "Design & Entwurf" },
  { n: 4, title: "Vertiefung", desc: "Feedback & Feinschliff" },
  { n: 5, title: "Launch", desc: "Go-Live & Support" },
];

export function About({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <section id="about" className={compact ? "py-24 relative" : "py-32 relative pt-40"}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative glass rounded-3xl overflow-hidden aspect-[4/5] max-w-md">
                <img
                  src={robin}
                  alt="Robin Lehmann, Webentwickler aus Heidelberg"
                  width={800}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4">
                  <div className="text-sm font-medium">Robin Lehmann</div>
                  <div className="text-xs text-muted-foreground">Webentwickler & Digital Consultant</div>
                </div>
              </div>
            </div>

            <div className="reveal">
              <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Über mich</div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ihr persönlicher<br /><span className="glow-text">Ansprechpartner.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Mit jahrelanger Erfahrung in der Webentwicklung helfe ich Unternehmen
                dabei, online sichtbar und erfolgreich zu sein — von der ersten Idee bis zur
                fertigen Website.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Als dein persönlicher Ansprechpartner begleite ich dich von der Beratung über
                die Umsetzung bis hin zur langfristigen Betreuung. Keine Agentur-Hierarchien,
                keine wechselnden Ansprechpartner.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Was mich auszeichnet: Kundennähe, Zuverlässigkeit und die Überzeugung, dass
                gute Webentwicklung individuelle Betreuung braucht.
              </p>
              {compact && (
                <Link
                  to="/about"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3 text-sm font-medium hover:bg-primary hover:border-primary transition"
                >
                  Mehr über mich
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {!compact && (
        <>
          <section className="py-24 relative">
            <div className="mx-auto max-w-7xl px-6">
              <div className="reveal max-w-2xl mb-14">
                <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Meine Arbeitsweise</div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Drei Werte, die jedes<br /><span className="glow-text">Projekt prägen.</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {values.map((v, i) => (
                  <div
                    key={v.title}
                    className="reveal glass rounded-3xl p-8 hover:-translate-y-1 hover:border-primary/40 transition-all"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <v.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{v.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 relative">
            <div className="mx-auto max-w-7xl px-6">
              <div className="reveal max-w-2xl mb-14">
                <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Projektablauf</div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Von der Idee bis<br /><span className="glow-text">zum Launch.</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-5 gap-4 relative">
                <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                {steps.map((s, i) => (
                  <div
                    key={s.n}
                    className="reveal relative text-center"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="relative mx-auto h-12 w-12 rounded-full glass flex items-center justify-center text-primary font-bold border border-primary/30">
                      {s.n}
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 relative">
            <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-8">
              <div className="reveal glass rounded-3xl p-8">
                <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Tech-Stack</div>
                <h3 className="text-2xl font-bold">Frontend</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["React", "TypeScript", "Tailwind CSS", "Next.js"].map((t) => (
                    <span key={t} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm">{t}</span>
                  ))}
                </div>
                <h3 className="mt-8 text-2xl font-bold">Backend</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Node.js", "Supabase", "PostgreSQL"].map((t) => (
                    <span key={t} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-sm">{t}</span>
                  ))}
                </div>
              </div>
              <div className="reveal glass rounded-3xl p-8 flex flex-col">
                <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Kontakt</div>
                <h3 className="text-2xl font-bold">Lass uns sprechen.</h3>
                <p className="mt-3 text-muted-foreground">
                  E-Mail: <a className="text-foreground hover:text-primary transition" href="mailto:robin.lehmann@connected-webdesign.de">robin.lehmann@connected-webdesign.de</a><br />
                  Telefon: auf Anfrage
                </p>
                <Link
                  to="/contact"
                  className="btn-primary mt-auto self-start inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium hover:brightness-110"
                >
                  Projekt besprechen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
