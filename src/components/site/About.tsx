import robin from "@/assets/robin.jpg";

export function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative glass rounded-3xl overflow-hidden aspect-[4/5] max-w-md">
              <img
                src={robin}
                alt="Robin Lehmann, Webdesigner aus Heidelberg"
                width={800}
                height={1024}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4">
                <div className="text-sm font-medium">Robin Lehmann</div>
                <div className="text-xs text-muted-foreground">Gründer · Webdesigner</div>
              </div>
            </div>
          </div>

          <div className="reveal">
            <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Über mich</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Persönlich. Direkt.<br /><span className="glow-text">Aus Heidelberg.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Ich bin Robin — Freelancer aus Heidelberg und Gründer von Connected Webdesign.
              Statt großer Agentur bekommst du einen direkten Ansprechpartner, der dein Projekt
              vom ersten Gespräch bis zum Launch persönlich begleitet.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Mein Fokus: schnelle, moderne Websites für kleine Unternehmen, die genauso gut
              aussehen wie sie funktionieren — ohne Marketing-Floskeln, ohne unnötige Komplexität.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Persönliche Beratung", "Faire Festpreise", "Made in Heidelberg"].map((t) => (
                <span key={t} className="glass rounded-full px-4 py-1.5 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
