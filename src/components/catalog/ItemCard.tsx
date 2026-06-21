import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import type { Item } from "@/types/database";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder when no image */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
            <div className="text-5xl mb-2">🏕️</div>
            <p className="text-xs text-muted-foreground">Foto segera hadir</p>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground">
            <Tag className="h-3 w-3 text-primary" />
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
            {item.description}
          </p>
        )}

        <div className="pt-1 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Harga sewa</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(item.price_per_day)}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                / hari
              </span>
            </p>
          </div>

          <Link
            href={`/katalog/${item.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/80 transition-colors"
            aria-label={`Lihat detail ${item.name}`}
          >
            Detail
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
