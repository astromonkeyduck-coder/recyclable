import type { DisposalCategory } from "@/lib/providers/types";

type CategoryMeta = {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  /** Emoji string, only for clipboard/share text, never rendered in UI. */
  emoji: string;
  description: string;
};

export const CATEGORY_META: Record<DisposalCategory, CategoryMeta> = {
  recycle: {
    label: "Recycle",
    color: "#3B82F6",
    bgColor: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-700 dark:text-blue-300",
    emoji: "♻️",
    description: "This item can be recycled",
  },
  trash: {
    label: "Trash",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    emoji: "🗑️",
    description: "This item goes in the trash",
  },
  compost: {
    label: "Compost",
    color: "#22C55E",
    bgColor: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300",
    emoji: "🌱",
    description: "This item can be composted",
  },
  dropoff: {
    label: "Drop-off",
    color: "#F97316",
    bgColor: "bg-orange-100 dark:bg-orange-950",
    textColor: "text-orange-700 dark:text-orange-300",
    emoji: "📍",
    description: "Take this item to a drop-off location",
  },
  hazardous: {
    label: "Hazardous",
    color: "#EF4444",
    bgColor: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300",
    emoji: "⚠️",
    description: "This item requires special hazardous waste disposal",
  },
  unknown: {
    label: "Not Sure",
    color: "#EAB308",
    bgColor: "bg-yellow-100 dark:bg-yellow-950",
    textColor: "text-yellow-700 dark:text-yellow-300",
    emoji: "❓",
    description: "We're not sure how to dispose of this item",
  },
  donate: {
    label: "Donate",
    color: "#8B5CF6",
    bgColor: "bg-violet-100 dark:bg-violet-950",
    textColor: "text-violet-700 dark:text-violet-300",
    emoji: "❤️",
    description: "Donate this item for reuse",
  },
  "yard-waste": {
    label: "Yard waste",
    color: "#15803D",
    bgColor: "bg-emerald-100 dark:bg-emerald-950",
    textColor: "text-emerald-700 dark:text-emerald-300",
    emoji: "🌿",
    description: "Yard or green waste (grass, leaves, branches)",
  },
  deposit: {
    label: "Deposit / Refund",
    color: "#0D9488",
    bgColor: "bg-teal-100 dark:bg-teal-950",
    textColor: "text-teal-700 dark:text-teal-300",
    emoji: "💰",
    description: "Return for refund (bottle/can deposit)",
  },
};
