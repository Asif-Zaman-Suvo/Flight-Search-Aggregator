"use client";

import { useSearchStore } from "@/store/useSearchStore";
import { FlightCard } from "./FlightCard";
import { FlightListSkeleton } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SortBar } from "./SortBar";

interface FlightListProps {
  passengers: number;
  date: string;
}

export function FlightList({ passengers, date }: FlightListProps) {
  const { status, error, displayedFlights, rawFlights, searchParams, fetchFlights } =
    useSearchStore();

  if (status === "loading") {
    return (
      <div>
        <div className="h-12 mb-3" />
        <FlightListSkeleton count={6} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <ErrorState
        message={error ?? "Failed to load flights. Please try again."}
        onRetry={() => searchParams && fetchFlights(searchParams)}
      />
    );
  }

  if (status === "success" && displayedFlights.length === 0) {
    return (
      <EmptyState
        title="No flights match your filters"
        description="Try adjusting or resetting your filters to see more results."
      />
    );
  }

  return (
    <div>
      <SortBar totalCount={rawFlights.length} />
      <div className="space-y-3">
        {displayedFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            passengers={passengers}
            date={date}
          />
        ))}
      </div>
    </div>
  );
}
