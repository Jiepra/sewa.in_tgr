# sewa_in.tgr — Website Penyewaan Alat Gunung

Website penyewaan alat gunung dan camping untuk toko **sewa_in.tgr**.
Menggantikan proses booking manual melalui WhatsApp.

## Tech Stack

| Layer        | Technology                           |
|--------------|--------------------------------------|
| Framework    | Next.js 15 (App Router)              |
| Language     | TypeScript                           |
| Styling      | Tailwind CSS v4                      |
| UI Components| shadcn/ui                            |
| Database     | Supabase PostgreSQL                  |
| Auth         | Supabase Auth                        |
| Storage      | Supabase Storage                     |
| Forms        | React Hook Form + Zod                |
| Date         | date-fns                             |
| Icons        | lucide-react                         |
| Notification | sonner                               |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

```bash
cp .env.example .env.local
```

Isi nilai berikut di `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=62xxxxxxxxxx
```

### 3. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Jalankan isi file `database-schema.sql`
4. Buat Storage Buckets di dashboard:
   - `item-images` (Public)
   - `payment-proofs` (Private)

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Folder

```
src/
  app/
    katalog/          -> Katalog alat (Phase 4)
    booking/          -> Form booking (Phase 5)
    pembayaran/       -> Instruksi pembayaran (Phase 6)
    syarat-ketentuan/ -> S&K
    admin/
      login/          -> Admin login (Phase 7)
      dashboard/      -> Dashboard admin (Phase 8)
      bookings/       -> Manajemen booking (Phase 9)
      items/          -> Manajemen alat (Phase 10)
    api/
      bookings/       -> API route booking
      upload-payment-proof/ -> API upload bukti

  components/
    ui/               -> shadcn/ui components
    layout/           -> Navbar, Footer, etc.
    public/           -> Public-facing components
    admin/            -> Admin-specific components
    booking/          -> Booking form components
    catalog/          -> Catalog components

  lib/
    supabase/
      client.ts       -> Browser client
      server.ts       -> Server client + service client
    utils/
      currency.ts     -> formatCurrency
      date.ts         -> calculateRentalDays, formatDateId
      booking.ts      -> calculateBookingTotal, calculateDpAmount,
                         generateBookingCode, buildWhatsAppMessage
    validations/
      booking.schema.ts -> Zod schema form booking
      item.schema.ts    -> Zod schema form item

  types/
    database.ts       -> TypeScript types sesuai skema DB
```

## Development Phases

| Phase | Scope                          | Status     |
|-------|--------------------------------|------------|
| 0     | Project Setup                  | Done       |
| 1     | Documentation                  | Done       |
| 2     | Supabase Setup                 | Next       |
| 3     | Public Landing Page            | Pending    |
| 4     | Catalog                        | Pending    |
| 5     | Booking Form                   | Pending    |
| 6     | Payment & Proof Upload         | Pending    |
| 7     | Admin Auth                     | Pending    |
| 8     | Admin Dashboard                | Pending    |
| 9     | Booking Management             | Pending    |
| 10    | Item Management                | Pending    |
| 11    | Polish & SEO                   | Pending    |
| 12    | Deployment                     | Pending    |

## Business Rules

- DP minimal 50% dari total sewa
- Total harga dihitung otomatis, tidak bisa diisi manual
- Pembayaran via transfer BCA: 7435614914 a/n MUHAMMAD SAHWAL
- Status booking: pending_payment -> payment_submitted -> confirmed -> ...
- Jaminan: KTP atau SIM (diserahkan fisik saat pengambilan barang)
- Admin dashboard dilindungi Supabase Auth

## Deployment

```bash
npm run build
```

Deploy ke Vercel. Tambahkan environment variables di dashboard Vercel.
