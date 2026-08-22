import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileSpreadsheet,
  Lock,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  BrainCircuit,
  LockKeyhole,
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

      setMessage("Account registered! You may now sign in.");
      setMode("sign-in");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Clean System Introduction Showcase */}
        <div className="lg:col-span-6 w-full rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-8">
          <div>
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="h-7 w-7 font-bold" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  SmartFlow One
                </h1>
                <span className="text-xs font-semibold text-emerald-400">
                  Financial Intelligence Platform
                </span>
              </div>
            </div>

            {/* Concise Introduction Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug mb-3">
              Automated Financial Extraction &amp; PDPA Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              SmartFlow One streamlines enterprise financial analysis with multi-source report extraction, automated PDPA Malaysia PII anonymization, and RAG decision support.
            </p>

            {/* 4 Clean System Capability Highlights */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Multi-Source Ingestion</h3>
                  <p className="text-[11px] text-slate-400">PDF annual reports &amp; multi-tab Excel financial statements</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">PDPA Malaysia Act 2010</h3>
                  <p className="text-[11px] text-slate-400">Automated pre-ingestion regex PII scrubbing (Zero Leakage)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Vector FAISS RAG Assistant</h3>
                  <p className="text-[11px] text-slate-400">103,798 semantic table chunks with cited provenance</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Volume2 size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">C-Suite Voice Briefings</h3>
                  <p className="text-[11px] text-slate-400">30-second executive audio synthesis via Web Speech API</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>&copy; 2026 SmartFlow One</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 size={12} /> Enterprise Grade Security
            </span>
          </div>
        </div>

        {/* Right Column: Account Sign-In & Registration Form */}
        <div className="lg:col-span-6 w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
              <LockKeyhole size={14} />
              Account Authentication
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              {mode === "sign-in" ? "Sign In to Your Account" : "Create Enterprise Account"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {mode === "sign-in"
                ? "Enter your authorized credentials to access SmartFlow One."
                : "Register a new account to begin analyzing financial reports."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-slate-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-slate-300"
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
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-xs font-semibold text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-emerald-400">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Authenticating..."
                : mode === "sign-in"
                  ? "Sign In to SmartFlow One"
                  : "Register Account"}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
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
                    className="font-bold text-emerald-400 hover:underline cursor-pointer ml-1"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("sign-in");
                      setError(null);
                      setMessage(null);
                    }}
                    className="font-bold text-emerald-400 hover:underline cursor-pointer ml-1"
                  >
                    Sign in to your account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
