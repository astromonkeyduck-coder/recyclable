"use client";

import { motion } from "framer-motion";
import type { DisposalCategory } from "@/lib/providers/types";
import type { OgVariant } from "@/lib/utils/og-params";

// Mirror of API route theme so animated preview matches OG image
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

export type OgCardAnimatedParams = {
  variant: string;
  category: DisposalCategory;
  item: string;
  loc: string;
  confidence: number;
  warning: string;
};

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center w-11 h-11 rounded-[11px] text-[22px] shadow-lg"
        style={{
          background: "linear-gradient(135deg, #16A34A 0%, #22C55E 50%, #4ADE80 100%)",
          boxShadow: "0 0 20px rgba(34,197,94,0.3)",
        }}
      >
        ♻️
      </div>
      <span className="text-lg font-extrabold text-[#E5E5E5] tracking-tight">
        isthisrecyclable.com
      </span>
    </div>
  );
}

function ConfidenceBarAnimated({
  confidence,
  accent,
}: {
  confidence: number;
  accent: string;
}) {
  const segments = 10;
  const filled = Math.round((confidence / 100) * segments);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[3px]">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-[22px] rounded-sm"
            style={{
              background: i < filled ? accent : "rgba(255,255,255,0.08)",
              opacity: i < filled ? 1 : 0.5,
            }}
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.4 + i * 0.04, duration: 0.35, ease: "easeOut" }}
          />
        ))}
      </div>
      <motion.span
        className="text-base font-extrabold tracking-tight"
        style={{ color: accent }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        {confidence}%
      </motion.span>
    </div>
  );
}

export function OgCardAnimatedResult({ params }: { params: OgCardAnimatedParams }) {
  const theme = CATEGORY_THEME[params.category];
  const fontSize =
    params.item.length > 35
      ? "text-[52px]"
      : params.item.length > 22
        ? "text-[64px]"
        : "text-[72px]";

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl font-sans"
      style={{
        aspectRatio: "1200/630",
        background: "linear-gradient(145deg, #0C0C0C 0%, #0A0A0A 50%, #080808 100%)",
      }}
    >
      {/* Pulsing glows */}
      <motion.div
        className="absolute -top-[180px] -right-20 w-[700px] h-[700px] rounded-full blur-[60px]"
        style={{
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 65%)`,
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[280px] -left-32 w-[550px] h-[550px] rounded-full blur-[50px]"
        style={{
          background: `radial-gradient(circle, ${theme.glow.replace(/[\d.]+\)$/, "0.10)")} 0%, transparent 65%)`,
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Animated accent stripe */}
      <motion.div
        className="absolute top-0 left-0 w-1 h-full opacity-70"
        style={{
          background: `linear-gradient(180deg, transparent 10%, ${theme.accent} 50%, transparent 90%)`,
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col flex-1 h-full p-12">
        <div className="flex items-center justify-between mb-9">
          <Logo />
          <ConfidenceBarAnimated confidence={params.confidence} accent={theme.accent} />
        </div>

        <motion.div
          className="flex mb-7"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div
            className="flex items-center gap-2 py-2 px-7 pl-5 rounded-full text-white text-lg font-extrabold tracking-widest"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}E6 0%, ${theme.accent}CC 100%)`,
              boxShadow: `0 4px 24px ${theme.glow}, 0 0 0 1px rgba(255,255,255,0.1) inset`,
            }}
          >
            <span className="text-[22px]">{theme.icon}</span>
            {theme.label}
          </div>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            className={`font-extrabold text-[#FAFAFA] leading-tight tracking-tight max-w-[950px] ${fontSize}`}
            style={{ textShadow: `0 0 80px ${theme.glow}` }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
          >
            {params.item}
          </motion.div>
          <motion.div
            className="flex items-center gap-2 mt-4 text-xl text-[#737373] font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="#737373"
              />
            </svg>
            {params.loc}
          </motion.div>
        </div>

        {params.warning && (
          <motion.div
            className="flex items-center gap-2 py-2 px-5 rounded-xl mb-5 text-[15px] font-bold border"
            style={{
              background: "rgba(234,179,8,0.08)",
              borderColor: "rgba(234,179,8,0.15)",
              color: "#FBBF24",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            ⚠️ {params.warning}
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-5 mt-auto border-t border-white/[0.06]">
          <span className="text-[13px] text-[#525252] font-bold tracking-wide">
            Local disposal rules for your area
          </span>
          <div className="flex gap-[3px]">
            {[1, 0.7, 0.4, 0.2].map((opacity, i) => (
              <motion.div
                key={i}
                className="w-3 h-[3px] rounded-sm"
                style={{ background: theme.accent, opacity }}
                animate={{ opacity: [opacity * 0.6, opacity, opacity * 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OgCardAnimatedHomepage() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl font-sans"
      style={{
        aspectRatio: "1200/630",
        background:
          "linear-gradient(135deg, #052E16 0%, #064E3B 30%, #0F766E 60%, #115E59 100%)",
      }}
    >
      <motion.div
        className="absolute -top-[200px] -right-[150px] w-[800px] h-[800px] rounded-full blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[200px] -left-[100px] w-[600px] h-[600px] rounded-full blur-[50px]"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-col flex-1 h-full p-12">
        <div className="flex items-center mb-auto">
          <Logo />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            className="text-[76px] font-extrabold text-white leading-none tracking-tight max-w-[900px]"
            style={{ textShadow: "0 0 80px rgba(34,197,94,0.4)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Is this recyclable?
          </motion.div>
          <motion.div
            className="text-[26px] font-bold mt-5 tracking-tight"
            style={{ color: "rgba(255,255,255,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Know exactly how to dispose of anything.
          </motion.div>
          <div className="flex gap-3 mt-8">
            {[
              { icon: "📸", label: "Snap a photo" },
              { icon: "🔍", label: "Search items" },
              { icon: "📍", label: "Local rules" },
              { icon: "⚡", label: "Works offline" },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                className="flex items-center gap-2 py-2 px-4 rounded-full text-[15px] font-bold border"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.35 }}
              >
                <span className="text-base">{f.icon}</span>
                {f.label}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 mt-auto border-t border-white/10">
          <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
            Snap it, search it, sort it.
          </span>
          <div className="flex gap-[3px]">
            {[1, 0.7, 0.4, 0.2].map((opacity, i) => (
              <motion.div
                key={i}
                className="w-3 h-[3px] rounded-sm bg-emerald-500"
                style={{ opacity }}
                animate={{ opacity: [opacity * 0.5, opacity, opacity * 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OgCardAnimatedPage({
  variant,
}: {
  variant: Exclude<OgVariant, "result" | "homepage">;
}) {
  const page = PAGE_VARIANTS[variant];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl font-sans"
      style={{
        aspectRatio: "1200/630",
        background: "linear-gradient(145deg, #0C0C0C 0%, #0A0A0A 50%, #080808 100%)",
      }}
    >
      <motion.div
        className="absolute -top-[180px] -right-20 w-[700px] h-[700px] rounded-full blur-[60px]"
        style={{
          background: `radial-gradient(circle, ${page.glow} 0%, transparent 65%)`,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 w-1 h-full opacity-70"
        style={{
          background: `linear-gradient(180deg, transparent 10%, ${page.accent} 50%, transparent 90%)`,
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col flex-1 h-full p-12">
        <div className="flex items-center justify-between mb-auto">
          <Logo />
          <div
            className="flex items-center gap-2 py-1 px-4 rounded-full text-[13px] font-bold tracking-widest uppercase border"
            style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#A3A3A3",
            }}
          >
            isthisrecyclable.com/{variant}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            className="text-[56px] mb-6"
            style={{ filter: `drop-shadow(0 0 30px ${page.glow})` }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {page.icon}
          </motion.div>
          <motion.div
            className="text-[68px] font-extrabold text-[#FAFAFA] leading-tight tracking-tight max-w-[900px]"
            style={{ textShadow: `0 0 80px ${page.glow}` }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {page.title}
          </motion.div>
          <motion.div
            className="text-2xl text-[#737373] font-bold mt-4 max-w-[700px] leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {page.subtitle}
          </motion.div>
        </div>

        <div className="flex items-center justify-between pt-5 mt-auto border-t border-white/[0.06]">
          <span className="text-[13px] text-[#525252] font-bold tracking-wide">
            Local disposal rules for your area
          </span>
          <div className="flex gap-[3px]">
            {[1, 0.7, 0.4, 0.2].map((opacity, i) => (
              <motion.div
                key={i}
                className="w-3 h-[3px] rounded-sm"
                style={{ background: page.accent, opacity }}
                animate={{ opacity: [opacity * 0.6, opacity, opacity * 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OgCardAnimated({ params }: { params: OgCardAnimatedParams }) {
  if (params.variant === "homepage" || params.item === "Is this recyclable?") {
    return <OgCardAnimatedHomepage />;
  }
  if (
    params.variant !== "result" &&
    params.variant !== "homepage" &&
    Object.keys(PAGE_VARIANTS).includes(params.variant)
  ) {
    return (
      <OgCardAnimatedPage variant={params.variant as Exclude<OgVariant, "result" | "homepage">} />
    );
  }
  return <OgCardAnimatedResult params={params} />;
}
