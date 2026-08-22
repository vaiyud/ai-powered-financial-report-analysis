import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Search, ShieldCheck, X, FileText, TrendingUp, AlertTriangle, Sparkles, Lock, Settings } from "lucide-react";

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
  "/": "Command Center",
  "/dashboard": "Command Center",
  "/financial-insights": "Financial Insights & Trends",
  "/risk-analysis": "Risk Severity Matrix",
  "/ai-recommendations": "AI CFO Recommendations",
  "/privacy-center": "PDPA Privacy Center",
  "/settings": "Platform Settings",
};

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const pageTitle = pathTitleMap[location.pathname] || "Financial Intelligence";

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

        {/* Profile & Status */}
        <div className="flex items-center gap-4">
          {/* Compliance Pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            PDPA Encrypted Session
          </span>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2.5 border-l border-slate-200/80 pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-semibold text-xs shadow-xs">
              FL
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                Finance Lead
              </span>
              <span className="text-[10px] text-slate-400">Enterprise Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Command Palette Search Modal */}
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
    </>
  );
}
