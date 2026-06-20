import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { FlightDetailContent } from "./FlightDetailContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FlightDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <FlightDetailContent params={params} />
    </Suspense>
  );
}
