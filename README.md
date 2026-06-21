# 🏕️ sewa_in.tgr — Rental Outdoor Equipment Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**sewa_in.tgr** adalah platform penyewaan alat gunung dan peralatan camping outdoor modern berbasis web yang berlokasi di **Pasar Kemis, Kabupaten Tangerang**. Sistem ini dirancang untuk mendigitalisasi proses pemesanan alat outdoor yang sebelumnya berbasis WhatsApp manual menjadi sistem pemesanan online terstruktur dengan kalkulasi harga otomatis, manajemen unit fisik alat, dan panel administrasi terintegrasi.

---

## ✨ Fitur Utama

### 👤 Portal Pelanggan (Public Portal)
* **Katalog Interaktif**: Jelajahi peralatan camping (tenda, carrier, sleeping gear, kompor) lengkap dengan spesifikasi, detail unit, dan status ketersediaan.
* **Kalkulator Booking Otomatis**: Formulir pemesanan cerdas yang menghitung total durasi sewa, total biaya sewa, serta nominal minimal DP 50% secara otomatis.
* **Sistem Jaminan Transparan**: Pelanggan memilih jenis jaminan fisik (KTP/SIM) yang akan diserahkan saat pengambilan alat.
* **Unggah Bukti Transaksi**: Setelah melakukan pembayaran manual via transfer bank, pelanggan dapat mengunggah bukti pembayaran langsung melalui halaman instruksi pembayaran.
* **Integrasi WhatsApp**: Tombol chat otomatis untuk memudahkan pelanggan berkonsultasi langsung dengan admin toko menggunakan template pesan otomatis.

### 🛡️ Dashboard Admin (Protected Admin Panel)
* **Keamanan Terproteksi**: Akses dashboard dilindungi secara ketat menggunakan **Supabase Authentication**.
* **Statistik Dashboard**: Informasi ringkas mengenai total pendapatan, jumlah pesanan aktif, total item sewa, dan antrean verifikasi pembayaran.
* **Manajemen Transaksi (Bookings)**:
  * Pelacakan status pemesanan lengkap (`pending_payment`, `payment_submitted`, `confirmed`, `rented`, `returned`, `cancelled`).
  * Verifikasi unggahan bukti pembayaran manual secara visual.
  * Pencarian instan pesanan berdasarkan kode booking dan nama penyewa.
* **Manajemen Inventaris Alat (Items)**:
  * Menambah, mengedit, dan menghapus data produk beserta foto produk (tersimpan di Supabase Storage).
  * Manajemen unit fisik alat individual (dilengkapi nomor seri, kondisi unit: *Good, Maintenance, Damaged, Lost*).

---

## 🛠️ Tech Stack

* **Core Framework**: [Next.js 15 (App Router)](https://nextjs.org/) dengan arsitektur Server & Client Components yang dioptimalkan.
* **Programming Language**: [TypeScript](https://www.typescriptlang.org/) dengan static-typing ketat untuk mengurangi bug saat runtime.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) untuk desain antarmuka modern yang responsif dan mobile-first.
* **Database & Backend Services**: [Supabase](https://supabase.com/) (PostgreSQL) terintegrasi dengan Row-Level Security (RLS) untuk perlindungan data.
* **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth) untuk sesi admin yang aman.
* **Cloud Storage**: [Supabase Storage](https://supabase.com/docs/guides/storage) untuk pengelolaan file gambar produk dan bukti transaksi pelanggan.
* **State & Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) untuk validasi formulir sisi klien dan server.

---

## 📂 Struktur Direktori Utama

```txt
src/
  app/
    (public)/           # Halaman Publik (Beranda, Katalog, Booking, S&K)
    admin/              # Panel Kontrol Admin (Login, Dashboard, Manajemen Transaksi, Inventaris)
    api/                # API Route Handler (Pembuatan Pesanan, Upload Bukti Transfer, Manajemen Alat)
  components/
    ui/                 # Komponen Dasar (Button, Dialog, Input, Badge, dst. via shadcn)
    layout/             # Navigasi & Footer Layout
    public/             # Komponen Halaman Pengunjung
    admin/              # Komponen Halaman Admin (Grafik, Form Alat, Tabel Booking)
    booking/            # Komponen Form & Kalkulasi Booking
    catalog/            # Tampilan Grid & Filter Katalog Produk
  lib/
    supabase/           # Klien Koneksi Supabase (Browser & Server)
    utils/              # Fungsi Utilitas (Kalkulator Harga, Format Rupiah, Format Tanggal)
    validations/        # Skema Validasi Zod (Form Booking, Form Produk)
  types/                # Definisi Type TypeScript & Skema Database
```

---

## 🚀 Panduan Memulai (Lokal)

### 1. Klon Repositori & Instal Dependensi
```bash
git clone https://github.com/Jiepra/sewa.in_tgr.git
cd sewa.in_tgr/sewa-in-tgr
npm install
```

### 2. Konfigurasi Variabel Lingkungan
Salin contoh konfigurasi lingkungan ke file `.env.local`:
```bash
cp .env.example .env.local
```
Lengkapi nilai-nilai variabel lingkungan di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=62xxxxxxxxxx
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka halaman [http://localhost:3000](http://localhost:3000) pada browser Anda untuk melihat aplikasi berjalan.

---

## 🔒 Aturan Bisnis & Keamanan (Business Rules)

1. **Jaminan Transaksi**: Pengunjung memilih opsi KTP atau SIM secara digital. Dokumen fisik asli wajib diserahkan di basecamp saat pengambilan alat.
2. **Kalkulasi DP**: Nilai Down Payment (DP) minimal adalah **50%** dari total nilai sewa. Sisa pembayaran dilunasi saat serah terima barang.
3. **Pembayaran Manual**: Menggunakan metode transfer bank manual ke:
   * **Bank**: BCA
   * **No. Rekening**: `7435614914`
   * **Atas Nama**: MUHAMMAD SAHWAL
4. **Row-Level Security (RLS)**:
   * Pengunjung publik diizinkan membuat data pesanan (`insert` pada tabel `bookings`).
   * Pembacaan data seluruh riwayat sewa (`select` pada tabel `bookings`) dibatasi ketat hanya untuk admin yang telah terotentikasi.
   * File bukti pembayaran disimpan dalam bucket privat di mana akses hanya diberikan kepada admin melalui otorisasi token server-side.

---

## 🔗 Tautan Aplikasi
* **Situs Web Resmi**: [https://sewa.in-tgr.vercel.app](https://sewa-in-tgr.vercel.app) *(Sesuaikan dengan URL deployment production)*
* **Lokasi Toko (Google Maps)**: [Sewa.in_tgr Maps Link](https://www.google.com/maps/search/?api=1&query=Sewa.in_tgr,+Jalan+Taman+Kota+Jayakarta,+Sukaasih,+Kec.+Ps.+Kemis,+Kabupaten+Tangerang,+Banten+15560)

---
*Dibuat untuk mempermudah petualangan luar ruangan Anda secara aman, teratur, dan profesional.* 🌲🏕️
