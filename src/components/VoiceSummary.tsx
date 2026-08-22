"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Square, Sparkles, ChevronDown, ChevronUp, Mic } from "lucide-react";

interface VoiceSummaryProps {
  summaryText: string;
  maxWords?: number;
}

function condense(text: string, maxWords: number): string {
  const cleaned = text
    .replace(/[#*_`>]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  const sentences = cleaned.match(/[^.!?]+[.!?]*/g) ?? [cleaned];
  const picked: string[] = [];
  let wordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount + words > maxWords && picked.length > 0) break;
    picked.push(sentence.trim());
    wordCount += words;
    if (wordCount >= maxWords) break;
  }

  let result = picked.join(" ").trim();
  const resultWords = result.split(/\s+/).filter(Boolean);
  if (resultWords.length > maxWords) {
    result = resultWords.slice(0, maxWords).join(" ") + "…";
  }

  return result;
}

export default function VoiceSummary({
  summaryText,
  maxWords = 75,
}: VoiceSummaryProps) {
  const [support, setSupport] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupport(true);
    } else {
      setSupport(false);
    }
  }, []);

  const detachUtterance = useCallback(() => {
    const u = utteranceRef.current;
    if (u) {
      u.onend = null;
      u.onerror = null;
      u.onstart = null;
      utteranceRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    detachUtterance();
    setIsSpeaking(false);
  }, [detachUtterance]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      detachUtterance();
    };
  }, [detachUtterance]);

  const play = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const spokenText = condense(summaryText, maxWords);
    if (!spokenText) return;

    window.speechSynthesis.cancel();
    detachUtterance();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      detachUtterance();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      detachUtterance();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [summaryText, maxWords, rate, detachUtterance]);

  const handleClick = useCallback(() => {
    if (isSpeaking) {
      stop();
    } else {
      play();
    }
  }, [isSpeaking, play, stop]);

  const spokenText = condense(summaryText, maxWords);

  return (
    <div className="w-full h-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs text-slate-100 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Mic size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight">C-Suite Voice Briefing</h3>
              <p className="text-[10px] text-slate-400">30-Sec AI Speech Synthesis</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-slate-700">
            Web Speech API
          </span>
        </div>

        {/* Spoken Text Preview / Waveform */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isSpeaking ? "🔊 Playing Briefing..." : "Ready to Play"}
            </span>

            {/* Sound Wave Animation */}
            {isSpeaking && (
              <div className="flex items-end gap-1 h-3">
                <span className="w-1 bg-emerald-400 h-2 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1 bg-emerald-400 h-3 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1 bg-emerald-400 h-1.5 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="w-1 bg-emerald-400 h-3 animate-bounce" style={{ animationDelay: "450ms" }} />
              </div>
            )}
          </div>

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
            &ldquo;{spokenText}&rdquo;
          </p>
        </div>
      </div>

      {/* Controls Footer */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClick}
            disabled={!support}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-extrabold transition-all cursor-pointer shadow-md ${
              isSpeaking
                ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                : "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110"
            }`}
          >
            {isSpeaking ? (
              <>
                <Square size={14} fill="currentColor" /> Pause Briefing
              </>
            ) : (
              <>
                <Volume2 size={15} /> Play Audio Summary
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-1 text-[10px] font-bold">
            {[1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRate(s)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  rate === s ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
        >
          {showTranscript ? "Hide Full Script" : "Show Full Script"}
          {showTranscript ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showTranscript && (
          <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400 leading-relaxed max-h-32 overflow-y-auto">
            {summaryText}
          </div>
        )}
      </div>
    </div>
  );
}
