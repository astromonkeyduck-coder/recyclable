"use client";

import { useRouter } from "next/navigation";
import { useLocation } from "@/hooks/use-location";

const POPULAR_SEARCHES = [
  "Plastic bottle",
  "Pizza box",
  "Batteries",
  "Plastic bag",
  "Glass jar",
  "Styrofoam",
  "Old phone",
  "Paint",
];

export function SearchChips() {
  const router = useRouter();
  const { providerId } = useLocation();

  return (
    <div className="flex flex-wrap justify-center gap-2" role="list" aria-label="Popular searches">
      {POPULAR_SEARCHES.map((item) => (
        <button
          key={item}
          onClick={() =>
            router.push(`/result?q=${encodeURIComponent(item)}&provider=${providerId}`)
          }
          className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          role="listitem"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
