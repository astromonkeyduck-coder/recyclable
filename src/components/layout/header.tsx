"use client";

import Link from "next/link";
import { Recycle } from "lucide-react";
import { LocationSelector } from "./location-selector";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Recycle className="h-5 w-5 text-green-600" />
          <span className="hidden sm:inline">Is this recyclable?</span>
          <span className="sm:hidden">ITR</span>
        </Link>

        <div className="flex items-center gap-2">
          <LocationSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
