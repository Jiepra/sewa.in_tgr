"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User, CalendarDays, ShieldCheck, FileText } from "lucide-react";

import { bookingFormSchema, type BookingFormValues } from "@/lib/validations/booking.schema";
import { calculateRentalDays } from "@/lib/utils/date";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import ItemSelector from "@/components/booking/ItemSelector";
import PriceSummary from "@/components/booking/PriceSummary";
import type { Item } from "@/types/database";

interface SelectedItem {
  item_id: string;
  quantity: number;
}

interface BookingFormProps {
  availableItems: Item[];
  preselectedItemId?: string;
}

// Section header helper
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="font-semibold text-foreground">{title}</h2>
    </div>
  );
}

export default function BookingForm({
  availableItems,
  preselectedItemId,
}: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() =>
    preselectedItemId ? [{ item_id: preselectedItemId, quantity: 1 }] : []
  );

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guarantee_type: undefined,
      items: preselectedItemId
        ? [{ item_id: preselectedItemId, quantity: 1 }]
        : [],
      agree_terms: undefined,
    },
  });

  const startDate = watch("rental_start_date");
  const endDate = watch("rental_end_date");
  const agreeTerms = watch("agree_terms");

  const rentalDays =
    startDate && endDate ? calculateRentalDays(startDate, endDate) : 0;

  // Keep form items in sync with selectedItems state
  useEffect(() => {
    setValue("items", selectedItems, { shouldValidate: false });
  }, [selectedItems, setValue]);

  const handleToggleItem = useCallback((itemId: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((s) => s.item_id === itemId);
      if (exists) {
        return prev.filter((s) => s.item_id !== itemId);
      }
      return [...prev, { item_id: itemId, quantity: 1 }];
    });
  }, []);

  const handleQuantityChange = useCallback(
    (itemId: string, quantity: number) => {
      setSelectedItems((prev) =>
        prev.map((s) => (s.item_id === itemId ? { ...s, quantity } : s))
      );
    },
    []
  );

  async function onSubmit(data: BookingFormValues) {
    if (selectedItems.length === 0) {
      toast.error("Pilih minimal 1 alat sebelum booking.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: selectedItems,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const errMsg =
          json?.error ?? "Gagal membuat booking. Coba lagi.";
        toast.error("Booking gagal", { description: errMsg });
        return;
      }

      toast.success("Booking berhasil dibuat!");
      router.push(`/pembayaran/${json.booking_code}`);
    } catch {
      toast.error("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start"
      noValidate
    >
      {/* ── LEFT: Form Fields ── */}
      <div className="space-y-8">

        {/* ── 1. Data Diri ── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <SectionHeader icon={User} title="Data Diri Penyewa" />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Contoh: Budi Santoso"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Nomor HP / WhatsApp <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Contoh: 08123456789"
                {...register("phone")}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">
                Alamat Lengkap <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                placeholder="Contoh: Jalan Taman Kota Jayakarta, Sukaasih, Kp. Picung, RT.05/RW.05, Kec. Ps. Kemis, Tangerang, Banten 15560"
                rows={3}
                {...register("address")}
                aria-invalid={!!errors.address}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. Tanggal Sewa ── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <SectionHeader icon={CalendarDays} title="Tanggal Sewa" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rental_start_date">
                Tanggal Sewa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rental_start_date"
                type="date"
                min={today}
                {...register("rental_start_date")}
                aria-invalid={!!errors.rental_start_date}
              />
              {errors.rental_start_date && (
                <p className="text-xs text-destructive">
                  {errors.rental_start_date.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rental_end_date">
                Tanggal Pengembalian <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rental_end_date"
                type="date"
                min={startDate || today}
                {...register("rental_end_date")}
                aria-invalid={!!errors.rental_end_date}
              />
              {errors.rental_end_date && (
                <p className="text-xs text-destructive">
                  {errors.rental_end_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Duration badge */}
          {startDate && endDate && rentalDays >= 1 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <CalendarDays className="h-4 w-4" />
              Durasi: {rentalDays} hari
            </div>
          )}
        </div>

        {/* ── 3. Pilih Alat ── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <SectionHeader icon={FileText} title="Pilih Alat yang Disewa" />

          {errors.items && (
            <p className="mb-3 text-xs text-destructive">
              {errors.items.message ?? errors.items.root?.message}
            </p>
          )}

          <ItemSelector
            items={availableItems}
            selected={selectedItems}
            onToggle={handleToggleItem}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        {/* ── 4. Jaminan & Catatan ── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <SectionHeader icon={ShieldCheck} title="Jaminan & Catatan" />

          <div className="space-y-5">
            {/* Guarantee type */}
            <div className="space-y-2">
              <Label>
                Jenis Jaminan <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Dokumen fisik diserahkan saat pengambilan alat.
              </p>
              <div className="flex gap-3">
                {(["KTP", "SIM"] as const).map((type) => (
                  <label
                    key={type}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                      watch("guarantee_type") === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      className="sr-only"
                      {...register("guarantee_type")}
                    />
                    <ShieldCheck className="h-4 w-4" />
                    {type}
                  </label>
                ))}
              </div>
              {errors.guarantee_type && (
                <p className="text-xs text-destructive">
                  {errors.guarantee_type.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Catatan Tambahan (opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Misal: butuh sleeping bag ukuran XL, atau ada permintaan khusus."
                rows={3}
                {...register("notes")}
              />
            </div>
          </div>
        </div>

        {/* ── 5. Persetujuan S&K ── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree_terms"
              checked={agreeTerms === true}
              onCheckedChange={(checked) => {
                setValue("agree_terms", checked === true ? true : (undefined as unknown as true), {
                  shouldValidate: true,
                });
              }}
              aria-invalid={!!errors.agree_terms}
            />
            <div className="space-y-1">
              <label
                htmlFor="agree_terms"
                className="text-sm font-medium text-foreground cursor-pointer leading-none"
              >
                Saya menyetujui{" "}
                <Link
                  href="/syarat-ketentuan"
                  target="_blank"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Syarat &amp; Ketentuan
                </Link>{" "}
                yang berlaku.
              </label>
              {errors.agree_terms && (
                <p className="text-xs text-destructive">
                  {errors.agree_terms.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit (mobile — below form) */}
        <div className="lg:hidden">
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>

      {/* ── RIGHT: Price Summary + Submit (desktop) ── */}
      <div className="space-y-4">
        <PriceSummary
          items={availableItems}
          selected={selectedItems}
          rentalDays={rentalDays}
        />
        <div className="hidden lg:block">
          <SubmitButton isLoading={isLoading} />
        </div>
      </div>
    </form>
  );
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      id="btn-submit-booking"
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/80 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Memproses Booking...
        </>
      ) : (
        "Kirim Booking"
      )}
    </button>
  );
}
