"use client";

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import VoiceSummary from "@/components/VoiceSummary";
import MultiAgentVisualizer from "@/components/MultiAgentVisualizer";
import {
  FileText,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  Upload,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Eye,
} from "lucide-react";

interface Metric {
  label: string;
  value: string;
  change: number;
  direction: "up" | "down";
  subtext: string;
}

interface Risk {
  id: number;
  title: string;
  severity: "high" | "medium" | "low";
  source: string;
  category: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: any;
  trend: string;
}

const STATS: StatItem[] = [
  { label: "Financial Reports Ingested", value: "6 Active", icon: FileText, trend: "+2 this quarter" },
  { label: "FAISS Vector Chunks", value: "103,798", icon: Layers, trend: "L2 Normalized" },
  { label: "PDPA PII Scrubbed Tokens", value: "7,843", icon: ShieldCheck, trend: "0 Exfiltration" },
  { label: "Multi-Agent Verified Anomaly", value: "9 Risks", icon: AlertTriangle, trend: "100% Provenance" },
];

const METRICS: Metric[] = [
  {
    label: "Sanofi S.A. Net Sales (Q1)",
    value: "€10.51B",
    change: 6.2,
    direction: "up",
    subtext: "Driven by Dupixent (+24.9% YoY)",
  },
  {
    label: "Bursa Malaysia Revenue",
    value: "RM 920.4M",
    change: 8.2,
    direction: "up",
    subtext: "Securities market ADV expansion",
  },
  {
    label: "Sanofi Operating Expenses",
    value: "€5.82B",
    change: 4.1,
    direction: "up",
    subtext: "R&D investments in immunology",
  },
  {
    label: "Maybank Group Net Profit",
    value: "RM 9.35B",
    change: 15.6,
    direction: "up",
    subtext: "Net interest income margin expansion",
  },
];

const RISKS: Risk[] = [
  {
    id: 1,
    title: "Sanofi S.A. Short-Term Debt Facility Spike to $32.8M (4.85% Int.)",
    severity: "high",
    source: "Page 15, Note 8.2",
    category: "Solvency & Interest Rate Exposure",
  },
  {
    id: 2,
    title: "Operating Cash Flow Compression (-18.4% YoY) due to Working Capital",
    severity: "medium",
    source: "Page 14, Cash Flow Table",
    category: "Liquidity & Working Capital",
  },
  {
    id: 3,
    title: "Bursa Malaysia Platform Continuity & Cyber Resilience Requirement",
    severity: "medium",
    source: "Page 34, Risk Governance",
    category: "Regulatory & Operational",
  },
];

const severityBadgeMap = {
  high: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  low: "bg-sky-500/10 text-sky-400 border-sky-500/30",
};

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                ACTIVE PIPELINE: SAN-2026-Q1
              </span>
              <span className="text-xs text-slate-400">• Malaysian PDPA Shield Active</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              CFO Financial Intelligence Command
            </h2>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Autonomous multi-agent synthesis across Sanofi S.A., Bursa Malaysia, Maybank, and Hong Leong Islamic Bank.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateUpload}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Upload className={`h-4 w-4 ${isUploading ? "animate-bounce" : ""}`} />
              {isUploading ? "Scrubbing PII & Indexing..." : "Ingest New Financial Report"}
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mt-4 rounded-xl bg-emerald-950/60 p-3 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            Report ingested! PDPA engine scrubbed 14 PII tokens. FAISS vector index updated.
          </div>
        )}
      </div>

      {/* KPI Stats Stream */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800/80 bg-slate-900/70"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-white tabular-nums">
                  {stat.value}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Agent Live Telemetry Engine */}
      <MultiAgentVisualizer />

      {/* Audio Briefing Suite */}
      <VoiceSummary
        summaryText="Sanofi S.A. reported strong Q1 net sales of €10.51B, up 6.2% YoY, led by Dupixent growth. Bursa Malaysia expanded operating revenue 8.2% to RM 920M. Key risk alert: short-term debt facilities jumped to $32.8M at 4.85% interest on page 15, while operating cash flows compressed 18.4%. We recommend immediate evaluation of interest rate hedging and supplier payment re-indexing."
        maxWords={80}
      />

      {/* Split Grid: Key Metrics & Top Risk Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Key Metrics Stream */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Verified Core Financial Metrics
              </h3>
              <p className="text-xs text-slate-400">
                Calculated deterministically via Quantitative Sandbox MCP Tool.
              </p>
            </div>
            <Link
              to="/financial-insights"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Open Provenance Studio <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-950/70 p-4 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 truncate max-w-[180px]">
                    {metric.label}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/50">
                    <ArrowUpRight className="h-3 w-3" />
                    +{metric.change}%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-white tabular-nums tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{metric.subtext}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Top Anomaly Alerts */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Risk Anomaly Gate
              </h3>
              <p className="text-xs text-slate-400">Flagged by Critic Agent</p>
            </div>
            <Link
              to="/risk-analysis"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Matrix →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {RISKS.map((risk) => (
              <div
                key={risk.id}
                className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                      severityBadgeMap[risk.severity]
                    }`}
                  >
                    {risk.severity} Severity
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{risk.source}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-200 line-clamp-2">
                  {risk.title}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">{risk.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
