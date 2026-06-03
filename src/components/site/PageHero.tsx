export function Hero({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative pt-40 pb-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4 animate-fade-up">
            {eyebrow}
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.05] animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {title}
            {highlight && (
              <>
                <br />
                <span className="glow-text">{highlight}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
