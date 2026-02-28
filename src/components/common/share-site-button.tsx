"use client";

import { useCallback } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSfx } from "@/components/sfx/sfx-context";
import { cn } from "@/lib/utils";

const SHARE_TITLE = "Is this recyclable?";
const SHARE_TEXT =
  "Snap it, search it, sort it. Know how to dispose of anything with your local rules.";

function getShareUrl(): string {
  if (typeof window === "undefined") return "https://isthisrecyclable.com";
  return window.location.origin;
}

export function useShareSite() {
  const sfx = useSfx();

  const share = useCallback(async () => {
    const url = getShareUrl();

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url,
        });
        toast.success("Shared!");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      sfx.ding();
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  }, [sfx]);

  return share;
}

type ShareSiteButtonProps = {
  variant?: "icon" | "link";
  className?: string;
  children?: React.ReactNode;
};

/** Icon button for header/toolbars */
export function ShareSiteButton({
  variant = "icon",
  className,
  children,
}: ShareSiteButtonProps) {
  const share = useShareSite();

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={share}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150",
          className
        )}
        aria-label="Share site"
      >
        {children ?? (
          <>
            <Share2 className="h-3.5 w-3.5" />
            Share site
          </>
        )}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={share}
      aria-label="Share site"
    >
      {children ?? <Share2 className="h-4 w-4" />}
    </Button>
  );
}
