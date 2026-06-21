import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Server-side health check using Supabase SERVICE ROLE (bypasses RLS).
 * Includes key diagnostics to help catch env var misconfiguration.
 *
 * ⚠️ Remove or protect this route before going to production.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  // Helper: show first 20 chars + "..." to help diagnose wrong key
  const preview = (key: string) =>
    key.length > 20 ? key.slice(0, 20) + "..." : key || "(empty)";

  // Service role JWT payload contains "role":"service_role"
  // Anon JWT payload contains "role":"anon"
  // We can decode the middle part of the JWT to detect this
  const detectRole = (jwt: string): string => {
    try {
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString("utf8")
      );
      return payload.role ?? "unknown";
    } catch {
      return "invalid_jwt";
    }
  };

  const checks: Record<string, boolean | string> = {
    env_supabase_url: !!supabaseUrl,
    env_anon_key: !!anonKey,
    env_service_key: !!serviceKey,
    env_site_url: !!process.env.NEXT_PUBLIC_SITE_URL,
    env_wa_number: !!process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER,
    database: false,
  };

  // ── Diagnostics (safe — no full key exposed) ──
  const diagnostics = {
    supabase_url_preview: supabaseUrl ? supabaseUrl.slice(0, 40) + "..." : "(empty)",
    anon_key_preview: preview(anonKey),
    anon_key_role: detectRole(anonKey),
    service_key_preview: preview(serviceKey),
    service_key_role: detectRole(serviceKey),
    // Flag if service key looks wrong
    service_key_looks_correct: detectRole(serviceKey) === "service_role",
    anon_and_service_same_key: anonKey === serviceKey,
  };

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
        checks,
        diagnostics,
      },
      { status: 500 }
    );
  }

  // Warn immediately if service key looks wrong
  if (!diagnostics.service_key_looks_correct) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "SUPABASE_SERVICE_ROLE_KEY does not appear to be a service role JWT. " +
          "Check your .env.local — you may have used the anon key instead. " +
          `Detected role: "${diagnostics.service_key_role}"`,
        checks,
        diagnostics,
      },
      { status: 500 }
    );
  }

  if (diagnostics.anon_and_service_same_key) {
    return NextResponse.json(
      {
        status: "error",
        message: "NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are identical. They must be different keys.",
        checks,
        diagnostics,
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("items").select("id").limit(1);

    if (error) {
      checks.database = `Error: ${error.message}`;
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed. Service role should bypass RLS — this may mean the table does not exist yet. Run database-schema.sql in Supabase SQL Editor.",
          checks,
          diagnostics,
        },
        { status: 500 }
      );
    }

    checks.database = true;

    return NextResponse.json({
      status: "ok",
      message: "sewa_in.tgr — Supabase connection is healthy.",
      checks,
      diagnostics,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    checks.database = `Exception: ${message}`;

    return NextResponse.json(
      { status: "error", message, checks, diagnostics },
      { status: 500 }
    );
  }
}
