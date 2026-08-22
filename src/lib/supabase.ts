import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Uses the service-role key, so this module must only ever be imported from
 * server code (API routes, server actions, server-only helpers). Never import
 * it into client components — the service-role key bypasses row-level security.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: SupabaseClient | null = null;

/**
 * Returns a singleton server-side Supabase client backed by the service-role
 * key. Throws if the required environment variables are missing.
 */
export function getServiceSupabase(): SupabaseClient {
  if (cached) return cached;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }

  cached = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cached;
}

/**
 * Convenience proxy that lazily calls getServiceSupabase().
 * Allows importing as `import { supabase } from "@/lib/supabase"` without
 * triggering an error at module-evaluation time when env vars are missing
 * (e.g. during `next build`).
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getServiceSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
