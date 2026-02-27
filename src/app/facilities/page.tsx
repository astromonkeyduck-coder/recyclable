"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2 } from "lucide-react";
import { LocationSearch } from "@/components/facilities/location-search";
import { FilterBar } from "@/components/facilities/filter-bar";
import { FacilityCard } from "@/components/facilities/facility-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeolocation } from "@/hooks/use-geolocation";
import { filterFacilities, type FacilityFilters } from "@/lib/facilities/filter";
import type { Coordinates, FacilityWithDistance } from "@/lib/facilities/types";
import { FACILITY_CATEGORY_META } from "@/lib/facilities/types";

export default function FacilitiesPage() {
  const geo = useGeolocation();
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [selected, setSelected] = useState<FacilityWithDistance | null>(null);
  const [filters, setFilters] = useState<FacilityFilters>({ maxDistanceMiles: 50 });

  const coords = geo.coordinates;

  const { data: facilities, isLoading } = useQuery<FacilityWithDistance[]>({
    queryKey: ["facilities", coords?.lat, coords?.lng],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (coords) {
        params.set("lat", String(coords.lat));
        params.set("lng", String(coords.lng));
        params.set("radius", "200");
      }
      const res = await fetch(`/api/facilities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load facilities");
      return res.json();
    },
    staleTime: 5 * 60_000,
  });

  const filtered = useMemo(() => {
    if (!facilities) return [];
    return filterFacilities(facilities, filters);
  }, [facilities, filters]);

  const handleLocationSelect = useCallback(
    (c: Coordinates, label: string) => {
      geo.setManualLocation(c);
      setLocationLabel(label.split(",").slice(0, 2).join(","));
    },
    [geo]
  );

  const handleRequestGPS = useCallback(() => {
    geo.requestPermission();
    setLocationLabel(null);
  }, [geo]);

  // Map marker summary for the static map view
  const mapMarkers = useMemo(() => {
    const byCat = new Map<string, number>();
    filtered.forEach((f) => {
      byCat.set(f.category, (byCat.get(f.category) ?? 0) + 1);
    });
    return Array.from(byCat.entries()).map(([cat, count]) => ({
      ...FACILITY_CATEGORY_META[cat as keyof typeof FACILITY_CATEGORY_META],
      count,
    }));
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Find Recycling Facilities
        </h1>
        <p className="text-sm text-muted-foreground">
          Drop-off centers, hazardous waste, e-waste recycling, and more near you.
        </p>
      </div>

      {/* Location search */}
      <div className="mb-4">
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          onRequestGPS={handleRequestGPS}
          gpsLoading={geo.loading}
        />
        {geo.error && (
          <p className="mt-2 text-xs text-red-500">{geo.error}</p>
        )}
        {(locationLabel || (coords && geo.source === "gps")) && (
          <motion.div
            className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MapPin className="h-3 w-3 text-green-600" />
            {locationLabel ?? "Using your current location"}
          </motion.div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
        />
      </div>

      {/* Split layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map area */}
        <div className="lg:w-1/2 xl:w-3/5">
          <div className="sticky top-20 rounded-xl border bg-muted/30 overflow-hidden">
            {/* Map summary view */}
            <div className="relative h-64 sm:h-80 lg:h-[calc(100vh-220px)] flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              {coords ? (
                <div className="flex flex-col items-center gap-4 text-center px-6">
                  <motion.div
                    className="relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-green-400/30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  <div>
                    <p className="font-semibold text-sm">{filtered.length} facilities found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {locationLabel ?? "Near your location"}
                    </p>
                  </div>

                  {/* Category breakdown */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {mapMarkers.map((m) => (
                      <span
                        key={m.label}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium"
                        style={{ backgroundColor: `${m.color}15`, color: m.color }}
                      >
                        {m.icon} {m.count} {m.label}
                      </span>
                    ))}
                  </div>

                  {selected && (
                    <motion.div
                      className="mt-4 rounded-lg border bg-background p-3 text-left w-full max-w-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-semibold text-xs">{selected.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {selected.address.street}, {selected.address.city}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {selected.distanceMiles > 0
                          ? `${selected.distanceMiles.toFixed(1)} miles away`
                          : ""}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center px-6">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <MapPin className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Set your location</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Search by ZIP code or use your current location to find nearby facilities.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Facility list */}
        <div className="lg:w-1/2 xl:w-2/5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              className="flex flex-col items-center gap-3 py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MapPin className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium">No facilities found</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                {coords
                  ? "Try expanding the search radius or clearing filters."
                  : "Enter a location or enable GPS to find nearby facilities."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((f, i) => (
                  <FacilityCard
                    key={f.id}
                    facility={f}
                    isSelected={selected?.id === f.id}
                    onSelect={setSelected}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
