import { ArrowUpRight } from "lucide-react";
import tennis from "@/assets/tennisclub.jpg";

export function Portfolio() {
  return (
    <section id="portfolio" className="py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Referenzen</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ausgewählte<br /><span className="glow-text">Projekte.</span>
          </h2>
        </div>

        <div className="reveal group relative glass rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative overflow-hidden bg-black/40 p-8 md:p-12">
              <div className="absolute -inset-20 bg-primary/20 blur-3xl opacity-60 animate-pulse-glow" />
              <img
                src={tennis}
                alt="Website Tennisclub Schwarz Gelb Heidelberg"
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
                Tennisclub Schwarz Gelb Heidelberg
              </h3>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Ein moderner Webauftritt für einen traditionsreichen Heidelberger Tennisverein —
                mit klarer Struktur, Vereinsfarben und allen wichtigen Infos für Mitglieder und Gäste auf einen Blick.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Webdesign", "Entwicklung", "CMS"].map((t) => (
                  <span key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="#"
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white/5 border border-white/10 px-6 py-3 text-sm font-medium hover:bg-primary hover:border-primary transition"
              >
                Website ansehen
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
