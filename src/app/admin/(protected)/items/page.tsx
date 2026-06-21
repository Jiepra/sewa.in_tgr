import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { Plus, Edit, Package, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Alat",
};

export default async function AdminItemsPage() {
  const supabase = await createClient();

  // Fetch all items with their units
  const { data: items, error } = await supabase
    .from("items")
    .select(`
      *,
      item_units ( id, status, condition )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Alat</h1>
          <p className="text-sm text-muted-foreground">
            Manajemen katalog barang sewa dan ketersediaan unit fisik.
          </p>
        </div>
        <Link
          href="/admin/items/new"
          id="btn-add-item"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Alat
        </Link>
      </div>

      {/* Error state */}
      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm font-medium text-destructive">
            Gagal mengambil data katalog alat.
          </p>
        </div>
      ) : !items || items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center space-y-3">
          <Package className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-foreground">Belum Ada Alat</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Katalog masih kosong. Klik tombol di atas untuk menambahkan alat baru ke persewaan Anda.
          </p>
        </div>
      ) : (
        <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-4 px-6">Alat</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Harga / Hari</th>
                  <th className="py-4 px-6">Ketersediaan Unit</th>
                  <th className="py-4 px-6">Status Publik</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {items.map((item) => {
                  const units = item.item_units ?? [];
                  const totalUnits = units.length;
                  const availableUnits = units.filter((u: any) => u.status === "available").length;

                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xl">🏕️</div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground block">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              /{item.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-foreground">
                        {formatCurrency(item.price_per_day)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-foreground">
                            {totalUnits} unit
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            ({availableUnits} tersedia)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {item.is_active ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 border border-green-200 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/50">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50">
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/items/${item.id}/edit`}
                          prefetch={false}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
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
