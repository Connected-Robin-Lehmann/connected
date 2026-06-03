import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Bitte gib deinen Namen ein").max(100),
  email: z.string().trim().email("Ungültige E-Mail-Adresse").max(255),
  message: z.string().trim().min(5, "Bitte schreibe eine kurze Nachricht").max(2000),
});

export function Contact() {
  const [status, setStatus] = useState<null | "ok" | "err">(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
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
    const subject = encodeURIComponent(`Projektanfrage von ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:hello@connected-webdesign.de?subject=${subject}&body=${body}`;
    setStatus("ok");
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-4xl px-6">
        <div className="reveal text-center mb-12">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Kontakt</div>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Lass uns über dein<br /><span className="glow-text">Projekt sprechen.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Schreib mir ein paar Sätze zu deinem Vorhaben — ich melde mich innerhalb von 24 Stunden zurück.
          </p>
        </div>

        <form onSubmit={onSubmit} className="reveal glass rounded-3xl p-8 md:p-10 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Name" name="name" placeholder="Max Mustermann" error={errors.name} />
            <Field label="E-Mail" name="email" type="email" placeholder="max@beispiel.de" error={errors.email} />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Nachricht</label>
            <textarea
              name="message"
              rows={5}
              placeholder="Erzähl mir kurz von deinem Projekt..."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary transition"
            />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <a
              href="mailto:hello@connected-webdesign.de"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              hello@connected-webdesign.de
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
