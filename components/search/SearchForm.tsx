"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plane, ArrowRightLeft, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { searchSchema, type SearchFormValues } from "@/lib/utils/validators";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  defaultValues?: Partial<SearchFormValues>;
  compact?: boolean;
}


export function SearchForm({ defaultValues, compact = false }: SearchFormProps) {
  const router = useRouter();
  const { setSearchParams } = useSearchStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: defaultValues?.origin ?? "",
      destination: defaultValues?.destination ?? "",
      date: defaultValues?.date ?? new Date().toISOString().split("T")[0],
      passengers: defaultValues?.passengers ?? 1,
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    setSearchParams(data);
    const params = new URLSearchParams({
      origin: data.origin,
      destination: data.destination,
      date: data.date,
      passengers: String(data.passengers),
    });
    router.push(`/results?${params.toString()}`);
  };

  const swapRoutes = () => {
    const origin = watch("origin");
    const destination = watch("destination");
    setValue("origin", destination);
    setValue("destination", origin);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div
        className={cn(
          "bg-white rounded-2xl shadow-lg border border-border",
          compact ? "p-4" : "p-6 md:p-8"
        )}
      >
        {!compact && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Plane className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Find your flight</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Search hundreds of flights across all major airlines
            </p>
          </div>
        )}

        <div
          className={cn(
            "grid gap-4",
            compact
              ? "md:grid-cols-[1fr_auto_1fr_1fr_1fr_auto]"
              : "md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr]"
          )}
        >
          {/* Origin */}
          <div className="space-y-1.5">
            {!compact && <Label htmlFor="origin">From</Label>}
            <div className="relative">
              <Input
                id="origin"
                placeholder="Origin (JFK)"
                className={cn(
                  "uppercase font-medium",
                  errors.origin && "border-destructive"
                )}
                maxLength={3}
                {...register("origin")}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register("origin").onChange(e);
                }}
              />
              {errors.origin && (
                <p className="text-[11px] text-destructive mt-1">
                  {errors.origin.message}
                </p>
              )}
            </div>
          </div>

          {/* Swap button */}
          <div className={cn("flex items-end pb-px", compact && "items-center")}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={swapRoutes}
              className="h-10 w-10 rounded-full hover:bg-accent"
              aria-label="Swap origin and destination"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            {!compact && <Label htmlFor="destination">To</Label>}
            <div>
              <Input
                id="destination"
                placeholder="Destination (LAX)"
                className={cn(
                  "uppercase font-medium",
                  errors.destination && "border-destructive"
                )}
                maxLength={3}
                {...register("destination")}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register("destination").onChange(e);
                }}
              />
              {errors.destination && (
                <p className="text-[11px] text-destructive mt-1">
                  {errors.destination.message}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            {!compact && <Label htmlFor="date">Date</Label>}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="date"
                type="date"
                className={cn("pl-9", errors.date && "border-destructive")}
                min={new Date().toISOString().split("T")[0]}
                {...register("date")}
              />
              {errors.date && (
                <p className="text-[11px] text-destructive mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          {/* Passengers */}
          <div className="space-y-1.5">
            {!compact && <Label htmlFor="passengers">Passengers</Label>}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <select
                id="passengers"
                value={watch("passengers")}
                onChange={(e) => setValue("passengers", parseInt(e.target.value, 10))}
                className="h-10 w-full appearance-none rounded-lg border border-input bg-white pl-9 pr-8 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Passenger" : "Passengers"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className={cn("space-y-1.5", !compact && "lg:col-auto")}>
            {!compact && <Label className="invisible">Search</Label>}
            <Button
              type="submit"
              className="w-full h-10 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plane className="h-4 w-4 mr-2" />
              Search Flights
            </Button>
          </div>
        </div>

      </div>
    </form>
  );
}
