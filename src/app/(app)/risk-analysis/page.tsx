"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Send,
  Zap,
  Filter,
} from "lucide-react";

interface RiskItem {
  id: string;
  title: string;
  company: string;
  severity: "high" | "medium" | "low";
  impact: "Critical" | "Moderate" | "Low";
  likelihood: "Probable" | "Possible" | "Unlikely";
  sourcePage: number;
  rootCause: string;
  mitigation: string;
  criticConfidence: number;
}

const RISKS_DATA: RiskItem[] = [
  {
    id: "r1",
    title: "Commercial Paper & Short-Term Debt Facility Spike to €32.8M (4.85% Int.)",
    company: "Sanofi S.A.",
    severity: "high",
    impact: "Critical",
    likelihood: "Probable",
    sourcePage: 15,
    rootCause: "Unhedged floating rate debt drawdowns creating interest rate exposure amidst tightening monetary conditions.",
    mitigation: "Execute interest rate swap contracts to fix coupons below 4.25% and consolidate short-term maturities into long-term bonds.",
    criticConfidence: 98,
  },
  {
    id: "r2",
    title: "Operating Cash Flow Compression (-18.4% YoY) due to Working Capital",
    company: "Sanofi S.A.",
    severity: "medium",
    impact: "Moderate",
    likelihood: "Probable",
    sourcePage: 14,
    rootCause: "Inventory buildup and delayed receivables collection across European retail distribution networks.",
    mitigation: "Implement dynamic supplier discounting and accelerate DSO (Days Sales Outstanding) terms to 45 days.",
    criticConfidence: 96,
  },
  {
    id: "r3",
    title: "Market Infrastructure Platform Continuity & Cyber Resilience",
    company: "Bursa Malaysia",
    severity: "medium",
    impact: "Critical",
    likelihood: "Possible",
    sourcePage: 34,
    rootCause: "Elevated average daily trading volume (ADV) placing stress on legacy transaction clearing systems.",
    mitigation: "Accelerate migration to cloud-native clearing engine with sub-millisecond failover redundancy.",
    criticConfidence: 94,
  },
  {
    id: "r4",
    title: "FX Currency Exposure on Emerging Market Healthcare Revenues",
    company: "Sanofi S.A.",
    severity: "low",
    impact: "Low",
    likelihood: "Possible",
    sourcePage: 22,
    rootCause: "Local currency depreciation against the Euro across Latin American operations.",
    mitigation: "Implement natural currency hedging by denominating local distribution contracts in USD/EUR equivalents.",
    criticConfidence: 92,
  },
];

export default function RiskAnalysisPage() {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [escalated, setEscalated] = useState<string | null>(null);

  const filteredRisks = RISKS_DATA.filter((r) =>
    filterSeverity === "all" ? true : r.severity === filterSeverity
  );

  const handleEscalate = (id: string) => {
    setEscalated(id);
    setTimeout(() => setEscalated(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Risk Severity Matrix & Anomaly Heatmap
          </h2>
          <p className="text-xs text-slate-500">
            Automated anomaly detection across balance sheets, leverage ratios, and governance notes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-white p-1 border border-slate-200 shadow-2xs text-xs">
          {["all", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition-colors ${
                filterSeverity === sev
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {sev === "all" ? "All Risks (4)" : `${sev} (${RISKS_DATA.filter(r => r.severity === sev).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Matrix Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="white-card p-4 border border-rose-200 bg-rose-50/50 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">HIGH IMPACT / CRITICAL</span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">1 Detected</p>
          <p className="text-[11px] text-slate-600 mt-1">Requires Board / CFO Intervention</p>
        </div>

        <div className="white-card p-4 border border-amber-200 bg-amber-50/50 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">MODERATE / MONITOR</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">2 Detected</p>
          <p className="text-[11px] text-slate-600 mt-1">Cash Flow & Infrastructure</p>
        </div>

        <div className="white-card p-4 border border-slate-200 bg-slate-50 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">LOW / MITIGATED</span>
            <Info className="h-4 w-4 text-slate-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">1 Detected</p>
          <p className="text-[11px] text-slate-600 mt-1">FX Operational Exposure</p>
        </div>
      </div>

      {/* Risk Cards List */}
      <div className="space-y-4">
        {filteredRisks.map((risk) => {
          const isHigh = risk.severity === "high";
          const isMed = risk.severity === "medium";

          return (
            <div
              key={risk.id}
              className={`white-card p-5 border transition-all ${
                isHigh
                  ? "border-rose-200 bg-white shadow-xs"
                  : isMed
                  ? "border-amber-200 bg-white shadow-xs"
                  : "border-slate-200 bg-white shadow-xs"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      isHigh
                        ? "bg-rose-100 text-rose-800"
                        : isMed
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {risk.severity} Severity
                  </span>
                  <span className="text-xs font-bold text-slate-900">{risk.company}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Critic Confidence: {risk.criticConfidence}%
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Bookmark className="h-3.5 w-3.5 text-slate-400" />
                    Page {risk.sourcePage}
                  </span>
                </div>
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-900 tracking-tight">
                {risk.title}
              </h3>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Root Cause */}
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    Root Cause Diagnosis
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed text-[11px]">
                    {risk.rootCause}
                  </p>
                </div>

                {/* AI Recommended Mitigation */}
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-emerald-600" />
                    Recommended Mitigation Strategy
                  </p>
                  <p className="mt-1.5 text-slate-600 leading-relaxed text-[11px]">
                    {risk.mitigation}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <div className="text-[11px] text-slate-500 font-medium">
                  Impact: <strong className="text-slate-800">{risk.impact}</strong> • Likelihood: <strong className="text-slate-800">{risk.likelihood}</strong>
                </div>

                <button
                  onClick={() => handleEscalate(risk.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors"
                >
                  <Send className="h-3 w-3 text-emerald-600" />
                  {escalated === risk.id ? "Escalation Sent to Audit Committe ✓" : "Escalate to Board Memo"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
