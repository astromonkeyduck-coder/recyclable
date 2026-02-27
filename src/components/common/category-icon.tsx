import {
  Recycle,
  Trash2,
  Leaf,
  MapPin,
  ShieldAlert,
  HelpCircle,
  type LucideProps,
} from "lucide-react";
import type { DisposalCategory } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/utils/categories";

const ICON_MAP: Record<DisposalCategory, React.FC<LucideProps>> = {
  recycle: Recycle,
  trash: Trash2,
  compost: Leaf,
  dropoff: MapPin,
  hazardous: ShieldAlert,
  unknown: HelpCircle,
};

const CONTAINER_COLORS: Record<DisposalCategory, string> = {
  recycle:
    "bg-blue-100 text-blue-600 shadow-blue-200/50 dark:bg-blue-950/60 dark:text-blue-400 dark:shadow-blue-900/30",
  trash:
    "bg-gray-100 text-gray-600 shadow-gray-200/50 dark:bg-gray-800/60 dark:text-gray-400 dark:shadow-gray-900/30",
  compost:
    "bg-green-100 text-green-600 shadow-green-200/50 dark:bg-green-950/60 dark:text-green-400 dark:shadow-green-900/30",
  dropoff:
    "bg-orange-100 text-orange-600 shadow-orange-200/50 dark:bg-orange-950/60 dark:text-orange-400 dark:shadow-orange-900/30",
  hazardous:
    "bg-red-100 text-red-600 shadow-red-200/50 dark:bg-red-950/60 dark:text-red-400 dark:shadow-red-900/30",
  unknown:
    "bg-yellow-100 text-yellow-600 shadow-yellow-200/50 dark:bg-yellow-950/60 dark:text-yellow-400 dark:shadow-yellow-900/30",
};

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CONFIG: Record<Size, { container: string; icon: string }> = {
  xs: { container: "h-5 w-5", icon: "h-3 w-3" },
  sm: { container: "h-7 w-7", icon: "h-3.5 w-3.5" },
  md: { container: "h-9 w-9", icon: "h-4.5 w-4.5" },
  lg: { container: "h-12 w-12", icon: "h-6 w-6" },
  xl: { container: "h-16 w-16", icon: "h-8 w-8" },
};

type CategoryIconProps = {
  category: DisposalCategory;
  size?: Size;
  bare?: boolean;
  className?: string;
};

/**
 * Renders the Lucide SVG icon for a disposal category inside a styled circular
 * container. Set `bare` to render the icon alone without the container.
 */
export function CategoryIcon({
  category,
  size = "md",
  bare = false,
  className,
}: CategoryIconProps) {
  const Icon = ICON_MAP[category];
  const meta = CATEGORY_META[category];
  const sizeConfig = SIZE_CONFIG[size];

  if (bare) {
    return (
      <Icon
        className={cn(sizeConfig.icon, meta.textColor, className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full shadow-inner",
        CONTAINER_COLORS[category],
        sizeConfig.container,
        className
      )}
      aria-hidden="true"
    >
      <Icon className={sizeConfig.icon} strokeWidth={2.25} />
    </span>
  );
}
