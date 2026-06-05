# DSGVO-Check für den Website-Check

Erweitert den bestehenden `WebsiteCheck` um eine zweite, serverseitig laufende Analyse. Eine URL, beide Analysen (Lighthouse + DSGVO) laufen parallel, Ergebnis erscheint im selben Bereich.

## Was geprüft wird

| Kategorie | Methode |
|---|---|
| **HTTPS / SSL** | Antwortet `https://`? Wird `http://` automatisch weitergeleitet? Gültiges Zertifikat (kein Fetch-Fehler)? |
| **Cookies beim Laden** | `Set-Cookie`-Header der Initialantwort parsen — Anzahl Cookies, Namen, `Secure`/`HttpOnly`/`SameSite`. Bekannte Tracker-Cookie-Namen markieren (`_ga`, `_fbp`, `_gid`, `_hjSession*`, …). |
| **Externe Ressourcen** | HTML parsen, alle `<script src>`, `<link href>`, `<img src>`, `<iframe src>` extrahieren. Hosts gegen Allowlist (eigene Domain) und Risk-Liste matchen: Google Fonts, Google Analytics/Tag Manager, Facebook, YouTube, Google Maps, Hotjar, Cloudflare Insights, etc. |
| **Tracker-Skripte** | Script-URLs gegen bekannte Tracker-Patterns matchen (`google-analytics.com`, `googletagmanager.com`, `connect.facebook.net`, `hotjar.com`, `clarity.ms`, `matomo`, …). |
| **Impressum & Datenschutz** | Im HTML nach Links suchen, deren Text oder `href` `impressum`, `datenschutz`, `privacy`, `legal` enthält. |
| **Security-Header (Bonus)** | `Strict-Transport-Security`, `X-Content-Type-Options`, `Content-Security-Policy`, `Referrer-Policy` — kurz angezeigt. |

Pro Kategorie ein Status: **OK / Warnung / Problem**, plus Detailliste. Daraus wird ein Gesamt-Score (0–100) und eine Texteinstufung berechnet, analog zum Lighthouse-Block.

## Architektur

**Neue Server Function** `src/lib/dsgvo.functions.ts`:
- `createServerFn({ method: "POST" })` mit Zod-validierter URL (max. 500 Zeichen, muss `http(s)`-Schema haben).
- SSRF-Schutz: DNS-Auflösung blockieren für private IP-Bereiche (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`, `fc00::/7`). Nur `http`/`https` erlauben.
- Timeout 15 s via `AbortController`.
- User-Agent: `ConnectedWebsiteCheck/1.0 (+https://…)` damit Seiten den Bot identifizieren können.
- Schritte:
  1. `fetch(url)` mit `redirect: "manual"` → HTTPS-Weiterleitung prüfen.
  2. `fetch(url, { redirect: "follow" })` → finale Antwort, Header & HTML.
  3. HTML mit `linkedom` parsen (leichtgewichtig, Worker-kompatibel) — falls Bundle-Größe ein Problem ist, Fallback auf Regex für `<script>`/`<link>`/`<a>`.
  4. Cookies aus `Set-Cookie` extrahieren (Worker-API: `response.headers.getSetCookie()`).
  5. Externe Hosts gegen Tracker-Mapping prüfen.
  6. Score & Findings zusammenstellen, plain DTO zurückgeben.

**Frontend-Erweiterung** in `src/components/site/WebsiteCheck.tsx`:
- Submit ruft Lighthouse **und** DSGVO-Server-Function parallel via `Promise.allSettled`. Jede Sektion hat eigenen Loading-/Error-State (eine kann fehlschlagen, ohne die andere zu blocken).
- Neuer Ergebnis-Block direkt unter der Lighthouse-Zusammenfassung:
  - Gesamt-Gauge + Texteinstufung im gleichen Stil wie bisher (`glass`, gleicher Score-Farbcode).
  - Grid mit 6 Karten (eine pro Kategorie), Status-Icon (`CheckCircle2` / `AlertTriangle` / `XCircle`), kurzer Befund.
  - Aufklappbare Detail-Liste pro Karte (z. B. „3 externe Hosts gefunden: fonts.googleapis.com, …").
- Reihenfolge im Ergebnis: Lighthouse-Karte → Lighthouse-Kategorien → Core Web Vitals → **DSGVO-Karte** → **DSGVO-Details** → Screenshot → CTA.

## Design

Bestehende Token & Klassen wiederverwenden: `glass`-Karten, `scoreColor`-Funktion aus der Datei, Gauge-Komponente, Primary-Farbtöne. Keine neuen Farben, keine neuen Schriften.

## Disclaimer

Unter dem DSGVO-Block kleiner Hinweis: *„Heuristische Analyse, ersetzt keine rechtliche Prüfung. Geprüft wird nur die Startseite ohne Interaktion."*

## Out of Scope

- Subseiten-Crawling (nur die eingegebene URL wird geladen).
- Cookie-Banner-Erkennung mit echter Interaktion (würde Headless Browser brauchen).
- Speicherung von Ergebnissen — alles läuft on-demand, kein DB-Eintrag.
- Rate-Limiting auf der Server Function (kann später ergänzt werden, falls Missbrauch auftritt).
