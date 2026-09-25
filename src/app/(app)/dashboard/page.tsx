"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VoiceSummary from "@/components/VoiceSummary";
import MultiAgentVisualizer from "@/components/MultiAgentVisualizer";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  Upload,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building2,
  ChevronRight,
} from "lucide-react";

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  subtext: string;
}

interface RiskItem {
  id: number;
  title: string;
  severity: "high" | "medium" | "low";
  source: string;
  category: string;
}

const KPIS: Metric[] = [
  {
    label: "Net Sales / Revenue",
    value: "€10.51B",
    change: "+6.2%",
    trend: "up",
    subtext: "Driven by Dupixent (+24.9% YoY)",
  },
  {
    label: "Operating Profit",
    value: "€2.48B",
    change: "+7.8%",
    trend: "up",
    subtext: "Gross margin steady at 77.2%",
  },
  {
    label: "Operating Cash Flow",
    value: "€1.82B",
    change: "-18.4%",
    trend: "down",
    subtext: "Working capital expansion in Q1",
  },
  {
    label: "Debt-to-Equity Ratio",
    value: "1.75x",
    change: "Stable",
    trend: "up",
    subtext: "Short-term facility spike to €32.8M",
  },
];

const RISKS: RiskItem[] = [
  {
    id: 1,
    title: "Short-Term Revolving Facility Spike to €32.8M (4.85% Floating Rate)",
    severity: "high",
    source: "Page 15, Note 8.2",
    category: "Capital Structure",
  },
  {
    id: 2,
    title: "Operating Cash Flow Contraction (-18.4% YoY) on Inventory Buildup",
    severity: "medium",
    source: "Page 14, Statement of Cash Flows",
    category: "Working Capital",
  },
  {
    id: 3,
    title: "Platform Infrastructure & Cyber Resilience Requirements",
    severity: "medium",
    source: "Page 34, Risk Governance",
    category: "Operational",
  },
];

const CHART_DATA = [
  { quarter: "Q1 '25", revenue: 9895, opex: 5400, profit: 2300 },
  { quarter: "Q2 '25", revenue: 10120, opex: 5520, profit: 2380 },
  { quarter: "Q3 '25", revenue: 10300, opex: 5680, profit: 2420 },
  { quarter: "Q4 '25", revenue: 10450, opex: 5750, profit: 2450 },
  { quarter: "Q1 '26", revenue: 10509, opex: 5820, profit: 2480 },
];

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Top Banner: Active Document & Action */}
      <div className="white-card p-6 bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Sanofi S.A. • Q1 2026 Financial Report
              </span>
              <span className="text-xs text-slate-500">• 64 Pages Indexed</span>
            </div>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Executive Financial Overview
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              AI-driven multi-agent synthesis across audited financial statements, solvency metrics, and compliance logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Upload className={`h-4 w-4 ${isUploading ? "animate-bounce" : ""}`} />
              {isUploading ? "Sanitizing PII & Indexing..." : "Upload Financial Report"}
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mt-4 rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            Report successfully ingested. PDPA engine scrubbed 14 PII tokens. FAISS vector index updated.
          </div>
        )}
      </div>

      {/* KPI Cards (4 clean high-impact cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, idx) => {
          const isUp = kpi.trend === "up";
          return (
            <div
              key={idx}
              className="white-card white-card-hover p-5 bg-white border border-slate-200/90 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                    kpi.change.startsWith("+")
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : kpi.change.startsWith("-")
                      ? "bg-rose-50 text-rose-700 border border-rose-100"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {kpi.change.startsWith("+") ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : kpi.change.startsWith("-") ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : null}
                  {kpi.change}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {kpi.value}
                </p>
                <p className="mt-1 text-[11px] text-slate-500 truncate">{kpi.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Agent Verification Pipeline */}
      <MultiAgentVisualizer />

      {/* Two-Column Seamless Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 of 12 cols): Executive AI Summary & Revenue Trajectory */}
        <div className="lg:col-span-8 space-y-6">
          {/* Executive Summary & Audio Player */}
          <div className="white-card p-6 bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  AI Executive Findings & Audio Briefing
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Verified against 4 source disclosures
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-700">
              Sanofi S.A. demonstrated resilient performance in Q1 2026, generating <strong className="text-slate-900">€10.51B in net sales (+6.2% YoY)</strong>, fueled by strong pharmaceutical demand for Dupixent (+24.9%). Gross profit expanded to €8.11B. However, <strong className="text-slate-900">operating cash flows contracted 18.4%</strong> due to inventory buildup, and short-term debt facilities increased to <strong className="text-slate-900">€32.8M at 4.85% floating rate</strong>.
            </p>

            {/* Audio Digest Bar */}
            <VoiceSummary
              summaryText="Sanofi S.A. reported strong Q1 net sales of €10.51B, up 6.2% YoY, led by Dupixent growth. Gross profit reached €8.11B. Key risk alert: short-term revolving debt jumped to €32.8M at 4.85% interest on page 15, while operating cash flows compressed 18.4%. We recommend immediate evaluation of interest rate hedging and supplier payment terms."
              maxWords={75}
            />
          </div>

          {/* Revenue & Profit Trends Chart */}
          <div className="white-card p-6 bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Financial Performance Trajectory (€ Millions)
                </h3>
                <p className="text-xs text-slate-500">5-Quarter historical revenue and operating income</p>
              </div>
              <Link
                to="/financial-insights"
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Deep-Dive Analytics <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#0f172a",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" name="Net Sales (€M)" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="profit" name="Operating Profit (€M)" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12 cols): Key Risks & Action Items */}
        <div className="lg:col-span-4 space-y-6">
          {/* Key Risk Callouts */}
          <div className="white-card p-5 bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Priority Risk Alerts
                </h3>
                <p className="text-xs text-slate-500">Flagged by Adversarial Critic</p>
              </div>
              <Link
                to="/risk-analysis"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View Matrix →
              </Link>
            </div>

            <div className="mt-3.5 space-y-3">
              {RISKS.map((risk) => {
                const isHigh = risk.severity === "high";
                return (
                  <div
                    key={risk.id}
                    className={`rounded-xl p-3 border transition-colors ${
                      isHigh
                        ? "bg-rose-50/60 border-rose-200 hover:bg-rose-50"
                        : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full ${
                          isHigh
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {risk.severity.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-slate-500 font-medium">{risk.source}</span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-900 leading-snug">
                      {risk.title}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">{risk.category}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Banner */}
          <div className="white-card p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Recommended CFO Action
            </div>
            <p className="mt-2 text-xs text-slate-700 leading-relaxed">
              Lock in floating-rate commercial paper to mitigate interest rate risk and accelerate accounts receivable collection.
            </p>
            <Link
              to="/ai-recommendations"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-2xs transition-colors"
            >
              Open What-If Simulator <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
