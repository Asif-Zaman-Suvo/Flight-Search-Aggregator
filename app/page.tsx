import { Plane } from "lucide-react";
import { SearchForm } from "@/components/search/SearchForm";

export default function HomePage() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white min-h-[calc(100vh-3.5rem)] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5" />
            <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">
              Flight Search
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Find your next flight
          </h1>
          <p className="text-blue-100 text-lg">
            Compare prices across all major US airlines.
          </p>
        </div>

        <SearchForm
          defaultValues={{ origin: "JFK", destination: "LAX", date: defaultDate, passengers: 1 }}
        />
      </div>
    </div>
  );
}
