"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Crosshair, Loader2 } from "lucide-react";
import type { Coordinates } from "@/lib/facilities/types";

type GeocodeResult = { lat: number; lng: number; displayName: string };

type LocationSearchProps = {
  onLocationSelect: (coords: Coordinates, label: string) => void;
  onRequestGPS: () => void;
  gpsLoading?: boolean;
};

export function LocationSearch({ onLocationSelect, onRequestGPS, gpsLoading }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results, isFetching } = useQuery<GeocodeResult[]>({
    queryKey: ["geocode", query],
    queryFn: async () => {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.results ?? [];
    },
    enabled: query.trim().length >= 3,
    staleTime: 5 * 60_000,
  });

  const handleSelect = useCallback(
    (result: GeocodeResult) => {
      setQuery("");
      setIsOpen(false);
      onLocationSelect({ lat: result.lat, lng: result.lng }, result.displayName);
    },
    [onLocationSelect]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex gap-2">
      <div className="relative flex-1">
        {isFetching ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          type="search"
          placeholder="Search by ZIP, city, or address..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim().length >= 3 && setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          className="h-10 pl-10 text-sm"
          autoComplete="off"
        />

        <AnimatePresence>
          {isOpen && results && results.length > 0 && (
            <motion.ul
              className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-accent transition-colors"
                    onClick={() => handleSelect(r)}
                  >
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate text-xs">{r.displayName}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-10 gap-1.5 shrink-0"
        onClick={onRequestGPS}
        disabled={gpsLoading}
      >
        {gpsLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Crosshair className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">Use my location</span>
      </Button>
    </div>
  );
}
