import { z } from "zod";

export const searchSchema = z.object({
  origin: z
    .string()
    .min(3, "Origin is required")
    .max(3, "Must be a 3-letter airport code")
    .transform((v) => v.toUpperCase()),
  destination: z
    .string()
    .min(3, "Destination is required")
    .max(3, "Must be a 3-letter airport code")
    .transform((v) => v.toUpperCase()),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .refine((d) => new Date(d) >= new Date(new Date().toDateString()), {
      message: "Date cannot be in the past",
    }),
  passengers: z
    .number()
    .int()
    .min(1, "At least 1 passenger")
    .max(9, "Max 9 passengers"),
}).refine((d) => d.origin !== d.destination, {
  message: "Origin and destination cannot be the same",
  path: ["destination"],
});

export type SearchFormValues = z.infer<typeof searchSchema>;

const passengerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .refine((d) => new Date(d) < new Date(), {
      message: "Date of birth must be in the past",
    }),
  passportNumber: z
    .string()
    .min(6, "Passport number must be at least 6 characters")
    .max(20),
  nationality: z.string().min(2, "Nationality is required").max(50),
});

export const bookingSchema = z.object({
  passengers: z.array(passengerSchema).min(1),
  contact: z.object({
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number"),
  }),
  specialRequests: z.string().max(500).optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
