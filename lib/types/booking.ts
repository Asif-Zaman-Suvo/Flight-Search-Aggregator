export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  passportNumber: string;
  nationality: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface BookingFormData {
  passengers: Passenger[];
  contact: ContactInfo;
  specialRequests?: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  flightId: string;
  passengers: Passenger[];
  contact: ContactInfo;
  specialRequests?: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  pnr: string; // passenger name record / booking reference
}
