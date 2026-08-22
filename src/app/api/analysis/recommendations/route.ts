import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { askAI } from "@/lib/ai";

export const runtime = "nodejs";

type Priority = "high" | "medium" | "low";

interface RecommendationFromAI {
  priority: Priority;
  category: string;
  title: string;
  detail: string;
  reasoning: string;
}

const VALID_PRIORITIES: Priority[] = ["high", "medium", "low"];

/**
 * POST /api/analysis/recommendations
 *
 * Body: { "document_id": string }
 *
 * Loads extracted_metrics and risks for the document, asks Gemini for
 * prioritized action recommendations referencing specific figures, and
 * inserts them into the recommendations table.
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

  // 1. Load extracted metrics
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
      { error: "No extracted metrics found. Run extract-metrics first." },
      { status: 422 },
    );
  }

  // 2. Load risks
  const { data: risks, error: risksError } = await supabase
    .from("risks")
    .select("severity, title, explanation, confidence, supporting_data")
    .eq("document_id", documentId);

  if (risksError) {
    return NextResponse.json(
      { error: "Failed to load risks.", details: risksError.message },
      { status: 500 },
    );
  }

  // 3. Build prompt
  const metricsBlock = metrics
    .map(
      (m) =>
        `- ${m.label}: prior=${m.prior_value ?? "N/A"}, current=${m.current_value ?? "N/A"}, change=${m.change_pct != null ? `${m.change_pct}%` : "N/A"}`,
    )
    .join("\n");

  const risksBlock =
    risks && risks.length > 0
      ? risks
          .map(
            (r) =>
              `- [${r.severity}] ${r.title}: ${r.explanation} (confidence: ${r.confidence}%)`,
          )
          .join("\n")
      : "No risks identified.";

  const prompt = `You are a senior financial advisor. Given the following financial metrics and identified risks for a reporting period, provide prioritized action recommendations. Each recommendation MUST reference specific figures from the metrics or risks provided — do NOT give generic financial advice.

Return ONLY a JSON array (no extra text, no markdown) with objects matching this schema:
{
  "priority": "high" | "medium" | "low",
  "category": "<category such as Cost Reduction, Revenue Growth, Risk Mitigation, Cash Management, etc.>",
  "title": "<short actionable title>",
  "detail": "<1-2 sentences describing the specific action to take>",
  "reasoning": "<1-2 sentences explaining why, referencing the specific numbers from metrics/risks>"
}

Order the array by priority (high first).

Metrics:
${metricsBlock}

Risks:
${risksBlock}

Return ONLY the JSON array:`;

  // 4. Call Gemini
  let aiResponse: string;
  try {
    aiResponse = await askAI(prompt);
  } catch (err) {
    return NextResponse.json(
      { error: "AI recommendation generation failed.", details: String(err) },
      { status: 502 },
    );
  }

  // 5. Parse response — strip markdown code fences if present
  let cleaned = aiResponse.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  cleaned = cleaned.trim();

  let recsRaw: RecommendationFromAI[];
  try {
    recsRaw = JSON.parse(cleaned);
    if (!Array.isArray(recsRaw)) {
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

  // 6. Validate and sanitize
  const recommendations: RecommendationFromAI[] = recsRaw
    .filter(
      (r) =>
        VALID_PRIORITIES.includes(r.priority) &&
        typeof r.category === "string" &&
        typeof r.title === "string" &&
        typeof r.detail === "string" &&
        typeof r.reasoning === "string",
    )
    .map((r) => ({
      priority: r.priority,
      category: r.category.slice(0, 100),
      title: r.title.slice(0, 200),
      detail: r.detail.slice(0, 1000),
      reasoning: r.reasoning.slice(0, 1000),
    }));

  // 7. Insert into recommendations table
  const rows = recommendations.map((r, idx) => ({
    document_id: documentId,
    priority: r.priority,
    category: r.category,
    title: r.title,
    detail: r.detail,
    reasoning: r.reasoning,
    sort_order: idx,
  }));

  const { error: insertError } = await supabase
    .from("recommendations")
    .insert(rows);

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save recommendations.", details: insertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, recommendations });
}
