"use client";

import type { DisposalCategory } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/utils/categories";
import { CategoryIcon } from "./category-icon";

type CategoryBadgeProps = {
  category: DisposalCategory;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

export function CategoryBadge({ category, size = "md", className }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category];

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-2 text-base font-semibold gap-2",
    xl: "flex-col px-6 py-4 text-2xl font-bold gap-3",
  };

  const iconSize = {
    sm: "xs" as const,
    md: "sm" as const,
    lg: "md" as const,
    xl: "xl" as const,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        meta.bgColor,
        meta.textColor,
        sizeClasses[size],
        className
      )}
      role="status"
    >
      <CategoryIcon category={category} size={iconSize[size]} />
      {meta.label}
    </span>
  );
}
