"use client";

import { use, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookingForm } from "@/components/booking/BookingForm";
import { FlightSummary } from "@/components/booking/FlightSummary";
import { useBookingStore } from "@/store/useBookingStore";
import { useSearchStore } from "@/store/useSearchStore";

interface BookingContentProps {
  params: Promise<{ id: string }>;
}

export function BookingContent({ params }: BookingContentProps) {
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

  const flight =
    selectedFlight?.id === id
      ? selectedFlight
      : rawFlights.find((f) => f.id === id);

  if (!flight) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Flight not found. Please go back and select a flight.
          </AlertDescription>
        </Alert>
        <Link href="/results" className="mt-4 inline-flex items-center rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium hover:bg-muted transition-colors">
          Back to results
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-5 gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to flight details
      </Button>

      <h1 className="text-xl font-bold mb-6">Complete your booking</h1>

      <div className="flex gap-6 items-start flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          <BookingForm flight={flight} passengers={passengers} date={date} />
        </div>
        <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-20">
          <FlightSummary flight={flight} passengers={passengers} />
        </aside>
      </div>
    </div>
  );
}
