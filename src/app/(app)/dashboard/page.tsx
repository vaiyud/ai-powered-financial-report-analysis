"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileText,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
};

interface Stat {
  label: string;
  value: number;
  icon: string;
}

interface Metric {
  label: string;
  value: string;
  change: number;
  direction: "up" | "down";
}

interface Risk {
  id: number;
  title: string;
  severity: "high" | "medium" | "low";
  source: string;
}

interface DashboardData {
  stats: Stat[];
  summary: {
    title: string;
    description: string;
    metrics: Metric[];
  };
  risks: Risk[];
}

const severityColors: Record<string, string> = {
  high: "bg-red-50 text-red-700 ring-red-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  low: "bg-sky-50 text-sky-700 ring-sky-200",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoLoaded, setDemoLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDemoLoad = () => {
    setDemoLoaded(true);
    setTimeout(() => setDemoLoaded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Financial Executive Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time multi-source financial extraction, PDPA anonymization, and risk scoring.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-emerald-400 shadow-md">
          <Zap size={14} className="animate-pulse text-emerald-400" />
          RAG Pipeline Active (103,798 FAISS Chunks)
        </div>
      </div>

      {/* Stat Cards - Bento Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? FileText;
          return (
            <div
              key={stat.label}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="group relative rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50/50 to-white p-8 text-center transition-all hover:border-emerald-500/80 hover:bg-emerald-50/20 shadow-xs">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
          <Upload size={26} />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          Upload Financial Reports (PDF / Multi-Tab XLSX)
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
          Automatically scrubbed under PDPA Malaysia prior to FAISS vector indexing. Supports Bursa Malaysia Annual Reports and Sanofi Q1 Spreadsheets.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700">
            Browse Document Files
          </button>
          <button
            onClick={handleDemoLoad}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
          >
            {demoLoaded ? "Demo Payload Re-Indexed ✓" : "Reload Demo Reports (6 Documents)"}
          </button>
        </div>
      </div>

      {/* Dual Bottom Bento Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Executive Summary */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-500" />
              {data.summary.title}
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              Verified Insights
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {data.summary.description}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {data.summary.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-shadow hover:shadow-xs"
              >
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {metric.label}
                </p>
                <p className="mt-1 text-xl font-extrabold text-slate-900">
                  {metric.value}
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  {metric.direction === "up" ? (
                    <ArrowUpRight size={14} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      metric.direction === "up"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.change}% YoY
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Risk Detection */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-500" />
              AI Risk Severity Highlights
            </h2>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              3 Alerts Detected
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Automatically scored from target annual reports and balance sheet filings.
          </p>

          <div className="mt-5 space-y-3">
            {data.risks.slice(0, 3).map((risk) => (
              <div
                key={risk.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:bg-white hover:shadow-xs"
              >
                <span
                  className={`mt-0.5 inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ring-1 ${severityColors[risk.severity]}`}
                >
                  {risk.severity}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800">
                    {risk.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-mono text-slate-400 truncate">
                    Source: {risk.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
