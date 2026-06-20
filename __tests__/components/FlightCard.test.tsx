import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlightCard } from "@/components/results/FlightCard";
import { generateFlights } from "@/lib/data/flights";
import type { Flight } from "@/lib/types";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock booking store
vi.mock("@/store/useBookingStore", () => ({
  useBookingStore: () => ({ selectFlight: vi.fn() }),
}));

const DATE = "2025-10-15";
let flight: Flight;

beforeEach(() => {
  [flight] = generateFlights(DATE);
});

describe("FlightCard", () => {
  it("renders airline name", () => {
    render(<FlightCard flight={flight} passengers={1} date={DATE} />);
    expect(
      screen.getByText(flight.segments[0].airline.name)
    ).toBeInTheDocument();
  });

  it("renders flight number", () => {
    render(<FlightCard flight={flight} passengers={1} date={DATE} />);
    expect(screen.getByText(new RegExp(flight.segments[0].flightNumber))).toBeInTheDocument();
  });

  it("renders Select button", () => {
    render(<FlightCard flight={flight} passengers={1} date={DATE} />);
    expect(screen.getByRole("button", { name: /select/i })).toBeInTheDocument();
  });

  it("shows total price for multiple passengers", () => {
    const passengers = 2;
    render(<FlightCard flight={flight} passengers={passengers} date={DATE} />);
    const expectedTotal = flight.price * passengers;
    expect(
      screen.getByText(new RegExp(`\\$${expectedTotal}`))
    ).toBeInTheDocument();
  });

  it("shows 'Bag included' badge when baggageIncluded=true", () => {
    const bagFlight: Flight = { ...flight, baggageIncluded: true };
    render(<FlightCard flight={bagFlight} passengers={1} date={DATE} />);
    expect(screen.getByText(/bag included/i)).toBeInTheDocument();
  });

  it("shows nonstop label for 0 stops", () => {
    const nonstop: Flight = { ...flight, stops: 0 };
    render(<FlightCard flight={nonstop} passengers={1} date={DATE} />);
    expect(screen.getByText(/nonstop/i)).toBeInTheDocument();
  });

  it("shows stop count for 1 stop", () => {
    const oneStop = generateFlights(DATE).find((f) => f.stops === 1)!;
    render(<FlightCard flight={oneStop} passengers={1} date={DATE} />);
    expect(screen.getByText(/1 stop/i)).toBeInTheDocument();
  });
});
