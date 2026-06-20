export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export type StopType = 0 | 1 | 2;

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
}

export interface FlightSegment {
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string; // ISO 8601
  arrivalTime: string; // ISO 8601
  durationMinutes: number;
  flightNumber: string;
  airline: Airline;
}

export interface Flight {
  id: string;
  segments: FlightSegment[];
  stops: StopType;
  totalDurationMinutes: number;
  price: number;
  cabinClass: CabinClass;
  baggageIncluded: boolean;
}

export type SortKey = "price" | "duration" | "departure" | "arrival";
export type SortDirection = "asc" | "desc";

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export interface FilterState {
  stops: StopType[];
  airlines: string[]; // airline codes
  maxPrice: number;
  minPrice: number;
  cabinClass: CabinClass[];
  departureTimes: TimeRange[];
  baggageIncluded: boolean | null;
}

export interface TimeRange {
  label: string;
  start: number; // hour 0-23
  end: number;
}

export const TIME_RANGES: TimeRange[] = [
  { label: "Early Morning", start: 0, end: 6 },
  { label: "Morning", start: 6, end: 12 },
  { label: "Afternoon", start: 12, end: 18 },
  { label: "Evening", start: 18, end: 24 },
];
