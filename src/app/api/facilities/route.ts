import { NextRequest, NextResponse } from "next/server";
import { getAllFacilities } from "@/lib/facilities/registry";
import { sortByDistance, filterByRadius } from "@/lib/geo/distance";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lng = parseFloat(searchParams.get("lng") ?? "");
    const radius = parseFloat(searchParams.get("radius") ?? "50");

    const facilities = await getAllFacilities();

    if (!isNaN(lat) && !isNaN(lng)) {
      const sorted = sortByDistance(facilities, { lat, lng });
      const filtered = filterByRadius(sorted, radius);
      return NextResponse.json(filtered);
    }

    return NextResponse.json(
      facilities.map((f) => ({ ...f, distanceMiles: 0, distanceKm: 0 }))
    );
  } catch (error) {
    console.error("Facilities error:", error);
    return NextResponse.json({ error: "Failed to load facilities" }, { status: 500 });
  }
}
