import { Loader2 } from "lucide-react";

export default function BookingDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumbs Placeholder */}
      <div className="h-4 w-48 bg-muted rounded-md" />

      {/* Header Placeholder */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-64 bg-muted rounded-lg" />
            <div className="h-5 w-24 bg-muted rounded-full" />
          </div>
          <div className="h-4 w-40 bg-muted rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info card skeleton */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-36 bg-muted rounded-md border-b border-border pb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded-md" />
                <div className="h-4 w-40 bg-muted rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded-md" />
                <div className="h-4 w-32 bg-muted rounded-md" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="h-3 w-24 bg-muted rounded-md" />
                <div className="h-4 w-5/6 bg-muted rounded-md" />
              </div>
            </div>
          </div>

          {/* Rented items card skeleton */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-36 bg-muted rounded-md border-b border-border pb-3" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-muted rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-40 bg-muted rounded-md" />
                      <div className="h-3 w-24 bg-muted rounded-md" />
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-muted rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Actions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-28 bg-muted rounded-md border-b border-border pb-3" />
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-muted rounded-md" />
                  <div className="h-4 w-24 bg-muted rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions box loading state */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3 flex flex-col items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Menghubungkan server...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
