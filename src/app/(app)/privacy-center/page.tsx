"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ScanEye,
  EyeOff,
  FileLock2,
  Trash2,
  Mail,
  Phone,
  CreditCard,
  User,
  MapPin,
  Landmark,
  Clock,
  type LucideIcon,
} from "lucide-react";

/**
 * Feature 4.2 — Privacy Center
 *
 * Displays the privacy/compliance status of a processed financial document:
 * a protection banner, high-level stats, the PII that was detected, the
 * financial data retained for analysis, and a destructive delete action.
 *
 * State values are placeholders and mock data for now.
 */

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

// --- Mock data -------------------------------------------------------------

const detectedPii: DetectedPii[] = [
  { id: "email", type: "Email address", sample: "j••••@acme.com", count: 3, icon: Mail },
  { id: "phone", type: "Phone number", sample: "+1 (•••) •••-4821", count: 2, icon: Phone },
  { id: "ssn", type: "Social security number", sample: "•••-••-1234", count: 1, icon: User },
  { id: "card", type: "Credit card", sample: "•••• •••• •••• 1111", count: 1, icon: CreditCard },
  { id: "address", type: "Mailing address", sample: "•• Market St, ••••", count: 2, icon: MapPin },
];

const retainedData: RetainedData[] = [
  { id: "revenue", label: "Quarterly revenue figures", detail: "Q1–Q4 2025 · aggregated", icon: Landmark },
  { id: "cashflow", label: "Cash flow statements", detail: "Operating & investing", icon: FileLock2 },
  { id: "ratios", label: "Financial ratios", detail: "Liquidity, leverage, margins", icon: Landmark },
  { id: "forecast", label: "Growth projections", detail: "12-month forecast model", icon: Landmark },
];

export default function PrivacyCenterPage() {
  // Placeholder state — wire these to real analysis results later.
  const [piiDetected] = useState<number>(9);
  const [piiMasked] = useState<number>(9);
  const [financialDataRetained] = useState<number>(4);
  const [tempDataStatus] = useState<"Purged" | "Pending" | "Retained">("Purged");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const stats: StatCard[] = [
    { key: "detected", label: "PII detected", value: String(piiDetected), icon: ScanEye, tone: "amber" },
    { key: "masked", label: "PII masked", value: String(piiMasked), icon: EyeOff, tone: "emerald" },
    { key: "retained", label: "Financial data retained", value: String(financialDataRetained), icon: FileLock2, tone: "sky" },
    { key: "temp", label: "Temp processing data", value: tempDataStatus, icon: Clock, tone: "violet" },
  ];

  const handleDelete = () => {
    // Placeholder — hook up to the delete endpoint later.
    setIsDeleting(true);
    setTimeout(() => setIsDeleting(false), 1200);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Privacy Center
        </h1>
        <p className="text-sm text-slate-500">
          Review how sensitive information in your document was detected, masked, and retained.
        </p>
      </header>

      {/* Protected status banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-50/40 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            Protected
            <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Compliant
            </span>
          </p>
          <p className="mt-0.5 text-sm text-emerald-700/80">
            All detected personal information has been masked. Your document is safe to analyze.
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
              Detected personal information
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {detectedPii.length} types
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
              Financial data retained for analysis
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

      {/* Delete document */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Delete document</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Permanently remove this document and all associated data. This action cannot be undone.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {isDeleting ? "Deleting…" : "Delete document"}
        </button>
      </section>
    </div>
  );
}
