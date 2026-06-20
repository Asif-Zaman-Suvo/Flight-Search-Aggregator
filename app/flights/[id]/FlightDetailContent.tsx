"use client";

import { use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plane,
  Clock,
  Luggage,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBookingStore } from "@/store/useBookingStore";
import { useSearchStore } from "@/store/useSearchStore";
import {
  formatTime,
  formatDate,
  formatDuration,
  formatPrice,
} from "@/lib/utils/flight-filters";

interface FlightDetailContentProps {
  params: Promise<{ id: string }>;
}

const CABIN_LABELS = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  business: "Business",
  first: "First Class",
} as const;

export function FlightDetailContent({ params }: FlightDetailContentProps) {
  const { id } = use(params);
  const router = useRouter();
  const urlParams = useSearchParams();
  const date = urlParams.get("date") ?? new Date().toISOString().split("T")[0];
  const passengers = parseInt(urlParams.get("passengers") ?? "1", 10);

  const { selectedFlight, selectFlight } = useBookingStore();
  const { rawFlights } = useSearchStore();

  useEffect(() => {
    if (!selectedFlight || selectedFlight.id !== id) {
      const found = rawFlights.find((f) => f.id === id);
      if (found) selectFlight(found);
    }
  }, [id, selectedFlight, rawFlights, selectFlight]);

  const flight = selectedFlight?.id === id ? selectedFlight : rawFlights.find((f) => f.id === id);

  if (!flight) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Flight not found. Please go back and select a flight from the search
            results.
          </AlertDescription>
        </Alert>
        <Link href="/results" className="mt-4 inline-flex items-center rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium hover:bg-muted transition-colors">
          Back to results
        </Link>
      </div>
    );
  }

  const segment = flight.segments[0];
  const lastSegment = flight.segments[flight.segments.length - 1];
  const totalPrice = flight.price * passengers;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-5 gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to results
      </Button>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Plane className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{segment.airline.name}</p>
                <p className="text-sm text-blue-100">{segment.flightNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
              {passengers > 1 && (
                <p className="text-sm text-blue-100">
                  {formatPrice(flight.price)} × {passengers} passengers
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs text-muted-foreground text-center mb-4">
            {formatDate(segment.departureTime)}
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-4xl font-bold tabular-nums">
                {formatTime(segment.departureTime)}
              </p>
              <p className="text-lg font-bold mt-1">{segment.departureAirport.code}</p>
              <p className="text-sm text-muted-foreground">{segment.departureAirport.name}</p>
              <p className="text-xs text-muted-foreground">
                {segment.departureAirport.city}, {segment.departureAirport.country}
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatDuration(flight.totalDurationMinutes)}
              </div>
              <div className="w-full flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <Plane className="h-4 w-4 text-blue-500 rotate-90 flex-shrink-0" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <Badge variant={flight.stops === 0 ? "default" : "secondary"} className="text-xs">
                {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
              </Badge>
            </div>

            <div className="text-right">
              <p className="text-4xl font-bold tabular-nums">
                {formatTime(lastSegment.arrivalTime)}
              </p>
              <p className="text-lg font-bold mt-1">{lastSegment.arrivalAirport.code}</p>
              <p className="text-sm text-muted-foreground">{lastSegment.arrivalAirport.name}</p>
              <p className="text-xs text-muted-foreground">
                {lastSegment.arrivalAirport.city}, {lastSegment.arrivalAirport.country}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Cabin</p>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Zap className="h-3.5 w-3.5 text-muted-foreground" />
              {CABIN_LABELS[flight.cabinClass]}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Baggage</p>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Luggage className="h-3.5 w-3.5 text-muted-foreground" />
              {flight.baggageIncluded ? (
                <span className="text-green-600">Included</span>
              ) : <span>Not included</span>}
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Base fare × {passengers}</span>
            <span className="text-sm">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Taxes & fees</span>
            <span className="text-xs text-green-600 font-medium">Included</span>
          </div>
          <Separator className="mb-4" />
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
          </div>
          <Button
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push(`/booking/${flight.id}?date=${date}&passengers=${passengers}`)}
          >
            Continue to Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
