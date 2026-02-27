"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

type ConfidenceMeterProps = {
  confidence: number;
  className?: string;
};

const TOOLTIP_TEXT: Record<string, string> = {
  High: "Strong match found in your local rules database.",
  Medium: "AI-assisted match. The item was mapped to a known material.",
  Low: "Best guess based on limited data. When in doubt, put it in the trash.",
};

const TIER_STYLES: Record<string, { bar: string; glow: string; pill: string }> = {
  High: {
    bar: "bg-green-500",
    glow: "shadow-[0_0_8px_rgba(34,197,94,0.4)]",
    pill: "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400",
  },
  Medium: {
    bar: "bg-yellow-500",
    glow: "shadow-[0_0_8px_rgba(234,179,8,0.35)]",
    pill: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400",
  },
  Low: {
    bar: "bg-red-500",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.35)]",
    pill: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400",
  },
};

export function ConfidenceMeter({ confidence, className }: ConfidenceMeterProps) {
  const pct = Math.round(confidence * 100);
  const tier = pct >= 75 ? "High" : pct >= 50 ? "Medium" : "Low";
  const styles = TIER_STYLES[tier];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", styles.bar, styles.glow)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.35 }}
        />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap cursor-help",
                styles.pill
              )}
            >
              {tier}
              <HelpCircle className="h-2.5 w-2.5 opacity-60" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[220px]">
            {TOOLTIP_TEXT[tier]}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
