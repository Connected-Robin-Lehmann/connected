import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const TO_EMAIL = "robin.lehmann@connected-webdesign.de";
const FROM_EMAIL = "Connected <kontakt@connected-webdesign.de>";
const RESEND_URL = "https://api.resend.com";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
  hp: z.string().max(200).optional(),
});

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function adminHtml(d: z.infer<typeof schema>) {
  const subject = d.subject || `Projektanfrage von ${d.name}`;
  return `<!doctype html><html><body style="margin:0;background:#0b0b10;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e7e7ee;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#7c5cff;margin-bottom:8px;">Connected.</div>
      <h1 style="font-size:22px;margin:0 0 24px 0;color:#fff;">Neue Kontaktanfrage</h1>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px 22px;">
        <p style="margin:0 0 6px 0;font-size:12px;color:#9b9bab;">Betreff</p>
        <p style="margin:0 0 16px 0;font-size:15px;color:#fff;font-weight:600;">${esc(subject)}</p>
        <p style="margin:0 0 6px 0;font-size:12px;color:#9b9bab;">Von</p>
        <p style="margin:0 0 4px 0;font-size:15px;color:#fff;">${esc(d.name)}</p>
        <p style="margin:0 0 16px 0;font-size:14px;"><a href="mailto:${esc(d.email)}" style="color:#7c5cff;text-decoration:none;">${esc(d.email)}</a></p>
        ${d.website ? `<p style="margin:0 0 6px 0;font-size:12px;color:#9b9bab;">Website</p><p style="margin:0 0 16px 0;font-size:14px;color:#fff;">${esc(d.website)}</p>` : ""}
        <p style="margin:0 0 6px 0;font-size:12px;color:#9b9bab;">Nachricht</p>
        <p style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.6;color:#e7e7ee;">${esc(d.message)}</p>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#6b6b7a;">Antworte einfach auf diese Mail — sie geht direkt an ${esc(d.email)}.</p>
    </div>
  </body></html>`;
}

function adminText(d: z.infer<typeof schema>) {
  return `Neue Kontaktanfrage\n\nVon: ${d.name} <${d.email}>\n${d.website ? `Website: ${d.website}\n` : ""}Betreff: ${d.subject || `Projektanfrage von ${d.name}`}\n\n${d.message}`;
}

function userHtml(d: z.infer<typeof schema>) {
  return `<!doctype html><html><body style="margin:0;background:#0b0b10;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e7e7ee;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#7c5cff;margin-bottom:8px;">Connected.</div>
      <h1 style="font-size:24px;margin:0 0 16px 0;color:#fff;">Danke für deine Nachricht, ${esc(d.name)}!</h1>
      <p style="font-size:15px;line-height:1.6;color:#c7c7d3;margin:0 0 16px 0;">
        Deine Anfrage ist bei mir angekommen. Ich melde mich innerhalb von <strong style="color:#fff;">24 Stunden</strong> persönlich bei dir zurück.
      </p>
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px 20px;margin:20px 0;">
        <p style="margin:0 0 6px 0;font-size:12px;color:#9b9bab;">Deine Nachricht</p>
        <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#e7e7ee;">${esc(d.message)}</p>
      </div>
      <p style="font-size:14px;line-height:1.6;color:#c7c7d3;margin:24px 0 4px 0;">Viele Grüße<br/><strong style="color:#fff;">Robin Lehmann</strong></p>
      <p style="font-size:13px;color:#9b9bab;margin:0;">Connected — Webdesign &amp; Webentwicklung aus Heidelberg</p>
      <p style="font-size:12px;color:#6b6b7a;margin-top:24px;">
        <a href="mailto:${TO_EMAIL}" style="color:#7c5cff;text-decoration:none;">${TO_EMAIL}</a>
      </p>
    </div>
  </body></html>`;
}

function userText(d: z.infer<typeof schema>) {
  return `Danke für deine Nachricht, ${d.name}!\n\nDeine Anfrage ist angekommen. Ich melde mich innerhalb von 24 Stunden bei dir zurück.\n\nDeine Nachricht:\n${d.message}\n\nViele Grüße\nRobin Lehmann\nConnected — Webdesign & Webentwicklung aus Heidelberg\n${TO_EMAIL}`;
}

async function sendMail(payload: Record<string, unknown>) {
  const res = await fetch(`${RESEND_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json().catch(() => ({}));
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
        }

        const parsed = schema.safeParse(raw);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) },
            { status: 400 },
          );
        }
        const data = parsed.data;

        // Honeypot: still erfolgreich antworten, aber nichts senden
        if (data.hp && data.hp.trim().length > 0) {
          return Response.json({ ok: true });
        }

        if (!process.env.RESEND_API_KEY) {
          return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
        }

        const subjectAdmin = `Neue Anfrage: ${data.subject || data.name}`;

        try {
          await sendMail({
            from: FROM_EMAIL,
            to: [TO_EMAIL],
            reply_to: data.email,
            subject: subjectAdmin,
            html: adminHtml(data),
            text: adminText(data),
          });

          // Bestätigung an den Absender — Fehler hier darf den Hauptversand nicht killen
          try {
            await sendMail({
              from: FROM_EMAIL,
              to: [data.email],
              reply_to: TO_EMAIL,
              subject: "Deine Anfrage ist angekommen — Connected",
              html: userHtml(data),
              text: userText(data),
            });
          } catch (e) {
            console.error("[contact] confirmation send failed", e);
          }

          return Response.json({ ok: true });
        } catch (e) {
          console.error("[contact] send failed", e);
          return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
        }
      },
    },
  },
});
