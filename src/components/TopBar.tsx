"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, LogOut } from "lucide-react";
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
    "User";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">
      {/* Protected session pill */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
        <ShieldCheck size={14} className="text-emerald-500" />
        Protected session
      </span>

      {/* User info */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
          {user ? initials : <User size={16} className="text-slate-500" />}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800">
            {displayName}
          </span>
          {user?.email && displayName !== user.email && (
            <span className="text-xs text-slate-500">{user.email}</span>
          )}
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
      >
        <LogOut size={14} />
        Logout
      </button>
    </header>
  );
}
