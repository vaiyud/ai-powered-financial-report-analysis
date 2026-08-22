import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { askAI } from "@/lib/ai";

export const runtime = "nodejs";

interface MetricFromAI {
  label: string;
  prior_value: number | null;
  current_value: number | null;
}

interface ExtractedMetric extends MetricFromAI {
  change_pct: number | null;
}

const EXPECTED_LABELS = [
  "Revenue",
  "Operating Expenses",
  "Net Profit",
  "Assets",
  "Liabilities",
  "Cash Flow",
];

/**
 * POST /api/analysis/extract-metrics
 *
 * Body: { "document_id": string }
 *
 * Loads the document's raw_text from Supabase, asks Gemini to extract
 * financial metrics, computes change_pct in code, and stores results
 * in the extracted_metrics table.
 */
export async function POST(request: Request) {
  let body: { document_id?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const documentId = body.document_id;
  if (!documentId || typeof documentId !== "string") {
    return NextResponse.json(
      { error: "Field 'document_id' is required and must be a string." },
      { status: 400 },
    );
  }

  // 1. Load document raw_text from Supabase
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("raw_text")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    return NextResponse.json(
      { error: "Document not found.", details: docError?.message },
      { status: 404 },
    );
  }

  const rawText: string = doc.raw_text;
  if (!rawText || rawText.trim().length === 0) {
    return NextResponse.json(
      { error: "Document has no raw_text to analyze." },
      { status: 422 },
    );
  }

  // 2. Build prompt and call Gemini via askAI()
  const prompt = `You are a financial data extraction assistant. Analyze the following financial document text and extract these metrics: Revenue, Operating Expenses, Net Profit, Assets, Liabilities, and Cash Flow.

Return ONLY a JSON array (no extra text) with objects like:
{ "label": "<metric name>", "prior_value": <number or null>, "current_value": <number or null> }

Use numeric values only (no currency symbols, no commas). Use null if a value cannot be determined.

Document text:
---
${rawText}
---

Return ONLY the JSON array:`;

  let aiResponse: string;
  try {
    aiResponse = await askAI(prompt);
  } catch (err) {
    return NextResponse.json(
      { error: "AI extraction failed.", details: String(err) },
      { status: 502 },
    );
  }

  // 3. Parse response — strip markdown code fences if present
  let cleaned = aiResponse.trim();
  // Remove ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  cleaned = cleaned.trim();

  let metricsRaw: MetricFromAI[];
  try {
    metricsRaw = JSON.parse(cleaned);
    if (!Array.isArray(metricsRaw)) {
      throw new Error("Response is not an array.");
    }
  } catch (parseErr) {
    return NextResponse.json(
      {
        error: "Failed to parse AI response as JSON.",
        raw: aiResponse,
        details: String(parseErr),
      },
      { status: 502 },
    );
  }

  // 4. Compute change_pct manually — never trust model percentages
  const metrics: ExtractedMetric[] = metricsRaw
    .filter((m) => EXPECTED_LABELS.includes(m.label))
    .map((m) => {
      let changePct: number | null = null;
      if (
        m.prior_value !== null &&
        m.prior_value !== 0 &&
        m.current_value !== null
      ) {
        changePct = parseFloat(
          (((m.current_value - m.prior_value) / Math.abs(m.prior_value)) * 100).toFixed(2),
        );
      }
      return {
        label: m.label,
        prior_value: m.prior_value,
        current_value: m.current_value,
        change_pct: changePct,
      };
    });

  // 5. Insert into extracted_metrics table
  const rows = metrics.map((m) => ({
    document_id: documentId,
    label: m.label,
    prior_value: m.prior_value,
    current_value: m.current_value,
    change_pct: m.change_pct,
  }));

  const { error: insertError } = await supabase
    .from("extracted_metrics")
    .insert(rows);

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save metrics.", details: insertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, metrics });
}
