import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { askAI } from "@/lib/ai";

export const runtime = "nodejs";

/**
 * POST /api/analysis/summary
 *
 * Body: { "document_id": string }
 *
 * Loads extracted_metrics for the given document, asks Gemini for a concise
 * executive summary, and stores the result in the documents.ai_summary column.
 * Returns the cached summary if one already exists.
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

  // 1. Check if a summary already exists for this document
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("ai_summary")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    return NextResponse.json(
      { error: "Document not found.", details: docError?.message },
      { status: 404 },
    );
  }

  // Return cached summary if already generated
  if (doc.ai_summary) {
    return NextResponse.json({ summary: doc.ai_summary, cached: true });
  }

  // 2. Load extracted metrics for this document
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

  // 3. Build prompt from metrics
  const metricsBlock = metrics
    .map(
      (m) =>
        `- ${m.label}: prior ${m.prior_value ?? "N/A"}, current ${m.current_value ?? "N/A"}, change ${m.change_pct != null ? `${m.change_pct}%` : "N/A"}`,
    )
    .join("\n");

  const prompt = `You are a senior financial analyst writing for a finance lead. Given the following extracted financial metrics for a reporting period, write a 2–3 sentence executive summary of the financial period, then add one sentence identifying the primary area requiring attention. Use a plain, professional tone. Do not use bullet points or headers — output only the paragraph.

Metrics:
${metricsBlock}

Summary:`;

  // 4. Call Gemini via askAI()
  let summary: string;
  try {
    summary = await askAI(prompt);
    summary = summary.trim();
  } catch (err) {
    return NextResponse.json(
      { error: "AI summary generation failed.", details: String(err) },
      { status: 502 },
    );
  }

  if (!summary) {
    return NextResponse.json(
      { error: "AI returned an empty summary." },
      { status: 502 },
    );
  }

  // 5. Store summary in the documents table
  const { error: updateError } = await supabase
    .from("documents")
    .update({ ai_summary: summary })
    .eq("id", documentId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to save summary.", details: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ summary, cached: false });
}
