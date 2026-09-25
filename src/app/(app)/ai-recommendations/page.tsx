"use client";

import { useState } from "react";
import {
  Sparkles,
  Sliders,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  DollarSign,
  RotateCcw,
} from "lucide-react";

interface ActionItem {
  id: string;
  title: string;
  category: string;
  priority: "High Priority" | "Strategic" | "Operational";
  financialImpact: string;
  timeframe: string;
  rationale: string;
  status: "Pending Approval" | "Executed" | "In Review";
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: "a1",
    title: "Restructure Floating Commercial Paper Facilities into Fixed Eurobonds",
    category: "Capital Structure",
    priority: "High Priority",
    financialImpact: "+€4.2M Annual Interest Savings",
    timeframe: "30-60 Days",
    rationale: "Short-term debt rose to €32.8M at 4.85% floating rate. Locking in coupon rates mitigates upward ECB rate risk.",
    status: "In Review",
  },
  {
    id: "a2",
    title: "Implement Dynamic Supplier Early-Payment Discounting to Restore Operating Cash Flow",
    category: "Working Capital",
    priority: "High Priority",
    financialImpact: "+€18.5M Cash Flow Recovery",
    timeframe: "45 Days",
    rationale: "Operating cash flow contracted 18.4% due to working capital expansion. Dynamic discounting accelerates cash conversion cycle.",
    status: "Pending Approval",
  },
  {
    id: "a3",
    title: "Deploy Automated RegTech Compliance for Bursa Malaysia Market Participants",
    category: "Infrastructure",
    priority: "Strategic",
    financialImpact: "RM 2.8M Opex Efficiency",
    timeframe: "90 Days",
    rationale: "Trading volume growth demands automated market surveillance and sub-millisecond audit reporting under SC guidelines.",
    status: "Pending Approval",
  },
];

export default function AIRecommendationsPage() {
  // What-If Sensitivity Simulator State (Baseline: Sanofi Net Sales €10,509M, Net Income €1,850M)
  const baseRevenue = 10509;
  const baseNetIncome = 1850;
  const baseCosts = baseRevenue - baseNetIncome;

  const [revGrowth, setRevGrowth] = useState<number>(0); // -20% to +20%
  const [costInflation, setCostInflation] = useState<number>(0); // -10% to +20%
  const [interestRateDelta, setInterestRateDelta] = useState<number>(0); // -2% to +4%

  // Compute live deterministic scenario metrics
  const projectedRevenue = baseRevenue * (1 + revGrowth / 100);
  const projectedCosts = baseCosts * (1 + costInflation / 100) + (32.8 * (interestRateDelta / 100));
  const projectedNetIncome = projectedRevenue - projectedCosts;
  const projectedMargin = (projectedNetIncome / projectedRevenue) * 100;
  const deltaIncomePct = ((projectedNetIncome - baseNetIncome) / baseNetIncome) * 100;

  const handleReset = () => {
    setRevGrowth(0);
    setCostInflation(0);
    setInterestRateDelta(0);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
              AI CFO ACTION ORCHESTRATOR
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Prioritized Action Queue & Sensitivity Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Actionable board recommendations linked with interactive What-If scenario modeling.
          </p>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-slate-900/90 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Interactive Sensitivity & Scenario Modeler (MCP Quant Engine)
              </h3>
              <p className="text-[11px] text-slate-400">
                Adjust key macro variables to simulate real-time impact on FY26 Net Income & EBITDA margins.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Baseline
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Revenue Growth */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Revenue Growth Delta</span>
              <span className={`font-mono font-bold ${revGrowth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {revGrowth > 0 ? `+${revGrowth}%` : `${revGrowth}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={revGrowth}
              onChange={(e) => setRevGrowth(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-20% Recession</span>
              <span>Baseline (0%)</span>
              <span>+20% Bull</span>
            </div>
          </div>

          {/* Slider 2: Cost Inflation */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Cost Inflation Delta</span>
              <span className={`font-mono font-bold ${costInflation <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {costInflation > 0 ? `+${costInflation}%` : `${costInflation}%`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="20"
              step="1"
              value={costInflation}
              onChange={(e) => setCostInflation(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-10% Savings</span>
              <span>Baseline (0%)</span>
              <span>+20% High Opex</span>
            </div>
          </div>

          {/* Slider 3: Interest Rate Hike */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">ECB/Central Bank Rate Hike</span>
              <span className={`font-mono font-bold ${interestRateDelta <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {interestRateDelta > 0 ? `+${interestRateDelta}%` : `${interestRateDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="4"
              step="0.25"
              value={interestRateDelta}
              onChange={(e) => setInterestRateDelta(Number(e.target.value))}
              className="w-full accent-cobalt bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-2.0% Cuts</span>
              <span>Baseline (0%)</span>
              <span>+4.0% Tightening</span>
            </div>
          </div>
        </div>

        {/* Live Simulated Financial Outputs */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <span className="text-[11px] text-slate-400">Projected Revenue</span>
            <p className="text-xl font-bold text-white tabular-nums mt-1">
              €{projectedRevenue.toFixed(0)}M
            </p>
            <span className="text-[10px] font-mono text-slate-400">
              Base: €{baseRevenue}M
            </span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <span className="text-[11px] text-slate-400">Projected Net Profit</span>
            <p className="text-xl font-bold text-white tabular-nums mt-1">
              €{projectedNetIncome.toFixed(0)}M
            </p>
            <span
              className={`text-[10px] font-mono font-bold ${
                deltaIncomePct >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {deltaIncomePct >= 0 ? `+${deltaIncomePct.toFixed(1)}% vs Base` : `${deltaIncomePct.toFixed(1)}% vs Base`}
            </span>
          </div>

          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <span className="text-[11px] text-slate-400">Net Profit Margin</span>
            <p className="text-xl font-bold text-white tabular-nums mt-1">
              {projectedMargin.toFixed(1)}%
            </p>
            <span className="text-[10px] font-mono text-emerald-400">
              Historical Base: 17.6%
            </span>
          </div>
        </div>
      </div>

      {/* Prioritized Action Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Prioritized Action Execution Plan
        </h3>

        {ACTION_ITEMS.map((action) => (
          <div
            key={action.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  {action.priority}
                </span>
                <span className="text-xs font-bold text-slate-300">{action.category}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {action.financialImpact}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {action.timeframe}
                </span>
              </div>
            </div>

            <h3 className="mt-3 text-base font-bold text-white tracking-tight">
              {action.title}
            </h3>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <span className="font-semibold text-emerald-400 font-mono mr-1">Rationale:</span>
              {action.rationale}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
              <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold text-slate-300 border border-slate-800">
                Status: {action.status}
              </span>

              <button className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve & Execute Action
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
