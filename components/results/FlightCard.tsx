"use client";

import { useRouter } from "next/navigation";
import { Plane, Clock, Luggage, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Flight } from "@/lib/types";
import {
  formatTime,
  formatPrice,
  formatDuration,
} from "@/lib/utils/flight-filters";
import { useBookingStore } from "@/store/useBookingStore";

interface FlightCardProps {
  flight: Flight;
  passengers: number;
  date: string;
}

const CABIN_LABELS: Record<Flight["cabinClass"], string> = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First Class",
};

export function FlightCard({ flight, passengers, date }: FlightCardProps) {
  const router = useRouter();
  const { selectFlight } = useBookingStore();
  const segment = flight.segments[0];
  const lastSegment = flight.segments[flight.segments.length - 1];
  const totalPrice = flight.price * passengers;

  const handleSelect = () => {
    selectFlight(flight);
    router.push(`/flights/${flight.id}?date=${date}&passengers=${passengers}`);
  };

  return (
    <div className="group rounded-xl border border-border bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Airline */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Plane className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {segment.airline.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {segment.flightNumber}
              </p>
            </div>
          </div>

        </div>

        <div className="mt-4 flex items-center gap-3">
          {/* Departure */}
          <div className="text-left">
            <p className="text-2xl font-bold tabular-nums">
              {formatTime(segment.departureTime)}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {segment.departureAirport.code}
            </p>
          </div>

          {/* Route line */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(flight.totalDurationMinutes)}
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="h-px flex-1 bg-border" />
              <Plane className="h-3 w-3 text-muted-foreground rotate-90 flex-shrink-0" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-xs text-muted-foreground">
              {flight.stops === 0
                ? "Nonstop"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">
              {formatTime(lastSegment.arrivalTime)}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {lastSegment.arrivalAirport.code}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between gap-4">
          {/* Features */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-xs font-normal gap-1">
              <Zap className="h-3 w-3" />
              {CABIN_LABELS[flight.cabinClass]}
            </Badge>
            {flight.baggageIncluded && (
              <Badge
                variant="outline"
                className="text-xs font-normal gap-1 text-green-700 border-green-200"
              >
                <Luggage className="h-3 w-3" />
                Bag included
              </Badge>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">
                {formatPrice(totalPrice)}
              </p>
              {passengers > 1 && (
                <p className="text-xs text-muted-foreground">
                  {formatPrice(flight.price)} × {passengers}
                </p>
              )}
            </div>
            <Button
              onClick={handleSelect}
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 rounded-lg font-semibold"
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
