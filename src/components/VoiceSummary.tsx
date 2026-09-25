"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Volume2,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Copy,
  Check,
  Headphones,
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

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      detachUtterance();
    };
    utterance.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("SpeechSynthesis error:", e.error);
      }
      setIsSpeaking(false);
      detachUtterance();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [spokenText, rate, detachUtterance]);

  const togglePlayPause = () => {
    if (isSpeaking) {
      stop();
    } else {
      play();
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
    <div className="white-card p-4 text-slate-900 shadow-xs border border-slate-200/90 bg-white">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Headphones className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                Audio Executive Briefing
              </h4>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                ~30s Digest
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Listen to AI-synthesized CFO takeaways and key variances.
            </p>
          </div>
        </div>

        {/* Audio Waveform Equalizer & Buttons */}
        <div className="flex items-center gap-3">
          {/* Animated Waveform Equalizer */}
          <div className="flex items-end gap-1 h-6 px-2.5 bg-slate-100 rounded-lg">
            <span
              className={`w-1 rounded-full bg-emerald-600 transition-all ${
                isSpeaking ? "animate-sound-bar-1" : "h-2 bg-slate-300"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-600 transition-all ${
                isSpeaking ? "animate-sound-bar-2" : "h-3.5 bg-slate-300"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-600 transition-all ${
                isSpeaking ? "animate-sound-bar-3" : "h-1.5 bg-slate-300"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-600 transition-all ${
                isSpeaking ? "animate-sound-bar-4" : "h-3 bg-slate-300"
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-600 transition-all ${
                isSpeaking ? "animate-sound-bar-5" : "h-2 bg-slate-300"
              }`}
            />
          </div>

          {/* Speed Selector */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium text-slate-600">
            {[1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setRate(spd)}
                className={`px-2 py-1 rounded transition-colors ${
                  rate === spd
                    ? "bg-white text-slate-900 font-bold shadow-2xs"
                    : "hover:text-slate-900"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Play/Stop Button */}
          <button
            onClick={togglePlayPause}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs active:scale-95 ${
              isSpeaking
                ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Play Briefing
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript Accordion */}
      <div className="mt-3 border-t border-slate-100 pt-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1 hover:text-slate-800 transition-colors font-medium"
          >
            {showTranscript ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            <span>{showTranscript ? "Hide Transcript" : "View Spoken Transcript"}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-slate-800 transition-colors text-[11px]"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {showTranscript && (
          <div className="mt-2.5 rounded-xl bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700 border border-slate-200">
            {spokenText || "No summary text generated yet."}
          </div>
        )}
      </div>
    </div>
  );
}
