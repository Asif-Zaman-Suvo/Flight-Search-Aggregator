import type { Flight, FilterState, SortState } from "@/lib/types";

export function applyFilters(flights: Flight[], filters: FilterState): Flight[] {
  return flights.filter((flight) => {
    if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
      return false;
    }

    if (
      filters.airlines.length > 0 &&
      !filters.airlines.includes(flight.segments[0].airline.code)
    ) {
      return false;
    }

    if (flight.price < filters.minPrice || flight.price > filters.maxPrice) {
      return false;
    }

    if (
      filters.cabinClass.length > 0 &&
      !filters.cabinClass.includes(flight.cabinClass)
    ) {
      return false;
    }

    if (filters.departureTimes.length > 0) {
      const depHour = new Date(flight.segments[0].departureTime).getUTCHours();
      const matchesTime = filters.departureTimes.some(
        (range) => depHour >= range.start && depHour < range.end
      );
      if (!matchesTime) return false;
    }

    if (
      filters.baggageIncluded !== null &&
      flight.baggageIncluded !== filters.baggageIncluded
    ) {
      return false;
    }

    return true;
  });
}

export function applySort(flights: Flight[], sort: SortState): Flight[] {
  return [...flights].sort((a, b) => {
    let valA: number;
    let valB: number;

    switch (sort.key) {
      case "price":
        valA = a.price;
        valB = b.price;
        break;
      case "duration":
        valA = a.totalDurationMinutes;
        valB = b.totalDurationMinutes;
        break;
      case "departure":
        valA = new Date(a.segments[0].departureTime).getTime();
        valB = new Date(b.segments[0].departureTime).getTime();
        break;
      case "arrival":
        valA = new Date(
          a.segments[a.segments.length - 1].arrivalTime
        ).getTime();
        valB = new Date(
          b.segments[b.segments.length - 1].arrivalTime
        ).getTime();
        break;
      default:
        return 0;
    }

    return sort.direction === "asc" ? valA - valB : valB - valA;
  });
}

export function getPriceRange(flights: Flight[]): { min: number; max: number } {
  if (flights.length === 0) return { min: 0, max: 1000 };
  const prices = flights.map((f) => f.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getUniqueAirlines(
  flights: Flight[]
): { code: string; name: string }[] {
  const map = new Map<string, string>();
  for (const flight of flights) {
    const { code, name } = flight.segments[0].airline;
    map.set(code, name);
  }
  return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
