import { NextRequest, NextResponse } from "next/server";
import { listProviders } from "@/lib/providers/loader";

type GeoResponse = {
  city: string | null;
  providerId: string | null;
};

export async function GET(req: NextRequest): Promise<NextResponse<GeoResponse>> {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? null;

    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return NextResponse.json({ city: null, providerId: null });
    }

    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,regionName,country`, {
      next: { revalidate: 86400 },
    });

    if (!geoRes.ok) {
      return NextResponse.json({ city: null, providerId: null });
    }

    const geo = (await geoRes.json()) as {
      status: string;
      city?: string;
      regionName?: string;
      country?: string;
    };

    if (geo.status !== "success" || !geo.city) {
      return NextResponse.json({ city: null, providerId: null });
    }

    const providers = await listProviders();
    const cityLower = geo.city.toLowerCase();

    const matched = providers.find(
      (p) => p.coverage.city?.toLowerCase() === cityLower
    );

    return NextResponse.json({
      city: geo.city,
      providerId: matched?.id ?? null,
    });
  } catch {
    return NextResponse.json({ city: null, providerId: null });
  }
}
