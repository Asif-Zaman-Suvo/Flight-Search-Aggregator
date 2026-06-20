"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Phone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Flight } from "@/lib/types";
import { bookingSchema, type BookingFormValues } from "@/lib/utils/validators";
import { useBookingStore } from "@/store/useBookingStore";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  flight: Flight;
  passengers: number;
  date: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] text-destructive mt-1">{message}</p>;
}

export function BookingForm({ flight, passengers, date }: BookingFormProps) {
  const router = useRouter();
  const { submitBooking, status, error } = useBookingStore();

  const defaultPassenger = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    passportNumber: "",
    nationality: "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      passengers: Array.from({ length: passengers }, () => ({
        ...defaultPassenger,
      })),
      contact: { email: "", phone: "" },
      specialRequests: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  const onSubmit = async (data: BookingFormValues) => {
    const bookingId = await submitBooking(flight, date, data);
    if (bookingId) {
      router.push(`/confirmation/${bookingId}`);
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        {/* Passenger Details */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
            <User className="h-4 w-4" />
            Passenger Details
          </h2>

          {fields.map((field, index) => (
            <div key={field.id}>
              {index > 0 && <Separator className="my-5" />}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Passenger {index + 1}
                </h3>
                {index >= passengers && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="h-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`passengers.${index}.firstName`}>
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`passengers.${index}.firstName`}
                    placeholder="John"
                    className={cn(
                      errors.passengers?.[index]?.firstName && "border-destructive"
                    )}
                    {...register(`passengers.${index}.firstName`)}
                  />
                  <FieldError
                    message={errors.passengers?.[index]?.firstName?.message}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`passengers.${index}.lastName`}>
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`passengers.${index}.lastName`}
                    placeholder="Doe"
                    className={cn(
                      errors.passengers?.[index]?.lastName && "border-destructive"
                    )}
                    {...register(`passengers.${index}.lastName`)}
                  />
                  <FieldError
                    message={errors.passengers?.[index]?.lastName?.message}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`passengers.${index}.dateOfBirth`}>
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`passengers.${index}.dateOfBirth`}
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    className={cn(
                      errors.passengers?.[index]?.dateOfBirth && "border-destructive"
                    )}
                    {...register(`passengers.${index}.dateOfBirth`)}
                  />
                  <FieldError
                    message={errors.passengers?.[index]?.dateOfBirth?.message}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`passengers.${index}.passportNumber`}>
                    Passport Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`passengers.${index}.passportNumber`}
                    placeholder="A12345678"
                    className={cn(
                      errors.passengers?.[index]?.passportNumber &&
                        "border-destructive"
                    )}
                    {...register(`passengers.${index}.passportNumber`)}
                  />
                  <FieldError
                    message={errors.passengers?.[index]?.passportNumber?.message}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`passengers.${index}.nationality`}>
                    Nationality <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`passengers.${index}.nationality`}
                    placeholder="American"
                    className={cn(
                      errors.passengers?.[index]?.nationality && "border-destructive"
                    )}
                    {...register(`passengers.${index}.nationality`)}
                  />
                  <FieldError
                    message={errors.passengers?.[index]?.nationality?.message}
                  />
                </div>
              </div>
            </div>
          ))}

          {fields.length < 9 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ ...defaultPassenger })}
              className="mt-5 gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Passenger
            </Button>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact.email">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contact.email"
                  type="email"
                  placeholder="john@example.com"
                  className={cn(
                    "pl-9",
                    errors.contact?.email && "border-destructive"
                  )}
                  {...register("contact.email")}
                />
              </div>
              <FieldError message={errors.contact?.email?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact.phone">
                Phone <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contact.phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={cn(
                    "pl-9",
                    errors.contact?.phone && "border-destructive"
                  )}
                  {...register("contact.phone")}
                />
              </div>
              <FieldError message={errors.contact?.phone?.message} />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="bg-white rounded-xl border border-border p-5">
          <Label htmlFor="specialRequests" className="text-base font-semibold block mb-4">
            Special Requests <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            id="specialRequests"
            rows={3}
            placeholder="Wheelchair assistance, dietary requirements, etc."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            {...register("specialRequests")}
          />
        </div>

        {/* Submit error */}
        {status === "error" && error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Confirming Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By clicking Confirm Booking you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </form>
  );
}
