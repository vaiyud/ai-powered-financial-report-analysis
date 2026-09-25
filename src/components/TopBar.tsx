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
  "/": "Executive Command Center",
  "/dashboard": "Executive Command Center",
  "/financial-insights": "Financial Insights & Provenance",
  "/risk-analysis": "Risk Severity Matrix",
  "/ai-recommendations": "AI CFO Recommendations & Simulator",
  "/privacy-center": "PDPA Privacy & Compliance Center",
  "/settings": "Platform & Agent Settings",
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const currentTitle = pathTitleMap[location.pathname] || "SmartFlow Intelligence";

  // Hotkey listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowSearchModal(false);
        setShowProfileDrawer(false);
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-xl">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
          {currentTitle}
          <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-slate-800">
            LIVE TELEMETRY
          </span>
        </h1>
      </div>

      {/* Right Controls: Command Bar, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Search Trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 px-3.5 py-1.5 text-xs text-slate-400 border border-slate-800 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span>Quick search or command...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">Agent Telemetry Alerts</span>
                <span className="text-[10px] font-mono text-emerald-400">All Verified</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <p className="font-semibold text-slate-200">Adversarial Critic Passed</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sanofi €10.51B revenue claim verified against Page 12.
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  <p className="font-semibold text-slate-200">PDPA Scrubbing Complete</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    7,843 PII tokens masked with 0 data exfiltration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => setShowProfileDrawer(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-850 px-2.5 py-1.5 border border-slate-800 transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
            FL
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-200">Finance Lead</span>
        </button>
      </div>

      {/* Command Palette Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 backdrop-blur-md pt-20 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
              <Search className="h-4 w-4 text-emerald-400" />
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a metric, company, or command..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
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
                      className="flex items-center justify-between rounded-xl p-3 text-xs hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-emerald-400 border border-slate-800">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{item.title}</p>
                          <p className="text-[10px] text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Jump ↵</span>
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
