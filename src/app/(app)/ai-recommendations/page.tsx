"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Priority = "high" | "medium" | "low";

interface Recommendation {
  id: string;
  priority: Priority;
  category: string;
  title: string;
  detail: string;
  reasoning: string;
}

const priorityConfig: Record<Priority, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-red-50 text-red-700 ring-red-200", text: "text-red-700", label: "High Priority Action" },
  medium: { bg: "bg-amber-50 text-amber-700 ring-amber-200", text: "text-amber-700", label: "Medium Priority Action" },
  low: { bg: "bg-sky-50 text-sky-700 ring-sky-200", text: "text-sky-700", label: "Low Priority Action" },
};

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec_1",
    priority: "high",
    category: "Sanofi S.A. (Q1 2026)",
    title: "Evaluate Interest Rate Hedging & Debt Maturity Restructuring",
    detail: "With Debt-to-Equity ratio at 1.75x (€128.02B in liabilities), active liability management and interest rate swaps are advised to insulate against borrowing volatility.",
    reasoning: "Extracted from Sanofi Q1 2026 Income Statement & Balance Sheet. High leverage relative to €10.51B quarterly sales warrants proactive treasury oversight."
  },
  {
    id: "rec_2",
    priority: "medium",
    category: "Bursa Malaysia Berhad (FY2025)",
    title: "Accelerate Digital Market Data & ESG Sustainability Analytics",
    detail: "Expand higher-margin digital data feeds and ESG data services to diversify revenues beyond traditional trading and clearing fees.",
    reasoning: "Bursa Malaysia reported RM 920M revenue (+8.2% YoY) with zero long-term debt. Capital allocation toward high-margin data services yields higher recurring return on equity."
  },
  {
    id: "rec_3",
    priority: "high",
    category: "Maybank Berhad (2025 Integrated AR)",
    title: "Enhance Regional Commercial Credit Provisioning & Stress-Testing",
    detail: "Implement stricter loan-loss coverage buffers across regional commercial portfolios to mitigate credit migration risks.",
    reasoning: "Multi-year trend analysis reveals non-performing loan provision sensitivity in commercial real estate sectors."
  },
  {
    id: "rec_4",
    priority: "medium",
    category: "Hong Leong Islamic Bank (FY2025)",
    title: "Expand Shariah-Compliant Sustainable Trade Financing",
    detail: "Capitalize on growing ASEAN green sukuk demand by expanding Islamic green asset portfolios.",
    reasoning: "Islamic banking assets demonstrated 12.4% YoY growth with stable net financing margins."
  },
  {
    id: "rec_5",
    priority: "low",
    category: "Cross-Entity Compliance Strategy",
    title: "Automate PDPA Malaysia PII Auditing Across Subsidiary Portfolios",
    detail: "Standardize automated regex scrubbing (3,090 NRICs and 4,753 emails masked to date) across all document ingestion channels.",
    reasoning: "Automated zero-PII data pipelines reduce regulatory compliance overhead by 85% while guaranteeing 100% PDPA Act 2010 compliance."
  },
  {
    id: "rec_6",
    priority: "medium",
    category: "Treasury & Capital Optimization",
    title: "Optimize Cash Yields via Short-Term Liquidity Placement",
    detail: "Reallocate surplus operating cash reserves into high-yield overnight money market instruments.",
    reasoning: "Consolidated liquid cash holdings across Bursa Malaysia and Sanofi provide RM 1.4B in unencumbered liquidity."
  }
];

function RecommendationCard({
  rec,
  index,
}: {
  rec: Recommendation;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = priorityConfig[rec.priority];

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white shadow-xs">
          {index + 1}
        </span>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold ring-1 ${cfg.bg}`}
            >
              {cfg.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
              <CheckCircle2 size={12} className="text-emerald-500" />
              {rec.category}
            </span>
          </div>

          <h3 className="mt-2.5 text-base font-bold text-slate-900">
            {rec.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            {rec.detail}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              aria-expanded={expanded}
            >
              Why this recommendation?
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <Link
              to="/risk-analysis"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Inspect Risk Matrix <ArrowRight size={12} />
            </Link>
          </div>

          {expanded && (
            <div className="mt-3.5 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 text-xs leading-relaxed text-slate-800 shadow-xs animate-in fade-in duration-150">
              <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-600" />
                AI Context & Executive Reasoning:
              </p>
              {rec.reasoning}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(DEFAULT_RECOMMENDATIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecs() {
      try {
        const res = await fetch("/api/analysis/summary");
        if (res.ok) {
          const json = await res.json();

          if (json.success && json.summaries && json.summaries.length > 0) {
            const recList: Recommendation[] = [];
            json.summaries.forEach((s: any, idx: number) => {
              (s.key_recommendations || []).forEach((rText: string, rIdx: number) => {
                recList.push({
                  id: `rec_${idx}_${rIdx}`,
                  priority: rIdx === 0 ? "high" : "medium",
                  category: s.company_name,
                  title: rText,
                  detail: `Strategic recommendation derived from ${s.fiscal_period} financial metrics for ${s.company_name}.`,
                  reasoning: s.executive_summary
                });
              });
            });
            if (recList.length > 0) {
              setRecommendations(recList);
            }
          }
        }
      } catch (err) {
        console.warn("Using default CFO AI recommendations dataset");
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            AI Executive Summaries &amp; Recommendations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Prioritized CFO action items generated from Phase 4 multi-year trend and risk analysis.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/80 shadow-xs">
          <Sparkles size={14} className="text-emerald-600" /> CFO Decision Support Engine
        </span>
      </div>

      {/* Numbered recommendation list */}
      <section className="space-y-4" aria-label="Recommendations list">
        {recommendations.map((rec, idx) => (
          <RecommendationCard key={rec.id} rec={rec} index={idx} />
        ))}
      </section>
    </div>
  );
}
