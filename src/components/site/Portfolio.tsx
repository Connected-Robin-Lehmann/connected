import { ArrowUpRight, Quote } from "lucide-react";
import { Link } from "@tanstack/react-router";
import tennis from "@/assets/tennisclub.jpg";

export function Portfolio({ compact = false }: { compact?: boolean }) {
  return (
    <section id="portfolio" className={compact ? "py-24 relative" : "py-32 relative pt-40"}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Referenzen</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Unsere<br /><span className="glow-text">Projekte.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Websites, die funktionieren — für zufriedene Kunden.
          </p>
        </div>

        <div className="reveal group relative glass rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative overflow-hidden bg-black/40 p-8 md:p-12">
              <div className="absolute -inset-20 bg-primary/20 blur-3xl opacity-60 animate-pulse-glow" />
              <img
                src={tennis}
                alt="Website TC Schwarz-Gelb Heidelberg e.V."
                width={1280}
                height={800}
                loading="lazy"
                className="relative rounded-xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                Vereinswebsite
              </div>
              <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                TC Schwarz-Gelb Heidelberg e.V.
              </h3>
              <p className="mt-2 text-muted-foreground">Tennisverein mit über 600 Mitgliedern</p>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Eine moderne Vereins-Website mit Veranstaltungen, News und Trainingszeiten —
                übersichtlich gestaltet und für Mitglieder wie Gäste leicht zu bedienen.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Übersichtliche Darstellung aller Vereinsinfos</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Einfache Verwaltung von Events & News</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Optimiert für Smartphone & Desktop</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Webdesign", "Entwicklung", "CMS"].map((t) => (
                  <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="https://schwarzgelb-heidelberg.de"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white/5 border border-white/10 px-6 py-3 text-sm font-medium hover:bg-primary hover:border-primary transition"
              >
                schwarzgelb-heidelberg.de
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {!compact && (
          <div className="reveal mt-8 glass rounded-3xl p-8 md:p-10 flex gap-5 items-start">
            <Quote className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-xl md:text-2xl font-display leading-snug">
                „Very very nice, clean, easy to navigate, professional!"
              </p>
              <div className="mt-3 text-sm text-muted-foreground">— Vereinsmitglied, TC Schwarz-Gelb Heidelberg</div>
            </div>
          </div>
        )}

        {!compact && (
          <div className="reveal mt-16 relative overflow-hidden rounded-3xl p-10 md:p-16 text-center glass">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,oklch(0.58_0.22_264/0.3),transparent_60%)]" />
            <h3 className="text-3xl md:text-5xl font-bold">
              Ihr Projekt könnte<br /><span className="glow-text">hier stehen.</span>
            </h3>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
              Lassen Sie uns gemeinsam eine Website erstellen, auf die Sie stolz sein können.
            </p>
            <Link
              to="/contact"
              className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium hover:brightness-110"
            >
              Projekt besprechen
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
