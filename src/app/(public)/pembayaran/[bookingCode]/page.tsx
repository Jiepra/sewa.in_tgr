import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateId } from "@/lib/utils/date";
import {
  CheckCircle2,
  Phone,
  ArrowRight,
  CalendarDays,
  Package,
} from "lucide-react";
import CopyButton from "@/components/public/CopyButton";
import PaymentProofUploader from "@/components/booking/PaymentProofUploader";

export const metadata: Metadata = {
  title: "Instruksi Pembayaran",
};

interface PaymentPageProps {
  params: Promise<{ bookingCode: string }>;
}

export default async function PaymentInstructionPage({
  params,
}: PaymentPageProps) {
  const { bookingCode } = await params;
  const supabase = await createClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      customers ( name, phone ),
      booking_items ( *, items ( name ) ),
      payments ( status, proof_url )
    `)
    .eq("booking_code", bookingCode)
    .single();

  if (error || !booking) {
    notFound();
  }

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER ?? "";
  const waMessage = encodeURIComponent(
    `Halo sewa_in.tgr, saya sudah transfer DP untuk booking:\n\nKode: ${bookingCode}\nNama: ${booking.customers?.name}\nJumlah DP: ${formatCurrency(booking.dp_amount)}\n\nMohon dikonfirmasi. Terima kasih!`
  );

  return (
    <section className="section-padding">
      <div className="container-page max-w-2xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Booking Berhasil Dibuat!
          </h1>
          <p className="text-muted-foreground">
            Selesaikan pembayaran DP untuk mengkonfirmasi booking kamu.
          </p>
        </div>

        {/* Booking code */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Kode Booking</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold font-mono text-primary">
              {bookingCode}
            </span>
            <CopyButton text={bookingCode} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Simpan kode ini untuk keperluan konfirmasi.
          </p>
        </div>

        {/* Booking detail */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-4 space-y-4">
          <h2 className="font-semibold text-foreground">Detail Booking</h2>

          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-muted-foreground">Nama</span>
            <span className="font-medium text-foreground text-right">
              {booking.customers?.name}
            </span>

            <span className="text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> Tanggal Sewa
            </span>
            <span className="font-medium text-foreground text-right">
              {formatDateId(booking.rental_start_date)}
            </span>

            <span className="text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> Tanggal Kembali
            </span>
            <span className="font-medium text-foreground text-right">
              {formatDateId(booking.rental_end_date)}
            </span>

            <span className="text-muted-foreground">Durasi</span>
            <span className="font-medium text-foreground text-right">
              {booking.rental_days} hari
            </span>

            <span className="text-muted-foreground flex items-center gap-1">
              <Package className="h-3.5 w-3.5" /> Alat
            </span>
            <span className="font-medium text-foreground text-right">
              {booking.booking_items
                ?.map(
                  (bi: { items: { name: string } | null; quantity: number }) =>
                    `${bi.items?.name} (${bi.quantity})`
                )
                .join(", ")}
            </span>
          </div>
        </div>

        {/* Payment instruction */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-4 space-y-4">
          <h2 className="font-semibold text-foreground">Instruksi Pembayaran DP</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sewa</span>
              <span className="font-semibold">{formatCurrency(booking.total_amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">DP yang Harus Dibayar</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(booking.dp_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sisa Pelunasan</span>
              <span className="font-medium">{formatCurrency(booking.remaining_amount)}</span>
            </div>
          </div>

          <div className="rounded-xl bg-background border border-border p-4 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Transfer ke:
            </p>
            <p className="text-sm text-muted-foreground">Bank BCA</p>
            <p className="text-xl font-mono font-bold text-foreground">
              7435614914
            </p>
            <p className="text-sm text-muted-foreground">a/n MUHAMMAD SAHWAL</p>
          </div>

          <p className="text-xs text-muted-foreground">
            Booking hanya dianggap valid setelah admin mengkonfirmasi pembayaran.
            Harap upload bukti transfer di bawah ini.
          </p>
        </div>

        {/* Upload proof + WhatsApp */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Langkah Selanjutnya</h2>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <p>Transfer DP sebesar <strong className="text-foreground">{formatCurrency(booking.dp_amount)}</strong> ke BCA 7435614914.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </span>
              <div className="flex-1 space-y-3">
                <p>Upload bukti transfer di bawah ini:</p>
                <PaymentProofUploader
                  bookingCode={bookingCode}
                  bookingStatus={booking.status}
                  paymentStatus={booking.payments?.[0]?.status}
                />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                3
              </span>
              <p>Setelah upload, Anda dapat melakukan konfirmasi tambahan ke admin via WhatsApp.</p>
            </div>
          </div>

          {waNumber && (
            <a
              href={`https://wa.me/${waNumber}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              id="payment-wa-confirm"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Konfirmasi via WhatsApp
            </a>
          )}

          <Link
            href="/katalog"
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border py-3.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Kembali ke Katalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
