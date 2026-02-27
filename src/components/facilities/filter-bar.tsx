"use client";

import { Button } from "@/components/ui/button";
import { FACILITY_CATEGORY_META, type FacilityCategory } from "@/lib/facilities/types";
import type { FacilityFilters } from "@/lib/facilities/filter";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

const MATERIAL_PRESETS = [
  "batteries",
  "electronics",
  "paint",
  "plastic bags",
  "glass",
  "textiles",
  "motor oil",
  "medications",
];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

type FilterBarProps = {
  filters: FacilityFilters;
  onChange: (filters: FacilityFilters) => void;
  resultCount: number;
};

export function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const toggleCategory = (cat: FacilityCategory) => {
    const current = filters.categories ?? [];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onChange({ ...filters, categories: next.length ? next : undefined });
  };

  const toggleMaterial = (mat: string) => {
    const current = filters.materials ?? [];
    const next = current.includes(mat)
      ? current.filter((m) => m !== mat)
      : [...current, mat];
    onChange({ ...filters, materials: next.length ? next : undefined });
  };

  const hasActiveFilters =
    !!filters.categories?.length ||
    !!filters.materials?.length ||
    filters.openNow ||
    (filters.maxDistanceMiles != null && filters.maxDistanceMiles !== 50);

  return (
    <div className="space-y-3">
      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {Object.entries(FACILITY_CATEGORY_META).map(([key, meta]) => {
          const cat = key as FacilityCategory;
          const isActive = filters.categories?.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              style={isActive ? { backgroundColor: meta.color } : undefined}
            >
              {meta.icon} {meta.label}
            </button>
          );
        })}
      </div>

      {/* Material filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MATERIAL_PRESETS.map((mat) => {
          const isActive = filters.materials?.includes(mat);
          return (
            <button
              key={mat}
              onClick={() => toggleMaterial(mat)}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/20"
              )}
            >
              {mat}
            </button>
          );
        })}
      </div>

      {/* Radius + open now + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            className="h-7 rounded-md border bg-background px-2 text-[11px] font-medium"
            value={filters.maxDistanceMiles ?? 50}
            onChange={(e) =>
              onChange({ ...filters, maxDistanceMiles: Number(e.target.value) })
            }
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                Within {r} mi
              </option>
            ))}
          </select>

          <button
            onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-medium border transition-colors",
              filters.openNow
                ? "bg-green-600 text-white border-green-600"
                : "bg-background text-muted-foreground border-border hover:border-green-600/30"
            )}
          >
            Open now
          </button>

          {hasActiveFilters && (
            <button
              onClick={() =>
                onChange({
                  maxDistanceMiles: 50,
                })
              }
              className="text-[10px] text-muted-foreground hover:text-foreground underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <span className="text-[11px] text-muted-foreground tabular-nums">
          {resultCount} {resultCount === 1 ? "facility" : "facilities"}
        </span>
      </div>
    </div>
  );
}
