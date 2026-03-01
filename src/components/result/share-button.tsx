"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Link2, Image, Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORY_META } from "@/lib/utils/categories";
import type { DisposalCategory } from "@/lib/providers/types";
import { toast } from "sonner";
import { useSfx } from "@/components/sfx/sfx-context";
import { generateShareImage } from "./share-card-canvas";

type ShareButtonProps = {
  itemName: string;
  category: DisposalCategory;
  providerName: string;
  confidence?: number;
  instructions?: string[];
};

function buildShareUrl(itemName: string, providerId: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const params = new URLSearchParams({
    q: itemName,
    provider: providerId,
  });
  return `${base}/result?${params.toString()}`;
}

export function ShareButton({
  itemName,
  category,
  providerName,
  confidence = 0,
  instructions = [],
}: ShareButtonProps) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider") ?? "general";
  const sfx = useSfx();

  const handleShareLink = useCallback(async () => {
    const meta = CATEGORY_META[category];
    const shareUrl = buildShareUrl(itemName, providerId);
    const actionMap: Record<string, string> = {
      recycle: "is recyclable",
      trash: "goes in the trash",
      compost: "is compostable",
      dropoff: "needs a drop-off location",
      hazardous: "requires hazardous waste disposal",
      unknown: "has unclear disposal rules",
      donate: "can be donated",
      "yard-waste": "is yard waste",
      deposit: "has a deposit refund",
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
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  }, [itemName, category, providerName, providerId, sfx]);

  const handleShareImage = useCallback(async () => {
    setGeneratingImage(true);
    try {
      const blob = await generateShareImage({
        itemName,
        category,
        confidence,
        instructions,
        providerName,
      });

      const file = new File([blob], `${itemName.toLowerCase().replace(/\s+/g, "-")}-disposal.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `How to dispose of ${itemName}`,
        });
        toast.success("Shared!");
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        sfx.ding();
        toast.success("Image downloaded!");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error("Could not generate image");
    } finally {
      setGeneratingImage(false);
    }
  }, [itemName, category, confidence, instructions, providerName, sfx]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={handleShareLink} className="gap-2">
          <Link2 className="h-3.5 w-3.5" />
          Share link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleShareImage}
          disabled={generatingImage}
          className="gap-2"
        >
          {generatingImage ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Image className="h-3.5 w-3.5" />
          )}
          Share as image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
