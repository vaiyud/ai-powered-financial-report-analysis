"use client";

import { useState } from "react";
import {
  Bot,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  Calculator,
  Scale,
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";

interface AgentStep {
  id: string;
  name: string;
  role: string;
  status: "idle" | "running" | "verified" | "flagged";
  icon: any;
  mcpTool: string;
  latencyMs: number;
  outputSummary: string;
  details: string[];
}

const AGENTS: AgentStep[] = [
  {
    id: "forensic",
    name: "Forensic Parser Agent",
    role: "Document Structure & OCR Extractor",
    status: "verified",
    icon: FileSearch,
    mcpTool: "query_financial_vector_index",
    latencyMs: 142,
    outputSummary: "64 Pages Ingested • 18 Multi-column Tables Extracted",
    details: [
      "Extracted Statement of Profit & Loss (Page 12)",
      "Indexed Cash Flow statement notes (Page 14, 15)",
      "Preserved 103,798 FAISS semantic chunk vectors",
    ],
  },
  {
    id: "quant",
    name: "Quantitative Sandbox Agent",
    role: "Deterministic Math Engine (MCP)",
    status: "verified",
    icon: Calculator,
    mcpTool: "execute_quant_sandbox",
    latencyMs: 88,
    outputSummary: "100% Deterministic Math • 0 Hallucinations",
    details: [
      "Computed YoY Sales delta: +6.2% (€10.51B vs €9.90B)",
      "Evaluated Debt-to-Equity: 1.75x (Flagged: Elevated Leverage)",
      "Simulated EBITDA sensitivity across 3 inflation tiers",
    ],
  },
  {
    id: "pdpa",
    name: "PDPA & Privacy Auditor",
    role: "Regulatory Compliance Shield",
    status: "verified",
    icon: ShieldCheck,
    mcpTool: "scrub_pdpa_pii",
    latencyMs: 64,
    outputSummary: "7,843 PII Tokens Redacted • PDPA 2010 Compliant",
    details: [
      "Masked 12 Director NRIC identifiers ([NRIC_PROTECTED])",
      "Scrubbed 44 corporate email addresses and phone lines",
      "Cryptographic audit trail hash generated",
    ],
  },
  {
    id: "critic",
    name: "Adversarial Critic Verifier",
    role: "Provenance & Anti-Hallucination Gate",
    status: "verified",
    icon: Scale,
    mcpTool: "verify_provenance_citations",
    latencyMs: 110,
    outputSummary: "CFO Citations 100% Verified vs Source PDFs",
    details: [
      "Verified Sanofi Debt Facility on Page 15 (Confidence: 98%)",
      "Verified Bursa Malaysia ADV volume on Page 28",
      "Cross-validated all footnote interest rates against statements",
    ],
  },
];

export default function MultiAgentVisualizer() {
  const [selectedAgent, setSelectedAgent] = useState<AgentStep>(AGENTS[1]);
  const [isRunningSim, setIsRunningSim] = useState(false);

  const handleSimulateCycle = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      setIsRunningSim(false);
    }, 1200);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/90 text-slate-100 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-white">
                Multi-Agent Telemetry & MCP Orchestration
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Consensus
              </span>
            </div>
            <p className="text-xs text-slate-400">
              4 autonomous agents coordinating via Model Context Protocol (MCP) and deterministic sandboxes.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateCycle}
          disabled={isRunningSim}
          className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 ring-1 ring-slate-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <Activity className={`h-3.5 w-3.5 text-emerald-400 ${isRunningSim ? "animate-spin" : ""}`} />
          {isRunningSim ? "Re-verifying DAG..." : "Trigger Consensus Cycle"}
        </button>
      </div>

      {/* Agents Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent.id === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
                isSelected
                  ? "bg-slate-800/90 border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-200">
                  <Icon className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/50">
                  <CheckCircle2 className="h-3 w-3" />
                  {agent.latencyMs}ms
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-semibold text-white tracking-tight">{agent.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{agent.role}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] font-mono text-slate-300 line-clamp-1">
                {agent.outputSummary}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Deep Dive Drawer */}
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Active Agent Inspect: {selectedAgent.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              Bound MCP Tool:
            </span>
            <code className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-emerald-300 border border-slate-700">
              {selectedAgent.mcpTool}()
            </code>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {selectedAgent.details.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/80 text-slate-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
