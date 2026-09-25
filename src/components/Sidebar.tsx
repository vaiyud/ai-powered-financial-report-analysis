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
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Financial Insights", href: "/financial-insights", icon: TrendingUp },
  { label: "Risk Severity Matrix", href: "/risk-analysis", icon: ShieldAlert },
  { label: "AI Recommendations", href: "/ai-recommendations", icon: Sparkles },
  { label: "Privacy Center", href: "/privacy-center", icon: Lock },
  { label: "Settings", href: "/settings", icon: Settings },
];

const WORKSPACES = [
  { id: "sanofi", name: "Sanofi S.A.", tag: "Healthcare • FY25/26" },
  { id: "bursa", name: "Bursa Malaysia Bhd", tag: "Stock Exchange • FY25" },
  { id: "maybank", name: "Maybank Group", tag: "Commercial Banking" },
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
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-slate-200 border-r border-slate-800 shadow-xl">
      {/* Brand & Logo Header */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            SmartFlow One
          </span>
          <span className="text-[11px] font-medium text-emerald-400">
            Financial Intelligence
          </span>
        </div>
      </div>

      {/* Active Workspace Selector */}
      <div className="px-3 pt-3">
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between rounded-xl bg-slate-850 hover:bg-slate-800 px-3 py-2.5 text-left border border-slate-750 transition-colors"
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
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl bg-slate-850 border border-slate-700 shadow-2xl p-1.5 space-y-1">
              {WORKSPACES.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    activeWorkspace.id === ws.id
                      ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-750"
                  }`}
                >
                  <div>
                    <p className="font-medium text-white">{ws.name}</p>
                    <p className="text-[10px] text-slate-400">{ws.tag}</p>
                  </div>
                  {activeWorkspace.id === ws.id && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
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
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
            >
              <Icon
                size={17}
                className={`shrink-0 transition-colors ${
                  isActive ? "text-slate-950" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Compliance Badge & Logout */}
      <div className="border-t border-slate-800 p-3.5 space-y-2.5">
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Lock size={13} />
              PDPA Malaysia Shield
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Automatic Zero-Exposure PII Masking
          </p>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
