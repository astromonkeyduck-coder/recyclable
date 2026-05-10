"use client";

import { Input } from "@/components/ui/input";
import { UNITS } from "@/lib/enviro/constants";
import { Search } from "lucide-react";

export function SearchFilterBar({
  search,
  onSearchChange,
  unitFilter,
  onUnitFilterChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  unitFilter: string;
  onUnitFilterChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search topics, examples..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-48 pl-8 text-sm sm:w-64"
        />
      </div>
      <select
        value={unitFilter}
        onChange={(e) => onUnitFilterChange(e.target.value)}
        className="h-9 rounded-md border bg-background px-2 text-sm"
      >
        <option value="all">All Units</option>
        {UNITS.map((u) => (
          <option key={u.id} value={`Unit ${u.number}`}>
            Unit {u.number}
          </option>
        ))}
      </select>
    </div>
  );
}
