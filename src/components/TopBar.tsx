"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, LogOut, Search, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function TopBar() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Finance Lead";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-8 backdrop-blur-md">
      {/* Search Bar / Workspace Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search financial metrics, company, or risk item (⌘K)..."
            className="w-80 rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-12 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
          <kbd className="absolute right-3 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Session Status + User Badge + Logout */}
      <div className="flex items-center gap-4">
        {/* Encrypted PDPA Session pill */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
          <ShieldCheck size={14} className="text-emerald-600" />
          PDPA Encrypted Session
        </span>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 border-l border-slate-200/80 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-semibold text-xs shadow-xs">
            {user ? initials : "FL"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
              {displayName}
            </span>
            <span className="text-[10px] text-slate-400">Enterprise Admin</span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          type="button"
          title="Sign out of SmartFlow One"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </header>
  );
}
