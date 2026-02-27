import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { OgParamsSchema } from "@/lib/utils/og-params";
import type { OgVariant } from "@/lib/utils/og-params";
import type { DisposalCategory } from "@/lib/providers/types";

export const runtime = "edge";

// ---------------------------------------------------------------------------
// Theme maps
// ---------------------------------------------------------------------------

const CATEGORY_THEME: Record<
  DisposalCategory,
  { accent: string; glow: string; label: string; icon: string }
> = {
  recycle: {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.25)",
    label: "RECYCLE",
    icon: "♻️",
  },
  trash: {
    accent: "#78716C",
    glow: "rgba(120,113,108,0.18)",
    label: "TRASH",
    icon: "🗑️",
  },
  compost: {
    accent: "#22C55E",
    glow: "rgba(34,197,94,0.25)",
    label: "COMPOST",
    icon: "🌱",
  },
  dropoff: {
    accent: "#F97316",
    glow: "rgba(249,115,22,0.25)",
    label: "DROP-OFF",
    icon: "📍",
  },
  hazardous: {
    accent: "#EF4444",
    glow: "rgba(239,68,68,0.25)",
    label: "HAZARDOUS",
    icon: "⚠️",
  },
  unknown: {
    accent: "#EAB308",
    glow: "rgba(234,179,8,0.20)",
    label: "NOT SURE",
    icon: "❓",
  },
};

const PAGE_VARIANTS: Record<
  Exclude<OgVariant, "result" | "homepage">,
  { title: string; subtitle: string; icon: string; accent: string; glow: string }
> = {
  about: {
    title: "About Us",
    subtitle: "The mission behind instant waste disposal guidance",
    icon: "💡",
    accent: "#22C55E",
    glow: "rgba(34,197,94,0.25)",
  },
  faq: {
    title: "FAQ",
    subtitle: "Answers to common questions about recycling & our app",
    icon: "💬",
    accent: "#8B5CF6",
    glow: "rgba(139,92,246,0.25)",
  },
  games: {
    title: "Recycling Games",
    subtitle: "Test your waste-sorting skills and climb the leaderboard",
    icon: "🏆",
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.25)",
  },
  facilities: {
    title: "Drop-off Facilities",
    subtitle: "Find recycling centers and hazardous waste sites near you",
    icon: "📍",
    accent: "#F97316",
    glow: "rgba(249,115,22,0.25)",
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "No photos stored. No accounts. No tracking. Period.",
    icon: "🔒",
    accent: "#6B7280",
    glow: "rgba(107,114,128,0.20)",
  },
};

// ---------------------------------------------------------------------------
// Font loader — fetches from Google Fonts CDN (always available on edge)
// ---------------------------------------------------------------------------

const INTER_BOLD_URL =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf";
const INTER_EXTRABOLD_URL =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf";

async function loadFonts() {
  const [interBold, interExtraBold] = await Promise.all([
    fetch(INTER_BOLD_URL).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null),
    fetch(INTER_EXTRABOLD_URL).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null),
  ]);

  const fonts: { name: string; data: ArrayBuffer; weight: 700 | 800; style: "normal" }[] = [];
  if (interBold) fonts.push({ name: "Inter", data: interBold, weight: 700, style: "normal" });
  if (interExtraBold) fonts.push({ name: "Inter", data: interExtraBold, weight: 800, style: "normal" });
  return fonts;
}

// ---------------------------------------------------------------------------
// Shared layout primitives
// ---------------------------------------------------------------------------

function DarkCanvas({
  accent,
  glow,
  children,
}: {
  accent: string;
  glow: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        background: "linear-gradient(145deg, #0C0C0C 0%, #0A0A0A 50%, #080808 100%)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Primary glow - top right */}
      <div
        style={{
          position: "absolute",
          top: "-180px",
          right: "-80px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />
      {/* Secondary glow - bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "-280px",
          left: "-120px",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow.replace(/[\d.]+\)$/, "0.10)")} 0%, transparent 65%)`,
          filter: "blur(50px)",
        }}
      />
      {/* Dot grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Left accent stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          background: `linear-gradient(180deg, transparent 10%, ${accent} 50%, transparent 90%)`,
          opacity: 0.7,
        }}
      />
      {children}
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "11px",
          background: "linear-gradient(135deg, #16A34A 0%, #22C55E 50%, #4ADE80 100%)",
          fontSize: "22px",
          boxShadow: "0 0 20px rgba(34,197,94,0.3)",
        }}
      >
        ♻️
      </div>
      <span
        style={{
          fontSize: "18px",
          fontWeight: 800,
          color: "#E5E5E5",
          letterSpacing: "-0.02em",
        }}
      >
        isthisrecyclable.com
      </span>
    </div>
  );
}

function BottomBar({ accent, isHomepage }: { accent: string; isHomepage: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "20px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "13px",
          color: "#525252",
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        {isHomepage ? (
          <>
            <span>📸 Scan</span>
            <span style={{ color: "#3F3F3F" }}>·</span>
            <span>🔍 Search</span>
            <span style={{ color: "#3F3F3F" }}>·</span>
            <span>📍 Local rules</span>
            <span style={{ color: "#3F3F3F" }}>·</span>
            <span>⚡ Works offline</span>
          </>
        ) : (
          <span>Local disposal rules for your area</span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        {[1, 0.7, 0.4, 0.2].map((opacity, i) => (
          <div
            key={i}
            style={{
              width: "14px",
              height: "3px",
              borderRadius: "2px",
              background: accent,
              opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confidence bar component
// ---------------------------------------------------------------------------

function ConfidenceBar({
  confidence,
  accent,
}: {
  confidence: number;
  accent: string;
}) {
  if (confidence <= 0) return null;
  const segments = 10;
  const filled = Math.round((confidence / 100) * segments);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", gap: "3px" }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "22px",
              borderRadius: "3px",
              background: i < filled ? accent : "rgba(255,255,255,0.08)",
              opacity: i < filled ? 1 : 0.5,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: "16px",
          fontWeight: 800,
          color: accent,
          letterSpacing: "-0.02em",
        }}
      >
        {confidence}%
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card renderers
// ---------------------------------------------------------------------------

function ResultCard({ params }: { params: ReturnType<typeof OgParamsSchema.parse> }) {
  const theme = CATEGORY_THEME[params.category];
  const isHomepage = params.item === "Is this recyclable?";

  if (isHomepage) {
    return <HomepageCard />;
  }

  const fontSize = params.item.length > 35 ? "52px" : params.item.length > 22 ? "64px" : "72px";

  return (
    <DarkCanvas accent={theme.accent} glow={theme.glow}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "48px 56px",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "36px",
          }}
        >
          <Logo />
          <ConfidenceBar confidence={params.confidence} accent={theme.accent} />
        </div>

        {/* Category badge */}
        <div style={{ display: "flex", marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 28px 10px 22px",
              borderRadius: "999px",
              background: `linear-gradient(135deg, ${theme.accent}E6 0%, ${theme.accent}CC 100%)`,
              color: "white",
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              boxShadow: `0 4px 24px ${theme.glow}, 0 0 0 1px rgba(255,255,255,0.1) inset`,
            }}
          >
            <span style={{ fontSize: "22px" }}>{theme.icon}</span>
            {theme.label}
          </div>
        </div>

        {/* Hero item name */}
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
              fontSize,
              fontWeight: 800,
              color: "#FAFAFA",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "950px",
              textShadow: `0 0 80px ${theme.glow}`,
            }}
          >
            {params.item}
          </div>

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "18px",
              fontSize: "20px",
              color: "#737373",
              fontWeight: 700,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="#737373"
              />
            </svg>
            {params.loc}
          </div>
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
              background: "rgba(234,179,8,0.08)",
              border: "1px solid rgba(234,179,8,0.15)",
              color: "#FBBF24",
              fontSize: "15px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            ⚠️ {params.warning}
          </div>
        )}

        <BottomBar accent={theme.accent} isHomepage={false} />
      </div>
    </DarkCanvas>
  );
}

function HomepageCard() {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        background: "linear-gradient(135deg, #052E16 0%, #064E3B 30%, #0F766E 60%, #115E59 100%)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Large decorative glow */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-150px",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          left: "-100px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "48px 56px",
          position: "relative",
        }}
      >
        {/* Top bar with logo */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "auto" }}>
          <Logo />
        </div>

        {/* Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: "76px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              maxWidth: "900px",
              textShadow: "0 0 80px rgba(34,197,94,0.4)",
            }}
          >
            Is this recyclable?
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 700,
              marginTop: "20px",
              letterSpacing: "-0.01em",
            }}
          >
            Know exactly how to dispose of anything.
          </div>

          {/* Feature badges */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            {[
              { icon: "📸", label: "Snap a photo" },
              { icon: "🔍", label: "Search items" },
              { icon: "📍", label: "Local rules" },
              { icon: "⚡", label: "Works offline" },
            ].map((f) => (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                <span style={{ fontSize: "16px" }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 700,
            }}
          >
            Snap it, search it, sort it.
          </span>
          <div style={{ display: "flex", gap: "3px" }}>
            {[1, 0.7, 0.4, 0.2].map((opacity, i) => (
              <div
                key={i}
                style={{
                  width: "14px",
                  height: "3px",
                  borderRadius: "2px",
                  background: "#22C55E",
                  opacity,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageCard({ variant }: { variant: Exclude<OgVariant, "result" | "homepage"> }) {
  const page = PAGE_VARIANTS[variant];

  return (
    <DarkCanvas accent={page.accent} glow={page.glow}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "48px 56px",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "auto",
          }}
        >
          <Logo />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#A3A3A3",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            isthisrecyclable.com/{variant}
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {/* Large icon */}
          <div
            style={{
              fontSize: "56px",
              marginBottom: "24px",
              filter: "drop-shadow(0 0 30px " + page.glow + ")",
            }}
          >
            {page.icon}
          </div>

          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              color: "#FAFAFA",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
              textShadow: `0 0 80px ${page.glow}`,
            }}
          >
            {page.title}
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "#737373",
              fontWeight: 700,
              marginTop: "16px",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            {page.subtitle}
          </div>
        </div>

        <BottomBar accent={page.accent} isHomepage={false} />
      </div>
    </DarkCanvas>
  );
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const raw = {
    variant: searchParams.get("variant") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    item: searchParams.get("item") ?? undefined,
    loc: searchParams.get("loc") ?? undefined,
    confidence: searchParams.get("confidence") ?? undefined,
    warning: searchParams.get("warning") ?? undefined,
  };

  const params = OgParamsSchema.parse(raw);

  let fonts: { name: string; data: ArrayBuffer; weight: 700 | 800; style: "normal" }[] = [];
  try {
    fonts = await loadFonts();
  } catch {
    // Fall back to system fonts if loading fails
  }

  let element: React.ReactElement;

  if (params.variant === "homepage" || params.item === "Is this recyclable?") {
    element = <HomepageCard />;
  } else if (params.variant !== "result") {
    element = <PageCard variant={params.variant as Exclude<OgVariant, "result" | "homepage">} />;
  } else {
    element = <ResultCard params={params} />;
  }

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
    ...(fonts.length > 0 ? { fonts } : {}),
    headers: {
      "Content-Type": "image/png",
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
