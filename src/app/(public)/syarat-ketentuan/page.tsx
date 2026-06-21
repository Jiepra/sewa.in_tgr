import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan penyewaan alat gunung dan camping sewa_in.tgr.",
};

const sections = [
  {
    id: "ketentuan",
    title: "1. Ketentuan Sewa",
    items: [
      "Penyewa wajib memberikan jaminan KTP atau SIM yang masih berlaku saat pengambilan barang.",
      "Minimal durasi sewa adalah 1 hari.",
      "Barang harus dikembalikan sesuai tanggal yang disepakati.",
      "Keterlambatan pengembalian akan dikenakan biaya tambahan per hari.",
      "Penyewa bertanggung jawab atas alat selama masa penyewaan.",
    ],
  },
  {
    id: "pembayaran",
    title: "2. Pembayaran",
    items: [
      "DP minimal 50% dari total sewa wajib dibayarkan di awal.",
      "Pembayaran melalui transfer bank BCA: 7435614914 a/n MUHAMMAD SAHWAL.",
      "Bukti transfer wajib diupload melalui website setelah transfer.",
      "Booking dianggap valid setelah admin mengkonfirmasi pembayaran.",
      "Sisa pembayaran dilunasi saat pengembalian barang.",
    ],
  },
  {
    id: "kerusakan",
    title: "3. Kerusakan & Kehilangan",
    items: [
      "Kerusakan atau kehilangan barang sepenuhnya menjadi tanggung jawab penyewa.",
      "Biaya penggantian sesuai harga pasar barang yang rusak atau hilang.",
      "Penyewa wajib melaporkan kerusakan segera, tidak menunggu pengembalian.",
      "Alat yang dikembalikan dalam kondisi kotor berlebihan dapat dikenakan biaya kebersihan.",
    ],
  },
  {
    id: "pembatalan",
    title: "4. Pembatalan",
    items: [
      "Pembatalan booking sebelum konfirmasi admin: pengembalian dana penuh.",
      "Pembatalan setelah konfirmasi admin: kebijakan refund ditentukan admin toko.",
      "Booking yang tidak diambil tanpa pemberitahuan dianggap hangus.",
    ],
  },
];

export default function SyaratKetentuanPage() {
  return (
    <section className="section-padding">
      <div className="container-page max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">
            Syarat &amp; Ketentuan
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Dengan melakukan booking, penyewa dianggap telah membaca, memahami,
            dan menyetujui seluruh syarat dan ketentuan berikut.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-primary/5 border border-primary/20 p-6 text-center space-y-3">
          <p className="text-sm font-medium text-foreground">
            Setuju dengan syarat &amp; ketentuan di atas?
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            Mulai Booking Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
