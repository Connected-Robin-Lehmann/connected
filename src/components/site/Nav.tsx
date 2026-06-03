import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Start" },
  { to: "/services", label: "Leistungen" },
  { to: "/about", label: "Über mich" },
  { to: "/references", label: "Referenzen" },
  { to: "/contact", label: "Kontakt" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled ? "glass" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow shadow-[0_0_20px_var(--primary)]" />
            Connected<span className="text-primary">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Projekt anfragen
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-foreground transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-foreground transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-foreground transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
        {open && (
          <div className="md:hidden glass mt-2 rounded-2xl p-5 flex flex-col gap-4 animate-fade-up">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
