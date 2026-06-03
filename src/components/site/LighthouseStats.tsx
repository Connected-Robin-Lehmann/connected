import { Zap, Eye, ShieldCheck, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const metrics = [
  {
    label: "Performance",
    score: 99,
    icon: Zap,
    color: "#22c55e",
    desc: "Schnelle Ladezeiten durch moderne Optimierungstechniken.",
  },
  {
    label: "Barrierefreiheit",
    score: 100,
    icon: Eye,
    color: "#22c55e",
    desc: "Für alle Nutzer zugänglich – inklusive Screenreader-Support.",
  },
  {
    label: "Best Practices",
    score: 100,
    icon: ShieldCheck,
    color: "#22c55e",
    desc: "Sicherer Code, aktuelle Standards und saubere Architektur.",
  },
  {
    label: "SEO",
    score: 100,
    icon: Search,
    color: "#22c55e",
    desc: "Optimiert für Google – von der Struktur bis zum Inhalt.",
  },
];

function Gauge({ value, color, size = 120 }: { value: number; color: string; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={animated ? offset : c}
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display">{animated ? value : 0}</span>
      </div>
    </div>
  );
}

export function LighthouseStats() {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Qualität</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Lighthouse-<span className="glow-text">optimiert.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Jede Website wird auf maximale Performance, Barrierefreiheit und Suchmaschinenfreundlichkeit getrimmt — messbar mit Google Lighthouse.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="reveal group glass rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-primary/30"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-center mb-6">
                <Gauge value={m.score} color={m.color} />
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">{m.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
