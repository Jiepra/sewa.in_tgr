import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDateId } from "@/lib/utils/date";
import BookingSearchFilter from "@/components/admin/BookingSearchFilter";
import { Eye, Calendar, Package, AlertCircle } from "lucide-react";
import type { BookingStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Kelola Booking",
};

interface BookingsPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

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

export default async function AdminBookingsPage({
  searchParams,
}: BookingsPageProps) {
  const { search, status } = await searchParams;
  const supabase = await createClient();

  let customerIds: string[] = [];
  let hasSearchedCustomers = false;

  if (search) {
    const { data: matchedCustomers } = await supabase
      .from("customers")
      .select("id")
      .or(`name.ilike.%${search}%,phone.ilike.%${search}%`);

    if (matchedCustomers && matchedCustomers.length > 0) {
      customerIds = matchedCustomers.map((c) => c.id);
      hasSearchedCustomers = true;
    }
  }

  // Base query with join
  let query = supabase
    .from("bookings")
    .select(`
      *,
      customers ( name, phone )
    `)
    .order("created_at", { ascending: false });

  // Apply filters
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    if (hasSearchedCustomers && customerIds.length > 0) {
      const uuidList = customerIds.map((id) => `"${id}"`).join(",");
      query = query.or(`booking_code.ilike.%${search}%,customer_id.in.(${uuidList})`);
    } else {
      query = query.ilike("booking_code", `%${search}%`);
    }
  }

  const { data: bookings, error } = await query;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Booking</h1>
          <p className="text-sm text-muted-foreground">
            Daftar pesanan rental alat outdoor masuk.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <BookingSearchFilter />
      </Suspense>

      {/* Table / List */}
      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm font-medium text-destructive">
            Gagal mengambil data booking dari server.
          </p>
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center space-y-3">
          <Package className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-foreground">Booking Tidak Ditemukan</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {search || status
              ? "Tidak ada hasil yang sesuai dengan kueri pencarian atau filter status Anda."
              : "Belum ada pesanan booking yang dibuat."}
          </p>
        </div>
      ) : (
        <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-4 px-6">Kode Booking</th>
                  <th className="py-4 px-6">Pelanggan</th>
                  <th className="py-4 px-6">Tanggal Sewa</th>
                  <th className="py-4 px-6">Durasi</th>
                  <th className="py-4 px-6">Total Harga</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {bookings.map((booking) => {
                  const cust = booking.customers as unknown as {
                    name: string;
                    phone: string;
                  } | null;

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono font-semibold text-primary">
                        {booking.booking_code}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-foreground">
                          {cust?.name ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cust?.phone ?? "—"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDateId(booking.rental_start_date)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          s/d {formatDateId(booking.rental_end_date)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {booking.rental_days} hari
                      </td>
                      <td className="py-4 px-6 font-bold text-foreground">
                        {formatCurrency(booking.total_amount)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            statusBadgeStyles[booking.status as BookingStatus]
                          }`}
                        >
                          {statusLabels[booking.status as BookingStatus]}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          prefetch={false}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
