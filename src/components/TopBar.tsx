import { ShieldCheck, User } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">
      {/* Protected session pill */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
        <ShieldCheck size={14} className="text-emerald-500" />
        Protected session
      </span>

      {/* User info */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
          <User size={16} className="text-slate-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800">Alex Morgan</span>
          <span className="text-xs text-slate-500">Admin</span>
        </div>
      </div>
    </header>
  );
}
