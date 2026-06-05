## Ziel

Den bestehenden Website-Check auf der Startseite um drei Metrik-Pakete erweitern und einen PDF-Export-Button hinzufügen, der einen professionellen, gebrandeten Bericht erzeugt.

## 1. Zusätzliche Metriken (serverseitig)

Neue Server Function `extendedAudit` in `src/lib/extended-audit.functions.ts`, läuft parallel zu Lighthouse + DSGVO.

### 1a. SEO-Tiefe (aus dem geladenen HTML, linkedom)
- `<title>` vorhanden + Länge (Soll 30–60)
- `<meta name="description">` vorhanden + Länge (Soll 70–160)
- `<html lang="…">` gesetzt
- Anzahl h1/h2/h3 (genau ein h1?)
- Open Graph (og:title, og:description, og:image)
- Twitter Card
- `<link rel="canonical">`
- JSON-LD strukturierte Daten (Typen auflisten)
- Bilder ohne `alt` (Anzahl von Gesamt)
- `robots.txt` per HEAD erreichbar
- `sitemap.xml` per HEAD erreichbar

### 1b. Mobile/UX
- `<meta name="viewport">` vorhanden + sinnvoll konfiguriert
- Favicon vorhanden (`<link rel="icon">` oder `/favicon.ico`)
- HTML-Dokumentgröße in KB

### 1c. Performance-Zusatz
- TTFB in ms (eigene Messung via `performance.now()`)
- Anzahl externer Requests (Script/Link/Img mit fremdem Host, aus HTML)

### Rückgabe-Shape
```ts
{
  seo:    { items: Array<{label, status, detail}>, score: number },
  mobile: { items: [...], score: number },
  perf:   { ttfbMs, externalRequests, items: [...], score: number },
}
```
Status-Schema identisch zu DSGVO (`ok | warn | fail`), damit die UI-Komponente wiederverwendbar bleibt.

## 2. Frontend-Integration

`src/components/site/WebsiteCheck.tsx`:
- `Promise.allSettled` erweitern auf 3 Calls (Lighthouse, DSGVO, ExtendedAudit)
- Drei neue Card-Blöcke unterhalb des DSGVO-Blocks, gleicher `glass`-Stil, Gauge + ausklappbare Details:
  1. SEO-Detail-Analyse
  2. Mobile & UX
  3. Server-Performance (TTFB + externe Requests prominent)
- Wiederverwendbare interne Sub-Komponente `MetricCard` extrahieren (DSGVO-Block damit ebenfalls refactoren), kein doppelter Code.
- Loading-Text: „Lighthouse-, DSGVO- & Detail-Analyse laufen…"

## 3. PDF-Export (Vektor, jsPDF + autotable)

### Dependencies
`bun add jspdf jspdf-autotable` (lazy-loaded beim Button-Klick → kein Einfluss auf Initial-Bundle der Startseite)

### Neue Datei `src/lib/report-pdf.ts`
Reine Client-Funktion `exportReport(payload)`, generiert A4-PDF:

**Struktur:**
1. **Deckblatt** — Connected-Wortmarke + Akzentbalken, Titel „Website-Analyse", URL, Datum, Strategie, Gesamtscore + DSGVO-Score als gezeichnete Kreise, 3–5-Zeilen-Zusammenfassung
2. **Lighthouse-Scores** — autotable (Kategorie | Score | Bewertung), Zeilen farblich nach Score
3. **Core Web Vitals** — autotable (Metrik | Wert | Bedeutung)
4. **DSGVO-Detailanalyse** — pro Finding Block mit Status-Farbcode + Detail-Bullets
5. **SEO / Mobile / Server-Performance** — analog
6. **Screenshot-Seite** — `result.screenshot` (Base64) via `doc.addImage`
7. **Empfehlungen** — automatisch aus allen Findings ≠ ok, gruppiert nach Bereich, 1-Satz-Handlungsempfehlung je Punkt (Mapping-Tabelle)
8. **Footer auf jeder Seite** — „Connected Webdesign — Robin Lehmann", Kontakt (E-Mail/Tel/URL), Seitenzahl, Generierungs-Datum
9. **Kontakt-CTA letzte Seite** — Karte mit Akzentfarbe, Hinweis „heuristische Analyse, keine Rechtsberatung"

### Farben & Design
- Aus dem Design-System abgeleitet, in PDF-tauglichem RGB hartcodiert (jsPDF kann kein oklch)
- Score-Farben: gleiche Schwellwerte wie UI (≥90 grün, ≥50 gelb, sonst rot)
- Hintergrund weiß (druckfreundlich), Akzentstreifen in Primary

### Button
- Oben rechts im Ergebnis-Bereich, `glass` Pill-Button mit Download-Icon
- Disabled solange nicht alle drei Analysen abgeschlossen sind
- Dateiname: `website-check-{hostname}-{YYYY-MM-DD}.pdf`

## Technische Details
- **SSRF-Schutz / Timeout / User-Agent**: gemeinsame Helper aus `dsgvo.functions.ts` in `src/lib/url-fetch.server.ts` extrahieren, beide Server Functions importieren sie.
- **TypeScript-Typen** aller Results exportieren, damit der PDF-Generator typsicher ist.
- **linkedom** ist bereits Dependency — keine neue für SEO/Mobile.
- **Bundle**: jspdf+autotable ~250 KB, via dynamischem `import()` lazy beim Klick geladen.

## Out of Scope
- Keine Unterseiten-Analyse
- Kein Speichern der Ergebnisse in einer Datenbank
- Keine E-Mail-Zustellung des PDFs (nur Download)
- Nur Deutsch

## Geänderte / neue Dateien
- neu: `src/lib/url-fetch.server.ts`
- neu: `src/lib/extended-audit.functions.ts`
- neu: `src/lib/report-pdf.ts`
- bearbeitet: `src/lib/dsgvo.functions.ts` (Helper extrahieren)
- bearbeitet: `src/components/site/WebsiteCheck.tsx` (3 Card-Blöcke, Export-Button, MetricCard-Refactor)
- bearbeitet: `package.json` / `bun.lock` (jspdf, jspdf-autotable)
