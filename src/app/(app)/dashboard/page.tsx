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
  medium: "bg-orange-50 text-orange-700 ring-orange-200",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? FileText;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Icon size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-800">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Panel */}
      <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Upload size={24} className="text-slate-400" />
        </div>
        <h3 className="text-base font-medium text-slate-700">
          Upload a financial document
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Drag and drop your PDF, Excel, or CSV files here
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
            Browse files
          </button>
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            Load Demo Financial Report
          </button>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Executive Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            {data.summary.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {data.summary.description}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {data.summary.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-medium text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-800">
                  {metric.value}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {metric.direction === "up" ? (
                    <ArrowUpRight size={14} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      metric.direction === "up"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Risk Detection */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            AI Risk Detection
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Automatically identified risks from analyzed documents
          </p>

          <div className="mt-5 space-y-3">
            {data.risks.slice(0, 3).map((risk) => (
              <div
                key={risk.id}
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <span
                  className={`mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${severityColors[risk.severity]}`}
                >
                  {risk.severity}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">
                    {risk.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
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
