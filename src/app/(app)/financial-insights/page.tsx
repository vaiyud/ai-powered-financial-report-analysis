"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Metric {
  id: string;
  document_id: string;
  label: string;
  prior_value: number | null;
  current_value: number | null;
  change_pct: number | null;
}

function formatCurrency(value: number | null): string {
  if (value === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function ChangeIndicator({ pct }: { pct: number | null }) {
  if (pct === null) return <Minus size={16} className="text-slate-400" />;
  if (pct > 0)
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
        <TrendingUp size={16} />+{pct.toFixed(1)}%
      </span>
    );
  if (pct < 0)
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-red-600">
        <TrendingDown size={16} />
        {pct.toFixed(1)}%
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-sm font-medium text-slate-500">
      <Minus size={16} />
      0%
    </span>
  );
}

export default function FinancialInsightsPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      const { data, error: fetchError } = await supabase
        .from("extracted_metrics")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setMetrics(data ?? []);
      }
      setLoading(false);
    }
    fetchMetrics();
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
        Failed to load metrics: {error}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="text-lg font-medium text-slate-600">No metrics yet</p>
        <p className="text-sm text-slate-400">
          Upload a document and run the extract-metrics analysis to see financial insights here.
        </p>
      </div>
    );
  }

  // Get unique metrics (latest per label)
  const latestByLabel = new Map<string, Metric>();
  for (const m of metrics) {
    if (!latestByLabel.has(m.label)) {
      latestByLabel.set(m.label, m);
    }
  }
  const uniqueMetrics = Array.from(latestByLabel.values());

  // Build line chart data: Revenue vs Operating Expenses
  const revenueMetrics = metrics.filter((m) => m.label === "Revenue");
  const opexMetrics = metrics.filter((m) => m.label === "Operating Expenses");
  const lineChartData = revenueMetrics.map((rev, idx) => ({
    name: `Period ${idx + 1}`,
    Revenue: rev.current_value ?? 0,
    "Operating Expenses": opexMetrics[idx]?.current_value ?? 0,
  }));

  // Build bar chart data: Cash Flow
  const cashFlowMetrics = metrics.filter((m) => m.label === "Cash Flow");
  const barChartData = cashFlowMetrics.map((cf, idx) => ({
    name: `Period ${idx + 1}`,
    "Cash Flow": cf.current_value ?? 0,
  }));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financial Insights</h1>
        <p className="mt-1 text-sm text-slate-500">
          AI-extracted metrics from your uploaded financial documents.
        </p>
      </div>

      {/* Metric cards */}
      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Financial metric cards"
      >
        {uniqueMetrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {m.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(m.current_value)}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Prior: {formatCurrency(m.prior_value)}
              </span>
              <ChangeIndicator pct={m.change_pct} />
            </div>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Operating Expenses line chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-800">
            Revenue vs Operating Expenses
          </h2>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Operating Expenses"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">
              Not enough data to display chart.
            </p>
          )}
        </div>

        {/* Cash Flow bar chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-800">
            Cash Flow
          </h2>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Cash Flow"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">
              Not enough data to display chart.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
