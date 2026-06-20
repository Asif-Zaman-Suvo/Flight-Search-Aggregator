# Architecture

## System Overview

SkySearch is a client-side-heavy Next.js application with a thin mock API layer. The architectural goal is a clean separation between **data**, **domain logic**, **state**, and **UI** — enabling each layer to evolve or be replaced independently (e.g., swapping the mock API for a real one requires changing only the API routes and fetch URLs).

```
Browser
  └─ React (Client Components)
       ├─ Zustand Store (useSearchStore, useBookingStore)
       ├─ UI Components (shadcn/ui + custom)
       └─ fetch → Next.js Route Handlers (/api/*)
                      └─ lib/data/flights.ts (in-memory mock)
```

---

## Layer Responsibilities

### 1. Domain Types (`lib/types/`)

Single source of truth for all domain entities:
- `Flight`, `FlightSegment`, `Airline`, `Airport`
- `Booking`, `Passenger`, `ContactInfo`
- `SearchParams`, `FilterState`, `SortState`

Types are pure data structures with no runtime logic. Every layer imports from here — no implicit coupling via prop drilling or ad-hoc shapes.

### 2. Mock Data & API (`lib/data/`, `app/api/`)

**`lib/data/flights.ts`** — `generateFlights(date: string): Flight[]` produces 34 deterministic flights for any given date. Each call is pure (no side effects), making the function trivially testable.

**`app/api/flights/route.ts`** — Route Handler that calls `generateFlights`, applies filter/sort from query params, returns JSON. This is the boundary clients talk to. Replacing with a real backend requires changing only this file.

**`app/api/bookings/route.ts`** — Route Handler that validates the booking body (Zod), persists to an in-memory `Map`, returns a `Booking` with a generated PNR. In production this would write to a database.

**Design decision:** Filter and sort logic runs server-side in the API route *and* client-side in Zustand for instant feedback when the user changes filter state. The API applies them on initial load; Zustand re-derives `displayedFlights` on every filter/sort change without a network round-trip.

### 3. Utility Layer (`lib/utils/`)

Pure functions — no React, no side effects:
- `applyFilters(flights, filters)` — predicate chain
- `applySort(flights, sort)` — shallow copy + sort (never mutates input)
- `getPriceRange(flights)` — drives slider bounds
- `getUniqueAirlines(flights)` — drives filter checkboxes
- `formatDuration`, `formatTime`, `formatDate`, `formatPrice` — display formatters

All exported from explicit file paths (not barrel `index.ts`) to avoid shadcn's `lib/utils.ts` (`cn`) name collision.

### 4. State Management (Zustand)

Two purpose-isolated stores:

#### `useSearchStore`
```
searchParams → rawFlights (API) → [applyFilters + applySort] → displayedFlights
                                         ↑                            ↑
                                    filters (local)              sort (local)
```

Key invariant: `displayedFlights` is always derived from `rawFlights + filters + sort`. All filter/sort actions call a shared `recompute()` helper — no duplication, no stale state.

The store holds `status: idle | loading | success | error` to drive UI state transitions cleanly.

#### `useBookingStore`
Tracks the booking funnel:
```
selectFlight() → submitBooking() → booking (confirmed) → navigate to /confirmation/[id]
```

`submitBooking` is async and manages its own `status: idle | submitting | success | error`, so the form knows when to show spinners and errors without lifting state.

**Why Zustand over Context/RTK?**
- Zustand is minimal (no Provider, no boilerplate)
- Devtools built-in
- Selectors prevent unnecessary re-renders
- For this scale, RTK Query would add complexity without benefit since we have a single resource type and no cache invalidation

### 5. UI Components (`components/`)

Three categories:

**Domain components** — know about `Flight`, `Booking`, etc.:
- `FlightCard` — renders a single flight row with price, route, and select CTA
- `FlightList` — orchestrates loading/empty/error/results states
- `FilterPanel` — drives all filter interactions via `useSearchStore` actions
- `SortBar` — drives sort interactions
- `BookingForm` — react-hook-form + Zod validation, N passengers via `useFieldArray`
- `FlightSummary` — read-only flight summary sidebar in booking flow
- `ConfirmationCard` — booking success display

**Primitive UI components** — domain-agnostic:
- `LoadingState` (skeleton), `EmptyState`, `ErrorState`
- shadcn/ui: `Button`, `Input`, `Select`, `Checkbox`, `Slider`, `Badge`, `Card`, `Separator`, `Alert`, `Sonner`

**Layout components** — `Navbar`

**Component boundary rule:** No component reads URL params directly. URL param reading is confined to `*Content.tsx` files (client boundary inside Suspense). This keeps components testable in isolation.

### 6. Routing (`app/`)

```
/                     → Home (SearchForm hero)
/results              → ResultsContent (useSearchParams + Suspense)
/flights/[id]         → FlightDetailContent
/booking/[id]         → BookingContent (BookingForm + FlightSummary)
/confirmation/[id]    → ConfirmationContent
```

**Suspense pattern:** Every page that uses `useSearchParams()` wraps a `*Content` client component in `<Suspense>`. This is required by Next.js 16 for static page generation to succeed — without it, the build fails at prerender.

**State persistence across navigation:** The booking store persists `selectedFlight` across client-side navigations. On hard refresh, the content components fall back to finding the flight in `rawFlights` from the search store, or display a not-found error.

---

## Data Flow: Flight Search

```
1. User fills SearchForm → react-hook-form validates → router.push("/results?...")
2. ResultsContent mounts → reads URL params → calls store.fetchFlights(params)
3. fetchFlights → fetch /api/flights?origin=JFK&... → 300ms delay → returns 34 flights
4. Store: rawFlights = 34 flights, filters reset to full range, displayedFlights = sorted by price asc
5. FilterPanel reads rawFlights → renders checkboxes/sliders
6. User changes filter → store.toggleStop() → recompute() → displayedFlights updated
7. FlightList re-renders with new displayedFlights (no API call)
```

## Data Flow: Booking

```
1. User clicks Select on FlightCard → store.selectFlight(flight) → router.push("/flights/[id]?...")
2. FlightDetailContent reads selectedFlight from store → renders details
3. User clicks Continue → router.push("/booking/[id]?...")
4. BookingForm submits → store.submitBooking(flight, date, formData)
5. submitBooking → POST /api/bookings → 500ms delay → returns Booking with PNR
6. Store: booking = confirmed → router.push("/confirmation/[bookingId]")
7. ConfirmationContent reads booking + flight from store → renders ConfirmationCard
```

---

## Scalability Considerations

| Concern | Current approach | At 10x scale |
|---------|-----------------|--------------|
| Flight data | In-memory generator | Database + Redis cache (TTL per route/date) |
| Bookings | In-memory Map | PostgreSQL + idempotency key on PNR |
| State | Zustand (client) | Add RTK Query for server cache + optimistic updates |
| Filtering | Client-side | Server-side with pagination (cursor-based) |
| Auth | None | JWT + middleware on booking routes |
| Real airlines | Mocked | Amadeus / Sabre API integration in route handler |

The key architectural win: **the mock API surface is identical to what a real backend would expose**. Migrating to real data requires zero changes to components or stores — only the Route Handlers change.

---

## Testing Strategy

| Layer | Tool | Coverage focus |
|-------|------|----------------|
| Utility functions | Vitest | 100% — filter predicates, sort invariants, formatters |
| Zod schemas | Vitest | Boundary values, cross-field validation |
| React components | Testing Library | Render output, user interactions, conditional rendering |
| API routes | Not yet | Would use `fetch` against `http://localhost` in integration tests |
| E2E | Not yet | Playwright for full booking funnel |

Tests live in `__tests__/unit/` and `__tests__/components/`. The vitest config is excluded from the Next.js TypeScript compiler to avoid Turbopack plugin type conflicts.
