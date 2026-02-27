"use client";

import Link from "next/link";
import { Recycle, Leaf, Camera, Search } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { FloatingVisualizer } from "@/components/music/floating-visualizer";
import { EcoTree } from "@/components/common/eco-tree";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/rules", label: "Rules" },
  { href: "/facilities", label: "Facilities" },
  { href: "/providers", label: "Providers" },
];

const APP_LINKS = [
  { href: "/", label: "Scan", icon: Camera },
  { href: "/", label: "Search", icon: Search },
];

const ECO_TIPS = [
  "Recycling one aluminum can saves enough energy to power a TV for 3 hours.",
  "Glass is 100% recyclable and can be recycled endlessly without losing quality.",
  "It takes 500+ years for a plastic bottle to decompose in a landfill.",
  "Composting food scraps can divert up to 30% of household waste from landfills.",
  "Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
  "Americans throw away 25 billion styrofoam cups every year.",
  "A single recycled plastic bottle saves enough energy to power a lightbulb for 3 hours.",
  "The average person generates over 4 pounds of trash every single day.",
];

function getRandomTip() {
  return ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)];
}

const linkClass =
  "relative text-muted-foreground hover:text-foreground transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-200 hover:after:w-full";

export function Footer() {
  const tip = getRandomTip();
  const { cityName } = useLocation();

  return (
    <div className="relative">
      {/* Trees standing ON TOP of the footer — bottom-full anchors their base to the footer's top edge */}
      <EcoTree
        showBird
        className="absolute left-8 bottom-full opacity-50 xl:left-16 xl:opacity-70 2xl:left-24"
      />
      <div className="hidden lg:block absolute right-8 bottom-full opacity-30 xl:right-16 xl:opacity-50 2xl:right-24 select-none pointer-events-none -scale-x-100">
        <EcoTree />
      </div>

      {/* Audio visualizer — bars grow upward from the footer's top edge */}
      <div className="absolute bottom-full left-0 right-0 h-16 pointer-events-none z-10">
        <FloatingVisualizer />
      </div>

      <footer className="relative border-t bg-gradient-to-b from-muted/30 to-muted/60">
      <div className="relative z-20 mx-auto max-w-3xl px-4 pt-10 pb-6">
        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {/* Branding column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-green-600" />
              <span className="font-semibold tracking-tight">
                Is this recyclable?
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Snap it, search it, sort it. Stop guessing and start disposing
              like a pro with {cityName ? `${cityName}'s` : "your city's"} local rules.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60">
              Built with
              <span className="inline-block animate-pulse text-green-500" aria-hidden>♻</span>
              by{" "}
              <span className="font-medium text-foreground/70">Richard</span>
              <span className="hidden sm:inline text-muted-foreground/40">
                — developer, designer & AP Enviro nerd
              </span>
            </span>
          </div>

          {/* Navigate column */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Navigate
            </h3>
            <nav
              className="flex flex-col gap-2 text-sm"
              aria-label="Footer navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* App column */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              App
            </h3>
            <nav className="flex flex-col gap-2 text-sm" aria-label="App links">
              {APP_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-2 ${linkClass}`}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Eco tip */}
        <div className="mt-8 flex items-start gap-2.5 rounded-lg border border-green-600/15 bg-green-600/5 px-4 py-3">
          <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/80">
              Did you know?
            </span>{" "}
            {tip}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t pt-5 text-xs text-muted-foreground/60 sm:flex-row sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} isthisrecyclable.com
          </span>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
        </div>
      </div>
      </footer>
    </div>
  );
}
