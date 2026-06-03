import { Globe, Sparkles, Rocket } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Website",
    price: "ab 1.200 €",
    desc: "Eine neue, individuelle Website für dein Unternehmen — modern, schnell und auf dich zugeschnitten.",
    features: ["Bis zu 5 Seiten", "Responsive Design", "SEO-Grundlagen"],
  },
  {
    icon: Sparkles,
    title: "Website Redesign",
    price: "ab 1.200 €",
    desc: "Deine bestehende Seite wirkt veraltet? Ich gebe ihr ein frisches, professionelles Gesicht.",
    features: ["Visuelles Refresh", "Performance-Boost", "Mobile-Optimierung"],
    featured: true,
  },
  {
    icon: Rocket,
    title: "Landingpage",
    price: "ab 800 €",
    desc: "Eine fokussierte Seite für dein Angebot, Event oder deine Kampagne — schnell live, schnell wirksam.",
    features: ["One-Pager", "Conversion-Fokus", "In ~1 Woche live"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Leistungen</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Klare Pakete.<br />
            <span className="glow-text">Faire Preise.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="reveal group relative glass rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {s.featured && (
                <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Beliebt
                </div>
              )}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-2xl font-bold">{s.title}</h3>
              <div className="mt-1 text-primary font-medium">{s.price}</div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{s.desc}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top,oklch(0.58_0.22_264/0.2),transparent_60%)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
