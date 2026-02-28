"use client";

import { useState } from "react";
import Link from "next/link";
import { Recycle, Settings } from "lucide-react";
import { LocationSelector } from "./location-selector";
import { ThemeToggle } from "./theme-toggle";
import { MusicControls } from "@/components/music/music-controls";
import { ShareSiteButton } from "@/components/common/share-site-button";
import { SettingsSheet } from "./settings-sheet";
import { Button } from "@/components/ui/button";

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight hover:scale-[1.03] active:scale-[0.98] transition-transform duration-150"
          >
            <Recycle className="h-5 w-5 text-green-600" />
            <span className="hidden sm:inline">Is this recyclable?</span>
            <span className="sm:hidden">ITR</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <ShareSiteButton />
            <MusicControls />
            <div className="hidden sm:block h-5 w-px bg-border mx-1" />
            <LocationSelector />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
