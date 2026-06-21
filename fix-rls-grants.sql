-- ============================================================
-- fix-rls-grants.sql
-- Jalankan di Supabase SQL Editor setelah database-schema.sql
--
-- Fixes:
-- 1. service_role: "permission denied for table items"
--    → service_role butuh GRANT meski BYPASSRLS aktif
-- 2. anon: akses catalog public (is_active = true)
-- 3. authenticated: akses penuh untuk admin
-- ============================================================

-- ── Schema usage ──
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ────────────────────────────────────────────────────────────
-- profiles
-- ────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT ON TABLE public.profiles TO authenticated;

-- ────────────────────────────────────────────────────────────
-- items
-- ────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.items TO service_role;
GRANT ALL ON TABLE public.items TO authenticated;
-- anon hanya SELECT (RLS akan filter is_active = true)
GRANT SELECT ON TABLE public.items TO anon;

-- ────────────────────────────────────────────────────────────
-- item_units
-- ────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.item_units TO service_role;
GRANT ALL ON TABLE public.item_units TO authenticated;
GRANT SELECT ON TABLE public.item_units TO anon;

-- ────────────────────────────────────────────────────────────
-- customers
-- ────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.customers TO service_role;
GRANT ALL ON TABLE public.customers TO authenticated;
-- anon INSERT untuk booking flow
GRANT INSERT ON TABLE public.customers TO anon;

-- ────────────────────────────────────────────────────────────
-- bookings
-- ────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.bookings TO service_role;
GRANT ALL ON TABLE public.bookings TO authenticated;
-- anon INSERT + SELECT (cek status booking sendiri via booking_code)
GRANT INSERT, SELECT ON TABLE public.bookings TO anon;

-- ────────────────────────────────────────────────────────────
-- booking_items
-- ────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.booking_items TO service_role;
GRANT ALL ON TABLE public.booking_items TO authenticated;
GRANT INSERT, SELECT ON TABLE public.booking_items TO anon;

-- ────────────────────────────────────────────────────────────
-- payments
-- ────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.payments TO service_role;
GRANT ALL ON TABLE public.payments TO authenticated;
-- anon INSERT (upload bukti) + SELECT
GRANT INSERT, SELECT ON TABLE public.payments TO anon;

-- ────────────────────────────────────────────────────────────
-- Default privileges: tabel baru di masa depan
-- ────────────────────────────────────────────────────────────
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role, authenticated;

-- ============================================================
-- Verifikasi: jalankan query ini untuk cek hasilnya
-- ============================================================
-- SELECT grantee, table_name, privilege_type
-- FROM information_schema.role_table_grants
-- WHERE table_schema = 'public'
--   AND grantee IN ('anon', 'authenticated', 'service_role')
-- ORDER BY table_name, grantee, privilege_type;
