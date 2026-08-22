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

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch z-10">
        {/* Left Column: Compact System Introduction Showcase */}
        <div className="lg:col-span-6 w-full rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20">
                <ShieldCheck className="h-6 w-6 font-bold" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  SmartFlow One
                </h1>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Financial Intelligence Platform
                </span>
              </div>
            </div>

            {/* Concise Title & Subtitle */}
            <h2 className="text-lg font-bold text-slate-100 leading-snug mb-2">
              Automated Financial Intelligence &amp; PDPA Compliance
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Multi-source report extraction, automated PDPA PII anonymization, and vector FAISS RAG decision support.
            </p>

            {/* Compact 2x2 Capabilities Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
                <FileSpreadsheet size={15} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Multi-Source PDF &amp; Excel Ingestion</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
                <Lock size={15} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">PDPA Act 2010 Automated Scrubbing</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
                <Sparkles size={15} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Vector FAISS RAG Decision Assistant</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
                <Volume2 size={15} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">30-Sec C-Suite Voice Briefings</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>&copy; 2026 SmartFlow One</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 size={12} /> Enterprise Security
            </span>
          </div>
        </div>

        {/* Right Column: Account Sign-In & Registration Form */}
        <div className="lg:col-span-6 w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-1">
                <LockKeyhole size={13} />
                Account Authentication
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                {mode === "sign-in" ? "Sign In to Your Account" : "Create Enterprise Account"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {mode === "sign-in"
                  ? "Enter authorized credentials to access SmartFlow One."
                  : "Register a new account to begin analyzing financial reports."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-semibold text-slate-300"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-xs font-semibold text-slate-300"
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
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
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
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-xs font-extrabold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loading
                  ? "Authenticating..."
                  : mode === "sign-in"
                    ? "Sign In to SmartFlow One"
                    : "Register Account"}
                <ArrowRight size={15} />
              </button>
            </form>
          </div>

          {/* Mode Switcher */}
          <div className="pt-4 border-t border-slate-800/80 text-center mt-4">
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
