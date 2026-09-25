"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ArrowRight,
  Shield,
  Zap,
  Filter,
  Send,
  FileCheck,
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
    title: "Commercial Paper & Short-Term Debt Facility Spike to $32.8M (4.85% Int.)",
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
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);
  const [escalated, setEscalated] = useState<string | null>(null);

  const filteredRisks = RISKS_DATA.filter((r) =>
    filterSeverity === "all" ? true : r.severity === filterSeverity
  );

  const handleEscalate = (id: string) => {
    setEscalated(id);
    setTimeout(() => setEscalated(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-rose-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-400 border border-rose-500/30">
              ADVERSARIAL CRITIC GATEWAY
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Risk Severity Matrix & Anomaly Heatmap
          </h2>
          <p className="text-xs text-slate-400">
            Automated anomaly detection across balance sheets, leverage ratios, and governance notes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          {["all", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition-colors ${
                filterSeverity === sev
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {sev === "all" ? "All Risks (4)" : `${sev} (${RISKS_DATA.filter(r => r.severity === sev).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Heatmap Matrix Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-rose-500/30 bg-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400">HIGH IMPACT / CRITICAL</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white tabular-nums">1 Detected</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires Board / CFO Intervention</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">MODERATE / MONITOR</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white tabular-nums">2 Detected</p>
          <p className="text-[11px] text-slate-400 mt-1">Cash Flow & Infrastructure</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-sky-500/30 bg-sky-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400">LOW / MITIGATED</span>
            <Info className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white tabular-nums">1 Detected</p>
          <p className="text-[11px] text-slate-400 mt-1">FX Operational Exposure</p>
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
              className={`glass-card rounded-2xl p-5 border transition-all duration-200 ${
                isHigh
                  ? "border-rose-500/40 bg-slate-900/90 shadow-lg shadow-rose-950/20"
                  : isMed
                  ? "border-amber-500/40 bg-slate-900/80"
                  : "border-slate-800 bg-slate-900/70"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                      isHigh
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : isMed
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-sky-500/20 text-sky-300 border-sky-500/40"
                    }`}
                  >
                    {risk.severity} Severity
                  </span>
                  <span className="text-xs font-bold text-white">{risk.company}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-mono text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Critic Confidence: {risk.criticConfidence}%
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 font-mono">
                    <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                    Page {risk.sourcePage}
                  </span>
                </div>
              </div>

              <h3 className="mt-3 text-base font-bold text-white tracking-tight">
                {risk.title}
              </h3>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Root Cause */}
                <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800/80">
                  <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    Root Cause Diagnosis
                  </p>
                  <p className="mt-1.5 text-slate-400 leading-relaxed text-[11px]">
                    {risk.rootCause}
                  </p>
                </div>

                {/* AI Recommended Mitigation */}
                <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800/80">
                  <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    Recommended Mitigation Strategy
                  </p>
                  <p className="mt-1.5 text-slate-400 leading-relaxed text-[11px]">
                    {risk.mitigation}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                <div className="text-[11px] text-slate-500 font-mono">
                  Impact: <span className="text-slate-300 font-semibold">{risk.impact}</span> • Likelihood: <span className="text-slate-300 font-semibold">{risk.likelihood}</span>
                </div>

                <button
                  onClick={() => handleEscalate(risk.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Send className="h-3 w-3 text-emerald-400" />
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
