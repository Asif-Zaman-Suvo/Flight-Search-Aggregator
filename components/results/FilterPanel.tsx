"use client";

import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearchStore } from "@/store/useSearchStore";
import {
  getUniqueAirlines,
  formatPrice,
} from "@/lib/utils/flight-filters";
import { TIME_RANGES, type StopType, type CabinClass } from "@/lib/types";
import { cn } from "@/lib/utils";

const STOP_OPTIONS: { value: StopType; label: string }[] = [
  { value: 0, label: "Nonstop" },
  { value: 1, label: "1 Stop" },
  { value: 2, label: "2+ Stops" },
];

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
];

interface FilterPanelProps {
  className?: string;
}

export function FilterPanel({ className }: FilterPanelProps) {
  const {
    filters,
    rawFlights,
    priceBounds,
    toggleStop,
    toggleAirline,
    toggleCabinClass,
    toggleDepartureTime,
    setPriceRange,
    setFilter,
    resetFilters,
  } = useSearchStore();

  const airlines = getUniqueAirlines(rawFlights);

  const activeFilterCount =
    filters.stops.length +
    filters.airlines.length +
    filters.cabinClass.length +
    filters.departureTimes.length +
    (filters.baggageIncluded !== null ? 1 : 0) +
    (filters.minPrice > priceBounds.min || filters.maxPrice < priceBounds.max ? 1 : 0);

  return (
    <div className={cn("bg-white rounded-xl border border-border", className)}>
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-semibold text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      <div className="p-4 space-y-5">
        {/* Stops */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Stops
          </h3>
          <div className="space-y-2">
            {STOP_OPTIONS.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`stop-${value}`}
                  checked={filters.stops.includes(value)}
                  onCheckedChange={() => toggleStop(value)}
                />
                <Label
                  htmlFor={`stop-${value}`}
                  className="text-sm cursor-pointer font-normal"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Price Range */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Price Range
            </h3>
            <span className="text-xs font-medium text-foreground">
              {formatPrice(filters.minPrice)} – {formatPrice(filters.maxPrice)}
            </span>
          </div>
          <Slider
            min={priceBounds.min}
            max={priceBounds.max}
            step={10}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={(values) => {
              const [min, max] = Array.isArray(values) ? values : [values, values];
              setPriceRange(min as number, max as number);
            }}
            className="mt-2"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{formatPrice(priceBounds.min)}</span>
            <span>{formatPrice(priceBounds.max)}</span>
          </div>
        </section>

        <Separator />

        {/* Airlines */}
        {airlines.length > 0 && (
          <>
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Airlines
              </h3>
              <div className="space-y-2">
                {airlines.map(({ code, name }) => (
                  <div key={code} className="flex items-center gap-2">
                    <Checkbox
                      id={`airline-${code}`}
                      checked={filters.airlines.includes(code)}
                      onCheckedChange={() => toggleAirline(code)}
                    />
                    <Label
                      htmlFor={`airline-${code}`}
                      className="text-sm cursor-pointer font-normal"
                    >
                      {name}
                    </Label>
                  </div>
                ))}
              </div>
            </section>
            <Separator />
          </>
        )}

        {/* Departure Time */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Departure Time
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {TIME_RANGES.map((range) => {
              const active = filters.departureTimes.some(
                (r) => r.label === range.label
              );
              return (
                <button
                  key={range.label}
                  type="button"
                  onClick={() => toggleDepartureTime(range)}
                  className={cn(
                    "text-xs px-2 py-2 rounded-lg border text-center transition-colors",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {range.label}
                  <div className="text-[10px] opacity-75 mt-0.5">
                    {range.start}:00 – {range.end === 24 ? "24:00" : `${range.end}:00`}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Cabin Class */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Cabin Class
          </h3>
          <div className="space-y-2">
            {CABIN_OPTIONS.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`cabin-${value}`}
                  checked={filters.cabinClass.includes(value)}
                  onCheckedChange={() => toggleCabinClass(value)}
                />
                <Label
                  htmlFor={`cabin-${value}`}
                  className="text-sm cursor-pointer font-normal"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Baggage */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Baggage
          </h3>
          <div className="flex items-center gap-2">
            <Checkbox
              id="baggage-included"
              checked={filters.baggageIncluded === true}
              onCheckedChange={(checked) =>
                setFilter("baggageIncluded", checked ? true : null)
              }
            />
            <Label
              htmlFor="baggage-included"
              className="text-sm cursor-pointer font-normal"
            >
              Baggage included
            </Label>
          </div>
        </section>
      </div>
    </div>
  );
}
