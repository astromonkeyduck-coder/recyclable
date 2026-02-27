"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ConfidenceMeterProps = {
  confidence: number;
  className?: string;
};

export function ConfidenceMeter({ confidence, className }: ConfidenceMeterProps) {
  const pct = Math.round(confidence * 100);

  const colorClass =
    pct >= 75
      ? "[&>div]:bg-green-500"
      : pct >= 50
        ? "[&>div]:bg-yellow-500"
        : "[&>div]:bg-red-500";

  const label =
    pct >= 75 ? "High confidence" : pct >= 50 ? "Medium confidence" : "Low confidence";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Progress value={pct} className={cn("h-2 flex-1", colorClass)} />
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        {label} ({pct}%)
      </span>
    </div>
  );
}
