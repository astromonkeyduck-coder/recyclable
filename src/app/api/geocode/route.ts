import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ResultSchema = z.array(
  z.object({
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    display_name: z.string(),
  })
);

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  try {
    const isZip = /^\d{5}$/.test(query);
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "5");

    if (isZip) {
      url.searchParams.set("postalcode", query);
      url.searchParams.set("country", "us");
    } else {
      url.searchParams.set("q", query);
      url.searchParams.set("countrycodes", "us");
    }

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "isthisrecyclable.com/1.0" },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
    }

    const raw = await res.json();
    const parsed = ResultSchema.safeParse(raw);

    if (!parsed.success || parsed.data.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const results = parsed.data.map((r) => ({
      lat: r.lat,
      lng: r.lon,
      displayName: r.display_name,
    }));

    return NextResponse.json({ results }, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
