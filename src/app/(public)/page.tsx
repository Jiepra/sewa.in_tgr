import type { Metadata } from "next";
import Link from "next/link";
import {
  Mountain,
  Tent,
  Backpack,
  Wind,
  Flashlight,
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Star,
  Package,
  Clock,
  Banknote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "sewa_in.tgr — Sewa Alat Gunung & Camping Tangerang",
  description:
    "Sewa alat gunung dan camping berkualitas di Pasar Kemis, Kabupaten Tangerang. Tenda, sleeping bag, carrier, kompor, dan perlengkapan outdoor lainnya. Booking mudah, harga terjangkau, DP 50%.",
};

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const categories = [
  {
    icon: Tent,
    name: "Tenda",
    desc: "Tenda dome, tenda ultralight, flysheet untuk semua medan.",
  },
  {
    icon: Backpack,
    name: "Carrier & Tas",
    desc: "Carrier 60L, 80L, daypack, dan drybag untuk perjalananmu.",
  },
  {
    icon: Wind,
    name: "Sleeping Gear",
    desc: "Sleeping bag, matras, sleeping pad untuk tidur nyaman di alam.",
  },
  {
    icon: Flashlight,
    name: "Peralatan Lain",
    desc: "Kompor, nesting, headlamp, trekking pole, dan perlengkapan lainnya.",
  },
];

const steps = [
  {
    num: "01",
    title: "Pilih Alat",
    desc: "Lihat katalog alat yang tersedia, cek harga dan deskripsi.",
  },
  {
    num: "02",
    title: "Isi Form Booking",
    desc: "Isi data diri, tanggal sewa, pilih alat dan jumlah. Total otomatis terhitung.",
  },
  {
    num: "03",
    title: "Bayar DP",
    desc: "Transfer DP minimal 50% ke BCA 7435614914. Upload bukti transfer.",
  },
  {
    num: "04",
    title: "Ambil & Nikmati",
    desc: "Admin konfirmasi, kamu ambil alat dengan jaminan KTP/SIM. Selamat mendaki!",
  },
];

const benefits = [
  {
    icon: Package,
    title: "Alat Lengkap & Terawat",
    desc: "Semua alat dicek kondisinya sebelum dipinjamkan. Siap pakai, bersih, dan layak.",
  },
  {
    icon: Banknote,
    title: "Harga Terjangkau",
    desc: "Harga sewa per hari yang kompetitif. DP cukup 50%, sisa dibayar saat pengembalian.",
  },
  {
    icon: Clock,
    title: "Booking Mudah & Cepat",
    desc: "Tidak perlu antri atau chat manual. Booking online kapan saja, dari mana saja.",
  },
  {
    icon: ShieldCheck,
    title: "Terpercaya",
    desc: "Sudah melayani ratusan pendaki dan camper. Proses transparan, bukti pembayaran tersimpan rapi.",
  },
];

const terms = [
  "Jaminan KTP atau SIM berlaku diserahkan saat pengambilan alat.",
  "DP minimal 50% wajib ditransfer sebelum alat diambil.",
  "Keterlambatan pengembalian dikenakan biaya tambahan per hari.",
  "Kerusakan atau kehilangan alat menjadi tanggung jawab penyewa.",
];

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER ?? "";

  return (
    <main>
      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-[oklch(0.28_0.08_145)] min-h-[88vh] flex items-center">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, oklch(1 0 0) 1px, transparent 1px),
                              radial-gradient(circle at 75% 80%, oklch(1 0 0) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5" />

        <div className="container-page relative z-10 py-20">
          <div className="max-w-3xl space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/20">
              <Mountain className="h-4 w-4" />
              Penyewaan Alat Gunung &amp; Camping · Tangerang
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Lengkap.{" "}
              <span className="text-[oklch(0.88_0.12_85)]">Terjangkau.</span>
              <br />
              Siap Antar Petualanganmu.
            </h1>

            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              Sewa alat gunung dan camping di{" "}
              <strong className="text-white">sewa_in.tgr (Pasar Kemis, Tangerang)</strong>. Booking
              online, hitung harga otomatis, bayar DP, langsung ambil. Sesederhana itu.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/booking"
                id="hero-cta-booking"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5"
              >
                Booking Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/katalog"
                id="hero-cta-katalog"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                Lihat Katalog
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.75_0.15_145)]" />
                DP cukup 50%
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.75_0.15_145)]" />
                Transfer BCA
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.75_0.15_145)]" />
                Jaminan KTP / SIM
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.75_0.15_145)]" />
                Booking 24 jam
              </span>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40L0 60Z" fill="oklch(0.98 0.005 100)" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          KATEGORI ALAT
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              Apa yang bisa disewa
            </p>
            <h2 className="text-3xl font-bold text-foreground">
              Kategori Alat Tersedia
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Semua kebutuhan outdoor-mu ada di sini. Dari tenda hingga peralatan
              memasak, siap pakai dan terawat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                href="/katalog"
                key={cat.name}
                className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Lihat katalog <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Lihat Semua Alat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CARA SEWA
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-secondary/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              Mudah & cepat
            </p>
            <h2 className="text-3xl font-bold text-foreground">Cara Booking Sewa</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Tidak perlu repot chat WhatsApp. Booking online dalam 4 langkah mudah.
            </p>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.num} className="relative flex flex-col items-center text-center">
                  {/* Step number circle */}
                  <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-primary/10 z-10">
                    <span className="text-xl font-bold">{step.num}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/80 hover:-translate-y-0.5 transition-all"
            >
              Mulai Booking Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          KEUNGGULAN
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Kenapa sewa_in.tgr
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                Dipercaya Ratusan Pendaki &amp; Camper
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Dari basecamp kami di Pasar Kemis, Tangerang, kami melayani para pecinta alam yang ingin
                pengalaman outdoor tanpa harus membeli peralatan mahal. Alat
                terawat, proses rapi, harga masuk akal.
              </p>
              <div className="flex items-center gap-1 pt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  Dipercaya pelanggan setia
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SYARAT & KETENTUAN RINGKAS
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-muted/40">
        <div className="container-page max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              Penting untuk dibaca
            </p>
            <h2 className="text-3xl font-bold text-foreground">
              Syarat &amp; Ketentuan Singkat
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
            {terms.map((term, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{term}</p>
              </div>
            ))}

            <div className="pt-4 border-t border-border">
              <Link
                href="/syarat-ketentuan"
                className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
              >
                Baca syarat &amp; ketentuan lengkap →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHATSAPP CTA
      ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-gradient-to-br from-primary to-[oklch(0.28_0.08_145)]">
        <div className="container-page text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ada Pertanyaan? Hubungi Kami
          </h2>
          <p className="text-white/80 max-w-md mx-auto">
            Admin kami siap membantu via WhatsApp. Tanyakan ketersediaan alat,
            konfirmasi pembayaran, atau keperluan lainnya.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo sewa_in.tgr, saya ingin bertanya tentang penyewaan alat.")}`}
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-lg hover:bg-white/90 hover:-translate-y-0.5 transition-all"
              >
                <Phone className="h-4 w-4" />
                Chat WhatsApp Sekarang
              </a>
            )}
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              Atau Booking Online
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Payment info */}
          <div className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-6 py-3 text-sm text-white/90">
            <span className="font-medium">Transfer BCA:</span>
            <code className="font-mono font-bold text-white">7435614914</code>
            <span className="text-white/70">a/n MUHAMMAD SAHWAL</span>
          </div>
        </div>
      </section>
    </main>
  );
}
