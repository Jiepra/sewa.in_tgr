import { Loader2 } from "lucide-react";

export default function EditItemLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumbs Placeholder */}
      <div className="h-4 w-32 bg-muted rounded-md" />

      {/* Header Placeholder */}
      <div className="border-b border-border pb-5">
        <div className="h-8 w-80 bg-muted rounded-lg" />
        <div className="h-4 w-96 bg-muted rounded-md mt-2" />
      </div>

      <div className="space-y-10">
        <div>
          <div className="h-4 w-40 bg-muted rounded-md mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded-md" />
                  <div className="h-10 w-full bg-muted rounded-md" />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-48 bg-muted/20 flex flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
