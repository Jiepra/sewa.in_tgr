import { z } from "zod";

// ============================================================
// Item Form Schema (Admin) — Zod v4 compatible
// Used for adding/editing rental items.
// ============================================================

export const itemFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama alat minimal 2 karakter." })
    .max(100, { message: "Nama alat terlalu panjang." }),
  slug: z
    .string()
    .min(2, { message: "Slug minimal 2 karakter." })
    .max(100)
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    }),
  category: z.string().min(1, { message: "Kategori wajib diisi." }),
  description: z.string().max(2000).optional(),
  price_per_day: z
    .number({ error: "Harga harus berupa angka." })
    .int()
    .min(1000, { message: "Harga minimal Rp 1.000." }),
  is_active: z.boolean().default(true),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

// ============================================================
// Item Unit Schema (Admin) — Zod v4 compatible
// ============================================================

export const itemUnitFormSchema = z.object({
  unit_code: z
    .string()
    .min(1, { message: "Kode unit wajib diisi." })
    .max(50, { message: "Kode unit terlalu panjang." }),
  condition: z.enum(["good", "maintenance", "damaged", "lost"], {
    message: "Kondisi wajib dipilih.",
  }),
  status: z.enum(["available", "rented", "maintenance", "unavailable"], {
    message: "Status wajib dipilih.",
  }),
});

export type ItemUnitFormValues = z.infer<typeof itemUnitFormSchema>;
