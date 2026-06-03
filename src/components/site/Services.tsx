import { Code2, ShieldCheck, Users } from "lucide-react";

export const services = [
  {
    icon: Code2,
    title: "Webdesign & Entwicklung",
    desc: "Moderne, responsive Websites mit benutzerfreundlichem Design — individuell für dein Unternehmen entwickelt.",
    features: [
      "Responsive Design",
      "SEO-optimierte Strukturen",
      "Schnelle Ladezeiten",
      "Barrierefreie Gestaltung",
      "Content Management Systeme",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Wartung & Updates",
    desc: "Kontinuierliche Pflege deiner Website für maximale Sicherheit und Stabilität — ohne dass du dich darum kümmern musst.",
    features: [
      "Regelmäßige Sicherheitsupdates",
      "Performance-Optimierung",
      "Backup & Recovery",
      "Bug-Fixes",
      "Technische Überwachung",
    ],
    featured: true,
  },
  {
    icon: Users,
    title: "Management & Moderation",
    desc: "Professionelle Betreuung mit persönlichem Service — ich kümmere mich um deine Inhalte und bin dein direkter Ansprechpartner.",
    features: [
      "Content-Management",
      "Social Media Integration",
      "Analytics & Reporting",
      "Persönlicher Ansprechpartner",
      "Schneller Support",
    ],
  },
];

export function Services({ compact = false }: { compact?: boolean }) {
  return (
    <section id="services" className={compact ? "py-24 relative" : "py-32 relative"}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Leistungen</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Alles aus einer Hand.<br />
            <span className="glow-text">Persönlich betreut.</span>
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
