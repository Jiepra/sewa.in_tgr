/**
 * Supabase Browser Client
 *
 * Use this client in Client Components (use client).
 * Do NOT use service role key here.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
