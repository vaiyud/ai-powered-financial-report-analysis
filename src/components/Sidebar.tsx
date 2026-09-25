import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Lock,
  Settings,
  ShieldCheck,
  LogOut,
  Building2,
  ChevronDown,
  Activity,
  Cpu,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Command Center", href: "/", icon: LayoutDashboard },
  { label: "Financial Insights", href: "/financial-insights", icon: TrendingUp },
  { label: "Risk Severity Matrix", href: "/risk-analysis", icon: ShieldAlert },
  { label: "AI Recommendations", href: "/ai-recommendations", icon: Sparkles },
  { label: "PDPA Privacy Center", href: "/privacy-center", icon: Lock },
  { label: "Settings & Config", href: "/settings", icon: Settings },
];

const WORKSPACES = [
  { id: "sanofi", name: "Sanofi S.A. (Global)", tag: "Healthcare • FY25" },
  { id: "bursa", name: "Bursa Malaysia Bhd", tag: "Exchange • FY25" },
  { id: "maybank", name: "Maybank Group", tag: "Banking • FY25" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeWorkspace, setActiveWorkspace] = useState(WORKSPACES[0]);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-950 text-slate-200 border-r border-slate-800/80 shadow-2xl">
      {/* Brand & Logo Header */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
          <ShieldCheck className="h-6 w-6 font-bold" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            SmartFlow One
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </span>
          <span className="text-[11px] font-medium text-emerald-400/90 font-mono">
            MAS • v2.0 Production
          </span>
        </div>
      </div>

      {/* Active Workspace Selector */}
      <div className="px-3 pt-3">
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between rounded-xl bg-slate-900/90 hover:bg-slate-900 px-3 py-2 text-left border border-slate-800/80 transition-colors"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {activeWorkspace.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {activeWorkspace.tag}
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-slate-900 border border-slate-700 shadow-xl p-1.5 space-y-1">
              {WORKSPACES.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    activeWorkspace.id === ws.id
                      ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <p className="font-medium">{ws.name}</p>
                  <p className="text-[10px] text-slate-400">{ws.tag}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? location.pathname === "/" || location.pathname === "/dashboard"
              : location.pathname.startsWith(href);

          return (
            <Link
              key={href}
              to={href}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 shadow-xs"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-500" />
              )}
              <Icon
                size={17}
                className={`shrink-0 transition-colors ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Compliance Badge & Logout */}
      <div className="border-t border-slate-800/80 p-3.5 space-y-2.5">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Lock size={13} />
              PDPA Malaysia Act 2010
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            7,843 PII Tokens Scrubbed • 0 Exposure
          </p>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-rose-400 transition-colors"
        >
          <LogOut size={15} />
          Sign Out of Terminal
        </button>
      </div>
    </aside>
  );
}
