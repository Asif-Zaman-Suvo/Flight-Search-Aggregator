import { Plane, Clock, Luggage } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Flight } from "@/lib/types";
import {
  formatTime,
  formatDate,
  formatDuration,
  formatPrice,
} from "@/lib/utils/flight-filters";

interface FlightSummaryProps {
  flight: Flight;
  passengers: number;
}

const CABIN_LABELS: Record<Flight["cabinClass"], string> = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First Class",
};

export function FlightSummary({ flight, passengers }: FlightSummaryProps) {
  const segment = flight.segments[0];
  const lastSegment = flight.segments[flight.segments.length - 1];
  const totalPrice = flight.price * passengers;

  return (
    <div className="rounded-xl border border-border bg-white">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Plane className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">{segment.airline.name}</p>
            <p className="text-xs text-muted-foreground">{segment.flightNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {formatTime(segment.departureTime)}
            </p>
            <p className="text-sm font-semibold">{segment.departureAirport.code}</p>
            <p className="text-xs text-muted-foreground">{segment.departureAirport.city}</p>
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
            <p className="text-sm font-semibold">{lastSegment.arrivalAirport.code}</p>
            <p className="text-xs text-muted-foreground">{lastSegment.arrivalAirport.city}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          {formatDate(segment.departureTime)}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="text-xs">
            {CABIN_LABELS[flight.cabinClass]}
          </Badge>
          {flight.baggageIncluded && (
            <Badge variant="outline" className="text-xs gap-1 text-green-700 border-green-200">
              <Luggage className="h-3 w-3" />
              Bag included
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      <div className="p-5 space-y-2">
        <h3 className="text-sm font-semibold mb-3">Price Breakdown</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Base fare × {passengers} passenger{passengers > 1 ? "s" : ""}
          </span>
          <span>{formatPrice(flight.price * passengers)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxes & fees</span>
          <span className="text-green-600 text-xs font-medium">Included</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
