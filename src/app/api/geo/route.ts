import { NextRequest, NextResponse } from "next/server";
import { listProviders } from "@/lib/providers/loader";

type GeoResponse = {
  city: string | null;
  providerId: string | null;
};

function matchProvider(
  city: string,
  providers: Awaited<ReturnType<typeof listProviders>>
): string | null {
  const cityLower = city.toLowerCase();
  const matched = providers.find(
    (p) => p.coverage.city?.toLowerCase() === cityLower
  );
  return matched?.id ?? null;
}

async function resolveFromCoords(
  lat: string,
  lng: string,
  providers: Awaited<ReturnType<typeof listProviders>>
): Promise<GeoResponse> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
    {
      headers: { "User-Agent": "isthisrecyclable.com/1.0" },
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) return { city: null, providerId: null };

  const data = (await res.json()) as {
    address?: { city?: string; town?: string; village?: string; county?: string };
  };

  const city =
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.county ??
    null;

  if (!city) return { city: null, providerId: null };

  return { city, providerId: matchProvider(city, providers) };
}

async function resolveFromIp(
  ip: string,
  providers: Awaited<ReturnType<typeof listProviders>>
): Promise<GeoResponse> {
  const geoRes = await fetch(
    `http://ip-api.com/json/${ip}?fields=status,city,regionName,country`,
    { next: { revalidate: 86400 } }
  );

  if (!geoRes.ok) return { city: null, providerId: null };

  const geo = (await geoRes.json()) as {
    status: string;
    city?: string;
    regionName?: string;
    country?: string;
  };

  if (geo.status !== "success" || !geo.city)
    return { city: null, providerId: null };

  return { city: geo.city, providerId: matchProvider(geo.city, providers) };
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<GeoResponse>> {
  try {
    const providers = await listProviders();

    const lat = req.nextUrl.searchParams.get("lat");
    const lng = req.nextUrl.searchParams.get("lng");

    if (lat && lng) {
      const result = await resolveFromCoords(lat, lng, providers);
      return NextResponse.json(result);
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? null;

    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return NextResponse.json({ city: null, providerId: null });
    }

    const result = await resolveFromIp(ip, providers);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ city: null, providerId: null });
  }
}
