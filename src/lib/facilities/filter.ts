import type { FacilityCategory, FacilityWithDistance } from "./types";
import { getOpenStatus } from "./hours";

export type FacilityFilters = {
  categories?: FacilityCategory[];
  materials?: string[];
  openNow?: boolean;
  maxDistanceMiles?: number;
  searchQuery?: string;
};

export function filterFacilities(
  facilities: FacilityWithDistance[],
  filters: FacilityFilters
): FacilityWithDistance[] {
  let result = facilities;

  if (filters.maxDistanceMiles != null) {
    result = result.filter((f) => f.distanceMiles <= filters.maxDistanceMiles!);
  }

  if (filters.categories?.length) {
    const cats = new Set(filters.categories);
    result = result.filter((f) => cats.has(f.category));
  }

  if (filters.materials?.length) {
    const matLower = filters.materials.map((m) => m.toLowerCase());
    result = result.filter((f) =>
      matLower.some((mat) =>
        f.acceptedMaterials.some((am) => am.toLowerCase().includes(mat))
      )
    );
  }

  if (filters.openNow) {
    result = result.filter((f) => {
      const status = getOpenStatus(f.hours);
      return status.isOpen === true;
    });
  }

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.address.city.toLowerCase().includes(q) ||
        f.acceptedMaterials.some((m) => m.toLowerCase().includes(q))
    );
  }

  return result;
}
