import { NextRequest } from "next/server";
import { generateFlights } from "@/lib/data/flights";
import { applyFilters, applySort } from "@/lib/utils/flight-filters";
import type { FilterState, SortState, StopType, CabinClass } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const passengers = parseInt(searchParams.get("passengers") ?? "1", 10);

  if (!origin || !destination || !date) {
    return Response.json(
      { error: "origin, destination, and date are required" },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json(
      { error: "date must be in YYYY-MM-DD format" },
      { status: 400 }
    );
  }

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));

  const flights = generateFlights(date);

  // Optional filter params from query string
  const stopsParam = searchParams.getAll("stops");
  const airlinesParam = searchParams.getAll("airlines");
  const minPrice = parseFloat(searchParams.get("minPrice") ?? "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") ?? "999999");
  const cabinParam = searchParams.getAll("cabinClass") as CabinClass[];
  const sortKey = (searchParams.get("sortKey") ?? "price") as SortState["key"];
  const sortDirection = (searchParams.get("sortDirection") ?? "asc") as SortState["direction"];

  const filters: FilterState = {
    stops: stopsParam.map(Number) as StopType[],
    airlines: airlinesParam,
    minPrice,
    maxPrice,
    cabinClass: cabinParam,
    departureTimes: [],
    baggageIncluded: null,
  };

  const sort: SortState = { key: sortKey, direction: sortDirection };

  const filtered = applyFilters(flights, filters);
  const sorted = applySort(filtered, sort);

  return Response.json({
    flights: sorted,
    meta: {
      total: sorted.length,
      origin,
      destination,
      date,
      passengers,
    },
  });
}
