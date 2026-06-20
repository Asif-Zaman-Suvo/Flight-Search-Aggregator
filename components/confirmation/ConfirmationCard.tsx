import Link from "next/link";
import {
  CheckCircle2,
  Plane,
  Clock,
  Users,
  Mail,
  Hash,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Booking, Flight } from "@/lib/types";
import {
  formatTime,
  formatDate,
  formatDuration,
  formatPrice,
} from "@/lib/utils/flight-filters";

interface ConfirmationCardProps {
  booking: Booking;
  flight: Flight;
}

export function ConfirmationCard({ booking, flight }: ConfirmationCardProps) {
  const segment = flight.segments[0];
  const lastSegment = flight.segments[flight.segments.length - 1];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center py-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-9 w-9 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Your booking is confirmed. A confirmation email has been sent to{" "}
          <span className="font-medium text-foreground">
            {booking.contact.email}
          </span>
          .
        </p>
      </div>

      {/* Booking Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4 text-center">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          Booking Reference
        </p>
        <p className="text-3xl font-bold text-blue-700 tracking-widest font-mono">
          {booking.pnr}
        </p>
        <p className="text-xs text-blue-500 mt-1">
          Booking ID: {booking.id}
        </p>
      </div>

      {/* Flight details */}
      <div className="bg-white rounded-xl border border-border p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Plane className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{segment.airline.name}</span>
          <span className="text-xs text-muted-foreground">
            {segment.flightNumber}
          </span>
          <Badge variant="outline" className="text-xs ml-auto">
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {formatTime(segment.departureTime)}
            </p>
            <p className="text-sm font-semibold">
              {segment.departureAirport.code}
            </p>
            <p className="text-xs text-muted-foreground">
              {segment.departureAirport.city}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(flight.totalDurationMinutes)}
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="h-px flex-1 bg-border" />
              <Plane className="h-3 w-3 text-muted-foreground rotate-90" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-xs text-muted-foreground">
              {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">
              {formatTime(lastSegment.arrivalTime)}
            </p>
            <p className="text-sm font-semibold">
              {lastSegment.arrivalAirport.code}
            </p>
            <p className="text-xs text-muted-foreground">
              {lastSegment.arrivalAirport.city}
            </p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          {formatDate(segment.departureTime)}
        </p>
      </div>

      {/* Passengers */}
      <div className="bg-white rounded-xl border border-border p-5 mb-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Passengers ({booking.passengers.length})
        </h3>
        <div className="space-y-2">
          {booking.passengers.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {p.firstName} {p.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                Passport: {p.passportNumber}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact + Total */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{booking.contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="h-4 w-4" />
            <span>
              Booked{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <Separator className="mb-3" />
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total Paid</span>
          <span className="text-xl font-bold">
            {formatPrice(booking.totalPrice)}
          </span>
        </div>
      </div>

      <Link href="/" className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 h-10 text-sm font-semibold transition-colors">
        Search More Flights
      </Link>
    </div>
  );
}
