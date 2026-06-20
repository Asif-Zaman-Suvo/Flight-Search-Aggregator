"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/search/SearchForm";
import { FilterPanel } from "@/components/results/FilterPanel";
import { FlightList } from "@/components/results/FlightList";
import { useSearchStore } from "@/store/useSearchStore";
import type { SearchParams } from "@/lib/types";

export function ResultsContent() {
  const urlParams = useSearchParams();
  const { fetchFlights } = useSearchStore();

  const origin = urlParams.get("origin") ?? "";
  const destination = urlParams.get("destination") ?? "";
  const date = urlParams.get("date") ?? new Date().toISOString().split("T")[0];
  const passengers = parseInt(urlParams.get("passengers") ?? "1", 10);

  useEffect(() => {
    if (!origin || !destination || !date) return;
    const params: SearchParams = { origin, destination, date, passengers };
    fetchFlights(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination, date, passengers]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchForm
          compact
          defaultValues={{ origin, destination, date, passengers }}
        />
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-bold">
          {origin} → {destination}
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}{" "}
          · {passengers} passenger{passengers !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-6 items-start">
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20">
          <FilterPanel />
        </aside>
        <div className="flex-1 min-w-0">
          <FlightList passengers={passengers} date={date} />
        </div>
      </div>
    </div>
  );
}
