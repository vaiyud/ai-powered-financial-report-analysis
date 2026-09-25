"use client";

import { useState } from "react";
import {
  Sparkles,
  Sliders,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  Clock,
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
    title: "Implement Dynamic Supplier Early-Payment Discounting to Restore Cash Flow",
    category: "Working Capital",
    priority: "High Priority",
    financialImpact: "+€18.5M Cash Flow Recovery",
    timeframe: "45 Days",
    rationale: "Operating cash flow contracted 18.4% due to working capital expansion. Dynamic discounting accelerates cash conversion cycle.",
    status: "Pending Approval",
  },
  {
    id: "a3",
    title: "Deploy Automated RegTech Compliance for Market Infrastructure Participants",
    category: "Infrastructure",
    priority: "Strategic",
    financialImpact: "RM 2.8M Opex Efficiency",
    timeframe: "90 Days",
    rationale: "Trading volume growth demands automated market surveillance and sub-millisecond audit reporting under regulatory guidelines.",
    status: "Pending Approval",
  },
];

export default function AIRecommendationsPage() {
  const baseRevenue = 10509;
  const baseNetIncome = 1850;
  const baseCosts = baseRevenue - baseNetIncome;

  const [revGrowth, setRevGrowth] = useState<number>(0);
  const [costInflation, setCostInflation] = useState<number>(0);
  const [interestRateDelta, setInterestRateDelta] = useState<number>(0);

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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Prioritized Action Queue & Sensitivity Simulator
          </h2>
          <p className="text-xs text-slate-500">
            Actionable board recommendations linked with interactive What-If scenario modeling.
          </p>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator */}
      <div className="white-card p-6 bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Interactive Sensitivity & Scenario Modeler
              </h3>
              <p className="text-xs text-slate-500">
                Adjust macro variables to simulate real-time impact on FY26 Net Income and profit margins.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs text-slate-700 font-semibold transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Baseline
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Revenue Growth */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Revenue Growth Delta</span>
              <span className={`font-bold ${revGrowth >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
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
              className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>-20% Recession</span>
              <span>Baseline (0%)</span>
              <span>+20% Bull</span>
            </div>
          </div>

          {/* Slider 2: Cost Inflation */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Cost Inflation Delta</span>
              <span className={`font-bold ${costInflation <= 0 ? "text-emerald-700" : "text-rose-700"}`}>
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
              className="w-full accent-amber-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>-10% Savings</span>
              <span>Baseline (0%)</span>
              <span>+20% High Opex</span>
            </div>
          </div>

          {/* Slider 3: Interest Rate Hike */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Central Bank Rate Delta</span>
              <span className={`font-bold ${interestRateDelta <= 0 ? "text-emerald-700" : "text-rose-700"}`}>
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
              className="w-full accent-indigo-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>-2.0% Cuts</span>
              <span>Baseline (0%)</span>
              <span>+4.0% Hike</span>
            </div>
          </div>
        </div>

        {/* Simulated Financial Outputs */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium">Projected Revenue</span>
            <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">
              €{projectedRevenue.toFixed(0)}M
            </p>
            <span className="text-[10px] text-slate-400">
              Base: €{baseRevenue}M
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium">Projected Net Profit</span>
            <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">
              €{projectedNetIncome.toFixed(0)}M
            </p>
            <span
              className={`text-[10px] font-bold ${
                deltaIncomePct >= 0 ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {deltaIncomePct >= 0 ? `+${deltaIncomePct.toFixed(1)}% vs Base` : `${deltaIncomePct.toFixed(1)}% vs Base`}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-[11px] text-slate-500 font-medium">Net Profit Margin</span>
            <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">
              {projectedMargin.toFixed(1)}%
            </p>
            <span className="text-[10px] text-emerald-700 font-medium">
              Historical Base: 17.6%
            </span>
          </div>
        </div>
      </div>

      {/* Prioritized Action Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Prioritized Action Execution Plan
        </h3>

        {ACTION_ITEMS.map((action) => (
          <div
            key={action.id}
            className="white-card p-5 bg-white border border-slate-200/90 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                  {action.priority}
                </span>
                <span className="text-xs font-bold text-slate-800">{action.category}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {action.financialImpact}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {action.timeframe}
                </span>
              </div>
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-900 tracking-tight">
              {action.title}
            </h3>

            <p className="mt-2 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <strong className="text-slate-900 mr-1">Rationale:</strong>
              {action.rationale}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                Status: {action.status}
              </span>

              <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-all active:scale-95">
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
