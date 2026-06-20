# SkySearch – Flight Search Aggregator

A production-quality flight search and booking application built with **Next.js 16 (App Router)**, **TypeScript**, **Zustand**, and **shadcn/ui**.

## Features

- **Flight Search** — Search by origin, destination, date, and passenger count with airport code autocomplete suggestions and popular route shortcuts
- **Results** — 34 mock flights across 5 airlines (American, Delta, United, JetBlue, Southwest, Frontier, Spirit) for JFK→LAX
- **Sort** — Sort by price, duration, departure time, or arrival time (asc/desc toggle)
- **Filter** — Filter by stops (nonstop/1-stop/2+), price range slider, airline, departure time window, cabin class, and baggage
- **Flight Detail** — Full flight information with price breakdown before booking
- **Booking Flow** — Passenger details form (N passengers), contact info, special requests
- **Confirmation** — Booking reference (PNR), itinerary summary, total paid
- **State management** — Zustand stores for search and booking, fully decoupled from UI
- **Loading / Empty / Error states** — Skeleton loaders, empty illustrations, retry on error

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | shadcn/ui (base-ui) + Tailwind CSS v4 |
| State | Zustand 5 with devtools |
| Forms | React Hook Form + Zod v4 |
| Testing | Vitest + @testing-library/react |
| Mock API | Next.js Route Handlers (`/api/flights`, `/api/bookings`) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The default search is pre-populated with **JFK → LAX** for tomorrow.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm test` | Run all tests (vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Lint with ESLint |

## Mock API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/flights` | GET | Search flights. Params: `origin`, `destination`, `date`, `passengers` |
| `/api/bookings` | POST | Create booking. Params: `flightId`, `date`. Body: `BookingFormValues` |
| `/api/bookings` | GET | Retrieve booking by `id` query param |

The API simulates realistic network latency (300ms for search, 500ms for booking) and runs full filter/sort logic server-side.

## Project Structure

```
app/
  api/flights/route.ts        GET /api/flights
  api/bookings/route.ts       POST + GET /api/bookings
  page.tsx                    Home (hero + search form)
  results/page.tsx            Search results page
  results/ResultsContent.tsx  Client component (useSearchParams)
  flights/[id]/               Flight detail
  booking/[id]/               Booking form
  confirmation/[id]/          Booking confirmation

components/
  search/SearchForm.tsx       Search form with validation
  results/FlightCard.tsx      Individual flight card
  results/FlightList.tsx      Rendered list with state handling
  results/FilterPanel.tsx     Sidebar filter controls
  results/SortBar.tsx         Sort toggle bar
  booking/BookingForm.tsx     Passenger + contact form
  booking/FlightSummary.tsx   Price breakdown sidebar
  confirmation/ConfirmationCard.tsx
  ui/                         Reusable primitives (shadcn + custom)
  layout/Navbar.tsx

lib/
  types/                      Domain type definitions
  data/flights.ts             Mock data generator + booking DB
  utils/flight-filters.ts     applyFilters, applySort, formatters
  utils/validators.ts         Zod schemas

store/
  useSearchStore.ts           Search state (params, results, filters, sort)
  useBookingStore.ts          Booking state (selected flight, form status)

__tests__/
  unit/                       flight-filters.test.ts, validators.test.ts
  components/                 FlightCard.test.tsx, EmptyState.test.tsx
```

## Environment

No environment variables required. All data is mocked locally.
