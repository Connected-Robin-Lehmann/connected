import { Check, X } from "lucide-react";

const codeLines: { t: string; c?: string }[] = [
  { t: "import { useState } from 'react';", c: "text-[oklch(0.7_0.18_290)]" },
  { t: "" },
  { t: "export function Hero() {", c: "text-[oklch(0.78_0.15_200)]" },
  { t: "  const [active, setActive] = useState(true);", c: "text-foreground/90" },
  { t: "" },
  { t: "  return (", c: "text-foreground/80" },
  { t: '    <section className="bg-background text-foreground">', c: "text-[oklch(0.78_0.12_150)]" },
  { t: '      <h1 className="text-5xl font-bold">', c: "text-[oklch(0.78_0.12_150)]" },
  { t: "        Ihre Website. Neu gedacht.", c: "text-foreground" },
  { t: "      </h1>", c: "text-[oklch(0.78_0.12_150)]" },
  { t: "    </section>", c: "text-[oklch(0.78_0.12_150)]" },
  { t: "  );", c: "text-foreground/80" },
  { t: "}", c: "text-[oklch(0.78_0.15_200)]" },
];

export function CodeShowcase() {
  return (
    <section className="py-32 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-3xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Unsere Arbeitsweise</div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Echte Webentwicklung —<br />
            <span className="glow-text">keine Baukästen.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Statt klick-bunter Templates schreibe ich sauberen, individuellen Code.
            Das bedeutet: deine Website ist schnell, flexibel und genau auf dich zugeschnitten.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="reveal grid sm:grid-cols-2 gap-4">
            <CompareCard
              title="Nicht bei uns"
              tone="neg"
              items={[
                "Wix / Jimdo / Squarespace",
                "WordPress-Templates",
                "Eingeschränkte Anpassungen",
                "Langsame Ladezeiten",
              ]}
            />
            <CompareCard
              title="Unsere Arbeitsweise"
              tone="pos"
              items={[
                "Individueller Code",
                "Maßgeschneidertes Design",
                "Volle Flexibilität",
                "Optimale Performance",
              ]}
            />
          </div>

          <div className="reveal relative">
            <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full opacity-60" />
            <div className="relative glass rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_oklch(0_0_0/0.6)]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
                <span className="h-3 w-3 rounded-full bg-[oklch(0.7_0.2_25)]" />
                <span className="h-3 w-3 rounded-full bg-[oklch(0.8_0.15_85)]" />
                <span className="h-3 w-3 rounded-full bg-[oklch(0.75_0.18_150)]" />
                <div className="ml-3 text-xs text-muted-foreground font-mono">Hero.tsx</div>
              </div>
              <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto">
                <code>
                  {codeLines.map((l, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="select-none text-muted-foreground/50 w-5 text-right">{i + 1}</span>
                      <span className={l.c || "text-foreground/70"}>{l.t || "\u00A0"}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["React", "TypeScript", "Vite", "Tailwind CSS"].map((t) => (
                <span key={t} className="rounded-full glass px-3 py-1 text-xs">
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

function CompareCard({
  title, items, tone,
}: { title: string; items: string[]; tone: "pos" | "neg" }) {
  const Icon = tone === "pos" ? Check : X;
  const iconClass = tone === "pos" ? "text-primary" : "text-muted-foreground/70";
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] mb-4 text-muted-foreground">{title}</div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Icon className={`h-4 w-4 mt-0.5 ${iconClass}`} />
            <span className={tone === "pos" ? "text-foreground" : "text-muted-foreground line-through decoration-muted-foreground/40"}>
              {i}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
