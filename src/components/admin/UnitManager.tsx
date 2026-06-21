"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ItemUnit, ItemCondition, ItemUnitStatus } from "@/types/database";

interface UnitManagerProps {
  itemId: string;
  initialUnits: ItemUnit[];
}

const conditionOptions = [
  { value: "good", label: "Bagus (Good)" },
  { value: "maintenance", label: "Perawatan (Maintenance)" },
  { value: "damaged", label: "Rusak (Damaged)" },
  { value: "lost", label: "Hilang (Lost)" },
];

const statusOptions = [
  { value: "available", label: "Tersedia" },
  { value: "rented", label: "Disewa" },
  { value: "maintenance", label: "Perawatan" },
  { value: "unavailable", label: "Tidak Tersedia" },
];

export default function UnitManager({ itemId, initialUnits }: UnitManagerProps) {
  const router = useRouter();
  const [units, setUnits] = useState<ItemUnit[]>(initialUnits);
  const [newUnitCode, setNewUnitCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleAddUnit(e: React.FormEvent) {
    e.preventDefault();
    if (!newUnitCode.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: itemId,
          unit_code: newUnitCode.trim().toUpperCase(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Gagal menambah unit", {
          description: json.error ?? "Terjadi kesalahan.",
        });
        return;
      }

      toast.success(`Unit ${newUnitCode.toUpperCase()} ditambahkan!`);
      setNewUnitCode("");
      setUnits((prev) => [...prev, json.unit]);
      router.refresh();
    } catch {
      toast.error("Kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateUnit(
    unitId: string,
    updates: { condition?: ItemCondition; status?: ItemUnitStatus }
  ) {
    setUpdatingId(unitId);
    try {
      const res = await fetch(`/api/admin/units/${unitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Gagal memperbarui unit", {
          description: json.error ?? "Terjadi kesalahan.",
        });
        return;
      }

      setUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, ...updates } : u))
      );
      toast.success("Unit berhasil diperbarui!");
      router.refresh();
    } catch {
      toast.error("Kesalahan jaringan.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteUnit(unitId: string, code: string) {
    if (!confirm(`Apakah Anda yakin ingin menghapus unit fisik ${code}?`)) return;

    setUpdatingId(unitId);
    try {
      const res = await fetch(`/api/admin/units/${unitId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Gagal menghapus unit", {
          description: json.error ?? "Terjadi kesalahan.",
        });
        return;
      }

      setUnits((prev) => prev.filter((u) => u.id !== unitId));
      toast.success(`Unit ${code} berhasil dihapus.`);
      router.refresh();
    } catch {
      toast.error("Kesalahan jaringan.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h2 className="font-semibold text-foreground text-sm">Kelola Unit Fisik</h2>
          <p className="text-xs text-muted-foreground">
            Daftar serial/nomor unit unik barang sewa.
          </p>
        </div>
      </div>

      {/* Add unit form */}
      <form onSubmit={handleAddUnit} className="flex gap-2">
        <Input
          placeholder="Contoh: TD4-01, TD4-02..."
          value={newUnitCode}
          onChange={(e) => setNewUnitCode(e.target.value)}
          disabled={isLoading}
          className="max-w-xs text-sm"
        />
        <Button type="submit" disabled={isLoading || !newUnitCode.trim()} size="sm">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-1.5" />
          )}
          Tambah Unit
        </Button>
      </form>

      {/* List of units */}
      {units.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
          Belum ada unit fisik terdaftar untuk alat ini. Tambahkan unit terlebih dahulu.
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden text-xs">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30 font-semibold text-muted-foreground uppercase">
                <th className="py-2.5 px-4">Kode Unit</th>
                <th className="py-2.5 px-4">Kondisi Alat</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-muted/10">
                  <td className="py-2.5 px-4 font-mono font-semibold text-foreground">
                    {unit.unit_code}
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={unit.condition}
                      onChange={(e) =>
                        handleUpdateUnit(unit.id, { condition: e.target.value as ItemCondition })
                      }
                      disabled={updatingId === unit.id}
                      className="rounded border border-input bg-background px-2 py-0.5 text-xs shadow-sm transition-colors focus-visible:outline-none"
                    >
                      {conditionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={unit.status}
                      onChange={(e) =>
                        handleUpdateUnit(unit.id, { status: e.target.value as ItemUnitStatus })
                      }
                      disabled={updatingId === unit.id}
                      className="rounded border border-input bg-background px-2 py-0.5 text-xs shadow-sm transition-colors focus-visible:outline-none"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteUnit(unit.id, unit.unit_code)}
                      disabled={updatingId === unit.id}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      aria-label="Hapus unit"
                    >
                      {updatingId === unit.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
