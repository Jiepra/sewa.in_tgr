"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
}

export default function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSelect(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const all = [null, ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
      {all.map((cat) => (
        <button
          key={cat ?? "semua"}
          onClick={() => handleSelect(cat)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
            activeCategory === cat
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
          aria-pressed={activeCategory === cat}
        >
          {cat ?? "Semua Alat"}
        </button>
      ))}
    </div>
  );
}
