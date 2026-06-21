-- ============================================================
-- sewa_in.tgr — Supabase PostgreSQL Schema
-- Phase 2: Run this SQL in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- profiles
-- Linked to Supabase Auth users (admin only)
-- ============================================================
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  role       text not null default 'admin'
               check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- items
-- Rental catalog
-- ============================================================
create table if not exists items (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  category      text not null,
  description   text,
  price_per_day integer not null check (price_per_day > 0),
  image_url     text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_items_slug on items (slug);
create index if not exists idx_items_is_active on items (is_active);
create index if not exists idx_items_category on items (category);

-- ============================================================
-- item_units
-- Physical units of each item
-- ============================================================
create table if not exists item_units (
  id         uuid primary key default gen_random_uuid(),
  item_id    uuid not null references items(id) on delete cascade,
  unit_code  text not null,
  condition  text not null default 'good'
               check (condition in ('good', 'maintenance', 'damaged', 'lost')),
  status     text not null default 'available'
               check (status in ('available', 'rented', 'maintenance', 'unavailable')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_item_units_item_id on item_units (item_id);
create index if not exists idx_item_units_status on item_units (status);

-- ============================================================
-- customers
-- Customers who make bookings (no login required in MVP)
-- ============================================================
create table if not exists customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  address    text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_customers_phone on customers (phone);

-- ============================================================
-- bookings
-- Main booking records
-- ============================================================
create table if not exists bookings (
  id                 uuid primary key default gen_random_uuid(),
  booking_code       text not null unique,
  customer_id        uuid not null references customers(id),
  rental_start_date  date not null,
  rental_end_date    date not null,
  rental_days        integer not null check (rental_days >= 1),
  guarantee_type     text not null check (guarantee_type in ('KTP', 'SIM')),
  total_amount       integer not null check (total_amount > 0),
  dp_amount          integer not null check (dp_amount > 0),
  remaining_amount   integer not null check (remaining_amount >= 0),
  status             text not null default 'pending_payment'
                       check (status in (
                         'pending_payment',
                         'payment_submitted',
                         'confirmed',
                         'ready_to_pickup',
                         'ongoing',
                         'returned',
                         'completed',
                         'cancelled'
                       )),
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- Ensure end date is not before start date
  constraint chk_dates check (rental_end_date >= rental_start_date)
);

create index if not exists idx_bookings_booking_code on bookings (booking_code);
create index if not exists idx_bookings_customer_id on bookings (customer_id);
create index if not exists idx_bookings_status on bookings (status);
create index if not exists idx_bookings_created_at on bookings (created_at desc);

-- ============================================================
-- booking_items
-- Items included in each booking (price snapshot)
-- ============================================================
create table if not exists booking_items (
  id                      uuid primary key default gen_random_uuid(),
  booking_id              uuid not null references bookings(id) on delete cascade,
  item_id                 uuid not null references items(id),
  quantity                integer not null check (quantity >= 1),
  price_per_day_snapshot  integer not null check (price_per_day_snapshot > 0),
  subtotal                integer not null check (subtotal > 0),
  created_at              timestamptz not null default now()
);

create index if not exists idx_booking_items_booking_id on booking_items (booking_id);
create index if not exists idx_booking_items_item_id on booking_items (item_id);

-- ============================================================
-- payments
-- Payment records and proof uploads
-- ============================================================
create table if not exists payments (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references bookings(id) on delete cascade,
  payment_method  text not null default 'bank_transfer',
  amount          integer not null check (amount > 0),
  proof_url       text,
  status          text not null default 'pending'
                    check (status in ('pending', 'submitted', 'verified', 'rejected')),
  verified_by     uuid references profiles(id),
  verified_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists idx_payments_booking_id on payments (booking_id);
create index if not exists idx_payments_status on payments (status);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger trg_items_updated_at
  before update on items
  for each row execute function update_updated_at_column();

create or replace trigger trg_item_units_updated_at
  before update on item_units
  for each row execute function update_updated_at_column();

create or replace trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS
alter table profiles enable row level security;
alter table items enable row level security;
alter table item_units enable row level security;
alter table customers enable row level security;
alter table bookings enable row level security;
alter table booking_items enable row level security;
alter table payments enable row level security;

-- ── profiles ──
-- Only authenticated admin users can read/write profiles
create policy "Admins can read profiles"
  on profiles for select
  to authenticated
  using (true);

-- ── items ──
-- Public can read active items
create policy "Public can read active items"
  on items for select
  to anon, authenticated
  using (is_active = true);

-- Authenticated (admin) can do everything
create policy "Admins can manage items"
  on items for all
  to authenticated
  using (true)
  with check (true);

-- ── item_units ──
create policy "Public can read item units"
  on item_units for select
  to anon, authenticated
  using (true);

create policy "Admins can manage item units"
  on item_units for all
  to authenticated
  using (true)
  with check (true);

-- ── customers ──
-- Anyone can create (public booking)
create policy "Public can create customer"
  on customers for insert
  to anon, authenticated
  with check (true);

-- Authenticated (admin) can read all customers
create policy "Admins can read customers"
  on customers for select
  to authenticated
  using (true);

-- ── bookings ──
-- Public can create booking
create policy "Public can create booking"
  on bookings for insert
  to anon, authenticated
  with check (true);

-- Public can read their own booking by booking_code (via API route)
-- Note: customer lookup is handled server-side, not directly via RLS
create policy "Public can read booking by code"
  on bookings for select
  to anon, authenticated
  using (true);

-- Admin can manage all bookings
create policy "Admins can manage bookings"
  on bookings for all
  to authenticated
  using (true)
  with check (true);

-- ── booking_items ──
create policy "Public can create booking items"
  on booking_items for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can read booking items"
  on booking_items for select
  to anon, authenticated
  using (true);

create policy "Admins can manage booking items"
  on booking_items for all
  to authenticated
  using (true)
  with check (true);

-- ── payments ──
create policy "Public can create payment"
  on payments for insert
  to anon, authenticated
  with check (true);

create policy "Admins can manage payments"
  on payments for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Storage Buckets (run separately or via Supabase dashboard)
-- ============================================================
-- Create in Supabase dashboard > Storage:
-- 1. Bucket: "item-images"   → Public: true
-- 2. Bucket: "payment-proofs" → Public: false
-- ============================================================
