import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ItemForm from "@/components/admin/ItemForm";
import UnitManager from "@/components/admin/UnitManager";
import type { ItemUnit } from "@/types/database";

export const metadata: Metadata = {
  title: "Edit Alat Persewaan",
};

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch item and its units
  const { data: item, error } = await supabase
    .from("items")
    .select(`
      *,
      item_units ( * )
    `)
    .eq("id", id)
    .single();

  if (error || !item) {
    notFound();
  }

  const initialUnits = (item.item_units ?? []) as ItemUnit[];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/items"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kelola Alat
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">Edit Alat</span>
      </div>

      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold text-foreground">Edit Alat: {item.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ubah informasi deskripsi, harga, foto, atau kelola unit fisik persediaan.
        </p>
      </div>

      <div className="space-y-10">
        {/* Core Item Form */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-4">Informasi Utama Alat</h3>
          <ItemForm initialData={item} />
        </div>

        {/* Physical Unit Management */}
        <div className="border-t border-border pt-8">
          <h3 className="text-sm font-bold text-foreground mb-4">Inventaris Unit Fisik</h3>
          <div className="max-w-3xl">
            <UnitManager itemId={item.id} initialUnits={initialUnits} />
          </div>
        </div>
      </div>
    </div>
  );
}
