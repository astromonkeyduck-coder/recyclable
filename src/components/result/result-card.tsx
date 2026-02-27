"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/common/category-badge";
import { ConfidenceMeter } from "./confidence-meter";
import { ShareButton } from "./share-button";
import { AlertTriangle, CheckCircle, Info, ListChecks, Sparkles } from "lucide-react";
import type { Material } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/utils/categories";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      className="w-full max-w-lg"
    >
      <Card className="overflow-hidden">
        {/* Big category banner */}
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
            <ol className="space-y-2">
              {material.instructions.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
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
              <ul className="space-y-1.5">
                {material.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500 shrink-0">!</span>
                    {m}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Notes */}
          {material.notes.length > 0 && (
            <Section icon={<Info className="h-4 w-4 text-blue-500" />} title="Good to know">
              <ul className="space-y-1.5">
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
                    onClick={() => onSelectAlternative?.(alt.material)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent",
                      alt.material.id === material.id && "border-primary bg-accent"
                    )}
                  >
                    <span className="mr-1">{CATEGORY_META[alt.material.category].icon}</span>
                    {alt.material.name}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* If in doubt */}
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>If in doubt:</strong> When you&apos;re unsure, it&apos;s better to put it in
              the trash than to contaminate the recycling stream.
            </p>
          </div>

          {/* Rationale (collapsed) */}
          {rationale && rationale.length > 0 && (
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">How we determined this</summary>
              <ul className="mt-2 space-y-1 pl-4">
                {rationale.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </details>
          )}

          {/* Share + provider */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">Rules: {providerName}</span>
            <ShareButton
              itemName={material.name}
              category={material.category}
              providerName={providerName}
            />
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
      <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}
