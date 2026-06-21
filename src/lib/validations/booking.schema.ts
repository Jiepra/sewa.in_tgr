import { z } from "zod";

// ============================================================
// Booking Form Schema — Zod v4 compatible
// Validates the customer-facing booking form.
// ============================================================

const bookingItemSchema = z.object({
  item_id: z.string().uuid({ message: "Pilih alat yang valid." }),
  quantity: z
    .number({ error: "Jumlah harus berupa angka." })
    .int()
    .min(1, { message: "Jumlah minimal 1." }),
});

export const bookingFormSchema = z
  .object({
    // Customer Data
    name: z
      .string()
      .min(2, { message: "Nama minimal 2 karakter." })
      .max(100, { message: "Nama terlalu panjang." }),
    phone: z
      .string()
      .min(9, { message: "Nomor HP tidak valid." })
      .max(15, { message: "Nomor HP tidak valid." })
      .regex(/^[0-9+\-\s()]+$/, { message: "Nomor HP tidak valid." }),
    address: z
      .string()
      .min(10, { message: "Alamat minimal 10 karakter." })
      .max(500, { message: "Alamat terlalu panjang." }),

    // Rental Period
    rental_start_date: z.string().min(1, { message: "Tanggal sewa wajib diisi." }),
    rental_end_date: z.string().min(1, { message: "Tanggal pengembalian wajib diisi." }),

    // Guarantee
    guarantee_type: z.enum(["KTP", "SIM"], {
      message: "Pilih jenis jaminan.",
    }),

    // Items
    items: z
      .array(bookingItemSchema)
      .min(1, { message: "Pilih minimal 1 alat." }),

    // Notes
    notes: z.string().max(500, { message: "Catatan terlalu panjang." }).optional(),

    // Terms agreement
    agree_terms: z.literal(true, {
      message: "Kamu harus menyetujui Syarat & Ketentuan.",
    }),
  })
  .refine(
    (data) => {
      if (!data.rental_start_date || !data.rental_end_date) return true;
      return data.rental_end_date >= data.rental_start_date;
    },
    {
      message: "Tanggal pengembalian tidak boleh sebelum tanggal sewa.",
      path: ["rental_end_date"],
    }
  );

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
