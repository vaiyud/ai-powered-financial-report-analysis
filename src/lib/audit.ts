import { getServiceSupabase } from "@/lib/supabase";

/**
 * Feature 4.3 — Audit trail
 *
 * Records which document fields fed into a generated insight, so users can
 * trace an AI conclusion back to its source data. Logging is opt-in per user
 * via the `keep_audit_trail` flag in the `user_settings` table.
 */

export interface LogAuditResult {
  /** True when a row was written to `audit_trail`. */
  logged: boolean;
  /**
   * Why logging was skipped, when `logged` is false.
   * - "disabled": the user has audit logging turned off.
   * - "error": a Supabase read/write failed (details logged to console).
   */
  reason?: "disabled" | "error";
}

/**
 * Conditionally records an audit-trail entry for a generated insight.
 *
 * Reads `keep_audit_trail` from `user_settings`. When enabled, inserts a row
 * into `audit_trail` capturing the document, the kind of insight produced, the
 * source fields that informed it, and the current timestamp.
 *
 * This helper never throws — audit logging is a side concern and should not
 * break the analysis flow. Failures are logged and reported via the return
 * value.
 *
 * @param documentId   The document the insight was derived from.
 * @param insightType  A label for the kind of insight (e.g. "cash_flow_summary").
 * @param sourceFields The document fields that contributed to the insight.
 */
export async function logAudit(
  documentId: string,
  insightType: string,
  sourceFields: string[],
): Promise<LogAuditResult> {
  try {
    const supabase = getServiceSupabase();

    // 1. Check whether this workspace/user has audit logging enabled.
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("keep_audit_trail")
      .maybeSingle();

    if (settingsError) {
      console.error("logAudit: failed to read user_settings:", settingsError);
      return { logged: false, reason: "error" };
    }

    if (!settings?.keep_audit_trail) {
      return { logged: false, reason: "disabled" };
    }

    // 2. Insert the audit record.
    const { error: insertError } = await supabase.from("audit_trail").insert({
      document_id: documentId,
      insight_type: insightType,
      source_fields: sourceFields,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("logAudit: failed to insert audit_trail row:", insertError);
      return { logged: false, reason: "error" };
    }

    return { logged: true };
  } catch (err) {
    console.error("logAudit: unexpected error:", err);
    return { logged: false, reason: "error" };
  }
}
