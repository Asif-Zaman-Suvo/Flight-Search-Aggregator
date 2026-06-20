"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Flight,
  FilterState,
  SortState,
  SearchParams,
  TimeRange,
  StopType,
  CabinClass,
} from "@/lib/types";
import { applyFilters, applySort, getPriceRange } from "@/lib/utils/flight-filters";

interface SearchState {
  searchParams: SearchParams | null;
  rawFlights: Flight[];
  displayedFlights: Flight[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  filters: FilterState;
  sort: SortState;
  priceBounds: { min: number; max: number };
}

interface SearchActions {
  setSearchParams: (params: SearchParams) => void;
  fetchFlights: (params: SearchParams) => Promise<void>;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleStop: (stop: StopType) => void;
  toggleAirline: (code: string) => void;
  toggleCabinClass: (cabin: CabinClass) => void;
  toggleDepartureTime: (range: TimeRange) => void;
  setPriceRange: (min: number, max: number) => void;
  setSort: (sort: SortState) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  stops: [],
  airlines: [],
  minPrice: 0,
  maxPrice: 999999,
  cabinClass: [],
  departureTimes: [],
  baggageIncluded: null,
};

function recompute(
  raw: Flight[],
  filters: FilterState,
  sort: SortState
): Flight[] {
  return applySort(applyFilters(raw, filters), sort);
}

export const useSearchStore = create<SearchState & SearchActions>()(
  devtools(
    (set, get) => ({
      searchParams: null,
      rawFlights: [],
      displayedFlights: [],
      status: "idle",
      error: null,
      filters: defaultFilters,
      sort: { key: "price", direction: "asc" },
      priceBounds: { min: 0, max: 1000 },

      setSearchParams: (params) => set({ searchParams: params }),

      fetchFlights: async (params) => {
        set({ status: "loading", error: null, searchParams: params });

        try {
          const url = new URL("/api/flights", window.location.origin);
          url.searchParams.set("origin", params.origin);
          url.searchParams.set("destination", params.destination);
          url.searchParams.set("date", params.date);
          url.searchParams.set("passengers", String(params.passengers));

          const res = await fetch(url.toString());
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error ?? "Failed to fetch flights");
          }

          const data = await res.json();
          const rawFlights: Flight[] = data.flights;
          const bounds = getPriceRange(rawFlights);

          const freshFilters: FilterState = {
            ...defaultFilters,
            minPrice: bounds.min,
            maxPrice: bounds.max,
          };

          const { sort } = get();
          const displayedFlights = recompute(rawFlights, freshFilters, sort);

          set({
            rawFlights,
            displayedFlights,
            status: "success",
            filters: freshFilters,
            priceBounds: bounds,
          });
        } catch (e) {
          set({
            status: "error",
            error: e instanceof Error ? e.message : "Unknown error",
            rawFlights: [],
            displayedFlights: [],
          });
        }
      },

      setFilter: (key, value) => {
        const filters = { ...get().filters, [key]: value };
        const displayedFlights = recompute(get().rawFlights, filters, get().sort);
        set({ filters, displayedFlights });
      },

      toggleStop: (stop) => {
        const stops = get().filters.stops;
        const next = stops.includes(stop)
          ? stops.filter((s) => s !== stop)
          : [...stops, stop];
        const filters = { ...get().filters, stops: next };
        set({ filters, displayedFlights: recompute(get().rawFlights, filters, get().sort) });
      },

      toggleAirline: (code) => {
        const airlines = get().filters.airlines;
        const next = airlines.includes(code)
          ? airlines.filter((a) => a !== code)
          : [...airlines, code];
        const filters = { ...get().filters, airlines: next };
        set({ filters, displayedFlights: recompute(get().rawFlights, filters, get().sort) });
      },

      toggleCabinClass: (cabin) => {
        const cabinClass = get().filters.cabinClass;
        const next = cabinClass.includes(cabin)
          ? cabinClass.filter((c) => c !== cabin)
          : [...cabinClass, cabin];
        const filters = { ...get().filters, cabinClass: next };
        set({ filters, displayedFlights: recompute(get().rawFlights, filters, get().sort) });
      },

      toggleDepartureTime: (range) => {
        const departureTimes = get().filters.departureTimes;
        const exists = departureTimes.some((r) => r.label === range.label);
        const next = exists
          ? departureTimes.filter((r) => r.label !== range.label)
          : [...departureTimes, range];
        const filters = { ...get().filters, departureTimes: next };
        set({ filters, displayedFlights: recompute(get().rawFlights, filters, get().sort) });
      },

      setPriceRange: (min, max) => {
        const filters = { ...get().filters, minPrice: min, maxPrice: max };
        set({ filters, displayedFlights: recompute(get().rawFlights, filters, get().sort) });
      },

      setSort: (sort) => {
        const displayedFlights = recompute(get().rawFlights, get().filters, sort);
        set({ sort, displayedFlights });
      },

      resetFilters: () => {
        const { priceBounds, rawFlights, sort } = get();
        const freshFilters: FilterState = {
          ...defaultFilters,
          minPrice: priceBounds.min,
          maxPrice: priceBounds.max,
        };
        set({
          filters: freshFilters,
          displayedFlights: recompute(rawFlights, freshFilters, sort),
        });
      },
    }),
    { name: "search-store" }
  )
);
