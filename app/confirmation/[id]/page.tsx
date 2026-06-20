import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ConfirmationContent } from "./ConfirmationContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConfirmationPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ConfirmationContent params={params} />
    </Suspense>
  );
}
