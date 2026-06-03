import { useState } from "react";
import { Mail, Send, Phone, Clock, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Bitte gib deinen Namen ein").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  subject: z.string().trim().max(200).optional(),
  website: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Bitte schreibe eine kurze Nachricht").max(2000),
});

const EMAIL = "robin.lehmann@connected-webdesign.de";

export function Contact({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<null | "ok" | "err">(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      website: String(fd.get("website") || ""),
      message: String(fd.get("message") || ""),
    };
    const res = schema.safeParse(data);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      setStatus("err");
      return;
    }
    setErrors({});
    const subject = encodeURIComponent(data.subject || `Projektanfrage von ${data.name}`);
    const body = encodeURIComponent(
      `${data.message}\n\n${data.website ? `Website: ${data.website}\n` : ""}— ${data.name} (${data.email})`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setStatus("ok");
  };

  return (
    <section id="contact" className={compact ? "py-24 relative" : "py-32 relative pt-40"}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal text-center mb-12">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Kontakt</div>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Lass uns über dein<br /><span className="glow-text">Projekt sprechen.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Hast du Fragen oder möchtest du ein Projekt besprechen? Ich freue mich
            auf deine Nachricht — und melde mich innerhalb von 24 Stunden zurück.
          </p>
        </div>

        <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[1.4fr_1fr]"}`}>
          <form onSubmit={onSubmit} className="reveal glass rounded-3xl p-8 md:p-10 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Name *" name="name" placeholder="Max Mustermann" error={errors.name} />
              <Field label="E-Mail *" name="email" type="email" placeholder="max@beispiel.de" error={errors.email} />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Betreff" name="subject" placeholder="Worum geht es?" />
              <Field label="Website" name="website" placeholder="meine-firma.de" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Nachricht *</label>
              <textarea
                name="message"
                rows={6}
                placeholder="Erzähl mir kurz von deinem Projekt..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition"
              />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>
              <button
                type="submit"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium hover:brightness-110 hover:-translate-y-0.5 transition"
              >
                Projekt starten
                <Send className="h-4 w-4" />
              </button>
            </div>
            {status === "ok" && (
              <p className="text-sm text-primary">Danke! Dein E-Mail-Programm sollte sich öffnen.</p>
            )}
          </form>

          {!compact && (
            <div className="space-y-6">
              <div className="reveal glass rounded-3xl p-8">
                <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Kontakt</div>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-muted-foreground">E-Mail</div>
                      <a href={`mailto:${EMAIL}`} className="hover:text-primary transition">{EMAIL}</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-muted-foreground">Telefon</div>
                      <div>Auf Anfrage verfügbar</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="text-muted-foreground">Erreichbarkeit</div>
                      <div>Mo–Fr: 9:00–18:00 Uhr</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="reveal glass rounded-3xl p-8">
                <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
                  Kostenloses Erstgespräch
                </div>
                <ul className="space-y-3 text-sm">
                  {["Kostenlose Beratung", "Unverbindliches Angebot", "Persönlicher Ansprechpartner"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", placeholder, error,
}: { label: string; name: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition"
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
