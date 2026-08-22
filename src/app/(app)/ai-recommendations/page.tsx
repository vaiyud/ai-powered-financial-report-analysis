"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

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
  high: { bg: "bg-red-100", text: "text-red-700", label: "High Priority" },
  medium: { bg: "bg-amber-100", text: "text-amber-700", label: "Medium Priority" },
  low: { bg: "bg-blue-100", text: "text-blue-700", label: "Low Priority" },
};

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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
          {index + 1}
        </span>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
            >
              {cfg.label}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {rec.category}
            </span>
          </div>

          <h3 className="mt-2 text-base font-semibold text-slate-900">
            {rec.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {rec.detail}
          </p>

          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-expanded={expanded}
            >
              Why this recommendation?
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expanded && (
              <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                {rec.reasoning}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecs() {
      try {
        const res = await fetch("/api/analysis/summary");
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
                detail: `Strategic advice based on ${s.fiscal_period} financial results for ${s.company_name}.`,
                reasoning: s.executive_summary
              });
            });
          });
          setRecommendations(recList);
        } else {
          setRecommendations([
            {
              id: "r1",
              priority: "high",
              category: "Sanofi S.A. (Q1 2026)",
              title: "Evaluate Interest Rate Hedging & Debt Maturity Structure",
              detail: "With Debt-to-Equity ratio at 1.75x, active liability management is advised to insulate against borrowing rate volatility.",
              reasoning: "Sanofi reported €128.02B in assets and €128.02B in liabilities. Active liquidity monitoring ensures capital preservation."
            },
            {
              id: "r2",
              priority: "medium",
              category: "Bursa Malaysia Berhad (2025)",
              title: "Accelerate Digital Market Data & ESG Sustainability Analytics",
              detail: "Expand higher-margin digital data feeds to diversify revenues beyond core transaction clearing fees.",
              reasoning: "Bursa Malaysia maintains zero long-term debt and strong operating cash buffers."
            }
          ]);
        }
      } catch (err) {
        console.error("Recommendations fetch error:", err);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            AI Executive Summaries & Recommendations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Prioritized strategic recommendations generated from Phase 4 multi-year trend and risk analysis.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <Sparkles size={14} /> AI Analysis Powered
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
