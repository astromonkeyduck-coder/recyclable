import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { OgParamsSchema } from "@/lib/utils/og-params";
import type { DisposalCategory } from "@/lib/providers/types";

export const runtime = "edge";

const CATEGORY_THEME: Record<
  DisposalCategory,
  { accent: string; glow: string; icon: string; label: string }
> = {
  recycle: {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.15)",
    icon: "♻️",
    label: "RECYCLE",
  },
  trash: {
    accent: "#9CA3AF",
    glow: "rgba(156,163,175,0.12)",
    icon: "🗑️",
    label: "TRASH",
  },
  compost: {
    accent: "#22C55E",
    glow: "rgba(34,197,94,0.15)",
    icon: "🌱",
    label: "COMPOST",
  },
  dropoff: {
    accent: "#F97316",
    glow: "rgba(249,115,22,0.15)",
    icon: "📍",
    label: "DROP-OFF",
  },
  hazardous: {
    accent: "#EF4444",
    glow: "rgba(239,68,68,0.15)",
    icon: "⚠️",
    label: "HAZARDOUS",
  },
  unknown: {
    accent: "#EAB308",
    glow: "rgba(234,179,8,0.12)",
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
  const isHomepage = params.item === "Is this recyclable?";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#0A0A0A",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow orb top-right */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: theme.glow,
            filter: "blur(80px)",
          }}
        />
        {/* Ambient glow orb bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-250px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "56px 64px",
            position: "relative",
          }}
        >
          {/* Top bar: Logo + confidence */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
            }}
          >
            {/* Logo area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              {/* Recycling logo circle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
                  fontSize: "26px",
                }}
              >
                ♻️
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#FAFAFA",
                    letterSpacing: "-0.02em",
                  }}
                >
                  isthisrecyclable.com
                </span>
                <span style={{ fontSize: "13px", color: "#737373", fontWeight: 500 }}>
                  Snap it, search it, sort it.
                </span>
              </div>
            </div>

            {/* Confidence pill (only for result cards) */}
            {!isHomepage && params.confidence > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#A3A3A3",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {params.confidence}% confident
              </div>
            )}
          </div>

          {/* Category badge */}
          {!isHomepage && (
            <div style={{ display: "flex", marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 28px",
                  borderRadius: "999px",
                  background: theme.accent,
                  color: "white",
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  boxShadow: `0 0 30px ${theme.glow}`,
                }}
              >
                <span style={{ fontSize: "24px" }}>{theme.icon}</span>
                {theme.label}
              </div>
            </div>
          )}

          {/* Hero text */}
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
                fontSize: isHomepage
                  ? "80px"
                  : params.item.length > 30
                    ? "52px"
                    : "68px",
                fontWeight: 800,
                color: "#FAFAFA",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                maxWidth: "950px",
              }}
            >
              {params.item}
            </div>

            {isHomepage ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "24px",
                  fontSize: "26px",
                  color: "#A3A3A3",
                  fontWeight: 500,
                }}
              >
                Know exactly how to dispose of anything.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                  fontSize: "22px",
                  color: "#737373",
                  fontWeight: 500,
                }}
              >
                <span style={{ color: "#A3A3A3" }}>📍</span>
                {params.loc}
              </div>
            )}
          </div>

          {/* Warning pill */}
          {params.warning && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                background: "rgba(234,179,8,0.1)",
                border: "1px solid rgba(234,179,8,0.2)",
                color: "#FBBF24",
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              <span>⚠️</span>
              {params.warning}
            </div>
          )}

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "24px",
                fontSize: "14px",
                color: "#525252",
                fontWeight: 500,
              }}
            >
              {isHomepage ? (
                <>
                  <span>📸 Scan</span>
                  <span>🔍 Search</span>
                  <span>📍 Local rules</span>
                  <span>🌙 Works offline</span>
                </>
              ) : (
                <span>Local disposal rules for your area</span>
              )}
            </div>
            {/* Accent line */}
            <div
              style={{
                width: "60px",
                height: "4px",
                borderRadius: "2px",
                background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
              }}
            />
          </div>
        </div>

        {/* Right-side accent stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "6px",
            height: "100%",
            background: `linear-gradient(180deg, transparent, ${theme.accent}, transparent)`,
            opacity: 0.6,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
