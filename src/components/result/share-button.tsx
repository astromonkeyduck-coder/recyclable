"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check, Copy } from "lucide-react";
import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORY_META } from "@/lib/utils/categories";
import type { DisposalCategory } from "@/lib/providers/types";
import { toast } from "sonner";
import { useSfx } from "@/components/sfx/sfx-context";

type ShareButtonProps = {
  itemName: string;
  category: DisposalCategory;
  providerName: string;
};

function buildShareUrl(itemName: string, providerId: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const params = new URLSearchParams({
    q: itemName,
    provider: providerId,
  });
  return `${base}/result?${params.toString()}`;
}

export function ShareButton({ itemName, category, providerName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider") ?? "general";
  const sfx = useSfx();

  const handleShare = useCallback(async () => {
    const meta = CATEGORY_META[category];
    const shareUrl = buildShareUrl(itemName, providerId);
    const actionMap: Record<string, string> = {
      recycle: "is recyclable",
      trash: "goes in the trash",
      compost: "is compostable",
      dropoff: "needs a drop-off location",
      hazardous: "requires hazardous waste disposal",
      unknown: "has unclear disposal rules",
    };
    const action = actionMap[category] ?? `should be: ${meta.label}`;
    const text = `${meta.emoji} ${itemName} ${action}!\n\nFind out how to dispose of anything at isthisrecyclable.com`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${itemName} ${action} | Is this recyclable?`,
          text,
          url: shareUrl,
        });
        toast.success("Shared!");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      sfx.ding();
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  }, [itemName, category, providerName, providerId]);

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}
