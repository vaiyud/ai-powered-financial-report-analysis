import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Lock,
  Settings,
  User,
  Camera,
  CheckCircle2,
  Mail,
  Building,
  Shield,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  link: string;
  icon: any;
}

interface UserProfile {
  name: string;
  role: string;
  email: string;
  department: string;
  avatarUrl: string | null;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "s1",
    title: "Sanofi S.A. Q1 2026 Net Sales (€10.51B, +6.2% YoY)",
    category: "Financial Metrics",
    link: "/financial-insights",
    icon: TrendingUp,
  },
  {
    id: "s2",
    title: "Bursa Malaysia Berhad FY2025 Revenue (RM 920M, +8.2% YoY)",
    category: "Financial Metrics",
    link: "/financial-insights",
    icon: TrendingUp,
  },
  {
    id: "s3",
    title: "Sanofi S.A. Debt-to-Equity Ratio Flag (1.75x Leverage)",
    category: "Risk Anomaly",
    link: "/risk-analysis",
    icon: AlertTriangle,
  },
  {
    id: "s4",
    title: "Bursa Malaysia Platform Continuity & Cyber Resilience",
    category: "Risk Anomaly",
    link: "/risk-analysis",
    icon: AlertTriangle,
  },
  {
    id: "s5",
    title: "PDPA Malaysia Act 2010 Audit (7,843 PII Tokens Scrubbed)",
    category: "Privacy Audit",
    link: "/privacy-center",
    icon: Lock,
  },
  {
    id: "s6",
    title: "Evaluate Interest Rate Hedging & Debt Restructuring",
    category: "AI Recommendation",
    link: "/ai-recommendations",
    icon: Sparkles,
  },
  {
    id: "s7",
    title: "PDPA Anonymization & RAG Engine Settings",
    category: "Settings",
    link: "/settings",
    icon: Settings,
  },
];

const pathTitleMap: Record<string, string> = {
  "/": "Command Center",
  "/dashboard": "Command Center",
  "/financial-insights": "Financial Insights & Trends",
  "/risk-analysis": "Risk Severity Matrix",
  "/ai-recommendations": "AI CFO Recommendations",
  "/privacy-center": "PDPA Privacy Center",
  "/settings": "Platform Settings",
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Finance Lead",
  role: "Enterprise Admin",
  email: "lead.finance@smartflow.ai",
  department: "Corporate Intelligence",
  avatarUrl: null,
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const pageTitle = pathTitleMap[location.pathname] || "Financial Intelligence";

  // Load user profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smartflow_user_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Using default profile");
    }
  }, []);

  // Keyboard shortcut listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS;

  const handleSelectResult = (link: string) => {
    setSearchOpen(false);
    setQuery("");
    navigate(link);
  };

  // Handle Profile Avatar Image Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const updated = { ...profile, avatarUrl: result };
        setProfile(updated);
        try {
          localStorage.setItem("smartflow_user_profile", JSON.stringify(updated));
        } catch (err) {
          console.warn("Failed to save avatar image");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("smartflow_user_profile", JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.warn("Failed to save profile");
    }
  };

  // Compute Initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-8 backdrop-blur-md">
        {/* Page Context Breadcrumb & Interactive Search */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-slate-900 tracking-tight hidden sm:inline-block">
            {pageTitle}
          </span>

          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              readOnly
              onClick={() => setSearchOpen(true)}
              placeholder="Search financial metrics, company, or risk item (⌘K)..."
              className="w-72 sm:w-80 rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-12 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all hover:border-emerald-500 focus:border-emerald-500 cursor-pointer"
            />
            <kbd
              onClick={() => setSearchOpen(true)}
              className="absolute right-3 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 cursor-pointer"
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Clean Profile Badge (Removes redundant extra green pills) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            title="Edit your user profile"
            className="flex items-center gap-3 rounded-2xl p-1.5 transition-all hover:bg-slate-100 cursor-pointer group border border-transparent hover:border-slate-200"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-emerald-500/30"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                {getInitials(profile.name)}
              </div>
            )}
            <div className="flex flex-col text-left pr-1">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[130px] group-hover:text-emerald-700">
                {profile.name}
              </span>
              <span className="text-[10px] font-medium text-slate-400">{profile.role}</span>
            </div>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* INTERACTIVE COMMAND PALETTE SEARCH MODAL */}
      {/* ========================================================================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl relative overflow-hidden">
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <Search className="h-5 w-5 text-emerald-600" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search financial data, risks, or PDPA logs..."
                className="flex-1 text-xs text-slate-900 placeholder-slate-400 outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Results List */}
            <div className="mt-3 max-h-80 overflow-y-auto space-y-1.5 pr-1">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item.link)}
                      className="w-full flex items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-emerald-50/60 group cursor-pointer border border-transparent hover:border-emerald-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                          <ItemIcon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700">
                        Jump to ↗
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching financial metrics or risk items found.
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Press ESC or click X to close</span>
              <span>SmartFlow RAG Search</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE USER PROFILE EDIT & AVATAR UPLOAD MODAL */}
      {/* ========================================================================= */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setProfileOpen(false)}
              className="absolute right-6 top-6 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">User Profile Details</h3>
                <p className="text-xs text-slate-500">
                  Manage personal information and profile picture
                </p>
              </div>
            </div>

            {/* Avatar Upload Banner */}
            <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 mb-6">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-16 w-16 rounded-2xl object-cover ring-4 ring-emerald-500/20"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-extrabold text-xl shadow-md">
                    {getInitials(profile.name)}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  <Camera size={20} />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                  <Camera size={14} /> Upload New Picture
                </button>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Supports PNG, JPG, or GIF up to 5MB
                </p>
              </div>
            </div>

            {/* Profile Input Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Role & Position</label>
                <div className="relative flex items-center">
                  <Shield className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Department</label>
                <div className="relative flex items-center">
                  <Building className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={16} />
                  Profile &amp; avatar image saved successfully!
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
