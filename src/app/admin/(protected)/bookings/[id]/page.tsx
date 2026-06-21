import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateId } from "@/lib/utils/date";
import BookingActions from "@/components/admin/BookingActions";
import { ArrowLeft, User, Phone, MapPin, Calendar, FileText, ExternalLink, ShieldCheck, HelpCircle, Package } from "lucide-react";
import type { BookingStatus, PaymentStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Detail Booking",
};

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusLabels: Record<BookingStatus, string> = {
  pending_payment: "Menunggu Pembayaran",
  payment_submitted: "Bukti Pembayaran Dikirim",
  confirmed: "Dikonfirmasi",
  ready_to_pickup: "Siap Diambil",
  ongoing: "Sedang Disewa",
  returned: "Dikembalikan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const statusBadgeStyles: Record<BookingStatus, string> = {
  pending_payment: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  payment_submitted: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50",
  confirmed: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50",
  ready_to_pickup: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50",
  ongoing: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50",
  returned: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50",
  completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/50",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  submitted: "Menunggu Verifikasi",
  verified: "Diverifikasi",
  rejected: "Ditolak",
};

export default async function AdminBookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch complete booking details
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      customers ( * ),
      booking_items ( *, items ( name, category, image_url ) ),
      payments ( * )
    `)
    .eq("id", id)
    .single();

  if (error || !booking) {
    notFound();
  }

  // Generate secure signed URL for payment proof if it exists
  let proofSignedUrl = "";
  const payment = booking.payments?.[0];
  if (payment?.proof_url) {
    const adminClient = createAdminClient();
    const { data } = await adminClient.storage
      .from("payment-proofs")
      .createSignedUrl(payment.proof_url, 300); // Valid for 5 minutes
    if (data) {
      proofSignedUrl = data.signedUrl;
    }
  }

  const cust = booking.customers as unknown as {
    name: string;
    phone: string;
    address: string;
  } | null;

  const isPdf = payment?.proof_url?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Daftar Booking
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">Detail Booking</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Booking {booking.booking_code}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                statusBadgeStyles[booking.status as BookingStatus]
              }`}
            >
              {statusLabels[booking.status as BookingStatus]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Dibuat pada {formatDateId(booking.created_at)} pukul{" "}
            {new Date(booking.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── LEFT: Booking Details ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Guarantee */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2 text-sm border-b border-border pb-3">
              <User className="h-4 w-4 text-primary" /> Informasi Penyewa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Nama Lengkap</span>
                <p className="font-medium text-foreground">{cust?.name ?? "—"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Nomor HP / WA</span>
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {cust?.phone ?? "—"}
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs text-muted-foreground">Alamat Lengkap</span>
                <p className="font-medium text-foreground flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  {cust?.address ?? "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Jaminan Dokumen</span>
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  {booking.guarantee_type} (Fisik)
                </p>
              </div>
            </div>
          </div>

          {/* Items Rented */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2 text-sm border-b border-border pb-3">
              <Package className="h-4 w-4 text-primary" /> Alat yang Disewa
            </h2>
            <div className="divide-y divide-border">
              {booking.booking_items?.map((bi: any) => (
                <div key={bi.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                      {bi.items?.image_url ? (
                        <Image
                          src={bi.items.image_url}
                          alt={bi.items.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl">🏕️</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm line-clamp-1">{bi.items?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(bi.price_per_day_snapshot)} × {bi.quantity} pcs
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">
                      {formatCurrency(bi.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment proof view */}
          {payment && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2 text-sm border-b border-border pb-3">
                <FileText className="h-4 w-4 text-primary" /> Bukti Pembayaran
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl">
                <div>
                  <span className="text-xs text-muted-foreground">Status Pembayaran</span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {paymentStatusLabels[payment.status as PaymentStatus]}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Jumlah Transfer</span>
                  <p className="font-semibold text-primary mt-0.5">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </div>

              {proofSignedUrl ? (
                <div className="space-y-3">
                  <span className="text-xs text-muted-foreground block">File Bukti Transfer:</span>
                  {isPdf ? (
                    <div className="rounded-xl border border-border bg-muted/40 p-5 text-center">
                      <FileText className="h-10 w-10 text-primary mx-auto mb-2" />
                      <p className="text-xs font-semibold text-foreground">Dokumen Bukti (PDF)</p>
                      <a
                        href={proofSignedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:underline"
                      >
                        Buka PDF di Tab Baru
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-xl overflow-hidden border border-border bg-muted">
                      <Image
                        src={proofSignedUrl}
                        alt="Bukti Transfer"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Belum ada file bukti transfer yang diupload.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: Pricing & Actions ── */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-foreground text-sm border-b border-border pb-3">
              Rincian Biaya
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durasi sewa</span>
                <span className="font-medium text-foreground">{booking.rental_days} hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Biaya</span>
                <span className="font-bold text-foreground">{formatCurrency(booking.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DP Minimal (50%)</span>
                <span className="font-bold text-primary">{formatCurrency(booking.dp_amount)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground font-semibold">Sisa Pelunasan</span>
                <span className="font-bold text-foreground">{formatCurrency(booking.remaining_amount)}</span>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <BookingActions
            bookingId={booking.id}
            bookingStatus={booking.status as BookingStatus}
            paymentId={payment?.id}
            paymentStatus={payment?.status as PaymentStatus}
          />
        </div>
      </div>
    </div>
  );
}
