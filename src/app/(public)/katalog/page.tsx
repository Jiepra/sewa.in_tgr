import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ItemCard from "@/components/catalog/ItemCard";
import CategoryFilter from "@/components/catalog/CategoryFilter";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Katalog Alat Sewa",
  description:
    "Lihat semua alat gunung dan camping yang tersedia untuk disewa. Tenda, carrier, sleeping bag, kompor, dan perlengkapan outdoor lainnya.",
};

interface KatalogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function KatalogPage({ searchParams }: KatalogPageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  // Fetch all active items (RLS: anon can only read is_active = true)
  let query = supabase
    .from("items")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: items, error } = await query;

  // Fetch distinct categories from active items for filter
  const { data: categoryRows } = await supabase
    .from("items")
    .select("category")
    .eq("is_active", true)
    .order("category");

  const categories: string[] = [
    ...new Set((categoryRows ?? []).map((r) => r.category as string)),
  ];

  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Katalog Alat</h1>
          <p className="mt-2 text-muted-foreground">
            Semua alat gunung dan camping yang tersedia untuk disewa.
          </p>
        </div>

        {/* Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <Suspense fallback={null}>
              <CategoryFilter
                categories={categories}
                activeCategory={category ?? null}
              />
            </Suspense>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm font-medium text-destructive">
              Gagal memuat katalog. Coba refresh halaman.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!error && (!items || items.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">
              {category ? `Tidak ada alat dalam kategori "${category}"` : "Belum ada alat tersedia"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {category
                ? "Coba pilih kategori lain atau lihat semua alat."
                : "Katalog sedang dipersiapkan. Hubungi admin untuk informasi ketersediaan."}
            </p>
          </div>
        )}

        {/* Item Grid */}
        {items && items.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">{items.length}</span>{" "}
              alat{category ? ` dalam kategori "${category}"` : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
