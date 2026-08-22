"use client";

import { ShieldCheck, User, Search, Bell, Lock } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-8 backdrop-blur-md">
      {/* Search Bar / Workspace Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search financial metrics, company, or risk item (Ctrl + K)..."
            className="w-80 rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-12 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
          <kbd className="absolute right-3 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Session Status + User Badge */}
      <div className="flex items-center gap-4">
        {/* Encrypted PDPA Session pill */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
          <ShieldCheck size={14} className="text-emerald-600" />
          PDPA Encrypted Session
        </span>

        {/* Notifications */}
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700">
          <Bell size={16} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 border-l border-slate-200/80 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-semibold text-xs shadow-xs">
            FA
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-900">Finance Lead</span>
            <span className="text-[10px] text-slate-400">Enterprise Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
