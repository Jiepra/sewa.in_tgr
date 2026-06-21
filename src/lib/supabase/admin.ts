/**
 * Supabase Admin Client — SERVICE ROLE
 *
 * ⚠️ SERVER-ONLY — Never import this in Client Components.
 * ⚠️ Uses SUPABASE_SERVICE_ROLE_KEY which bypasses all RLS policies.
 *
 * Use only in:
 * - API Route Handlers (app/api/*)
 * - Server Actions
 * - Admin-only server operations
 *
 * Do NOT use for public-facing reads that should be RLS-restricted.
 */

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "[supabase/admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Check your .env.local file."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      // Service role should not persist sessions
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
