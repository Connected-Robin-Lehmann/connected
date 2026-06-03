import { MessageCircle, PenTool, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Gespräch",
    desc: "Wir lernen uns kennen, ich höre zu und verstehe dein Projekt, deine Ziele und Wünsche.",
  },
  {
    icon: PenTool,
    title: "Entwurf",
    desc: "Du bekommst einen ersten Designentwurf — wir verfeinern ihn gemeinsam bis alles passt.",
  },
  {
    icon: CheckCircle2,
    title: "Fertigstellung",
    desc: "Ich setze deine Website technisch um, bringe sie online und übergebe sie startklar.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl mb-20">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Ablauf</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Drei Schritte<br />
            <span className="glow-text">zur neuen Website.</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {steps.map((s, i) => (
            <div
              key={s.title}
              className="reveal relative text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative mx-auto h-20 w-20">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
                <div className="relative h-full w-full rounded-full glass flex items-center justify-center text-primary border border-primary/30">
                  <s.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-[0_0_20px_var(--primary)]">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-8 text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
