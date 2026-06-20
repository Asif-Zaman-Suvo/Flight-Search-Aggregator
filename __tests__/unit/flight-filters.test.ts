import { describe, it, expect } from "vitest";
import {
  applyFilters,
  applySort,
  getPriceRange,
  getUniqueAirlines,
  formatDuration,
  formatTime,
  formatPrice,
} from "@/lib/utils/flight-filters";
import { generateFlights } from "@/lib/data/flights";
import type { Flight, FilterState, SortState } from "@/lib/types";

const DATE = "2025-10-15";
let flights: Flight[];

function defaultFilters(): FilterState {
  return {
    stops: [],
    airlines: [],
    minPrice: 0,
    maxPrice: 999999,
    cabinClass: [],
    departureTimes: [],
    baggageIncluded: null,
  };
}

describe("generateFlights", () => {
  it("produces 34 flights for a given date", () => {
    flights = generateFlights(DATE);
    expect(flights).toHaveLength(34);
  });

  it("all flights have required fields", () => {
    flights.forEach((f) => {
      expect(f.id).toBeTruthy();
      expect(f.price).toBeGreaterThan(0);
      expect(f.segments.length).toBeGreaterThan(0);
      expect(["economy", "premium_economy", "business", "first"]).toContain(
        f.cabinClass
      );
      expect([0, 1, 2]).toContain(f.stops);
    });
  });

  it("departure time is on the given date (UTC)", () => {
    flights.forEach((f) => {
      const dep = new Date(f.segments[0].departureTime);
      expect(dep.toISOString().startsWith(DATE)).toBe(true);
    });
  });
});

describe("applyFilters", () => {
  beforeAll(() => {
    flights = generateFlights(DATE);
  });

  it("returns all flights when no filters applied", () => {
    expect(applyFilters(flights, defaultFilters())).toHaveLength(flights.length);
  });

  it("filters by stops=0 (nonstop only)", () => {
    const result = applyFilters(flights, { ...defaultFilters(), stops: [0] });
    expect(result.every((f) => f.stops === 0)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by stops=1", () => {
    const result = applyFilters(flights, { ...defaultFilters(), stops: [1] });
    expect(result.every((f) => f.stops === 1)).toBe(true);
  });

  it("filters by multiple stops", () => {
    const result = applyFilters(flights, { ...defaultFilters(), stops: [0, 1] });
    expect(result.every((f) => f.stops === 0 || f.stops === 1)).toBe(true);
  });

  it("filters by airline code", () => {
    const result = applyFilters(flights, {
      ...defaultFilters(),
      airlines: ["DL"],
    });
    expect(result.every((f) => f.segments[0].airline.code === "DL")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by price range", () => {
    const result = applyFilters(flights, {
      ...defaultFilters(),
      minPrice: 100,
      maxPrice: 200,
    });
    expect(result.every((f) => f.price >= 100 && f.price <= 200)).toBe(true);
  });

  it("filters by cabin class", () => {
    const result = applyFilters(flights, {
      ...defaultFilters(),
      cabinClass: ["business"],
    });
    expect(result.every((f) => f.cabinClass === "business")).toBe(true);
  });

  it("filters by baggage included", () => {
    const result = applyFilters(flights, {
      ...defaultFilters(),
      baggageIncluded: true,
    });
    expect(result.every((f) => f.baggageIncluded === true)).toBe(true);
  });

  it("returns empty array when price range excludes all", () => {
    const result = applyFilters(flights, {
      ...defaultFilters(),
      minPrice: 99999,
      maxPrice: 100000,
    });
    expect(result).toHaveLength(0);
  });

  it("filters by departure time range (morning 6-12)", () => {
    const result = applyFilters(flights, {
      ...defaultFilters(),
      departureTimes: [{ label: "Morning", start: 6, end: 12 }],
    });
    result.forEach((f) => {
      const hour = new Date(f.segments[0].departureTime).getUTCHours();
      expect(hour).toBeGreaterThanOrEqual(6);
      expect(hour).toBeLessThan(12);
    });
  });
});

describe("applySort", () => {
  beforeAll(() => {
    flights = generateFlights(DATE);
  });

  it("sorts by price ascending", () => {
    const sorted = applySort(flights, { key: "price", direction: "asc" });
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
    }
  });

  it("sorts by price descending", () => {
    const sorted = applySort(flights, { key: "price", direction: "desc" });
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].price).toBeLessThanOrEqual(sorted[i - 1].price);
    }
  });

  it("sorts by duration ascending", () => {
    const sorted = applySort(flights, { key: "duration", direction: "asc" });
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].totalDurationMinutes).toBeGreaterThanOrEqual(
        sorted[i - 1].totalDurationMinutes
      );
    }
  });

  it("sorts by departure time ascending", () => {
    const sorted = applySort(flights, { key: "departure", direction: "asc" });
    for (let i = 1; i < sorted.length; i++) {
      const a = new Date(sorted[i - 1].segments[0].departureTime).getTime();
      const b = new Date(sorted[i].segments[0].departureTime).getTime();
      expect(b).toBeGreaterThanOrEqual(a);
    }
  });

  it("does not mutate original array", () => {
    const original = generateFlights(DATE);
    const sorted = applySort(original, { key: "price", direction: "asc" });
    expect(original[0].id).not.toBe(sorted[0].id); // original unchanged order
  });
});

describe("getPriceRange", () => {
  it("returns correct min/max", () => {
    const flights = generateFlights(DATE);
    const { min, max } = getPriceRange(flights);
    expect(min).toBeLessThan(max);
    expect(flights.every((f) => f.price >= min && f.price <= max)).toBe(true);
  });

  it("returns defaults for empty array", () => {
    const { min, max } = getPriceRange([]);
    expect(min).toBe(0);
    expect(max).toBe(1000);
  });
});

describe("getUniqueAirlines", () => {
  it("returns unique airlines", () => {
    const airlines = getUniqueAirlines(generateFlights(DATE));
    const codes = airlines.map((a) => a.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toContain("AA");
    expect(codes).toContain("DL");
    expect(codes).toContain("UA");
    expect(codes).toContain("B6");
  });
});

describe("format utilities", () => {
  it("formatDuration handles hours and minutes", () => {
    expect(formatDuration(330)).toBe("5h 30m");
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(95)).toBe("1h 35m");
  });

  it("formatPrice formats USD correctly", () => {
    expect(formatPrice(199)).toBe("$199");
    expect(formatPrice(1500)).toBe("$1,500");
  });

  it("formatTime returns HH:MM in UTC", () => {
    const iso = "2025-10-15T06:30:00.000Z";
    expect(formatTime(iso)).toBe("06:30");
  });
});
