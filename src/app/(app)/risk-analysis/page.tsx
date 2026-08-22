"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { ShieldAlert, AlertTriangle, Info } from "lucide-react";

type Severity = "high" | "medium" | "low";

interface SupportingDataPoint {
  label: string;
  from: number | null;
  to: number | null;
  change_pct: number | null;
}

interface Risk {
  id: string;
  document_id: string;
  severity: Severity;
  title: string;
  explanation: string;
  confidence: number;
  supporting_data: SupportingDataPoint[];
}

const severityConfig: Record<
  Severity,
  { border: string; bg: string; text: string; icon: typeof ShieldAlert; label: string }
> = {
  high: {
    border: "border-l-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    icon: ShieldAlert,
    label: "High",
  },
  medium: {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: AlertTriangle,
    label: "Medium",
  },
  low: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: Info,
    label: "Low",
  },
};

function formatValue(value: number | null): string {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const color =
    confidence >= 75
      ? "bg-emerald-500"
      : confidence >= 50
        ? "bg-amber-500"
        : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600">{confidence}%</span>
    </div>
  );
}

export default function RiskAnalysisPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRisks() {
      const { data, error: fetchError } = await supabase
        .from("risks")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRisks(data ?? []);
      }
      setLoading(false);
    }
    fetchRisks();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load risks: {error}
      </div>
    );
  }

  if (risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="text-lg font-medium text-slate-600">No risks identified yet</p>
        <p className="text-sm text-slate-400">
          Upload a document, extract metrics, and run risk analysis to see results here.
        </p>
      </div>
    );
  }

  // Count by severity
  const counts: Record<Severity, number> = { high: 0, medium: 0, low: 0 };
  for (const r of risks) {
    if (counts[r.severity] !== undefined) counts[r.severity]++;
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Risk Analysis</h1>
        <p className="mt-1 text-sm text-slate-500">
          AI-identified financial risks backed by extracted metric data.
        </p>
      </div>

      {/* Summary count cards */}
      <section
        className="grid gap-4 sm:grid-cols-3"
        aria-label="Risk severity summary"
      >
        {(["high", "medium", "low"] as Severity[]).map((sev) => {
          const cfg = severityConfig[sev];
          const Icon = cfg.icon;
          return (
            <div
              key={sev}
              className={`flex items-center gap-4 rounded-xl border border-slate-200 p-5 shadow-sm ${cfg.bg}`}
            >
              <Icon size={28} className={cfg.text} />
              <div>
                <p className="text-2xl font-bold text-slate-900">{counts[sev]}</p>
                <p className={`text-sm font-medium ${cfg.text}`}>{cfg.label} Risk</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Risk cards */}
      <section className="space-y-4" aria-label="Risk details">
        {risks.map((risk) => {
          const cfg = severityConfig[risk.severity];
          return (
            <div
              key={risk.id}
              className={`rounded-xl border border-slate-200 border-l-4 ${cfg.border} bg-white p-5 shadow-sm`}
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                  >
                    {cfg.label}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">
                    {risk.title}
                  </h3>
                </div>
                <ConfidenceBar confidence={risk.confidence} />
              </div>

              {/* Explanation */}
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {risk.explanation}
              </p>

              {/* Supporting data points */}
              {risk.supporting_data && risk.supporting_data.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {risk.supporting_data.map((sd, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <p className="text-xs font-medium text-slate-500">
                        {sd.label}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="text-slate-600">
                          {formatValue(sd.from)}
                        </span>
                        <span className="text-slate-400">&rarr;</span>
                        <span className="font-medium text-slate-900">
                          {formatValue(sd.to)}
                        </span>
                        {sd.change_pct != null && (
                          <span
                            className={`text-xs font-medium ${
                              sd.change_pct < 0 ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {sd.change_pct > 0 ? "+" : ""}
                            {sd.change_pct.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
