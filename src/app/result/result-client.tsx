"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, Suspense, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ResultCard } from "@/components/result/result-card";
import { FunnyResult } from "@/components/result/funny-result";
import { ScanContext } from "@/components/result/scan-context";
import { RelatedItems } from "@/components/result/related-items";
import { ProviderComparison } from "@/components/result/provider-comparison";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBadge } from "@/components/common/category-badge";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Loader2,
  RotateCcw,
  Search,
  WifiOff,
  ImageOff,
} from "lucide-react";
import Link from "next/link";
import type { Material } from "@/lib/providers/types";
import { CATEGORY_META } from "@/lib/utils/categories";
import { useSfx } from "@/components/sfx/sfx-context";
import { useVoice } from "@/components/voice/voice-context";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useEcoStats } from "@/hooks/use-eco-stats";

type ResolveResult = {
  best: Material | null;
  matches: Array<{ material: Material; score: number }>;
  confidence: number;
  rationale: string[];
  providerName: string;
};

function usePullToRefresh(onRefresh: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const refreshingRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (startYRef.current === 0 || refreshingRef.current) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0 && window.scrollY === 0) {
      setPulling(true);
      setPullDistance(Math.min(delta * 0.4, 80));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 50 && !refreshingRef.current) {
      refreshingRef.current = true;
      onRefresh();
      setTimeout(() => {
        refreshingRef.current = false;
      }, 1000);
    }
    setPulling(false);
    setPullDistance(0);
    startYRef.current = 0;
  }, [pullDistance, onRefresh]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !("ontouchstart" in window)) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { containerRef, pulling, pullDistance };
}

function ResultSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 w-full max-w-lg mx-auto">
      <div className="w-full rounded-xl border overflow-hidden">
        <div className="flex flex-col items-center gap-3 py-8 px-4 bg-muted/30">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center gap-3 w-full max-w-xs">
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const providerId = searchParams.get("provider") ?? "general";
  const errorMsg = searchParams.get("error");
  const isScan = searchParams.get("scan") === "true";
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const { addToHistory } = useSearchHistory();
  const { logLookup } = useEcoStats();

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useQuery<ResolveResult>({
    queryKey: ["resolve", providerId, q],
    queryFn: async () => {
      const labels = searchParams.get("labels");
      const scanConfidence = searchParams.get("confidence");

      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          guessedItemName: q,
          labels: labels ? JSON.parse(labels) : [q],
          visionConfidence: scanConfidence
            ? parseFloat(scanConfidence)
            : undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to resolve item");
      }

      return res.json();
    },
    enabled: !!q && !errorMsg,
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });

  const activeMaterial = selectedMaterial ?? data?.best;
  const confidence = data?.confidence ?? 0;
  const sfx = useSfx();
  const { playVoice } = useVoice();
  const playedRef = useRef(false);

  const loggedRef = useRef(false);

  useEffect(() => {
    if (data?.best && q) {
      addToHistory(q, data.best.category);
      if (!loggedRef.current) {
        logLookup(data.best.category);
        loggedRef.current = true;
      }
    }
  }, [data?.best, q, addToHistory, logLookup]);

  useEffect(() => {
    if (playedRef.current) return;

    if (errorMsg) {
      sfx.error();
      playedRef.current = true;
      return;
    }

    if (!isLoading && data) {
      if (!activeMaterial) {
        sfx.warning();
      } else {
        const cat: string = activeMaterial.category;
        if (cat === "recycle" || cat === "compost") sfx.success();
        else if (cat === "hazardous" || cat === "dropoff") sfx.warning();
        else sfx.reveal();
        playVoice("scan_result", { category: activeMaterial.category });
      }
      playedRef.current = true;
    }
  }, [isLoading, data, errorMsg, activeMaterial, sfx, playVoice]);

  const { containerRef, pulling, pullDistance } = usePullToRefresh(() =>
    refetch()
  );

  if (errorMsg) {
    return (
      <ErrorState
        message={errorMsg}
        query={q}
        isScan={isScan}
        onRetry={() => refetch()}
      />
    );
  }

  const funnyResponse = searchParams.get("funny");
  if (funnyResponse) {
    return (
      <FunnyResult
        message={funnyResponse}
        productDescription={searchParams.get("product")}
      />
    );
  }

  if (!q) {
    return <EmptyState />;
  }

  if (isLoading && !data) {
    return <ResultSkeleton />;
  }

  if (error && !data) {
    const msg =
      error instanceof Error ? error.message : "Something went wrong.";
    return (
      <ErrorState
        message={msg}
        query={q}
        isScan={isScan}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  if (!activeMaterial) {
    return (
      <UnknownState
        query={q}
        matches={data.matches}
        rationale={data.rationale}
        onSelectAlternative={setSelectedMaterial}
      />
    );
  }

  const productDescription = searchParams.get("product");
  const textFound = searchParams.get("textFound");
  const materialComp = searchParams.get("material");

  const categoryLabel = CATEGORY_META[activeMaterial.category]?.label ?? activeMaterial.category;
  const liveAnnouncement = `${activeMaterial.name}: ${categoryLabel}.`;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 px-4 py-8">
      {/* Screen reader announcement when result loads or category changes */}
      <div
        aria-live="polite"
        aria-atomic
        className="sr-only"
        role="status"
      >
        {liveAnnouncement}
      </div>
      {/* Pull-to-refresh indicator */}
      {pulling && (
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: pullDistance > 50 ? 1 : 0.5 }}
        >
          <RotateCcw
            className="h-5 w-5 text-muted-foreground"
            style={{
              transform: `rotate(${pullDistance * 3}deg)`,
            }}
          />
        </motion.div>
      )}

      {/* Stale data indicator */}
      {isPlaceholderData && isFetching && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Updating...
        </div>
      )}

      {/* Editable search */}
      <div className="w-full max-w-lg">
        <SearchBar defaultValue={q} />
      </div>

      {isScan && (productDescription || textFound || materialComp) && (
        <ScanContext
          productDescription={productDescription}
          textFound={textFound}
          materialComposition={materialComp}
        />
      )}

      <ResultCard
        material={activeMaterial}
        confidence={confidence}
        providerName={data.providerName}
        rationale={data.rationale}
        alternatives={data.matches}
        onSelectAlternative={setSelectedMaterial}
      />

      <ProviderComparison
        itemName={activeMaterial.name}
        currentProviderId={providerId}
        currentCategory={activeMaterial.category}
      />

      <RelatedItems
        currentName={activeMaterial.name}
        currentId={activeMaterial.id}
        providerId={providerId}
      />

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:w-auto sm:max-w-none">
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/">
            <RotateCcw className="h-3.5 w-3.5" />
            Scan another
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/">
            <Search className="h-3.5 w-3.5" />
            New search
          </Link>
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 px-4 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Search className="h-12 w-12 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-semibold">No item specified</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Search for an item or scan a photo to get started.
        </p>
      </div>
      <div className="w-full max-w-md">
        <SearchBar autoFocus />
      </div>
    </motion.div>
  );
}

function parseErrorType(message: string): "network" | "image" | "generic" {
  const lower = message.toLowerCase();
  if (
    lower.includes("offline") ||
    lower.includes("network") ||
    lower.includes("internet")
  )
    return "network";
  if (lower.includes("blurry") || lower.includes("image") || lower.includes("photo"))
    return "image";
  return "generic";
}

function ErrorState({
  message,
  query,
  isScan,
  onRetry,
}: {
  message: string;
  query?: string;
  isScan?: boolean;
  onRetry?: () => void;
}) {
  const errorType = parseErrorType(message);

  const Icon =
    errorType === "network"
      ? WifiOff
      : errorType === "image"
        ? ImageOff
        : AlertCircle;

  const heading =
    errorType === "network"
      ? "No internet connection"
      : errorType === "image"
        ? "Couldn't read the image"
        : "Something went wrong";
  const subline =
    errorType === "network"
      ? "The bins need the internet to help. Connect and try again."
      : errorType === "image"
        ? "Even the AI is squinting. Try better light or a clearer shot."
        : undefined;

  return (
    <motion.div
      className="flex flex-col items-center gap-6 px-4 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Icon className="h-12 w-12 text-muted-foreground" />
      <div>
        <h2 className="text-lg font-semibold">{heading}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {subline ?? message}
        </p>
      </div>
      <div className="w-full max-w-md">
        <SearchBar autoFocus defaultValue={query} />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="default" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
        )}
        {isScan && (
          <Button asChild variant="outline" className="gap-2">
            <Link href="/?openCamera=true">
              <Camera className="h-4 w-4" />
              Retake photo
            </Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back home
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

function UnknownState({
  query,
  matches,
  rationale,
  onSelectAlternative,
}: {
  query: string;
  matches: Array<{ material: Material; score: number }>;
  rationale: string[];
  onSelectAlternative: (m: Material) => void;
}) {
  const sfx = useSfx();

  return (
    <motion.div
      className="flex flex-col items-center gap-6 px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <CategoryBadge category="unknown" size="xl" />
      <div className="text-center">
        <h2 className="text-xl font-bold">
          Not sure about &ldquo;{query}&rdquo;
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          We couldn&apos;t confidently identify this item — the bins are shrugging.
          Try a more specific search term, or choose from the closest matches below.
        </p>
      </div>

      {matches.length > 0 && (
        <div className="w-full max-w-md space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Closest matches
          </p>
          {matches.map((m) => (
            <button
              key={m.material.id}
              onClick={() => {
                sfx.pop();
                onSelectAlternative(m.material);
              }}
              aria-label={`View result for ${m.material.name}`}
              className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CategoryBadge category={m.material.category} size="sm" />
              <span className="flex-1 text-sm font-medium">
                {m.material.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(m.score * 100)}%
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="w-full max-w-md">
        <SearchBar autoFocus defaultValue={query} />
      </div>

      {rationale.length > 0 && (
        <details className="text-xs text-muted-foreground max-w-md" open>
          <summary className="cursor-pointer">Details</summary>
          <ul className="mt-2 space-y-1">
            {rationale.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </details>
      )}
    </motion.div>
  );
}

export default function ResultClientPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultContent />
    </Suspense>
  );
}
