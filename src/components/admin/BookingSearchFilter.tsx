"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BookingStatus } from "@/types/database";

const statusOptions: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "pending_payment", label: "Menunggu Pembayaran" },
  { value: "payment_submitted", label: "Bukti Pembayaran Dikirim" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "ready_to_pickup", label: "Siap Diambil" },
  { value: "ongoing", label: "Sedang Disewa" },
  { value: "returned", label: "Dikembalikan" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export default function BookingSearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");

  // Debounce search input changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, pathname, router, searchParams]);

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari kode booking, nama pelanggan, atau no HP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 w-full"
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-60">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
