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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Financial Insights", href: "/financial-insights", icon: TrendingUp },
  { label: "Risk Analysis", href: "/risk-analysis", icon: ShieldAlert },
  { label: "AI Recommendations", href: "/ai-recommendations", icon: Sparkles },
  { label: "Privacy Center", href: "/privacy-center", icon: Lock },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-slate-200">
      {/* Logo block */}
      <div className="flex flex-col gap-0.5 border-b border-slate-700/60 px-5 py-6">
        <span className="text-lg font-semibold tracking-tight text-white">
          SmartFlow One
        </span>
        <span className="text-xs font-medium text-slate-400">
          Financial Intelligence
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-700/50 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/60 px-5 py-4">
        <p className="text-xs text-slate-500">&copy; 2026 SmartFlow One</p>
      </div>
    </aside>
  );
}
