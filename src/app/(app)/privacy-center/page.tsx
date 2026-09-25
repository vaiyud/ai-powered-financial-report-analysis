"use client";

import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Database,
  FileKey,
  KeyRound,
  RefreshCw,
} from "lucide-react";

interface PiiStat {
  type: string;
  count: number;
  pattern: string;
  status: "Compliant" | "Protected";
}

const PII_STATS: PiiStat[] = [
  { type: "Malaysian NRIC Identifiers", count: 142, pattern: "\\d{6}-\\d{2}-\\d{4}", status: "Protected" },
  { type: "Bank Account & IBAN Numbers", count: 68, pattern: "GB\\d{2}[A-Z]{4}\\d{14}", status: "Protected" },
  { type: "Corporate Email Addresses", count: 486, pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}", status: "Protected" },
  { type: "Executive Direct Phone Lines", count: 214, pattern: "(\\+?6?01[0-46-9]-*[0-9]{7,8})", status: "Protected" },
];

export default function PrivacyCenterPage() {
  const [showRawSample, setShowRawSample] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handleDataPurge = () => {
    setIsPurging(true);
    setTimeout(() => {
      setIsPurging(false);
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                PDPA MALAYSIA ACT 2010 COMPLIANT
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Zero-Exposure Privacy & Redaction Center
            </h2>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl">
              Automatic regex-based sanitization executes before documents touch FAISS vector indexing or LLM inference.
            </p>
          </div>

          <button
            onClick={handleDataPurge}
            disabled={isPurging}
            className="flex items-center gap-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-4 py-2.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <Trash2 className={`h-4 w-4 ${isPurging ? "animate-spin" : ""}`} />
            {isPurging ? "Purging Ephemeral Cache..." : "Purge Temporary Raw Documents"}
          </button>
        </div>

        {purgeSuccess && (
          <div className="mt-4 rounded-xl bg-emerald-950/60 p-3 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            Ephemeral raw document cache purged. Vector index and sanitized metrics retained.
          </div>
        )}
      </div>

      {/* PII Redaction Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PII_STATS.map((stat, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/80"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{stat.type}</span>
              <Lock className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-3 text-2xl font-bold text-white tabular-nums">
              {stat.count} <span className="text-xs font-normal text-slate-400">Masked</span>
            </p>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="truncate max-w-[140px]">{stat.pattern}</span>
              <span className="text-emerald-400 font-semibold">{stat.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Redaction Inspection Sandbox */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Pre-LLM Sanitization Inspection Sandbox
            </h3>
            <p className="text-xs text-slate-400">
              Side-by-side comparison of raw ingested text vs. sanitized text forwarded to Gemini 2.5 Flash.
            </p>
          </div>

          <button
            onClick={() => setShowRawSample(!showRawSample)}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            {showRawSample ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showRawSample ? "Hide Unredacted Text" : "Audit Inspection View (Restricted)"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Raw Text View */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800/80 pb-1.5">
              <span>INPUT: RAW EXTRACTED TEXT</span>
              <span className="text-rose-400 text-[10px]">Unsanitized (Client Boundary)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {showRawSample ? (
                <>
                  Director <span className="bg-rose-500/20 text-rose-300 px-1 rounded">Ahmad Razif (NRIC: 780412-14-5589)</span> approved loan facility with Maybank account <span className="bg-rose-500/20 text-rose-300 px-1 rounded">514012938472</span>. Contact: <span className="bg-rose-500/20 text-rose-300 px-1 rounded">+6012-3948123</span> (ahmad.razif@sanofi-my.com).
                </>
              ) : (
                <span className="text-slate-500 italic">
                  [Click 'Audit Inspection View' to view raw sample with administrator privileges]
                </span>
              )}
            </p>
          </div>

          {/* Sanitized View */}
          <div className="rounded-xl bg-slate-950 p-4 border border-emerald-500/30">
            <div className="flex items-center justify-between text-emerald-400 mb-2 border-b border-slate-800/80 pb-1.5">
              <span>OUTPUT: SANITIZED LLM PROMPT</span>
              <span className="text-emerald-400 text-[10px]">Safe for Gemini 2.5 Inference</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Director <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded">[NRIC_PROTECTED_PDPA]</span> approved loan facility with Maybank account <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded">[BANK_ACCOUNT_REDACTED]</span>. Contact: <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded">[PHONE_REDACTED]</span> (<span className="bg-emerald-500/20 text-emerald-300 px-1 rounded">[EMAIL_REDACTED]</span>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
