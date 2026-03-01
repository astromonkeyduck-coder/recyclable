"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryIcon } from "@/components/common/category-icon";
import { ConfidenceMeter } from "./confidence-meter";
import { Celebration } from "./celebration";
import { ShareButton } from "./share-button";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Copy,
  Info,
  Lightbulb,
  ListChecks,
  Sparkles,
  Flag,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
} from "lucide-react";
import type { Material } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/utils/categories";
import { useSfx } from "@/components/sfx/sfx-context";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FeedbackForm } from "@/components/common/feedback-form";

type ResultCardProps = {
  material: Material;
  confidence: number;
  providerName: string;
  rationale?: string[];
  alternatives?: Array<{ material: Material; score: number }>;
  onSelectAlternative?: (material: Material) => void;
  query?: string;
  providerId?: string;
  conceptId?: string;
  materialId?: string;
};

const CATEGORY_TIPS: Record<string, string[]> = {
  recycle: [
    "Rinse containers before tossing them in the bin — food residue contaminates entire batches.",
    "Keep lids on bottles. Loose caps are too small for sorting machines.",
    "Flatten boxes and cartons to save space and help sorters.",
  ],
  trash: [
    "When in doubt, trash it. One wrong item can contaminate an entire recycling load.",
    "Bag broken glass separately and label it so waste workers stay safe.",
    "Chip bags, candy wrappers, and multilayer packaging are always trash.",
  ],
  compost: [
    "Chop large scraps into smaller pieces — they break down faster.",
    "Coffee grounds and filters are both compostable. Toss them in together.",
    "Avoid composting meat, dairy, or oily food in backyard bins — municipal compost can handle them.",
  ],
  dropoff: [
    "Many retailers (Best Buy, Staples) accept small electronics for free recycling.",
    "Check your city's website for annual collection events — they often take bulky items.",
    "Some items like tires and mattresses have dedicated recycling programs.",
  ],
  hazardous: [
    "Never pour chemicals down the drain — even small amounts can contaminate water systems.",
    "Store hazardous items in original containers until you can drop them off.",
    "Many fire stations and pharmacies accept expired medications year-round.",
  ],
};

function getCategoryTip(category: string): string | null {
  const tips = CATEGORY_TIPS[category];
  if (!tips?.length) return null;
  return tips[Math.floor(Math.random() * tips.length)];
}

const GRADIENT_MAP: Record<string, string> = {
  recycle:
    "bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100 dark:from-blue-950 dark:via-blue-950/60 dark:to-sky-950",
  trash:
    "bg-gradient-to-br from-gray-100 via-gray-50 to-slate-100 dark:from-gray-800 dark:via-gray-900/60 dark:to-slate-900",
  compost:
    "bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-950 dark:via-emerald-950/60 dark:to-teal-950",
  dropoff:
    "bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 dark:from-orange-950 dark:via-amber-950/60 dark:to-yellow-950",
  hazardous:
    "bg-gradient-to-br from-red-100 via-rose-50 to-pink-100 dark:from-red-950 dark:via-rose-950/60 dark:to-pink-950",
  unknown:
    "bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 dark:from-yellow-950 dark:via-amber-950/60 dark:to-orange-950",
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 22 } },
};

export function ResultCard({
  material,
  confidence,
  providerName,
  rationale,
  alternatives,
  onSelectAlternative,
  query,
  providerId,
  conceptId,
  materialId,
}: ResultCardProps) {
  const [rationaleOpen, setRationaleOpen] = useState(true);
  const sfx = useSfx();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const searchParams = useSearchParams();
  const effectiveProviderId = providerId ?? searchParams.get("provider") ?? "general";
  const saved = isBookmarked(material.name);
  const meta = CATEGORY_META[material.category];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tip = useMemo(() => getCategoryTip(material.category), [material.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 160, damping: 20 }}
      className="w-full max-w-lg"
    >
      <Card className="overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 border-0 ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
        {/* ── Category banner ── */}
        <div
          className={cn(
            "relative flex flex-col items-center gap-4 px-6 pb-8 pt-10 overflow-hidden",
            GRADIENT_MAP[material.category]
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent dark:from-white/5" />

          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
            className="relative"
          >
            <Celebration category={material.category} materialId={material.id} />
            <div className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full ring-4 ring-white/60 dark:ring-white/10 shadow-xl",
              meta.bgColor
            )}>
              <CategoryIcon category={material.category} size="xl" bare />
            </div>
          </motion.div>

          <div className="relative text-center space-y-1.5">
            <motion.h2
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {material.name}
            </motion.h2>
            <motion.p
              className={cn("text-sm font-medium", meta.textColor)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
            >
              {meta.description}
            </motion.p>
          </div>

          {material.tags?.includes("ai-classified") && (
            <motion.span
              className="relative inline-flex items-center gap-1.5 rounded-full bg-violet-100/80 dark:bg-violet-950/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 ring-1 ring-violet-200/50 dark:ring-violet-800/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Sparkles className="h-3 w-3" />
              AI-assisted result
            </motion.span>
          )}

          <motion.div
            className="relative w-full max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ConfidenceMeter confidence={confidence} />
          </motion.div>
        </div>

        {/* ── Card body ── */}
        <CardContent className="p-0">
          <motion.div
            className="divide-y divide-border/60"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* Instructions */}
            <motion.div variants={staggerItem} className="p-6">
              <div className="flex items-center justify-between gap-2">
                <SectionHeader
                  icon={<ListChecks className="h-4 w-4" />}
                  title="What to do"
                  accentColor="border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="gap-1.5 shrink-0"
                  onClick={() => {
                    const label = CATEGORY_META[material.category].label;
                    const text = [
                      `${material.name} (${label})`,
                      "",
                      ...material.instructions.map((step, i) => `${i + 1}. ${step}`),
                    ].join("\n");
                    navigator.clipboard.writeText(text).then(
                      () => toast.success("Copied to clipboard"),
                      () => toast.error("Could not copy")
                    );
                    sfx.ding();
                  }}
                  aria-label="Copy disposal steps"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy steps
                </Button>
              </div>
              <div className="relative ml-3 mt-4">
                <div className="absolute left-0 top-1 bottom-1 w-px bg-border" />
                <ol className="space-y-4">
                  {material.instructions.map((step, i) => (
                    <li key={i} className="flex gap-4 pl-5 relative">
                      <span className="absolute left-0 -translate-x-1/2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-4 ring-background">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed pt-px">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>

            {/* Quick tip */}
            {tip && (
              <motion.div variants={staggerItem} className="px-6 py-4">
                <div className="flex items-start gap-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 p-3">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Tip:</span> {tip}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Common mistakes */}
            {material.commonMistakes.length > 0 && (
              <motion.div variants={staggerItem} className="p-6">
                <SectionHeader
                  icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                  title="Common mistakes"
                  accentColor="border-amber-400 dark:border-amber-600"
                />
                <div className="mt-3 space-y-2">
                  {material.commonMistakes.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 p-3"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-amber-900 dark:text-amber-200/90">{m}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notes */}
            {material.notes.length > 0 && (
              <motion.div variants={staggerItem} className="p-6">
                <SectionHeader
                  icon={<Info className="h-4 w-4 text-blue-500" />}
                  title="Good to know"
                  accentColor="border-blue-400 dark:border-blue-600"
                />
                <ul className="mt-3 space-y-2">
                  {material.notes.map((n, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-500 shrink-0" />
                      {n}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Alternatives */}
            {alternatives && alternatives.length > 1 && (
              <motion.div variants={staggerItem} className="p-6">
                <SectionHeader
                  icon={<CheckCircle className="h-4 w-4" />}
                  title="Did you mean?"
                  accentColor="border-muted-foreground/30"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {alternatives.slice(0, 3).map((alt) => (
                    <button
                      key={alt.material.id}
                      onClick={() => { sfx.pop(); onSelectAlternative?.(alt.material); }}
                      aria-label={`Switch to ${alt.material.name} (${CATEGORY_META[alt.material.category].label})`}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
                        alt.material.id === material.id
                          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                          : "hover:bg-accent hover:shadow-sm"
                      )}
                    >
                      <CategoryIcon category={alt.material.category} size="xs" />
                      {alt.material.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Drop-off link */}
            {(material.category === "dropoff" || material.category === "hazardous") && (
              <motion.div variants={staggerItem} className="p-6">
                <SectionHeader
                  icon={<MapPin className="h-4 w-4" />}
                  title="Find drop-off locations"
                  accentColor="border-orange-400 dark:border-orange-600"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${material.name} recycling drop-off near me`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border bg-accent/50 px-4 py-2.5 text-sm font-medium text-primary hover:bg-accent transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Search for {material.name} drop-off near me
                </a>
              </motion.div>
            )}

            {/* If in doubt */}
            <motion.div variants={staggerItem} className="p-6">
              <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <ShieldCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">If in doubt</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    When you&apos;re unsure, it&apos;s better to put it in the trash
                    than to contaminate the recycling stream.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Drop-off / hazardous CTA */}
            {(material.category === "dropoff" || material.category === "hazardous") && (
              <motion.div variants={staggerItem} className="px-6 pb-2">
                <a
                  href="/facilities"
                  className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30 p-4 transition-shadow hover:shadow-md group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                      Find a drop-off location near you
                    </p>
                    <p className="text-xs text-green-700/70 dark:text-green-300/60 mt-0.5">
                      Search recycling centers, hazardous waste sites & more
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 -rotate-90 text-green-600/50 shrink-0" />
                </a>
              </motion.div>
            )}

            {/* Rationale */}
            {rationale && rationale.length > 0 && (
              <motion.div variants={staggerItem} className="px-6 py-4">
                <button
                  onClick={() => { sfx.tap(); setRationaleOpen(!rationaleOpen); }}
                  className="flex w-full items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 -mx-1"
                  aria-expanded={rationaleOpen}
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      rationaleOpen && "rotate-180"
                    )}
                  />
                  <Sparkles className="h-3 w-3 text-violet-500" />
                  How we determined this
                </button>
                <AnimatePresence initial={false}>
                  {rationaleOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-2 space-y-1 pl-5 text-xs text-muted-foreground">
                        {rationale.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Rules: {providerName}
              </span>
              <div className="flex items-center gap-1.5">
                <FeedbackForm
                  itemName={material.name}
                  category={material.category}
                  providerName={providerName}
                  query={query}
                  providerId={effectiveProviderId}
                  conceptId={conceptId}
                  materialId={materialId}
                >
                  <button
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Report wrong result"
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </button>
                </FeedbackForm>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  aria-label={saved ? "Remove from saved" : "Save item"}
                  onClick={() => {
                    sfx.pop();
                    toggleBookmark({
                      query: material.name,
                      category: material.category,
                      providerName,
                      providerId: effectiveProviderId,
                    });
                    toast.success(saved ? "Removed from saved" : "Saved!");
                  }}
                >
                  {saved ? (
                    <BookmarkCheck className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Bookmark className="h-3.5 w-3.5" />
                  )}
                </Button>
                <ShareButton
                  itemName={material.name}
                  category={material.category}
                  providerName={providerName}
                  confidence={confidence}
                  instructions={material.instructions}
                />
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SectionHeader({
  icon,
  title,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  accentColor: string;
}) {
  return (
    <h3 className={cn(
      "flex items-center gap-2 text-sm font-semibold border-l-2 pl-3 -ml-0.5",
      accentColor
    )}>
      {icon}
      {title}
    </h3>
  );
}
