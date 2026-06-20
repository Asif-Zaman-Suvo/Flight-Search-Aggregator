"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortState, SortKey } from "@/lib/types";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price", label: "Price" },
  { key: "duration", label: "Duration" },
  { key: "departure", label: "Departure" },
  { key: "arrival", label: "Arrival" },
];

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
}

interface SortBarProps {
  totalCount: number;
}

export function SortBar({ totalCount }: SortBarProps) {
  const { sort, setSort, displayedFlights } = useSearchStore();

  const handleSort = (key: SortKey) => {
    if (sort.key === key) {
      setSort({ key, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      setSort({ key, direction: "asc" });
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 py-3 px-1">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{displayedFlights.length}</span>
        {totalCount !== displayedFlights.length && (
          <span> of {totalCount}</span>
        )}{" "}
        flights found
      </p>

      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1.5">Sort by:</span>
        {SORT_OPTIONS.map(({ key, label }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => handleSort(key)}
            className={cn(
              "h-8 px-3 text-xs gap-1.5 rounded-full",
              sort.key === key
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-accent"
            )}
          >
            {label}
            <SortIcon active={sort.key === key} direction={sort.direction} />
          </Button>
        ))}
      </div>
    </div>
  );
}
