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
  CheckCircle2,
  Building,
  Command,
  Bell,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  link: string;
  icon: any;
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
    title: "Short-Term Debt Facility & Solvency Anomaly (€32.8M)",
    category: "Risk Matrix",
    link: "/risk-analysis",
    icon: AlertTriangle,
  },
  {
    id: "s4",
    title: "Working Capital Optimization & Cash Flow Recovery",
    category: "AI Recommendations",
    link: "/ai-recommendations",
    icon: Sparkles,
  },
  {
    id: "s5",
    title: "PDPA Malaysia Compliance & PII Token Masking",
    category: "Privacy Center",
    link: "/privacy-center",
    icon: Lock,
  },
];

const pathTitleMap: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Executive Overview", subtitle: "Real-time financial performance and AI risk analysis" },
  "/dashboard": { title: "Executive Overview", subtitle: "Real-time financial performance and AI risk analysis" },
  "/financial-insights": { title: "Financial Insights & Trends", subtitle: "Income statement analysis and document provenance" },
  "/risk-analysis": { title: "Risk Severity Matrix", subtitle: "Automated anomaly detection across disclosures" },
  "/ai-recommendations": { title: "AI CFO Recommendations", subtitle: "Actionable board items & What-If scenario modeler" },
  "/privacy-center": { title: "PDPA Compliance Center", subtitle: "Zero-exposure PII masking and data retention controls" },
  "/settings": { title: "Platform Settings", subtitle: "API keys, model parameters, and preferences" },
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const currentRoute = pathTitleMap[location.pathname] || {
    title: "SmartFlow One",
    subtitle: "Financial Intelligence",
  };

  // Hotkey listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowSearchModal(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-6 backdrop-blur-md shadow-xs">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-base font-bold tracking-tight text-slate-900">
          {currentRoute.title}
        </h1>
        <p className="text-xs text-slate-500 hidden sm:block">
          {currentRoute.subtitle}
        </p>
      </div>

      {/* Right Controls: Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Search Trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 px-3.5 py-1.5 text-xs text-slate-600 border border-slate-200 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden md:inline">Search metrics, reports, or risks...</span>
          <span className="md:hidden">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 border border-slate-300 shadow-2xs">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900">Analysis Notifications</span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  All Systems Verified
                </span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                  <p className="font-semibold text-slate-800">CFO Summary Verified</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sanofi €10.51B revenue claim verified against Page 12.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                  <p className="font-semibold text-slate-800">PDPA Compliance Active</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Zero PII tokens transmitted to external inference.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 px-2.5 py-1.5 border border-slate-200">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
            FL
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-800">
            Finance Lead
          </span>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-xs pt-20 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
              <Search className="h-4 w-4 text-emerald-600" />
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search financial metrics, company disclosures, or risks..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matching results found.
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate(item.link);
                        setShowSearchModal(false);
                      }}
                      className="flex items-center justify-between rounded-xl p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="text-[10px] text-slate-500">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Jump ↵</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
