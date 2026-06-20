"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Flight, Booking } from "@/lib/types";
import type { BookingFormValues } from "@/lib/utils/validators";

interface BookingState {
  selectedFlight: Flight | null;
  booking: Booking | null;
  status: "idle" | "submitting" | "success" | "error";
  error: string | null;
}

interface BookingActions {
  selectFlight: (flight: Flight) => void;
  clearFlight: () => void;
  submitBooking: (
    flight: Flight,
    date: string,
    formData: BookingFormValues
  ) => Promise<string | null>; // returns booking id on success
  reset: () => void;
}

export const useBookingStore = create<BookingState & BookingActions>()(
  devtools(
    (set) => ({
      selectedFlight: null,
      booking: null,
      status: "idle",
      error: null,

      selectFlight: (flight) => set({ selectedFlight: flight }),
      clearFlight: () => set({ selectedFlight: null }),

      submitBooking: async (flight, date, formData) => {
        set({ status: "submitting", error: null });

        try {
          const url = new URL("/api/bookings", window.location.origin);
          url.searchParams.set("flightId", flight.id);
          url.searchParams.set("date", date);

          const res = await fetch(url.toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(
              err.error ?? `Booking failed with status ${res.status}`
            );
          }

          const data = await res.json();
          const booking: Booking = data.booking;
          set({ booking, status: "success" });
          return booking.id;
        } catch (e) {
          set({
            status: "error",
            error: e instanceof Error ? e.message : "Unknown error",
          });
          return null;
        }
      },

      reset: () =>
        set({ selectedFlight: null, booking: null, status: "idle", error: null }),
    }),
    { name: "booking-store" }
  )
);
