import { NextRequest, NextResponse } from "next/server";
import { getAllFacilities } from "@/lib/facilities/registry";
import { sortByDistance, filterByRadius } from "@/lib/geo/distance";
import type { FacilityWithDistance } from "@/lib/facilities/types";

function diversifyFirstPage(
  sorted: FacilityWithDistance[],
  limit: number,
): FacilityWithDistance[] {
  if (sorted.length <= limit) return sorted;

  const picked = new Set<string>();
  const result: FacilityWithDistance[] = [];
  const seenCategories = new Set<string>();

  for (const f of sorted) {
    if (result.length >= limit) break;
    if (!seenCategories.has(f.category)) {
      seenCategories.add(f.category);
      picked.add(f.id);
      result.push(f);
    }
  }

  for (const f of sorted) {
    if (result.length >= limit) break;
    if (!picked.has(f.id)) {
      picked.add(f.id);
      result.push(f);
    }
  }

  return result;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lng = parseFloat(searchParams.get("lng") ?? "");
    const radius = parseFloat(searchParams.get("radius") ?? "50");
    const limit = parseInt(searchParams.get("limit") ?? "0", 10) || 0;
    const offset = parseInt(searchParams.get("offset") ?? "0", 10) || 0;

    const facilities = await getAllFacilities();

    if (!isNaN(lat) && !isNaN(lng)) {
      const sorted = sortByDistance(facilities, { lat, lng });
      const filtered = filterByRadius(sorted, radius);
      const total = filtered.length;

      let page: FacilityWithDistance[];
      if (limit > 0) {
        if (offset === 0) {
          page = diversifyFirstPage(filtered, limit);
        } else {
          page = filtered.slice(offset, offset + limit);
        }
      } else {
        page = filtered;
      }

      return NextResponse.json({ facilities: page, total });
    }

    const all = facilities.map((f) => ({
      ...f,
      distanceMiles: 0,
      distanceKm: 0,
    })) as FacilityWithDistance[];

    const total = all.length;
    let page: FacilityWithDistance[];
    if (limit > 0) {
      page = all.slice(offset, offset + limit);
    } else {
      page = all;
    }

    return NextResponse.json({ facilities: page, total });
  } catch (error) {
    console.error("Facilities error:", error);
    return NextResponse.json({ error: "Failed to load facilities" }, { status: 500 });
  }
}
