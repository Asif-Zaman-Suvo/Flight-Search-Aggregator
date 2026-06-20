"use client";

import { use, useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConfirmationCard } from "@/components/confirmation/ConfirmationCard";
import { useBookingStore } from "@/store/useBookingStore";
import { useSearchStore } from "@/store/useSearchStore";
import type { Booking, Flight } from "@/lib/types";

interface ConfirmationContentProps {
  params: Promise<{ id: string }>;
}

export function ConfirmationContent({ params }: ConfirmationContentProps) {
  const { id } = use(params);

  const storeBooking = useBookingStore((s) => s.booking);
  const storeFlights = useSearchStore((s) => s.rawFlights);

  const [booking, setBooking] = useState<Booking | null>(
    storeBooking?.id === id ? storeBooking : null
  );
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      const found = storeFlights.find((f) => f.id === booking.flightId);
      if (found) {
        setFlight(found);
        setLoading(false);
        return;
      }
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings?id=${id}`);
        if (!res.ok) throw new Error("Booking not found");
        const data = await res.json();
        setBooking(data.booking);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load booking");
        setLoading(false);
      }
    };

    fetchBooking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!booking || flight) return;
    const found = storeFlights.find((f) => f.id === booking.flightId);
    if (found) setFlight(found);
    setLoading(false);
  }, [booking, storeFlights, flight]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !booking || !flight) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ?? "Booking or flight details not found. Please search again."}
          </AlertDescription>
        </Alert>
        <Link href="/" className="mt-4 inline-flex items-center rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium hover:bg-muted transition-colors">
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <ConfirmationCard booking={booking} flight={flight} />
    </div>
  );
}
