import { formatCurrency } from "@/lib/utils/currency";
import { calculateDpAmount } from "@/lib/utils/booking";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import type { Item } from "@/types/database";

interface SelectedItem {
  item_id: string;
  quantity: number;
}

interface PriceSummaryProps {
  items: Item[];
  selected: SelectedItem[];
  rentalDays: number;
}

export default function PriceSummary({
  items,
  selected,
  rentalDays,
}: PriceSummaryProps) {
  const days = Math.max(rentalDays, 0);

  // Build line items
  const lineItems = selected
    .map((sel) => {
      const item = items.find((i) => i.id === sel.item_id);
      if (!item) return null;
      const subtotal = item.price_per_day * sel.quantity * Math.max(days, 1);
      return {
        name: item.name,
        quantity: sel.quantity,
        pricePerDay: item.price_per_day,
        subtotal,
      };
    })
    .filter(Boolean) as {
    name: string;
    quantity: number;
    pricePerDay: number;
    subtotal: number;
  }[];

  const total = lineItems.reduce((sum, li) => sum + li.subtotal, 0);
  const dp = calculateDpAmount(total);
  const remaining = total - dp;

  const hasItems = selected.length > 0;
  const hasDays = days >= 1;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 sticky top-20">
      <h3 className="font-semibold text-foreground">Ringkasan Harga</h3>

      {/* Duration info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Durasi sewa</span>
        <span className="font-medium text-foreground">
          {hasDays ? `${days} hari` : "—"}
        </span>
      </div>

      <Separator />

      {/* Line items */}
      {hasItems && hasDays ? (
        <div className="space-y-2">
          {lineItems.map((li) => (
            <div key={li.name} className="space-y-0.5">
              <div className="flex items-start justify-between gap-2 text-sm">
                <span className="text-foreground line-clamp-1 flex-1">
                  {li.name}
                </span>
                <span className="font-medium text-foreground shrink-0">
                  {formatCurrency(li.subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(li.pricePerDay)} × {li.quantity} pcs × {days} hari
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            {!hasItems
              ? "Pilih minimal 1 alat untuk melihat total harga."
              : "Pilih tanggal sewa untuk menghitung total."}
          </span>
        </div>
      )}

      {hasItems && hasDays && total > 0 && (
        <>
          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total sewa</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">DP minimal (50%)</span>
              <span className="font-semibold text-primary">
                {formatCurrency(dp)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sisa pelunasan</span>
              <span className="font-medium text-foreground">
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Bank info */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1 text-xs">
            <p className="font-semibold text-foreground">Transfer DP ke:</p>
            <p className="text-muted-foreground">Bank BCA</p>
            <p className="font-mono font-bold text-foreground text-sm">
              7435614914
            </p>
            <p className="text-muted-foreground">a/n MUHAMMAD SAHWAL</p>
          </div>
        </>
      )}
    </div>
  );
}
