"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ResultCard } from "@/components/result/result-card";
import { ScanContext } from "@/components/result/scan-context";
import { ScanningAnimation } from "@/components/scan/scanning-animation";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/common/category-badge";
import { ArrowLeft, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import type { Material, DisposalCategory } from "@/lib/providers/types";

type ResolveResult = {
  best: Material | null;
  matches: Array<{ material: Material; score: number }>;
  confidence: number;
  rationale: string[];
  providerName: string;
};

function ResultContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const providerId = searchParams.get("provider") ?? "general";
  const errorMsg = searchParams.get("error");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const { data, isLoading, error } = useQuery<ResolveResult>({
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
          visionConfidence: scanConfidence ? parseFloat(scanConfidence) : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to resolve item");
      }

      return res.json();
    },
    enabled: !!q && !errorMsg,
    staleTime: 5 * 60_000,
  });

  const activeMaterial = selectedMaterial ?? data?.best;
  const confidence = data?.confidence ?? 0;

  if (errorMsg) {
    return <ErrorState message={errorMsg} />;
  }

  if (!q) {
    return <EmptyState />;
  }

  if (isLoading) {
    return <ScanningAnimation />;
  }

  if (error || !data) {
    return <ErrorState message="Something went wrong. Please try again." />;
  }

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

  const isScan = searchParams.get("scan") === "true";
  const productDescription = searchParams.get("product");
  const textFound = searchParams.get("textFound");
  const materialComp = searchParams.get("material");

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
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

      <div className="flex gap-3">
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

function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 px-4 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-4xl">😕</div>
      <div>
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      <div className="w-full max-w-md">
        <SearchBar autoFocus />
      </div>
      <Button asChild variant="outline">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back home
        </Link>
      </Button>
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
          We couldn&apos;t confidently identify this item. Try a more specific search
          term, or choose from the closest matches below.
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
              onClick={() => onSelectAlternative(m.material)}
              className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
            >
              <CategoryBadge category={m.material.category} size="sm" />
              <span className="flex-1 text-sm font-medium">{m.material.name}</span>
              <span className="text-xs text-muted-foreground">
                {Math.round(m.score * 100)}%
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="w-full max-w-md">
        <SearchBar autoFocus />
      </div>

      {rationale.length > 0 && (
        <details className="text-xs text-muted-foreground max-w-md">
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
    <Suspense fallback={<ScanningAnimation />}>
      <ResultContent />
    </Suspense>
  );
}
