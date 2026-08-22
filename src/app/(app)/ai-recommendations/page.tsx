"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { ChevronDown, ChevronUp } from "lucide-react";

type Priority = "high" | "medium" | "low";

interface Recommendation {
  id: string;
  document_id: string;
  priority: Priority;
  category: string;
  title: string;
  detail: string;
  reasoning: string;
  sort_order: number;
}

const priorityConfig: Record<Priority, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-red-100", text: "text-red-700", label: "High" },
  medium: { bg: "bg-amber-100", text: "text-amber-700", label: "Medium" },
  low: { bg: "bg-blue-100", text: "text-blue-700", label: "Low" },
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
        {/* Number */}
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
          {index + 1}
        </span>

        <div className="flex-1">
          {/* Header row: badges + title */}
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

          {/* Detail */}
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {rec.detail}
          </p>

          {/* Why? button + reasoning */}
          <div className="mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-expanded={expanded}
              aria-controls={`reasoning-${rec.id}`}
            >
              Why?
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expanded && (
              <div
                id={`reasoning-${rec.id}`}
                className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600"
              >
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      const { data, error: fetchError } = await supabase
        .from("recommendations")
        .select("*")
        .order("sort_order", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRecommendations(data ?? []);
      }
      setLoading(false);
    }
    fetchRecommendations();
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
        Failed to load recommendations: {error}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="text-lg font-medium text-slate-600">
          No recommendations yet
        </p>
        <p className="text-sm text-slate-400">
          Upload a document, extract metrics, run risk analysis, then generate
          recommendations to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI Recommendations
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Prioritized action items generated from your financial metrics and
          identified risks.
        </p>
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
