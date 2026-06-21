import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BookingStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};

const statusLabels: Record<BookingStatus, string> = {
  pending_payment: "Menunggu Pembayaran",
  payment_submitted: "Bukti Dikirim",
  confirmed: "Dikonfirmasi",
  ready_to_pickup: "Siap Diambil",
  ongoing: "Sedang Disewa",
  returned: "Dikembalikan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const statusColors: Record<BookingStatus, string> = {
  pending_payment: "status-pending-payment",
  payment_submitted: "status-payment-submitted",
  confirmed: "status-confirmed",
  ready_to_pickup: "status-ready-to-pickup",
  ongoing: "status-ongoing",
  returned: "status-returned",
  completed: "status-completed",
  cancelled: "status-cancelled",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch booking counts by status
  const { data: bookings } = await supabase
    .from("bookings")
    .select("status");

  const counts = (bookings ?? []).reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalBookings = bookings?.length ?? 0;
  const activeStatuses: BookingStatus[] = [
    "pending_payment",
    "payment_submitted",
    "confirmed",
    "ready_to_pickup",
    "ongoing",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan booking masuk hari ini.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-2 rounded-xl border border-border bg-card p-5 sm:col-span-1">
          <p className="text-sm text-muted-foreground">Total Booking</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{totalBookings}</p>
        </div>
        {activeStatuses.map((status) => (
          <div key={status} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{statusLabels[status]}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {counts[status] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Setup notice if no data */}
      {totalBookings === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Belum ada booking masuk.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Setelah pelanggan mengisi form booking, data akan muncul di sini.
          </p>
        </div>
      )}
    </div>
  );
}
