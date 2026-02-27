import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { OgParamsSchema } from "@/lib/utils/og-params";
import type { DisposalCategory } from "@/lib/providers/types";

export const runtime = "edge";

const CATEGORY_THEME: Record<
  DisposalCategory,
  { accent: string; bg: string; gradient: string; icon: string; label: string }
> = {
  recycle: {
    accent: "#2563EB",
    bg: "#EFF6FF",
    gradient: "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 40%, #F0F9FF 100%)",
    icon: "♻️",
    label: "RECYCLE",
  },
  trash: {
    accent: "#4B5563",
    bg: "#F3F4F6",
    gradient: "linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 40%, #F9FAFB 100%)",
    icon: "🗑️",
    label: "TRASH",
  },
  compost: {
    accent: "#16A34A",
    bg: "#F0FDF4",
    gradient: "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 40%, #F7FEE7 100%)",
    icon: "🌱",
    label: "COMPOST",
  },
  dropoff: {
    accent: "#EA580C",
    bg: "#FFF7ED",
    gradient: "linear-gradient(135deg, #FFEDD5 0%, #FFF7ED 40%, #FFFBEB 100%)",
    icon: "📍",
    label: "DROP-OFF",
  },
  hazardous: {
    accent: "#DC2626",
    bg: "#FEF2F2",
    gradient: "linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 40%, #FFF1F2 100%)",
    icon: "⚠️",
    label: "HAZARDOUS",
  },
  unknown: {
    accent: "#CA8A04",
    bg: "#FEFCE8",
    gradient: "linear-gradient(135deg, #FEF9C3 0%, #FEFCE8 40%, #FFFFF0 100%)",
    icon: "❓",
    label: "NOT SURE",
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const raw = {
    category: searchParams.get("category") ?? undefined,
    item: searchParams.get("item") ?? undefined,
    loc: searchParams.get("loc") ?? undefined,
    confidence: searchParams.get("confidence") ?? undefined,
    warning: searchParams.get("warning") ?? undefined,
  };

  const params = OgParamsSchema.parse(raw);
  const theme = CATEGORY_THEME[params.category];

  const confidenceLabel =
    params.confidence >= 75
      ? "High confidence"
      : params.confidence >= 50
        ? "Medium confidence"
        : params.confidence > 0
          ? "Low confidence"
          : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: theme.gradient,
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle noise texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />

        {/* Decorative corner accent */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: theme.accent,
            opacity: 0.06,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: theme.accent,
            opacity: 0.04,
          }}
        />

        {/* Main card container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            margin: "40px",
            padding: "48px 56px",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.85)",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top row: category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 24px",
                borderRadius: "999px",
                background: theme.accent,
                color: "white",
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "0.08em",
              }}
            >
              <span style={{ fontSize: "26px" }}>{theme.icon}</span>
              {theme.label}
            </div>
            {confidenceLabel && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: "rgba(0,0,0,0.05)",
                  color: "#555",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {confidenceLabel} ({params.confidence}%)
              </div>
            )}
          </div>

          {/* Item name - the hero text */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: params.item.length > 30 ? "56px" : "72px",
                fontWeight: 800,
                color: "#111",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "900px",
              }}
            >
              {params.item}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "20px",
                fontSize: "24px",
                color: "#666",
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: "20px" }}>📍</span>
              {params.loc}
            </div>
          </div>

          {/* Warning pill (optional) */}
          {params.warning && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                background: "#FEF3C7",
                border: "1px solid #FDE68A",
                color: "#92400E",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "24px",
                maxWidth: "fit-content",
              }}
            >
              <span>⚠️</span>
              {params.warning}
            </div>
          )}

          {/* Bottom brand bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "20px",
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "20px",
                fontWeight: 700,
                color: "#333",
              }}
            >
              <span style={{ fontSize: "24px" }}>♻️</span>
              isthisrecyclable.com
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#999",
                fontWeight: 500,
              }}
            >
              Snap it, search it, sort it.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
