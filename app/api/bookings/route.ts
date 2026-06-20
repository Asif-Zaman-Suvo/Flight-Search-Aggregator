import { NextRequest } from "next/server";
import { bookingsDb, generateFlights } from "@/lib/data/flights";
import { bookingSchema } from "@/lib/utils/validators";
import type { Booking } from "@/lib/types";

function generatePNR(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateId(): string {
  return `BK${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { searchParams } = request.nextUrl;
  const flightId = searchParams.get("flightId");
  const date = searchParams.get("date");

  if (!flightId || !date) {
    return Response.json(
      { error: "flightId and date query params are required" },
      { status: 400 }
    );
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const flights = generateFlights(date);
  const flight = flights.find((f) => f.id === flightId);
  if (!flight) {
    return Response.json({ error: "Flight not found" }, { status: 404 });
  }

  const { passengers, contact, specialRequests } = parsed.data;
  const totalPrice = flight.price * passengers.length;

  await new Promise((r) => setTimeout(r, 500));

  const booking: Booking = {
    id: generateId(),
    flightId,
    passengers,
    contact,
    specialRequests,
    totalPrice,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    pnr: generatePNR(),
  };

  bookingsDb.set(booking.id, booking);

  return Response.json({ booking }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (id) {
    const booking = bookingsDb.get(id);
    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }
    return Response.json({ booking });
  }

  return Response.json({ bookings: Array.from(bookingsDb.values()) });
}
