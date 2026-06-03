import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4 text-sm">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
            Connected<span className="text-primary">.</span>
          </div>
          <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
            Professionelle Webentwicklung und -betreuung für Ihr Unternehmen.
          </p>
          <div className="mt-5 space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:robin.lehmann@connected-webdesign.de" className="hover:text-foreground transition">
                robin.lehmann@connected-webdesign.de
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Dürerstraße 10, 69126 Heidelberg
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium text-foreground mb-3">Navigation</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition">Start</Link></li>
            <li><Link to="/services" className="hover:text-foreground transition">Leistungen</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition">Über mich</Link></li>
            <li><Link to="/references" className="hover:text-foreground transition">Referenzen</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-medium text-foreground mb-3">Rechtliches</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/impressum" className="hover:text-foreground transition">Impressum</Link></li>
            <li><Link to="/datenschutz" className="hover:text-foreground transition">Datenschutz</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <div>© 2025 Connected — Inhaber: Robin Lehmann</div>
          <div>Made in Heidelberg</div>
        </div>
      </div>
    </footer>
  );
}
