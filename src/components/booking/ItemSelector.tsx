"use client";

import Image from "next/image";
import { Plus, Minus, CheckSquare, Square, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import type { Item } from "@/types/database";
import { cn } from "@/lib/utils";

interface SelectedItem {
  item_id: string;
  quantity: number;
}

interface ItemSelectorProps {
  items: Item[];
  selected: SelectedItem[];
  onToggle: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export default function ItemSelector({
  items,
  selected,
  onToggle,
  onQuantityChange,
}: ItemSelectorProps) {
  function getSelectedItem(itemId: string) {
    return selected.find((s) => s.item_id === itemId);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Belum ada alat tersedia. Hubungi admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const sel = getSelectedItem(item.id);
        const isSelected = !!sel;

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
            )}
            onClick={() => onToggle(item.id)}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onToggle(item.id);
              }
            }}
          >
            {/* Checkbox icon */}
            <div className="shrink-0 text-primary">
              {isSelected ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Image */}
            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">
                  🏕️
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">
                {item.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <p className="text-sm font-semibold text-primary mt-1">
                {formatCurrency(item.price_per_day)}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  / hari
                </span>
              </p>
            </div>

            {/* Quantity stepper */}
            {isSelected && (
              <div
                className="flex items-center gap-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() =>
                    onQuantityChange(item.id, Math.max(1, (sel?.quantity ?? 1) - 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={(sel?.quantity ?? 1) <= 1}
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">
                  {sel?.quantity ?? 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onQuantityChange(item.id, (sel?.quantity ?? 1) + 1)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
