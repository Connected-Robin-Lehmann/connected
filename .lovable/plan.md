## Ziel

Das Kontaktformular versendet die Anfrage serverseitig über den **Resend Connector** — kein `mailto:` mehr. Der Absender bekommt zusätzlich eine gebrandete Eingangsbestätigung. Schutz vor Bots über ein verstecktes Honeypot-Feld.

## Voraussetzung (einmalig durch dich)

- Resend Connector verbinden (Lovable fragt nach deinem Resend-Account und richtet die Domain `connected-webdesign.de` ein — DNS-Einträge bei deinem Registrar setzen).
- Solange die Domain noch nicht verifiziert ist, läuft der Versand über `onboarding@resend.dev` (nur als Test, geht aber an dich).

## Was gebaut wird

### 1. Server-Route `src/routes/api/contact.ts` (POST)
- Empfängt JSON: `{ name, email, subject?, website?, message, hp }`
- Validiert mit `zod` (Längen, E-Mail-Format, Pflichtfelder)
- **Honeypot**: wenn `hp` befüllt → `200 ok` ohne Versand (Bot still abweisen)
- Sendet zwei Mails über `https://connector-gateway.lovable.dev/resend/emails`:
  - **An dich** (`robin.lehmann@connected-webdesign.de`): formatierte HTML-Mail mit allen Feldern, `reply_to` = E-Mail des Absenders → du kannst direkt antworten
  - **An den Absender**: kurze gebrandete Bestätigung („Danke für deine Anfrage, ich melde mich innerhalb von 24 Stunden")
- Liefert `{ ok: true }` oder strukturierte Fehler (400 Validation, 502 Gateway, 500 generisch)
- Liest `process.env.LOVABLE_API_KEY` + `process.env.RESEND_API_KEY`

### 2. E-Mail-Templates (inline im Handler, kein React Email nötig)
- Beide Mails als schlanke Inline-HTML-Strings im Connected-Branding (dunkler Hintergrund, primary-Akzent, Logo-Text „Connected.")
- Plain-Text-Fallback (`text`-Feld)

### 3. `src/components/site/Contact.tsx` umbauen
- `mailto:`-Logik raus, `fetch("/api/contact", { method: "POST", … })` rein
- States: `idle | submitting | success | error`
- Button zeigt Spinner + „Wird gesendet…" während Submit, ist disabled
- Erfolgs-UI: grüne Bestätigungskarte mit Checkmark statt Formular („Danke! Deine Nachricht ist angekommen. Ich melde mich innerhalb von 24h.")
- Fehler-UI: Toast / Inline-Hinweis mit Retry
- Honeypot: unsichtbares `<input name="hp">` mit `tabindex={-1}`, `autocomplete="off"`, `aria-hidden`, off-screen positioniert
- `mailto:`-Link unter dem Formular bleibt als Fallback erhalten

### 4. Kein neuer State / keine DB
- Anfragen werden **nicht** gespeichert (keine Lovable Cloud benötigt). Du bekommst alles per Mail.

## Technische Details

### Gateway-Call (Pseudocode)
```ts
await fetch("https://connector-gateway.lovable.dev/resend/emails", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": process.env.RESEND_API_KEY!,
  },
  body: JSON.stringify({
    from: "Connected <kontakt@connected-webdesign.de>",   // bzw. onboarding@resend.dev vor Domain-Verify
    to: ["robin.lehmann@connected-webdesign.de"],
    reply_to: data.email,
    subject: `Neue Anfrage von ${data.name}`,
    html, text,
  }),
});
```

### Zod-Schema (serverseitig, identisch zu Client)
- `name`: 1–100, trim
- `email`: gültig, ≤255
- `subject`: ≤200, optional
- `website`: ≤200, optional
- `message`: 5–2000, trim
- `hp`: optional string (Honeypot)

### Out of Scope (bewusst nicht jetzt)
- Rate-Limit pro IP (kannst du nachrüsten, sobald Cloud aktiv ist und wir KV/DB nutzen können)
- Cloudflare Turnstile
- Speicherung in DB
- Datei-Anhänge

## Dateien

**Neu:**
- `src/routes/api/contact.ts`

**Geändert:**
- `src/components/site/Contact.tsx`

## Was du danach tun musst

1. Resend Connector verbinden (ich löse den Dialog im Build-Schritt aus).
2. In Resend deine Domain `connected-webdesign.de` verifizieren (DNS-Records setzen). Bis dahin testet das Formular mit dem Resend-Default-Absender.
3. Testanfrage abschicken → Mail in deinem Postfach prüfen.
