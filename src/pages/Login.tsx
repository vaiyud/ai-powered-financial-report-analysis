import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  FileSpreadsheet,
  Lock,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"extraction" | "pdpa" | "rag" | "voice">("extraction");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setMessage("Check your email for a confirmation link.");
      setLoading(false);
    }
  }

  const handleGuestDemoLaunch = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Credentials Form */}
        <div className="lg:col-span-5 w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-8 w-8 font-bold" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              SmartFlow One
            </h1>
            <p className="mt-1 text-xs text-slate-400 font-medium">
              Enterprise Financial Intelligence & PDPA Compliance Platform
            </p>
          </div>

          {/* Quick Demo Access Box */}
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <p className="text-xs font-semibold text-emerald-400 mb-2.5 flex items-center justify-center gap-1.5">
              <Zap size={14} className="animate-bounce text-emerald-400" />
              Instant Hackathon Demo Access
            </p>
            <button
              type="button"
              onClick={handleGuestDemoLaunch}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
            >
              Launch SmartFlow One Demo
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] font-semibold uppercase text-slate-500">
              Or Account Credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium text-slate-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-3.5 py-2 text-xs font-semibold text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-400">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Authenticating..."
                : mode === "sign-in"
                  ? "Sign In to SmartFlow One"
                  : "Create Account"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-5 text-center text-xs text-slate-500">
            {mode === "sign-in" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-up");
                    setError(null);
                    setMessage(null);
                  }}
                  className="font-semibold text-emerald-400 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-in");
                    setError(null);
                    setMessage(null);
                  }}
                  className="font-semibold text-emerald-400 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>

        {/* Right Column: Interactive Intro Card */}
        <div className="lg:col-span-7 w-full rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <BrainCircuit size={14} />
                AI Financial SaaS Platform
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
                v2.0 Enterprise Release
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Automated Financial Extraction & PDPA Anonymization
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              SmartFlow One processes multi-source PDF annual integrated reports and multi-tab Excel financial statements through a 4-stage RAG pipeline with zero PII exposure.
            </p>

            {/* Interactive Pillar Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("extraction")}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "extraction"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                <FileSpreadsheet size={14} />
                Dual Extractor
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pdpa")}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "pdpa"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                <Lock size={14} />
                PDPA Malaysia
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rag")}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "rag"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                <Sparkles size={14} />
                FAISS RAG
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("voice")}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "voice"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                <Volume2 size={14} />
                Voice Summary
              </button>
            </div>

            {/* Active Content Showcase Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 mb-6">
              {activeTab === "extraction" && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="text-emerald-400" size={16} />
                    Dual-Stream PDF & XLSX Ingestion Engine
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Extracts raw multi-year financial statements across 1,322 units (1,316 PDF pages + 6 Excel sheets) including Sanofi Q1 2026 sales and Bursa Malaysia Integrated Reports.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> 100% Provenance Line-Items
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> Pydantic Validated Ratios
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "pdpa" && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Lock className="text-emerald-400" size={16} />
                    PDPA Malaysia Act 2010 Compliance Engine
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Automated pre-ingestion regex scrubber masked 7,843 sensitive PII tokens (3,090 NRIC IC numbers and 4,753 corporate email disclosures) with zero data leakage.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> 3,090 NRICs Anonymized
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> 4,753 Emails Masked
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "rag" && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="text-emerald-400" size={16} />
                    103,798 Chunk FAISS Vector RAG Store
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Indexed ~1,000 character financial table chunks into 1,024-dim FAISS vector store. Delivers instant answers for YoY growth, net margins, and debt-to-equity ratios.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> 1.75x Debt Ratio Scored
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> 9 Red-Flag Disclosures
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "voice" && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Volume2 className="text-emerald-400" size={16} />
                    30-Second Web Speech Voice Briefing
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Synthesizes multi-page financial insights into a 75-word executive voice briefing using native browser Web Speech API for C-suite decision makers.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> Browser Speech Synthesis
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> 75-Word Executive Brief
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-5">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-white">103,798</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                FAISS Chunks
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400">7,843</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                PDPA Redactions
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-amber-400">1.75x</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                Sanofi D/E Ratio
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
