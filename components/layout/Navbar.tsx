import Link from "next/link";
import { Plane } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Plane className="h-4 w-4 text-white" />
          </div>
          <span>SkySearch</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Flights
          </Link>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            My Trips
          </Link>
        </nav>
      </div>
    </header>
  );
}
