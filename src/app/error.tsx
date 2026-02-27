"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-6xl">🗑️</span>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Something went wrong
          </h1>
          <p className="max-w-sm text-muted-foreground">
            An unexpected error occurred. This has been logged and we&apos;ll
            look into it.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={reset} size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
