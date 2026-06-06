import { useState } from "react";
import { Mail, Send, Phone, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const schema = z.object({
  name: z.string().trim().min(1, "Bitte gib deinen Namen ein").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  subject: z.string().trim().max(200).optional(),
  website: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Bitte schreibe eine kurze Nachricht").max(2000),
});

const EMAIL = "robin.lehmann@connected-webdesign.de";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      website: String(fd.get("website") || ""),
      message: String(fd.get("message") || ""),
      hp: String(fd.get("hp") || ""),
    };

    const res = schema.safeParse(data);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("submitting");
    setErrorMsg("");

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok || !json.ok) {
        throw new Error(json?.error || `HTTP ${r.status}`);
      }
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Der Versand hat leider nicht geklappt. Bitte versuche es erneut oder schreibe mir direkt eine E-Mail.");
    }
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
          {status === "success" ? (
            <div className="reveal glass rounded-3xl p-10 md:p-14 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Nachricht angekommen!</h3>
              <p className="text-muted-foreground max-w-md">
                Danke für deine Anfrage. Du bekommst gleich eine Bestätigung per E-Mail —
                ich melde mich innerhalb von 24 Stunden persönlich bei dir zurück.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-8 text-sm text-muted-foreground hover:text-foreground transition"
              >
                Weitere Nachricht senden
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="reveal glass rounded-3xl p-8 md:p-10 space-y-5" noValidate>
              {/* Honeypot — für Menschen unsichtbar */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                <label>
                  Bitte leer lassen
                  <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

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

              {status === "error" && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

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
                  disabled={status === "submitting"}
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium hover:brightness-110 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === "submitting" ? (
                    <>
                      Wird gesendet…
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Projekt starten
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

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
