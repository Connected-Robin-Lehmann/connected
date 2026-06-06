## Problem

Das Projekt ist ein **TanStack Start**-Projekt, das aktuell für **Cloudflare Workers** als Deployment-Ziel konfiguriert ist (`@lovable.dev/vite-tanstack-config` mit Nitro/Cloudflare Default + `.wrangler/`-Build-Artefakte).

Beim Vercel-Deployment entsteht `404: NOT_FOUND`, weil Vercel das Cloudflare-Worker-Build nicht als Server-Renderer erkennt — es findet weder eine Vercel-Serverless-Function noch ein statisches `index.html` (TanStack Start nutzt SSR, kein SPA-Fallback).

## Lösung

Build-Target von Cloudflare auf **Vercel** umstellen, sodass Nitro ein Vercel-kompatibles Output erzeugt (`.vercel/output/` Build Output API v3, das Vercel nativ versteht).

## Schritte

1. **`vite.config.ts` anpassen** — Nitro-Preset explizit auf `vercel` setzen:
   ```ts
   export default defineConfig({
     tanstackStart: { server: { entry: "server" } },
     nitro: { preset: "vercel" },
   });
   ```

2. **Environment Variables in Vercel setzen** — im Vercel-Dashboard unter Project → Settings → Environment Variables für Production + Preview:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (falls für Kontaktformular benötigt)
   
   Die Werte können aus dem Lovable-Projekt (Cloud → Secrets) übernommen werden.

3. **Vercel-Projekteinstellungen prüfen**:
   - Framework Preset: **Other** (nicht „Vite") — Nitro liefert eine eigene Build Output API-Struktur
   - Build Command: `bun run build` (oder `vite build`)
   - Output Directory: **leer lassen** — Nitro schreibt automatisch nach `.vercel/output/`
   - Install Command: `bun install`

4. **Lokal verifizieren** (optional, vor dem Push):
   ```bash
   bun run build
   ls .vercel/output/
   ```
   Sollte `config.json`, `functions/` und `static/` enthalten.

5. **Neu deployen** auf Vercel.

## Wichtiger Hinweis

Lovables Preview & „Publish" laufen weiter auf Cloudflare — die Umstellung auf Vercel hat **keinen Einfluss** auf den Lovable-Preview, weil das Lovable-eigene Plugin den Sandbox-Dev-Server unabhängig vom `nitro.preset` startet. Sollte es trotzdem Probleme im Preview geben, kann der Preset alternativ via Umgebungsvariable (`NITRO_PRESET=vercel` nur in Vercel) gesteuert werden — sage Bescheid, dann passe ich das so an.

## Alternative

Falls Vercel-Deployment komplizierter wird (z.B. Server-Funktionen verhalten sich anders), ist **Lovable Publish** mit Custom Domain die wartungsärmere Option, da das Projekt dafür bereits vollständig konfiguriert ist.
