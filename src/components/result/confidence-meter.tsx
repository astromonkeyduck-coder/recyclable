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
  Medium: "AI-assisted match — the item was mapped to a known material.",
  Low: "Best guess based on limited data. When in doubt, put it in the trash.",
};

export function ConfidenceMeter({ confidence, className }: ConfidenceMeterProps) {
  const pct = Math.round(confidence * 100);

  const colorClass =
    pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500";

  const tier = pct >= 75 ? "High" : pct >= 50 ? "Medium" : "Low";
  const label = `${tier} confidence`;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground whitespace-nowrap cursor-help">
              {label} ({pct}%)
              <HelpCircle className="h-3 w-3 opacity-50" />
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
