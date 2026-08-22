"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Lock,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Financial Insights", href: "/financial-insights", icon: TrendingUp },
  { label: "Risk Analysis", href: "/risk-analysis", icon: ShieldAlert },
  { label: "AI Recommendations", href: "/ai-recommendations", icon: Sparkles },
  { label: "Privacy Center", href: "/privacy-center", icon: Lock },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-slate-200 border-r border-slate-800/80 shadow-xl">
      {/* Brand & Logo block */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20">
          <ShieldCheck className="h-6 w-6 font-bold" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            FinSight AI
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </span>
          <span className="text-xs font-medium text-slate-400">
            Financial Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-5 flex flex-1 flex-col gap-1.5 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 font-semibold ring-1 ring-emerald-500/20 shadow-xs"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-500" />
              )}
              <Icon
                size={19}
                className={`shrink-0 transition-colors ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer & Compliance Badge */}
      <div className="border-t border-slate-800/80 p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Lock size={14} />
            PDPA Malaysia Encrypted
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Zero PII Exposure Engine
          </p>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-600">&copy; 2026 FinSight AI Platform</p>
      </div>
    </aside>
  );
}
