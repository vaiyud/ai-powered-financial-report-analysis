import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Feature 4.4 — Data minimization & auto-delete
 *
 * POST /api/documents/cleanup
 *
 * Purges the raw extracted text of a document once analysis is complete, when
 * the user has opted into automatic cleanup of temporary processing data.
 *
 * Body:
 *   { "documentId": string }
 *
 * Behavior:
 *   - Reads `auto_delete_temp` from `user_settings`.
 *   - If enabled, sets `documents.raw_text` to null for the given document.
 *   - If disabled, does nothing (still returns success).
 *
 * Response:
 *   { "success": true, "cleaned": boolean }
 */
export async function POST(request: Request) {
  let body: { documentId?: unknown };

  try {
    body = (await request.json()) as { documentId?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { documentId } = body;

  if (typeof documentId !== "string" || documentId.length === 0) {
    return NextResponse.json(
      { success: false, error: "Field 'documentId' is required and must be a string." },
      { status: 400 },
    );
  }

  try {
    const supabase = getServiceSupabase();

    // 1. Check whether automatic cleanup of temporary data is enabled.
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("auto_delete_temp")
      .maybeSingle();

    if (settingsError) {
      console.error("cleanup: failed to read user_settings:", settingsError);
      return NextResponse.json(
        { success: false, error: "Failed to read user settings." },
        { status: 500 },
      );
    }

    // 2. If the user hasn't opted in, leave the raw text untouched.
    if (!settings?.auto_delete_temp) {
      return NextResponse.json({ success: true, cleaned: false });
    }

    // 3. Purge the raw extracted text for this document.
    const { error: updateError } = await supabase
      .from("documents")
      .update({ raw_text: null })
      .eq("id", documentId);

    if (updateError) {
      console.error("cleanup: failed to clear raw_text:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to clear document raw text." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, cleaned: true });
  } catch (err) {
    console.error("cleanup: unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
