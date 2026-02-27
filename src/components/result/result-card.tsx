"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/common/category-badge";
import { ConfidenceMeter } from "./confidence-meter";
import { ShareButton } from "./share-button";
import { AlertTriangle, CheckCircle, ChevronDown, Info, ListChecks, Sparkles, Flag, MapPin, Bookmark, BookmarkCheck } from "lucide-react";
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
};

export function ResultCard({
  material,
  confidence,
  providerName,
  rationale,
  alternatives,
  onSelectAlternative,
}: ResultCardProps) {
  const [rationaleOpen, setRationaleOpen] = useState(true);
  const sfx = useSfx();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider") ?? "general";
  const saved = isBookmarked(material.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 180, damping: 20 }}
      className="w-full max-w-lg"
    >
      <Card className="overflow-hidden">
        {/* Category banner */}
        <div
          className={cn(
            "flex flex-col items-center gap-3 py-8 px-4",
            CATEGORY_META[material.category].bgColor
          )}
        >
          <CategoryBadge category={material.category} size="xl" />
          <h2 className="text-xl font-bold text-center">{material.name}</h2>
          {material.tags?.includes("ai-classified") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 dark:bg-violet-950 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
              <Sparkles className="h-3 w-3" />
              AI-assisted result
            </span>
          )}
          <ConfidenceMeter confidence={confidence} className="w-full max-w-xs" />
        </div>

        <CardContent className="space-y-6 p-6">
          {/* Instructions */}
          <Section icon={<ListChecks className="h-4 w-4" />} title="What to do">
            <ol className="space-y-2.5">
              {material.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* Common mistakes */}
          {material.commonMistakes.length > 0 && (
            <Section
              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
              title="Common mistakes"
            >
              <ul className="space-y-2">
                {material.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500 shrink-0 mt-0.5">!</span>
                    {m}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Notes */}
          {material.notes.length > 0 && (
            <Section icon={<Info className="h-4 w-4 text-blue-500" />} title="Good to know">
              <ul className="space-y-2">
                {material.notes.map((n, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {n}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Alternatives */}
          {alternatives && alternatives.length > 1 && (
            <Section icon={<CheckCircle className="h-4 w-4" />} title="Did you mean?">
              <div className="flex flex-wrap gap-2">
                {alternatives.slice(0, 3).map((alt) => (
                  <button
                    key={alt.material.id}
                    onClick={() => { sfx.pop(); onSelectAlternative?.(alt.material); }}
                    aria-label={`Switch to ${alt.material.name} (${CATEGORY_META[alt.material.category].label})`}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
                      alt.material.id === material.id
                        ? "border-primary bg-accent"
                        : "hover:bg-accent"
                    )}
                  >
                    <span className="mr-1.5">{CATEGORY_META[alt.material.category].icon}</span>
                    {alt.material.name}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Nearby drop-off link for dropoff / hazardous */}
          {(material.category === "dropoff" || material.category === "hazardous") && (
            <Section icon={<MapPin className="h-4 w-4" />} title="Find drop-off locations">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${material.name} recycling drop-off near me`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Search for {material.name} drop-off near me
              </a>
            </Section>
          )}

          {/* If in doubt */}
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>If in doubt:</strong> When you&apos;re unsure, it&apos;s better to put it in
              the trash than to contaminate the recycling stream.
            </p>
          </div>

          {/* Rationale (collapsible with animation) */}
          {rationale && rationale.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <button
                onClick={() => { sfx.tap(); setRationaleOpen(!rationaleOpen); }}
                className="flex items-center gap-1.5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 -mx-1"
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
                    <ul className="mt-2 space-y-1 pl-5">
                      {rationale.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Share + provider + feedback */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Rules: {providerName}</span>
            <div className="flex items-center gap-2">
              <FeedbackForm
                itemName={material.name}
                category={material.category}
                providerName={providerName}
              >
                <button
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded px-1 -mx-1"
                  aria-label="Report wrong result"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report wrong result
                </button>
              </FeedbackForm>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  sfx.pop();
                  toggleBookmark({
                    query: material.name,
                    category: material.category,
                    providerName,
                    providerId,
                  });
                  toast.success(saved ? "Removed from saved" : "Saved!");
                }}
              >
                {saved ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
                {saved ? "Saved" : "Save"}
              </Button>
              <ShareButton
                itemName={material.name}
                category={material.category}
                providerName={providerName}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold mb-2.5">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}
