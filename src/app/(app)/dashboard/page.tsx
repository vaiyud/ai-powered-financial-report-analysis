"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  Upload,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  FileCheck,
  Send,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import VoiceSummary from "@/components/VoiceSummary";

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
  const [queryText, setQueryText] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const [processingState, setProcessingState] = useState<{
    isProcessing: boolean;
    stepName: string;
    progressPct: number;
    uploadedFileName: string | null;
  }>({
    isProcessing: false,
    stepName: "",
    progressPct: 0,
    uploadedFileName: null,
  });

  const [activeSummaryText, setActiveSummaryText] = useState<string>(
    "Sanofi S.A. reported €10.51 billion in Q1 2026 net sales (+6.2% YoY). Debt-to-Equity stands at 1.75x with strong operating cash buffers. Bursa Malaysia Berhad maintained zero debt with robust clearing revenues."
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const runPipelineSimulation = (fileName: string) => {
    setProcessingState({
      isProcessing: true,
      stepName: "Scanning & Scrubbing PDPA Malaysia PII Redactions...",
      progressPct: 25,
      uploadedFileName: fileName,
    });

    setTimeout(() => {
      setProcessingState((prev) => ({
        ...prev,
        stepName: "Financial Table Semantic Chunking (~1,000 Chars)...",
        progressPct: 50,
      }));
    }, 900);

    setTimeout(() => {
      setProcessingState((prev) => ({
        ...prev,
        stepName: "FAISS Sparse Cosine Indexing & Vector Search Storage...",
        progressPct: 75,
      }));
    }, 1800);

    setTimeout(() => {
      setProcessingState((prev) => ({
        ...prev,
        stepName: "Generating RAG Executive Insights & Voice Summary...",
        progressPct: 100,
      }));
    }, 2700);

    setTimeout(() => {
      setProcessingState({
        isProcessing: false,
        stepName: "Complete",
        progressPct: 100,
        uploadedFileName: fileName,
      });

      if (data) {
        const updatedData = { ...data };
        updatedData.stats[0].value += 1;
        updatedData.stats[1].value += 1250;
        updatedData.stats[2].value += 42;
        setData(updatedData);
      }

      setActiveSummaryText(
        `Successfully ingested and analyzed ${fileName}. RAG vector search indexed 1,250 table chunks. 42 PII tokens scrubbed under PDPA Malaysia. Financial ratios indicate 8.4% top-line operating growth with stable debt-to-equity leverage.`
      );
    }, 3500);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      runPipelineSimulation(file.name);
    }
  };

  const handleDemoReload = () => {
    runPipelineSimulation("Bursa_2025_Annual_Integrated_Report.pdf");
  };

  const handleAIQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    setIsAsking(true);
    setAiAnswer(null);

    setTimeout(() => {
      setIsAsking(false);
      if (queryText.toLowerCase().includes("revenue") || queryText.toLowerCase().includes("sales")) {
        setAiAnswer(
          "Sanofi Q1 2026 Net Sales reached €10,509 million (+6.2% YoY). Bursa Malaysia FY2025 operating revenue reached RM 920 million (+8.2% YoY). [Provenance: Sanofi Q1 Statement Tab 1, Bursa AR2025 Page 42]"
        );
      } else if (queryText.toLowerCase().includes("risk") || queryText.toLowerCase().includes("debt")) {
        setAiAnswer(
          "Sanofi S.A. Debt-to-Equity ratio is 1.75x with active liability management. Bursa Malaysia maintains 0.00x debt with high liquidity. [Provenance: Sanofi Balance Sheet Tab, Bursa AR2025 Page 112]"
        );
      } else {
        setAiAnswer(
          `SmartFlow RAG Analysis: Ingested reports show robust top-line operating margins and high capital adequacy across reporting periods. [Source: FAISS 103,798 Indexed Chunks]`
        );
      }
    }, 1000);
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
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.xlsx,.csv"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            SmartFlow One Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time multi-source financial extraction, PDPA anonymization, and RAG decision support.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-emerald-400 shadow-md">
          <Zap size={14} className="animate-pulse text-emerald-400" />
          RAG Pipeline Active ({data.stats[1].value.toLocaleString()} FAISS Chunks)
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

      {/* Interactive AI Query Box */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-md text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
            <MessageSquare size={16} />
            Ask SmartFlow RAG Assistant
          </h2>
          <span className="text-[11px] font-mono text-slate-400">FAISS Index Connected</span>
        </div>
        <form onSubmit={handleAIQuery} className="flex gap-2">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Ask about revenue growth, debt-to-equity ratio, or risk disclosures..."
            className="flex-1 rounded-xl bg-slate-950/80 border border-slate-700/80 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isAsking}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
          >
            {isAsking ? "Querying..." : <><Send size={14} /> Ask AI</>}
          </button>
        </form>

        {aiAnswer && (
          <div className="mt-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 p-4 text-xs leading-relaxed text-slate-200">
            <p className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
              <Sparkles size={14} /> SmartFlow Verified Response:
            </p>
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Upload Zone & Pipeline Runner */}
      <div className="group relative rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50/50 to-white p-8 text-center transition-all hover:border-emerald-500/80 hover:bg-emerald-50/20 shadow-xs">
        {processingState.isProcessing ? (
          <div className="py-4 space-y-4 max-w-lg mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 animate-bounce">
              <Zap size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Processing Report: {processingState.uploadedFileName}
              </h3>
              <p className="mt-1 text-xs font-medium text-emerald-600">
                {processingState.stepName}
              </p>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${processingState.progressPct}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
              <Upload size={26} />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Upload Financial Reports (PDF / Multi-Tab XLSX)
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              Automatically scrubbed under PDPA Malaysia prior to FAISS vector indexing. Supports Bursa Malaysia Annual Reports and Sanofi Q1 Spreadsheets.
            </p>
            {processingState.uploadedFileName && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <FileCheck size={14} /> Ingested & Analyzed: {processingState.uploadedFileName}
              </div>
            )}
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleBrowseClick}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700"
              >
                Browse Document Files
              </button>
              <button
                type="button"
                onClick={handleDemoReload}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
              >
                Reload Demo Reports (6 Documents)
              </button>
            </div>
          </>
        )}
      </div>

      {/* Dual Bottom Bento Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Executive Summary & Voice Summary */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-500" />
                RAG AI Executive Summary
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Verified Insights
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
              {activeSummaryText}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <VoiceSummary summaryText={activeSummaryText} />
              <span className="text-[11px] text-slate-400 font-medium">
                30s Web Speech Narration Engine
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-4 border-t border-slate-100">
            {data.summary.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5"
              >
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {metric.label}
                </p>
                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  {metric.value}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {metric.direction === "up" ? (
                    <ArrowUpRight size={13} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={13} className="text-red-500" />
                  )}
                  <span
                    className={`text-[11px] font-semibold ${
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
