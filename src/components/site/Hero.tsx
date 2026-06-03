import { ArrowRight, MapPin } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.58_0.22_264/0.15),transparent_60%)]" />
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground animate-fade-up">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Freelance Webdesign · Heidelberg
          </div>

          <h1
            className="mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.02] animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Ihre Website.
            <br />
            <span className="glow-text">Neu gedacht.</span>
          </h1>

          <p
            className="mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Professionelles Webdesign für kleine Unternehmen in Heidelberg —
            schnell, modern und unkompliziert.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="#contact"
              className="btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium hover:[&]:[transform:translateY(-2px)] hover:brightness-110"
            >
              Projekt anfragen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-medium hover:bg-white/5 transition"
            >
              Referenzen ansehen
            </a>
          </div>

          <div
            className="mt-16 grid grid-cols-3 gap-6 max-w-md animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { k: "100%", v: "Individuell" },
              { k: "<4 Wo", v: "Umsetzung" },
              { k: "1:1", v: "Betreuung" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl font-display font-bold text-foreground">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
