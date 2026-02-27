"use client";

import { CATEGORY_META } from "@/lib/utils/categories";
import type { DisposalCategory } from "@/lib/providers/types";
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  category: DisposalCategory;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

export function CategoryBadge({ category, size = "md", className }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category];

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base font-semibold",
    xl: "px-6 py-3 text-2xl font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        meta.bgColor,
        meta.textColor,
        sizeClasses[size],
        className
      )}
      role="status"
    >
      <span aria-hidden="true">{meta.icon}</span>
      {meta.label}
    </span>
  );
}
