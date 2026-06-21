"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldAlert, CheckCircle, XCircle, ArrowRightCircle } from "lucide-react";
import type { BookingStatus, PaymentStatus } from "@/types/database";

interface BookingActionsProps {
  bookingId: string;
  bookingStatus: BookingStatus;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
}

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: "pending_payment", label: "Menunggu Pembayaran" },
  { value: "payment_submitted", label: "Bukti Pembayaran Dikirim" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "ready_to_pickup", label: "Siap Diambil" },
  { value: "ongoing", label: "Sedang Disewa (Ongoing)" },
  { value: "returned", label: "Dikembalikan (Returned)" },
  { value: "completed", label: "Selesai (Completed)" },
  { value: "cancelled", label: "Dibatalkan (Cancelled)" },
];

export default function BookingActions({
  bookingId,
  bookingStatus,
  paymentId,
  paymentStatus,
}: BookingActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<BookingStatus>(bookingStatus);

  async function handleUpdateBookingStatus(newStatus: BookingStatus) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Gagal memperbarui status", {
          description: json.error ?? "Terjadi kesalahan.",
        });
        return;
      }

      setStatus(newStatus);
      toast.success("Status booking diperbarui!");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyPayment(approve: boolean) {
    if (!paymentId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verify: approve }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Gagal memproses verifikasi", {
          description: json.error ?? "Terjadi kesalahan.",
        });
        return;
      }

      toast.success(approve ? "Pembayaran berhasil diverifikasi!" : "Pembayaran ditolak.");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Verifikasi Pembayaran */}
      {paymentId && paymentStatus === "submitted" && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-4 dark:border-blue-900/40 dark:bg-blue-950/10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-foreground text-sm">
              Verifikasi Pembayaran Masuk
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Periksa bukti transfer dengan saksama di sebelah kiri sebelum
            menyetujui pembayaran ini.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleVerifyPayment(true)}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              Setujui (Konfirmasi)
            </button>
            <button
              onClick={() => handleVerifyPayment(false)}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-destructive/20 hover:bg-destructive/10 px-4 py-2.5 text-xs font-semibold text-destructive transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              Tolak Bukti
            </button>
          </div>
        </div>
      )}

      {/* 2. Update Status Alur */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm">Update Status Booking</h3>

        <div className="space-y-3">
          <select
            value={status}
            onChange={(e) => handleUpdateBookingStatus(e.target.value as BookingStatus)}
            disabled={isLoading}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Quick lifecycle helpers */}
          <div className="space-y-1.5 pt-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Alur Cepat Status:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {status === "confirmed" && (
                <button
                  onClick={() => handleUpdateBookingStatus("ready_to_pickup")}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Siap Diambil
                  <ArrowRightCircle className="h-3 w-3" />
                </button>
              )}
              {status === "ready_to_pickup" && (
                <button
                  onClick={() => handleUpdateBookingStatus("ongoing")}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Mulai Sewa (Ongoing)
                  <ArrowRightCircle className="h-3 w-3" />
                </button>
              )}
              {status === "ongoing" && (
                <button
                  onClick={() => handleUpdateBookingStatus("returned")}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Alat Dikembalikan (Returned)
                  <ArrowRightCircle className="h-3 w-3" />
                </button>
              )}
              {status === "returned" && (
                <button
                  onClick={() => handleUpdateBookingStatus("completed")}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 rounded bg-teal-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-teal-700"
                >
                  Selesaikan (Completed)
                  <CheckCircle className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
