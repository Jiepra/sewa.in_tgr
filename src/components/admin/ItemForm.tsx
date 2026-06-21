"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Upload, FileImage, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Item } from "@/types/database";

const quickCategories = [
  "Tenda",
  "Tas/Carrier",
  "Sepatu",
  "Sleeping Bag",
  "Alat Masak",
  "Aksesoris",
  "Lainnya",
];

const itemFormSchema = z.object({
  name: z.string().min(3, "Nama alat minimal 3 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter.").regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung."),
  category: z.string().min(2, "Kategori wajib diisi."),
  price_per_day: z.coerce.number().min(1, "Harga sewa minimal Rp 1."),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  initialData?: Item;
}

export default function ItemForm({ initialData }: ItemFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url ?? null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      category: initialData?.category ?? "",
      price_per_day: initialData?.price_per_day ?? 0,
      description: initialData?.description ?? "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const itemName = watch("name");
  const isSlugEditedManually = watch("slug") !== "";

  // Helper to slugify text
  function slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }

  // Auto-generate slug when name changes (unless it's an edit screen or slug was typed manually)
  useEffect(() => {
    if (!initialData && itemName && !isSlugEditedManually) {
      setValue("slug", slugify(itemName));
    }
  }, [itemName, setValue, initialData, isSlugEditedManually]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("File tidak valid", {
        description: "Hanya file gambar yang diperbolehkan.",
      });
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("File terlalu besar", {
        description: "Ukuran maksimal foto alat adalah 2MB.",
      });
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImagePreview(url);
  }

  function handleRemoveImage() {
    setFile(null);
    setImagePreview(null);
  }

  async function onSubmit(values: any) {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("category", values.category);
    formData.append("price_per_day", values.price_per_day.toString());
    formData.append("description", values.description ?? "");
    formData.append("is_active", values.is_active.toString());

    if (file) {
      formData.append("file", file);
    }
    if (initialData?.image_url) {
      formData.append("current_image_url", initialData.image_url);
    }

    try {
      const url = initialData ? `/api/admin/items/${initialData.id}` : "/api/admin/items";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(initialData ? "Gagal memperbarui alat" : "Gagal menambah alat", {
          description: json.error ?? "Terjadi kesalahan.",
        });
        return;
      }

      toast.success(initialData ? "Alat berhasil diperbarui" : "Alat berhasil ditambahkan");
      router.push("/admin/items");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: General Info Form */}
        <div className="md:col-span-2 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Nama Alat</label>
            <Input
              placeholder="Contoh: Tenda Dome 4 Orang"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Slug URL</label>
            <Input
              placeholder="contoh-tenda-dome-4-orang"
              {...register("slug")}
              disabled={isLoading}
              onChange={(e) => {
                setValue("slug", slugify(e.target.value));
              }}
            />
            <p className="text-[10px] text-muted-foreground">
              Slug digunakan sebagai alamat URL detail alat, contoh: /katalog/[slug]
            </p>
            {errors.slug && (
              <p className="text-xs font-medium text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Kategori</label>
            <Input
              placeholder="Masukkan kategori alat..."
              {...register("category")}
              disabled={isLoading}
            />
            {/* Quick selectors */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("category", c)}
                  className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs font-medium text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Harga Sewa / Hari (Rp)</label>
            <Input
              type="number"
              placeholder="Contoh: 35000"
              {...register("price_per_day")}
              disabled={isLoading}
            />
            {errors.price_per_day && (
              <p className="text-xs font-medium text-destructive">{errors.price_per_day.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Deskripsi Alat</label>
            <Textarea
              placeholder="Masukkan deskripsi lengkap mengenai spesifikasi, ukuran, atau panduan penggunaan alat..."
              rows={4}
              {...register("description")}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Right: Upload Image & Settings */}
        <div className="space-y-6">
          {/* Image Upload Box */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <label className="text-sm font-semibold text-foreground block">Foto Alat</label>
            
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors h-48">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <span className="text-xs font-medium text-foreground text-center">
                  Pilih foto alat
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Format gambar (Maks. 2MB)
                </span>
              </label>
            ) : (
              <div className="relative rounded-xl border border-border p-2 bg-muted/20 h-48 flex items-center justify-center overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview foto alat"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-white hover:bg-destructive/80 transition-colors shadow-md"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Visibility toggle */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Pengaturan Publik</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_active")}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-foreground block">
                  Tampilkan di Katalog
                </span>
                <span className="text-xs text-muted-foreground block leading-tight">
                  Jika dinonaktifkan, alat tidak akan muncul di katalog publik.
                </span>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              disabled={isLoading}
              onClick={() => router.push("/admin/items")}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl"
              disabled={isLoading}
              id="btn-save-item"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Alat"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
