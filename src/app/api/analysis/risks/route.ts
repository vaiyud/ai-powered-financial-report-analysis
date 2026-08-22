import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { askAI } from "@/lib/ai";

export const runtime = "nodejs";

type Severity = "high" | "medium" | "low";

interface SupportingDataPoint {
  label: string;
  from: number | null;
  to: number | null;
  change_pct: number | null;
}

interface RiskFromAI {
  severity: Severity;
  title: string;
  explanation: string;
  confidence: number;
  supporting_data: SupportingDataPoint[];
}

const VALID_SEVERITIES: Severity[] = ["high", "medium", "low"];

/**
 * POST /api/analysis/risks
 *
 * Body: { "document_id": string }
 *
 * Loads extracted_metrics for the document, asks Gemini to identify
 * financial risks supported by the numbers, and inserts them into the
 * risks table.
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

  // 1. Load extracted metrics for this document
  const { data: metrics, error: metricsError } = await supabase
    .from("extracted_metrics")
    .select("label, prior_value, current_value, change_pct")
    .eq("document_id", documentId);

  if (metricsError) {
    return NextResponse.json(
      { error: "Failed to load metrics.", details: metricsError.message },
      { status: 500 },
    );
  }

  if (!metrics || metrics.length === 0) {
    return NextResponse.json(
      { error: "No extracted metrics found for this document. Run extract-metrics first." },
      { status: 422 },
    );
  }

  // 2. Build prompt
  const metricsBlock = metrics
    .map(
      (m) =>
        `- ${m.label}: prior=${m.prior_value ?? "N/A"}, current=${m.current_value ?? "N/A"}, change=${m.change_pct != null ? `${m.change_pct}%` : "N/A"}`,
    )
    .join("\n");

  const prompt = `You are a financial risk analyst. Given the following extracted financial metrics for a reporting period, identify financial risks that are directly supported by the numbers provided. Do NOT invent risks that cannot be justified by these metrics.

Return ONLY a JSON array (no extra text, no markdown) with objects matching this schema:
{
  "severity": "high" | "medium" | "low",
  "title": "<short risk title>",
  "explanation": "<1-2 sentence explanation of the risk>",
  "confidence": <number 0-100 representing how confident you are>,
  "supporting_data": [{ "label": "<metric name>", "from": <prior_value or null>, "to": <current_value or null>, "change_pct": <percent change or null> }]
}

Metrics:
${metricsBlock}

Return ONLY the JSON array:`;

  // 3. Call Gemini
  let aiResponse: string;
  try {
    aiResponse = await askAI(prompt);
  } catch (err) {
    return NextResponse.json(
      { error: "AI risk analysis failed.", details: String(err) },
      { status: 502 },
    );
  }

  // 4. Parse response — strip markdown code fences if present
  let cleaned = aiResponse.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  cleaned = cleaned.trim();

  let risksRaw: RiskFromAI[];
  try {
    risksRaw = JSON.parse(cleaned);
    if (!Array.isArray(risksRaw)) {
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

  // 5. Validate and sanitize
  const risks: RiskFromAI[] = risksRaw
    .filter(
      (r) =>
        VALID_SEVERITIES.includes(r.severity) &&
        typeof r.title === "string" &&
        typeof r.explanation === "string" &&
        typeof r.confidence === "number",
    )
    .map((r) => ({
      severity: r.severity,
      title: r.title.slice(0, 200),
      explanation: r.explanation.slice(0, 1000),
      confidence: Math.max(0, Math.min(100, Math.round(r.confidence))),
      supporting_data: Array.isArray(r.supporting_data)
        ? r.supporting_data.map((sd) => ({
            label: String(sd.label ?? ""),
            from: sd.from ?? null,
            to: sd.to ?? null,
            change_pct: sd.change_pct ?? null,
          }))
        : [],
    }));

  // 6. Insert into risks table
  const rows = risks.map((r) => ({
    document_id: documentId,
    severity: r.severity,
    title: r.title,
    explanation: r.explanation,
    confidence: r.confidence,
    supporting_data: r.supporting_data,
  }));

  const { error: insertError } = await supabase.from("risks").insert(rows);

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save risks.", details: insertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, risks });
}
