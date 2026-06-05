import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Search, Loader2, Zap, Eye, ShieldCheck, Gauge as GaugeIcon, Smartphone, Monitor,
  AlertCircle, CheckCircle2, Clock, Image as ImageIcon, ShieldAlert, XCircle,
  AlertTriangle, ChevronDown, Lock, Cookie, Globe, FileText, ScrollText,
} from "lucide-react";
import { checkDsgvo, type DsgvoResult, type DsgvoStatus, type DsgvoFinding } from "@/lib/dsgvo.functions";

const API_KEY = "AIzaSyDuiRz2R4yNltsdDpEHiE6iPRm4KIFxoQ0";

type Strategy = "mobile" | "desktop";

interface CategoryScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

interface AuditMetric {
  lcp?: string;
  fcp?: string;
  cls?: string;
  tbt?: string;
  si?: string;
  tti?: string;
}

interface CheckResult {
  url: string;
  strategy: Strategy;
  scores: CategoryScore;
  metrics: AuditMetric;
  screenshot?: string;
}

function scoreColor(score: number) {
  if (score >= 90) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(score: number) {
  if (score >= 90) return "Sehr gut";
  if (score >= 50) return "Verbesserungswürdig";
  return "Schlecht";
}

function ScoreGauge({ value, color, size = 96 }: { value: number; color: string; size?: number }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold font-display">{value}</span>
      </div>
    </div>
  );
}

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

async function fetchPagespeed(url: string, strategy: Strategy): Promise<CheckResult> {
  const params = new URLSearchParams({
    url,
    key: API_KEY,
    strategy,
  });
  ["performance", "accessibility", "best-practices", "seo"].forEach((c) =>
    params.append("category", c),
  );

  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || "Analyse fehlgeschlagen");
  }
  const data = await res.json();
  const cats = data.lighthouseResult?.categories ?? {};
  const audits = data.lighthouseResult?.audits ?? {};

  return {
    url,
    strategy,
    scores: {
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
    },
    metrics: {
      lcp: audits["largest-contentful-paint"]?.displayValue,
      fcp: audits["first-contentful-paint"]?.displayValue,
      cls: audits["cumulative-layout-shift"]?.displayValue,
      tbt: audits["total-blocking-time"]?.displayValue,
      si: audits["speed-index"]?.displayValue,
      tti: audits["interactive"]?.displayValue,
    },
    screenshot: audits["final-screenshot"]?.details?.data,
  };
}

const categoryConfig = [
  { key: "performance" as const, label: "Performance", icon: Zap },
  { key: "accessibility" as const, label: "Barrierefreiheit", icon: Eye },
  { key: "bestPractices" as const, label: "Best Practices", icon: ShieldCheck },
  { key: "seo" as const, label: "SEO", icon: Search },
];

const metricConfig = [
  { key: "lcp" as const, label: "Largest Contentful Paint", hint: "Ladezeit des größten Inhalts" },
  { key: "fcp" as const, label: "First Contentful Paint", hint: "Erstes sichtbares Element" },
  { key: "tbt" as const, label: "Total Blocking Time", hint: "Blockierte Hauptthread-Zeit" },
  { key: "cls" as const, label: "Cumulative Layout Shift", hint: "Visuelle Stabilität" },
  { key: "si" as const, label: "Speed Index", hint: "Wahrgenommene Ladezeit" },
  { key: "tti" as const, label: "Time to Interactive", hint: "Bis interaktiv" },
];

export function WebsiteCheck() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [dsgvo, setDsgvo] = useState<DsgvoResult | null>(null);
  const [dsgvoError, setDsgvoError] = useState<string | null>(null);
  const runDsgvo = useServerFn(checkDsgvo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    try {
      new URL(normalized);
    } catch {
      setError("Bitte gib eine gültige URL ein.");
      return;
    }
    setError(null);
    setDsgvoError(null);
    setLoading(true);
    setResult(null);
    setDsgvo(null);
    const [lh, dg] = await Promise.allSettled([
      fetchPagespeed(normalized, strategy),
      runDsgvo({ data: { url: normalized } }),
    ]);
    if (lh.status === "fulfilled") setResult(lh.value);
    else setError(lh.reason instanceof Error ? lh.reason.message : "Lighthouse-Analyse fehlgeschlagen");
    if (dg.status === "fulfilled") setDsgvo(dg.value);
    else setDsgvoError(dg.reason instanceof Error ? dg.reason.message : "DSGVO-Analyse fehlgeschlagen");
    setLoading(false);
  };

  const avg = result
    ? Math.round(
        (result.scores.performance +
          result.scores.accessibility +
          result.scores.bestPractices +
          result.scores.seo) /
          4,
      )
    : 0;

  const summary = (() => {
    if (!result) return "";
    const s = result.scores;
    const weak: string[] = [];
    const strong: string[] = [];
    categoryConfig.forEach((c) => {
      const v = s[c.key];
      if (v < 70) weak.push(c.label);
      else if (v >= 90) strong.push(c.label);
    });

    if (avg >= 90) {
      return `Hervorragendes Ergebnis! Die Seite ist technisch sehr solide${strong.length ? ` – besonders in ${strong.join(", ")}` : ""}. Hier gibt es nur noch Feinschliff zu holen.`;
    }
    if (avg >= 70) {
      return `Solides Ergebnis mit Optimierungspotenzial${weak.length ? `, vor allem bei ${weak.join(", ")}` : ""}. Mit gezielten Maßnahmen lassen sich die Werte spürbar steigern.`;
    }
    if (avg >= 40) {
      return `Die Seite hat deutliche Schwächen${weak.length ? ` in ${weak.join(", ")}` : ""}. Eine professionelle Überarbeitung würde sich hier klar lohnen.`;
    }
    return `Kritisches Ergebnis – die Seite hat in mehreren Bereichen erhebliche Probleme${weak.length ? ` (${weak.join(", ")})` : ""}. Eine grundlegende Modernisierung ist empfehlenswert.`;
  })();

  return (
    <section id="check" className="py-32 relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl mb-12">
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Kostenloser Website-Check</div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Wie schnell ist Ihre <span className="glow-text">Website wirklich?</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Analysieren Sie Ihre Seite in Sekunden mit Google Lighthouse — Performance, SEO,
            Barrierefreiheit und Best Practices auf einen Blick.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-6 md:p-8 mb-10 flex flex-col gap-4"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ihre-website.de"
                className="w-full rounded-full bg-white/5 border border-white/10 pl-11 pr-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2 rounded-full bg-white/5 border border-white/10 p-1">
              <button
                type="button"
                onClick={() => setStrategy("mobile")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  strategy === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="h-4 w-4" /> Mobil
              </button>
              <button
                type="button"
                onClick={() => setStrategy("desktop")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  strategy === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor className="h-4 w-4" /> Desktop
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analysiere…
                </>
              ) : (
                <>
                  <GaugeIcon className="h-4 w-4" /> Jetzt prüfen
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Die Analyse wird über Google PageSpeed Insights durchgeführt und kann 20–40 Sekunden dauern.
          </p>
        </form>

        {loading && (
          <div className="glass rounded-3xl p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Lighthouse-Analyse läuft – einen Moment bitte…</p>
          </div>
        )}

        {(result || dsgvo || dsgvoError) && !loading && (
          <div className="space-y-6 animate-fade-up">
            {result && (
              <>
                {/* Overall summary card */}
                <div className="glass rounded-3xl p-8 md:p-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="flex items-center gap-6">
                      <ScoreGauge value={avg} color={scoreColor(avg)} size={120} />
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                          Gesamteinstufung Performance
                        </div>
                        <div className="text-3xl font-bold font-display" style={{ color: scoreColor(avg) }}>
                          {scoreLabel(avg)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 break-all">{result.url}</div>
                      </div>
                    </div>
                    <div className="flex-1 md:border-l md:border-white/10 md:pl-8">
                      <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-3">
                        <CheckCircle2 className="h-4 w-4" /> Zusammenfassung
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{summary}</p>
                    </div>
                  </div>
                </div>

                {/* Category scores */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categoryConfig.map((c) => {
                    const v = result.scores[c.key];
                    return (
                      <div key={c.key} className="glass rounded-3xl p-6 text-center">
                        <ScoreGauge value={v} color={scoreColor(v)} />
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mt-4 mb-2">
                          <c.icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold">{c.label}</h3>
                        <div className="text-xs text-muted-foreground mt-1" style={{ color: scoreColor(v) }}>
                          {scoreLabel(v)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Core web vitals */}
                <div className="glass rounded-3xl p-8">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-6">
                    <Clock className="h-4 w-4" /> Core Web Vitals & Metriken
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {metricConfig.map((m) => {
                      const v = result.metrics[m.key];
                      return (
                        <div key={m.key} className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
                          <div className="text-xs text-muted-foreground">{m.label}</div>
                          <div className="text-2xl font-bold font-display mt-1">{v ?? "—"}</div>
                          <div className="text-xs text-muted-foreground mt-1">{m.hint}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* DSGVO block */}
            {dsgvo && <DsgvoBlock data={dsgvo} />}
            {dsgvoError && !dsgvo && (
              <div className="glass rounded-3xl p-6 flex items-center gap-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> DSGVO-Analyse fehlgeschlagen: {dsgvoError}
              </div>
            )}

            {/* Screenshot */}
            {result?.screenshot && (
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-6">
                  <ImageIcon className="h-4 w-4" /> Vorschau der analysierten Seite
                </div>
                <div className="flex justify-center">
                  <img
                    src={result.screenshot}
                    alt={`Screenshot von ${result.url}`}
                    className="rounded-2xl border border-white/10 max-h-[420px]"
                  />
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="glass rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Nicht zufrieden mit dem Ergebnis?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Ich helfe Ihnen, Ihre Website auf 90+ in allen Kategorien zu bringen und DSGVO-konform aufzustellen — schnell, modern und persönlich betreut.
              </p>
              <a
                href="/contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium hover:brightness-110 transition"
              >
                Jetzt unverbindlich anfragen
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
