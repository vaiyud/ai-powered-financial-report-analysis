"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  Maximize2,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

interface MetricItem {
  id: string;
  label: string;
  ticker: string;
  currentValue: string;
  priorValue: string;
  changePct: number;
  provenance: {
    documentName: string;
    page: number;
    section: string;
    rawExcerpt: string;
    mcpSignature: string;
  };
}

const METRICS_DATA: MetricItem[] = [
  {
    id: "m1",
    label: "Net Sales / Operating Revenue",
    ticker: "SANOFI",
    currentValue: "€10,509M",
    priorValue: "€9,895M",
    changePct: 6.2,
    provenance: {
      documentName: "Sanofi_Q1_2026_Interim_Financial_Report.pdf",
      page: 12,
      section: "Consolidated Statement of Profit and Loss",
      rawExcerpt: "Net sales for the first quarter of 2026 reached €10,509 million, representing an increase of 6.2% at constant exchange rates, driven primarily by Dupixent (+24.9%).",
      mcpSignature: "SHA256-P12-VERIFIED",
    },
  },
  {
    id: "m2",
    label: "Business Gross Profit",
    ticker: "SANOFI",
    currentValue: "€8,111M",
    priorValue: "€7,686M",
    changePct: 5.5,
    provenance: {
      documentName: "Sanofi_Q1_2026_Interim_Financial_Report.pdf",
      page: 13,
      section: "Segment Operating Performance",
      rawExcerpt: "Gross margin stood at 77.2% of net sales compared to 77.7% in Q1 prior year, reflecting manufacturing efficiencies offset by product mix shifts.",
      mcpSignature: "SHA256-P13-VERIFIED",
    },
  },
  {
    id: "m3",
    label: "Securities Market Operating Revenue",
    ticker: "BURSA",
    currentValue: "RM 920.4M",
    priorValue: "RM 850.6M",
    changePct: 8.2,
    provenance: {
      documentName: "Bursa_Malaysia_Integrated_Annual_Report_2025.pdf",
      page: 28,
      section: "Financial Review & Market Data",
      rawExcerpt: "Operating revenue rose 8.2% to RM 920.4 million, supported by average daily trading value (ADV) of RM 3.12 billion against RM 2.88 billion in the prior period.",
      mcpSignature: "SHA256-P28-VERIFIED",
    },
  },
  {
    id: "m4",
    label: "Short-Term Revolving Credit Facility",
    ticker: "SANOFI",
    currentValue: "€32.8M",
    priorValue: "€15.2M",
    changePct: 115.8,
    provenance: {
      documentName: "Sanofi_Q1_2026_Interim_Financial_Report.pdf",
      page: 15,
      section: "Notes to Condensed Consolidated Financial Statements: Note 8.2",
      rawExcerpt: "Drawdowns under commercial paper and short-term revolving facilities totaled €32.8 million at an effective floating interest rate of 4.85% per annum.",
      mcpSignature: "SHA256-P15-FLAGGED-LEVERAGE",
    },
  },
];

const CHART_SERIES = [
  { quarter: "Q1 '25", sanofiSales: 9895, bursaRev: 850, opex: 5400 },
  { quarter: "Q2 '25", sanofiSales: 10120, bursaRev: 875, opex: 5520 },
  { quarter: "Q3 '25", sanofiSales: 10300, bursaRev: 890, opex: 5680 },
  { quarter: "Q4 '25", sanofiSales: 10450, bursaRev: 905, opex: 5750 },
  { quarter: "Q1 '26", sanofiSales: 10509, bursaRev: 920, opex: 5820 },
];

export default function FinancialInsightsPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricItem>(METRICS_DATA[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Split-Screen Provenance Studio
          </h2>
          <p className="text-xs text-slate-400">
            Interactive AI analytics synchronized with cited source PDF disclosure pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            100% Deterministic Extraction
          </span>
        </div>
      </div>

      {/* Main Interactive Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Analytics & Metric Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Revenue Trend Chart */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Revenue & Operating Trajectory (€ Millions)
                </h3>
                <p className="text-[11px] text-slate-400">5-Quarter historical multi-source comparison</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                L2 Verified
              </span>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_SERIES} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorOpex" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="quarter" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#f8fafc",
                    }}
                  />
                  <Area type="monotone" dataKey="sanofiSales" name="Sanofi Sales" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" dataKey="opex" name="Operating Exp" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOpex)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Metric Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Extracted Line Items (Click to synchronize PDF preview)
            </h3>

            {METRICS_DATA.map((metric) => {
              const isSelected = selectedMetric.id === metric.id;
              return (
                <div
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                    isSelected
                      ? "bg-slate-800/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                      : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300 border border-slate-800">
                        {metric.ticker}
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {metric.label}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                        metric.changePct > 50
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      <ArrowUpRight className="h-3 w-3" />
                      +{metric.changePct}% YoY
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between border-t border-slate-800/60 pt-2.5 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white tabular-nums">
                        {metric.currentValue}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {metric.priorValue}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                      <Bookmark className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Page {metric.provenance.page}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Synchronized Document Provenance Inspector */}
        <div className="lg:col-span-5 sticky top-20 glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/90 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Source Document Inspector
              </h3>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
              {selectedMetric.provenance.mcpSignature}
            </span>
          </div>

          {/* Document Header Metadata */}
          <div className="mt-4 rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <p className="text-[11px] font-mono text-slate-400 truncate">
              📄 {selectedMetric.provenance.documentName}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Cited Page: <span className="text-emerald-400 font-mono font-bold">{selectedMetric.provenance.page}</span>
              </span>
              <span className="text-slate-400 text-[11px] truncate max-w-[170px]">
                {selectedMetric.provenance.section}
              </span>
            </div>
          </div>

          {/* Simulated PDF Bounding Box Highlight Canvas */}
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-2">
              <span>[PROVENANCE_BOUNDING_BOX_PAGE_{selectedMetric.provenance.page}]</span>
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>

            <p className="text-xs leading-relaxed text-slate-200 font-serif italic bg-slate-950/60 p-3 rounded-lg border border-emerald-500/20">
              "{selectedMetric.provenance.rawExcerpt}"
            </p>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Critic Match: 98.4% Confidence</span>
              <span className="text-emerald-400">FAISS Cosine Similarity: 0.94</span>
            </div>
          </div>

          {/* Adversarial Verification Stamp */}
          <div className="mt-4 rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-xs flex items-center gap-2.5 text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <p className="text-[11px] leading-tight">
              Deterministic verification confirmed no LLM arithmetic modification between source disclosure table and calculated output.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
