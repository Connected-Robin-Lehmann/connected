import type { DsgvoResult, DsgvoFinding } from "./dsgvo.functions";
import type { ExtendedAuditResult, AuditItem, AuditStatus } from "./extended-audit.functions";

// ---------- Inputs ----------

export interface ReportInput {
  url: string;
  strategy: "mobile" | "desktop";
  generatedAt: Date;
  lighthouse: {
    scores: { performance: number; accessibility: number; bestPractices: number; seo: number };
    metrics: {
      lcp?: string;
      fcp?: string;
      cls?: string;
      tbt?: string;
      si?: string;
      tti?: string;
    };
    screenshot?: string;
  } | null;
  dsgvo: DsgvoResult | null;
  extended: ExtendedAuditResult | null;
  summary: string;
}

// ---------- Brand ----------

const BRAND = {
  name: "Connected Webdesign",
  owner: "Robin Lehmann",
  email: "robin.lehmann@connected-webdesign.de",
  url: "connected-heidelberg.de",
};

// RGB tuples (jsPDF requires sRGB)
const COLOR = {
  primary: [99, 102, 241] as [number, number, number], // indigo-500
  text: [24, 28, 47] as [number, number, number],
  muted: [110, 116, 134] as [number, number, number],
  divider: [228, 230, 240] as [number, number, number],
  ok: [34, 197, 94] as [number, number, number],
  warn: [245, 158, 11] as [number, number, number],
  fail: [239, 68, 68] as [number, number, number],
  cardBg: [248, 249, 252] as [number, number, number],
};

function scoreColor(score: number): [number, number, number] {
  if (score >= 90) return COLOR.ok;
  if (score >= 50) return COLOR.warn;
  return COLOR.fail;
}

function statusColor(status: AuditStatus): [number, number, number] {
  return status === "ok" ? COLOR.ok : status === "warn" ? COLOR.warn : COLOR.fail;
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Sehr gut";
  if (score >= 70) return "Gut";
  if (score >= 50) return "Verbesserungswürdig";
  return "Kritisch";
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

// ---------- Recommendations ----------

const RECOMMENDATIONS: Record<string, string> = {
  // Lighthouse
  performance: "Bilder optimieren (WebP/AVIF), unbenutztes JavaScript entfernen, Caching & Kompression aktivieren.",
  accessibility: "Farbkontraste, semantisches HTML, ARIA-Labels und Tastatur-Navigation prüfen.",
  bestPractices: "Aktuelle JavaScript-Bibliotheken nutzen, Konsolen-Fehler beheben, HTTPS überall.",
  seo: "Title & Meta-Description optimieren, semantische Struktur, mobile Optimierung sicherstellen.",
  // DSGVO
  https: "SSL-Zertifikat installieren und HTTP-Anfragen automatisch auf HTTPS umleiten.",
  cookies: "Tracking-Cookies erst nach aktiver Einwilligung (Opt-In) über ein Consent-Banner setzen.",
  external: "Externe Ressourcen lokal hosten oder erst nach Einwilligung laden (z. B. Google Fonts).",
  trackers: "Tracking-Skripte (Analytics, Pixel) erst nach Cookie-Banner-Zustimmung einbinden.",
  legal: "Rechtssichere Impressums- und Datenschutzseite verlinken (im Footer auf jeder Seite).",
  headers: "Sicherheits-Header (HSTS, CSP, X-Content-Type-Options) auf Server-Ebene konfigurieren.",
};

// ---------- Main ----------

export async function exportReport(input: ReportInput): Promise<void> {
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = (autoTableModule.default ?? autoTableModule) as (
    doc: InstanceType<typeof jsPDF>,
    opts: Record<string, unknown>,
  ) => void;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;

  let cursorY = margin;

  // ---- COVER ----
  // accent bar
  doc.setFillColor(...COLOR.primary);
  doc.rect(0, 0, pageW, 6, "F");

  // brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.primary);
  doc.text(BRAND.name.toUpperCase(), margin, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.muted);
  doc.text(formatDate(input.generatedAt), pageW - margin, 36, { align: "right" });

  // title
  cursorY = 110;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...COLOR.text);
  doc.text("Website-Analyse", margin, cursorY);

  cursorY += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.muted);
  doc.text(
    `Bericht für: ${input.url}    •    Strategie: ${input.strategy === "mobile" ? "Mobil" : "Desktop"}`,
    margin,
    cursorY,
  );

  // score circles
  cursorY += 50;
  const circleY = cursorY;
  const circleR = 48;
  const circleSpacing = 200;
  const cx1 = margin + circleR;
  const cx2 = margin + circleR + circleSpacing;

  if (input.lighthouse) {
    const s = input.lighthouse.scores;
    const avg = Math.round((s.performance + s.accessibility + s.bestPractices + s.seo) / 4);
    drawScoreCircle(doc, cx1, circleY + circleR, circleR, avg, "Performance gesamt");
  }
  if (input.dsgvo) {
    drawScoreCircle(doc, cx2, circleY + circleR, circleR, input.dsgvo.score, "DSGVO-Konformität");
  }

  cursorY = circleY + circleR * 2 + 50;

  // summary box
  doc.setFillColor(...COLOR.cardBg);
  doc.roundedRect(margin, cursorY, pageW - margin * 2, 110, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.primary);
  doc.text("Zusammenfassung", margin + 18, cursorY + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLOR.text);
  const summaryLines = doc.splitTextToSize(input.summary, pageW - margin * 2 - 36);
  doc.text(summaryLines.slice(0, 5), margin + 18, cursorY + 44);

  drawFooter(doc, pageW, pageH, margin, input.generatedAt);

  // ---- LIGHTHOUSE PAGE ----
  if (input.lighthouse) {
    doc.addPage();
    cursorY = margin;
    drawSectionHeader(doc, "Lighthouse-Scores", margin, cursorY, pageW);
    cursorY += 32;

    const s = input.lighthouse.scores;
    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [["Kategorie", "Score", "Bewertung"]],
      body: [
        ["Performance", `${s.performance}`, scoreLabel(s.performance)],
        ["Barrierefreiheit", `${s.accessibility}`, scoreLabel(s.accessibility)],
        ["Best Practices", `${s.bestPractices}`, scoreLabel(s.bestPractices)],
        ["SEO", `${s.seo}`, scoreLabel(s.seo)],
      ],
      headStyles: { fillColor: COLOR.primary, textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fontSize: 10, textColor: COLOR.text },
      alternateRowStyles: { fillColor: COLOR.cardBg },
      didParseCell: (data: { section: string; column: { index: number }; row: { raw: unknown[] }; cell: { styles: { textColor?: [number, number, number]; fontStyle?: string } } }) => {
        if (data.section === "body" && data.column.index >= 1) {
          const score = Number((data.row.raw as unknown[])[1]);
          data.cell.styles.textColor = scoreColor(score);
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
    cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 28;

    // Core Web Vitals
    drawSectionHeader(doc, "Core Web Vitals & Metriken", margin, cursorY, pageW);
    cursorY += 32;
    const m = input.lighthouse.metrics;
    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [["Metrik", "Wert", "Bedeutung"]],
      body: [
        ["Largest Contentful Paint", m.lcp ?? "—", "Ladezeit des größten Inhalts"],
        ["First Contentful Paint", m.fcp ?? "—", "Erstes sichtbares Element"],
        ["Total Blocking Time", m.tbt ?? "—", "Blockierte Hauptthread-Zeit"],
        ["Cumulative Layout Shift", m.cls ?? "—", "Visuelle Stabilität"],
        ["Speed Index", m.si ?? "—", "Wahrgenommene Ladezeit"],
        ["Time to Interactive", m.tti ?? "—", "Bis interaktiv"],
      ],
      headStyles: { fillColor: COLOR.primary, textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fontSize: 10, textColor: COLOR.text },
      alternateRowStyles: { fillColor: COLOR.cardBg },
    });
    drawFooter(doc, pageW, pageH, margin, input.generatedAt);
  }

  // ---- DSGVO PAGE ----
  if (input.dsgvo) {
    doc.addPage();
    cursorY = margin;
    drawSectionHeader(doc, "DSGVO-Detailanalyse", margin, cursorY, pageW);
    cursorY += 32;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [["Kategorie", "Status", "Zusammenfassung"]],
      body: input.dsgvo.findings.map((f: DsgvoFinding) => [
        f.label,
        f.status.toUpperCase(),
        f.summary,
      ]),
      headStyles: { fillColor: COLOR.primary, textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fontSize: 10, textColor: COLOR.text, valign: "top" },
      alternateRowStyles: { fillColor: COLOR.cardBg },
      columnStyles: { 0: { cellWidth: 130, fontStyle: "bold" }, 1: { cellWidth: 60, halign: "center", fontStyle: "bold" } },
      didParseCell: (data: { section: string; column: { index: number }; row: { raw: unknown[] }; cell: { styles: { textColor?: [number, number, number] } } }) => {
        if (data.section === "body" && data.column.index === 1) {
          const status = String((data.row.raw as unknown[])[1]).toLowerCase() as AuditStatus;
          data.cell.styles.textColor = statusColor(status);
        }
      },
    });
    cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

    // Details per finding
    for (const f of input.dsgvo.findings) {
      if (f.details.length === 0) continue;
      cursorY = ensureSpace(doc, cursorY, 60, pageW, pageH, margin, input.generatedAt);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...statusColor(f.status));
      doc.text(`• ${f.label}`, margin, cursorY);
      cursorY += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR.text);
      for (const d of f.details) {
        const lines = doc.splitTextToSize(`– ${d}`, pageW - margin * 2 - 12);
        cursorY = ensureSpace(doc, cursorY, lines.length * 12 + 4, pageW, pageH, margin, input.generatedAt);
        doc.text(lines, margin + 12, cursorY);
        cursorY += lines.length * 12 + 2;
      }
      cursorY += 8;
    }
    drawFooter(doc, pageW, pageH, margin, input.generatedAt);
  }

  // ---- EXTENDED AUDIT PAGE ----
  if (input.extended) {
    doc.addPage();
    cursorY = margin;
    drawSectionHeader(doc, "SEO, Mobile & Server-Performance", margin, cursorY, pageW);
    cursorY += 28;

    cursorY = renderSection(doc, autoTable, "SEO-Detailanalyse", input.extended.seo.items, input.extended.seo.score, margin, cursorY, pageW, pageH, input.generatedAt);
    cursorY = renderSection(doc, autoTable, "Mobile & UX", input.extended.mobile.items, input.extended.mobile.score, margin, cursorY, pageW, pageH, input.generatedAt);

    // Perf extras line
    cursorY = ensureSpace(doc, cursorY, 30, pageW, pageH, margin, input.generatedAt);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR.primary);
    doc.text(
      `Server-Performance — TTFB: ${input.extended.perf.ttfbMs ?? "—"} ms  •  Externe Hosts: ${input.extended.perf.externalRequests}  •  HTML-Größe: ${input.extended.perf.htmlSizeKb} KB`,
      margin,
      cursorY,
    );
    cursorY += 16;
    cursorY = renderSection(doc, autoTable, "Server-Performance — Details", input.extended.perf.items, input.extended.perf.score, margin, cursorY, pageW, pageH, input.generatedAt);
    drawFooter(doc, pageW, pageH, margin, input.generatedAt);
  }

  // ---- SCREENSHOT ----
  if (input.lighthouse?.screenshot) {
    doc.addPage();
    cursorY = margin;
    drawSectionHeader(doc, "Vorschau der analysierten Seite", margin, cursorY, pageW);
    cursorY += 28;
    try {
      const imgProps = doc.getImageProperties(input.lighthouse.screenshot);
      const maxW = pageW - margin * 2;
      const maxH = pageH - cursorY - margin - 60;
      const ratio = imgProps.width / imgProps.height;
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      const x = (pageW - w) / 2;
      doc.addImage(input.lighthouse.screenshot, "JPEG", x, cursorY, w, h);
    } catch {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR.muted);
      doc.text("Screenshot konnte nicht eingebettet werden.", margin, cursorY + 20);
    }
    drawFooter(doc, pageW, pageH, margin, input.generatedAt);
  }

  // ---- RECOMMENDATIONS ----
  const recs = collectRecommendations(input);
  if (recs.length > 0) {
    doc.addPage();
    cursorY = margin;
    drawSectionHeader(doc, "Empfehlungen & nächste Schritte", margin, cursorY, pageW);
    cursorY += 28;

    for (const r of recs) {
      cursorY = ensureSpace(doc, cursorY, 40, pageW, pageH, margin, input.generatedAt);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR.primary);
      doc.text(`▸ ${r.area}`, margin, cursorY);
      cursorY += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR.text);
      const lines = doc.splitTextToSize(r.text, pageW - margin * 2 - 12);
      doc.text(lines, margin + 12, cursorY);
      cursorY += lines.length * 13 + 10;
    }
    drawFooter(doc, pageW, pageH, margin, input.generatedAt);
  }

  // ---- CONTACT CTA ----
  doc.addPage();
  cursorY = margin + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...COLOR.text);
  doc.text("Lassen Sie uns das gemeinsam lösen.", margin, cursorY);
  cursorY += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR.muted);
  const cta = doc.splitTextToSize(
    "Ich helfe Ihnen, Ihre Website auf 90+ in allen Kategorien zu bringen, DSGVO-konform aufzustellen und SEO-technisch sichtbar zu machen — schnell, modern und persönlich betreut.",
    pageW - margin * 2,
  );
  doc.text(cta, margin, cursorY);
  cursorY += cta.length * 14 + 24;

  // contact card
  doc.setFillColor(...COLOR.primary);
  doc.roundedRect(margin, cursorY, pageW - margin * 2, 130, 10, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(BRAND.name, margin + 24, cursorY + 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(BRAND.owner, margin + 24, cursorY + 52);
  doc.text(`E-Mail:  ${BRAND.email}`, margin + 24, cursorY + 78);
  doc.text(`Web:     ${BRAND.url}`, margin + 24, cursorY + 96);

  // disclaimer
  cursorY += 160;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.muted);
  const disclaimer = doc.splitTextToSize(
    "Hinweis: Dieser Bericht basiert auf einer automatisierten, heuristischen Analyse der Startseite und ersetzt keine rechtliche Prüfung durch einen Datenschutzbeauftragten. Performance-Daten stammen aus Google PageSpeed Insights.",
    pageW - margin * 2,
  );
  doc.text(disclaimer, margin, cursorY);

  drawFooter(doc, pageW, pageH, margin, input.generatedAt);

  // ---- Save ----
  const host = (() => {
    try {
      return new URL(input.url).hostname.replace(/^www\./, "");
    } catch {
      return "report";
    }
  })();
  const dateStr = input.generatedAt.toISOString().slice(0, 10);
  doc.save(`website-check-${host}-${dateStr}.pdf`);
}

// ---------- Drawing helpers ----------

function drawScoreCircle(
  doc: import("jspdf").jsPDF,
  cx: number,
  cy: number,
  r: number,
  score: number,
  label: string,
) {
  const color = scoreColor(score);
  doc.setDrawColor(...COLOR.divider);
  doc.setLineWidth(6);
  doc.circle(cx, cy, r, "S");

  // foreground arc approximation: full ring tinted
  doc.setDrawColor(...color);
  doc.setLineWidth(6);
  doc.circle(cx, cy, r, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...color);
  doc.text(String(score), cx, cy + 8, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR.muted);
  doc.text(label, cx, cy + r + 18, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...color);
  doc.text(scoreLabel(score), cx, cy + r + 32, { align: "center" });
}

function drawSectionHeader(
  doc: import("jspdf").jsPDF,
  text: string,
  x: number,
  y: number,
  pageW: number,
) {
  doc.setFillColor(...COLOR.primary);
  doc.rect(x, y, 4, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR.text);
  doc.text(text, x + 14, y + 17);
  doc.setDrawColor(...COLOR.divider);
  doc.setLineWidth(0.5);
  doc.line(x, y + 26, pageW - x, y + 26);
}

function drawFooter(
  doc: import("jspdf").jsPDF,
  pageW: number,
  pageH: number,
  margin: number,
  date: Date,
) {
  const page = doc.getNumberOfPages();
  const total = doc.getNumberOfPages();
  doc.setDrawColor(...COLOR.divider);
  doc.setLineWidth(0.5);
  doc.line(margin, pageH - 36, pageW - margin, pageH - 36);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR.muted);
  doc.text(`${BRAND.name} — ${BRAND.owner}  •  ${BRAND.email}`, margin, pageH - 22);
  doc.text(
    `Erstellt am ${formatDate(date)}  •  Seite ${page} / ${total}`,
    pageW - margin,
    pageH - 22,
    { align: "right" },
  );
}

function ensureSpace(
  doc: import("jspdf").jsPDF,
  cursorY: number,
  needed: number,
  pageW: number,
  pageH: number,
  margin: number,
  date: Date,
): number {
  if (cursorY + needed > pageH - 60) {
    drawFooter(doc, pageW, pageH, margin, date);
    doc.addPage();
    return margin;
  }
  return cursorY;
}

function renderSection(
  doc: import("jspdf").jsPDF,
  autoTable: (doc: import("jspdf").jsPDF, opts: Record<string, unknown>) => void,
  title: string,
  items: AuditItem[],
  score: number,
  margin: number,
  cursorY: number,
  pageW: number,
  pageH: number,
  date: Date,
): number {
  cursorY = ensureSpace(doc, cursorY, 60, pageW, pageH, margin, date);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLOR.text);
  doc.text(title, margin, cursorY);
  doc.setTextColor(...scoreColor(score));
  doc.text(`${score}/100 — ${scoreLabel(score)}`, pageW - margin, cursorY, { align: "right" });
  cursorY += 8;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    head: [["Check", "Status", "Detail"]],
    body: items.map((i) => [i.label, i.status.toUpperCase(), i.detail]),
    headStyles: { fillColor: COLOR.primary, textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: COLOR.text, valign: "top" },
    alternateRowStyles: { fillColor: COLOR.cardBg },
    columnStyles: {
      0: { cellWidth: 140, fontStyle: "bold" },
      1: { cellWidth: 55, halign: "center", fontStyle: "bold" },
    },
    didParseCell: (data: { section: string; column: { index: number }; row: { raw: unknown[] }; cell: { styles: { textColor?: [number, number, number] } } }) => {
      if (data.section === "body" && data.column.index === 1) {
        const status = String((data.row.raw as unknown[])[1]).toLowerCase() as AuditStatus;
        data.cell.styles.textColor = statusColor(status);
      }
    },
  });
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
}

function collectRecommendations(input: ReportInput): { area: string; text: string }[] {
  const recs: { area: string; text: string }[] = [];
  if (input.lighthouse) {
    const s = input.lighthouse.scores;
    const map: Record<string, number> = {
      performance: s.performance,
      accessibility: s.accessibility,
      bestPractices: s.bestPractices,
      seo: s.seo,
    };
    const labels: Record<string, string> = {
      performance: "Performance",
      accessibility: "Barrierefreiheit",
      bestPractices: "Best Practices",
      seo: "SEO (Lighthouse)",
    };
    for (const [key, val] of Object.entries(map)) {
      if (val < 90) recs.push({ area: labels[key], text: RECOMMENDATIONS[key] });
    }
  }
  if (input.dsgvo) {
    for (const f of input.dsgvo.findings) {
      if (f.status !== "ok") {
        recs.push({ area: `DSGVO — ${f.label}`, text: RECOMMENDATIONS[f.key] ?? f.summary });
      }
    }
  }
  if (input.extended) {
    const failedSeo = input.extended.seo.items.filter((i) => i.status === "fail").map((i) => i.label);
    if (failedSeo.length) recs.push({ area: "SEO-Detailanalyse", text: `Kritische Punkte beheben: ${failedSeo.join(", ")}.` });
    const failedMobile = input.extended.mobile.items.filter((i) => i.status !== "ok").map((i) => i.label);
    if (failedMobile.length) recs.push({ area: "Mobile & UX", text: `Optimieren: ${failedMobile.join(", ")}.` });
    const failedPerf = input.extended.perf.items.filter((i) => i.status !== "ok").map((i) => i.label);
    if (failedPerf.length) recs.push({ area: "Server-Performance", text: `Optimieren: ${failedPerf.join(", ")}.` });
  }
  return recs;
}
