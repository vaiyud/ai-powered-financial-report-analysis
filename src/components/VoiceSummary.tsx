"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Volume2,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mic,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Headphones,
  Sliders,
} from "lucide-react";

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
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [copied, setCopied] = useState(false);
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
    setIsPaused(false);
  }, [detachUtterance]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      detachUtterance();
    };
  }, [detachUtterance]);

  const spokenText = condense(summaryText, maxWords);

  const play = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!spokenText) return;

    window.speechSynthesis.cancel();
    detachUtterance();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      detachUtterance();
    };

    utterance.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("SpeechSynthesis error:", e.error);
      }
      setIsSpeaking(false);
      setIsPaused(false);
      detachUtterance();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [spokenText, rate, detachUtterance]);

  const togglePlayPause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (!isSpeaking) {
      play();
    } else {
      stop();
    }
  };

  const handleCopy = async () => {
    if (!spokenText) return;
    await navigator.clipboard.writeText(spokenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!support) return null;

  return (
    <div className="glass-card rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 text-slate-100 shadow-xl">
      {/* Top Bar with waveform and controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <Headphones className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                CFO Audio Briefing Studio
              </h4>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-slate-700">
                ~30s Digest
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Web Speech synthesized briefing of verified financial findings.
            </p>
          </div>
        </div>

        {/* Audio Equalizer bars & Playback action */}
        <div className="flex items-center gap-3">
          {/* Waveform Equalizer */}
          <div className="flex items-end gap-1 h-6 px-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
            <span
              className={`w-1 rounded-full bg-emerald-400 transition-all ${
                isSpeaking ? "animate-sound-bar-1" : "h-2 bg-slate-700"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-400 transition-all ${
                isSpeaking ? "animate-sound-bar-2" : "h-3 bg-slate-700"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-400 transition-all ${
                isSpeaking ? "animate-sound-bar-3" : "h-1.5 bg-slate-700"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-400 transition-all ${
                isSpeaking ? "animate-sound-bar-4" : "h-3.5 bg-slate-700"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-400 transition-all ${
                isSpeaking ? "animate-sound-bar-5" : "h-2 bg-slate-700"
              }`}
            />
          </div>

          {/* Speed Selector */}
          <div className="flex items-center rounded-lg bg-slate-950/80 p-1 border border-slate-800 text-[11px] font-mono">
            {[1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setRate(spd)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  rate === spd
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Play/Stop Main Button */}
          <button
            onClick={togglePlayPause}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md active:scale-95 ${
              isSpeaking
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
                : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20"
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop Narration
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Play Audio Briefing
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript Accordion / Viewer */}
      <div className="mt-3 border-t border-slate-800/80 pt-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            {showTranscript ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            <span>{showTranscript ? "Hide Transcript" : "View Audio Script"}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-slate-200 transition-colors text-[11px]"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        {showTranscript && (
          <div className="mt-2.5 rounded-xl bg-slate-950/80 p-3.5 text-xs leading-relaxed text-slate-300 border border-slate-800/80 font-sans">
            <span className="text-emerald-400 font-mono font-bold mr-1.5">[Audio Script]:</span>
            {spokenText || "No summary text generated yet."}
          </div>
        )}
      </div>
    </div>
  );
}
