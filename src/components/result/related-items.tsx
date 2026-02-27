"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CATEGORY_META } from "@/lib/utils/categories";
import type { DisposalCategory } from "@/lib/providers/types";
import { useSfx } from "@/components/sfx/sfx-context";

type SearchResult = {
  materialId: string;
  name: string;
  category: DisposalCategory;
  score: number;
};

type RelatedItemsProps = {
  currentName: string;
  currentId?: string;
  providerId: string;
};

export function RelatedItems({
  currentName,
  currentId,
  providerId,
}: RelatedItemsProps) {
  const router = useRouter();
  const sfx = useSfx();

  const keyword = currentName.split(/\s+/).slice(0, 2).join(" ");

  const { data: related } = useQuery<SearchResult[]>({
    queryKey: ["related", providerId, keyword],
    queryFn: async () => {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(keyword)}&provider=${providerId}`
      );
      if (!res.ok) return [];
      const results: SearchResult[] = await res.json();
      return results
        .filter((r) => r.materialId !== currentId)
        .slice(0, 5);
    },
    enabled: !!keyword,
    staleTime: 5 * 60_000,
  });

  if (!related?.length) return null;

  return (
    <motion.div
      className="w-full max-w-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 text-center">
        People also searched for
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {related.map((item) => {
          const meta = CATEGORY_META[item.category];
          return (
            <button
              key={item.materialId}
              onClick={() => {
                sfx.pop();
                router.push(
                  `/result?q=${encodeURIComponent(item.name)}&materialId=${item.materialId}&provider=${providerId}`
                );
              }}
              className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{meta.icon}</span>
              {item.name}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
