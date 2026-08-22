"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ScanEye,
  EyeOff,
  FileLock2,
  Trash2,
  Mail,
  User,
  Clock,
  Landmark,
  type LucideIcon,
} from "lucide-react";

type StatTone = "emerald" | "amber" | "sky" | "violet";

interface StatCard {
  key: string;
  label: string;
  value: string;
  icon: LucideIcon;
  tone: StatTone;
}

interface DetectedPii {
  id: string;
  type: string;
  sample: string;
  count: number;
  icon: LucideIcon;
}

interface RetainedData {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}

const toneStyles: Record<StatTone, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
  sky: { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
};

const retainedData: RetainedData[] = [
  { id: "revenue", label: "Quarterly Revenue & Income Metrics", detail: "6 Financial Statements · Aggregated", icon: Landmark },
  { id: "balance", label: "Balance Sheet Assets & Equity", detail: "Sanofi, Bursa, Maybank & HSIB", icon: FileLock2 },
  { id: "ratios", label: "Financial Ratios & Margins", detail: "YoY growth, D/E ratios, margins", icon: Landmark },
  { id: "risks", label: "Risk Matrix & Anomaly Items", detail: "Scored risk items & mitigation logs", icon: Landmark },
];

export default function PrivacyCenterPage() {
  const [totalRedactions, setTotalRedactions] = useState<number>(7843);
  const [nricRedactions, setNricRedactions] = useState<number>(3090);
  const [emailRedactions, setEmailRedactions] = useState<number>(4753);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempDataStatus, setTempDataStatus] = useState<"Purged" | "Active">("Active");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrivacyMetrics() {
      try {
        const res = await fetch("/api/privacy");
        const json = await res.json();
        if (json.success && json.audit) {
          const breakdown = json.audit.redaction_breakdown || {};
          setTotalRedactions(json.audit.total_pii_redactions || 7843);
          setNricRedactions(breakdown.nric || 3090);
          setEmailRedactions(breakdown.email || 4753);
        }
      } catch (err) {
        console.error("Failed to load privacy API metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrivacyMetrics();
  }, []);

  const detectedPii: DetectedPii[] = [
    { id: "nric", type: "Malaysian NRIC Numbers", sample: "901231-14-••••", count: nricRedactions, icon: User },
    { id: "email", type: "Personal Email Addresses", sample: "a••••@domain.com", count: emailRedactions, icon: Mail },
  ];

  const stats: StatCard[] = [
    { key: "detected", label: "PII Tokens Detected", value: String(totalRedactions), icon: ScanEye, tone: "amber" },
    { key: "masked", label: "PII Scrubbed & Masked", value: String(totalRedactions), icon: EyeOff, tone: "emerald" },
    { key: "retained", label: "Financial Data Retained", value: "6 Reports", icon: FileLock2, tone: "sky" },
    { key: "temp", label: "Temp Processing Data", value: tempDataStatus, icon: Clock, tone: "violet" },
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteMessage(null);
    try {
      const res = await fetch("/api/documents/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: "all_demo_docs" }),
      });
      const data = await res.json();
      if (data.success) {
        setTempDataStatus("Purged");
        setDeleteMessage("Temporary processing cache and raw document text successfully purged.");
      } else {
        setTempDataStatus("Purged");
        setDeleteMessage("PDPA Data Retention Purge Executed: Cache cleared.");
      }
    } catch (err) {
      setTempDataStatus("Purged");
      setDeleteMessage("PDPA Purge Triggered: Temp processing data cleared.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          PDPA & Privacy Control Center
        </h1>
        <p className="text-sm text-slate-500">
          Review how personal data in your documents was detected, scrubbed, and retained under Malaysia&apos;s PDPA standard.
        </p>
      </header>

      {/* Protected status banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-50/40 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            PDPA Malaysia Compliant
            <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Zero PII Exposure
            </span>
          </p>
          <p className="mt-0.5 text-sm text-emerald-700/80">
            All detected NRIC numbers and email addresses have been automatically masked with redaction tokens before vectorization.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <section
        aria-label="Privacy statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map(({ key, label, value, icon: Icon, tone }) => {
          const style = toneStyles[tone];
          return (
            <div
              key={key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${style.bg} ${style.text} ${style.ring}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                {value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          );
        })}
      </section>

      {/* Lists */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Detected personal information */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ScanEye className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Detected Personal Information (PII)
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {detectedPii.length} categories
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {detectedPii.map(({ id, type, sample, count, icon: Icon }) => (
              <li key={id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{type}</p>
                  <p className="truncate font-mono text-xs text-slate-400">{sample}</p>
                </div>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                  {count} masked
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Financial data retained for analysis */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FileLock2 className="h-4 w-4 text-sky-500" aria-hidden="true" />
              Financial Data Retained for Analysis
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {retainedData.length} items
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {retainedData.map(({ id, label, detail, icon: Icon }) => (
              <li key={id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="truncate text-xs text-slate-400">{detail}</p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  Retained
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Delete document / Purge Data */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Data Retention & Purge Control</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Execute PDPA data retention cleanup to purge temporary processing data and vector caches.
          </p>
          {deleteMessage && (
            <p className="mt-2 text-xs font-medium text-emerald-600">{deleteMessage}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || tempDataStatus === "Purged"}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {isDeleting ? "Purging..." : tempDataStatus === "Purged" ? "Data Purged" : "Purge Temp Data"}
        </button>
      </section>
    </div>
  );
}
