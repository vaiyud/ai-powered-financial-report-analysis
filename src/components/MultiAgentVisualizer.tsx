"use client";

import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  Calculator,
  Scale,
  Sparkles,
  ArrowRight,
  Activity,
  ChevronRight,
  Layers,
} from "lucide-react";

interface AgentStep {
  id: string;
  name: string;
  role: string;
  status: "verified" | "processing";
  icon: any;
  summary: string;
}

const AGENTS: AgentStep[] = [
  {
    id: "forensic",
    name: "Document Ingestion",
    role: "PDF / Table Extractor",
    status: "verified",
    icon: FileSearch,
    summary: "64 Pages & 18 Disclosure Tables Parsed",
  },
  {
    id: "quant",
    name: "Quantitative Sandbox",
    role: "Deterministic Math Engine",
    status: "verified",
    icon: Calculator,
    summary: "YoY Variances & DuPont Analysis Computed",
  },
  {
    id: "pdpa",
    name: "PDPA Privacy Shield",
    role: "Regulatory Compliance",
    status: "verified",
    icon: ShieldCheck,
    summary: "7,843 PII Tokens Scrubbed (Zero Exposure)",
  },
  {
    id: "critic",
    name: "Adversarial Critic",
    role: "Provenance Verification",
    status: "verified",
    icon: Scale,
    summary: "100% Citation Match vs. Source Documents",
  },
];

export default function MultiAgentVisualizer() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentStep>(AGENTS[0]);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => setIsVerifying(false), 1000);
  };

  return (
    <div className="white-card p-5 border border-slate-200/90 bg-white shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Multi-Agent Verification Pipeline
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified Active
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
        >
          <Activity className={`h-3.5 w-3.5 text-emerald-600 ${isVerifying ? "animate-spin" : ""}`} />
          {isVerifying ? "Re-verifying Pipeline..." : "Re-run Verification"}
        </button>
      </div>

      {/* 4-Step Horizontal Pipeline Flow */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {AGENTS.map((agent, idx) => {
          const Icon = agent.icon;
          const isSelected = activeAgent.id === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => setActiveAgent(agent)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                isSelected
                  ? "bg-emerald-50/50 border-emerald-200 shadow-xs"
                  : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-emerald-700 border border-slate-200 shadow-2xs">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>

              <div className="mt-2.5">
                <h4 className="text-xs font-bold text-slate-900">{agent.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{agent.summary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
