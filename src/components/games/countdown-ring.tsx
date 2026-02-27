"use client";

import { cn } from "@/lib/utils";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function timerColor(remaining: number, total: number): string {
  const ratio = remaining / total;
  if (ratio > 0.5) return "#22C55E";
  if (ratio > 0.25) return "#F59E0B";
  return "#EF4444";
}

export function CountdownRing({
  remaining,
  total,
  className,
}: {
  remaining: number;
  total: number;
  className?: string;
}) {
  const fraction = total > 0 ? remaining / total : 0;
  const offset = CIRCUMFERENCE * (1 - fraction);
  const color = timerColor(remaining, total);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/20"
        />
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.5s ease" }}
        />
      </svg>
      <span
        className={cn(
          "absolute text-xs font-bold tabular-nums",
          remaining <= 3 && "text-red-500"
        )}
      >
        {remaining}
      </span>
    </div>
  );
}
