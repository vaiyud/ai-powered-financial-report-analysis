"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Square, VolumeX } from "lucide-react";

/**
 * VoiceSummary
 *
 * Reads a condensed version of the financial analysis aloud using the
 * browser's built-in Web Speech API (window.speechSynthesis). Designed to
 * deliver a roughly 30-second spoken summary.
 *
 * Gracefully degrades when speech synthesis is unavailable, and cancels any
 * in-flight utterance on unmount so audio never outlives the component.
 */

interface VoiceSummaryProps {
  /** The final financial analysis text to summarize and read aloud. */
  summaryText: string;
  /**
   * Approximate spoken length target in words. At an average speaking rate of
   * ~150 wpm, ~75 words lands near 30 seconds. Defaults to 75.
   */
  maxWords?: number;
}

/**
 * Condenses raw analysis text into something short enough to speak in ~30s:
 * strips common markdown, collapses whitespace, and trims to the first few
 * sentences up to a word budget.
 */
function condense(text: string, maxWords: number): string {
  const cleaned = text
    // Strip markdown emphasis, headings, list markers, and inline code.
    .replace(/[#*_`>]/g, " ")
    // Drop markdown link syntax, keeping the visible label.
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Collapse all whitespace (including newlines) to single spaces.
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  // Prefer whole sentences: accumulate until we hit the word budget.
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

  // Hard cap as a fallback if a single sentence blew past the budget.
  const resultWords = result.split(/\s+/).filter(Boolean);
  if (resultWords.length > maxWords) {
    result = resultWords.slice(0, maxWords).join(" ") + "…";
  }

  return result;
}

type SupportState = "checking" | "supported" | "unsupported";

export default function VoiceSummary({
  summaryText,
  maxWords = 75,
}: VoiceSummaryProps) {
  const [support, setSupport] = useState<SupportState>("checking");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hold the current utterance so we can detach handlers during cleanup.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Detect Web Speech API support once, on mount.
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupport("supported");
    } else {
      setSupport("unsupported");
    }
  }, []);

  // Clear handlers off an utterance to avoid state updates after unmount.
  const detachUtterance = useCallback(() => {
    const u = utteranceRef.current;
    if (u) {
      u.onend = null;
      u.onerror = null;
      u.onstart = null;
      utteranceRef.current = null;
    }
  }, []);

  // Stop any speech and reset state.
  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    detachUtterance();
    setIsSpeaking(false);
  }, [detachUtterance]);

  // Cancel speech if the component unmounts (e.g. user navigates away).
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

    // Reset any prior speech before starting fresh.
    window.speechSynthesis.cancel();
    detachUtterance();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1;
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
  }, [summaryText, maxWords, detachUtterance]);

  const handleClick = useCallback(() => {
    if (isSpeaking) {
      stop();
    } else {
      play();
    }
  }, [isSpeaking, play, stop]);

  const hasText = summaryText.trim().length > 0;
  const disabled = support !== "supported" || !hasText;

  if (support === "unsupported") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
        <VolumeX className="h-4 w-4" aria-hidden="true" />
        Audio summary isn&apos;t supported in this browser.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isSpeaking}
      aria-label={isSpeaking ? "Pause or stop audio summary" : "Play audio summary"}
      className={
        "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 " +
        (isSpeaking
          ? "bg-slate-800 text-white hover:bg-slate-900 focus-visible:ring-slate-500"
          : "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500")
      }
    >
      {isSpeaking ? (
        <>
          <Square className="h-4 w-4" aria-hidden="true" />
          Pause / Stop
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          Play Audio Summary
        </>
      )}
    </button>
  );
}
