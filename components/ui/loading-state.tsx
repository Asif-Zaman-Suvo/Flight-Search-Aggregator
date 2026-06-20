import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-1.5 text-right">
          <Skeleton className="h-7 w-16 ml-auto" />
          <Skeleton className="h-4 w-10 ml-auto" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export function FlightListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  );
}
