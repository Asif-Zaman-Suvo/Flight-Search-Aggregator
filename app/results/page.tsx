import { Suspense } from "react";
import { FlightListSkeleton } from "@/components/ui/loading-state";
import { ResultsContent } from "./ResultsContent";

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="h-16 bg-white rounded-2xl border border-border mb-6" />
        <div className="flex gap-6">
          <div className="hidden lg:block w-64 h-96 bg-white rounded-xl border border-border" />
          <div className="flex-1"><FlightListSkeleton count={6} /></div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
