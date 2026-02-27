"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { DisposalCategory } from "@/lib/providers/types";
import type { OgVariant } from "@/lib/utils/og-params";

const RESULT_SAMPLES: Array<{
  label: string;
  category: DisposalCategory;
  item: string;
  loc: string;
  confidence: number;
  warning?: string;
}> = [
  {
    label: "Recycle - Plastic Bottle",
    category: "recycle",
    item: "Plastic Bottle",
    loc: "Orlando, FL",
    confidence: 95,
  },
  {
    label: "Trash - Plastic Bag",
    category: "trash",
    item: "Plastic Bag",
    loc: "Orlando, FL",
    confidence: 92,
    warning: "Never put in recycling bin",
  },
  {
    label: "Compost - Banana Peel",
    category: "compost",
    item: "Banana Peel",
    loc: "General guidance",
    confidence: 88,
  },
  {
    label: "Drop-off - Old TV",
    category: "dropoff",
    item: "Television",
    loc: "Orlando, FL",
    confidence: 80,
  },
  {
    label: "Hazardous - Batteries",
    category: "hazardous",
    item: "Batteries",
    loc: "General Guidance (US)",
    confidence: 97,
    warning: "Can cause fires in garbage trucks",
  },
  {
    label: "Unknown - Mystery Item",
    category: "unknown",
    item: "Unicorn Horn",
    loc: "Your area",
    confidence: 12,
  },
  {
    label: "Long Item Name",
    category: "recycle",
    item: "Corrugated Cardboard Shipping Box",
    loc: "Orlando, FL",
    confidence: 99,
  },
];

const PAGE_VARIANT_SAMPLES: Array<{
  label: string;
  variant: OgVariant;
}> = [
  { label: "Homepage", variant: "homepage" },
  { label: "About", variant: "about" },
  { label: "FAQ", variant: "faq" },
  { label: "Games", variant: "games" },
  { label: "Facilities", variant: "facilities" },
  { label: "Privacy", variant: "privacy" },
];

function buildOgUrl(params: {
  variant?: string;
  category?: string;
  item?: string;
  loc?: string;
  confidence?: number;
  warning?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.variant && params.variant !== "result") sp.set("variant", params.variant);
  if (params.category) sp.set("category", params.category);
  if (params.item) sp.set("item", params.item);
  if (params.loc) sp.set("loc", params.loc);
  if (params.confidence != null) sp.set("confidence", String(params.confidence));
  if (params.warning) sp.set("warning", params.warning);
  return `/api/og?${sp.toString()}`;
}

export default function DebugOgPage() {
  const [customItem, setCustomItem] = useState("Pizza Box");
  const [customCategory, setCustomCategory] = useState<DisposalCategory>("recycle");
  const [customLoc, setCustomLoc] = useState("Orlando, FL");
  const [customConfidence, setCustomConfidence] = useState(85);
  const [customWarning, setCustomWarning] = useState("");
  const [customVariant, setCustomVariant] = useState<string>("result");

  const customUrl = buildOgUrl({
    variant: customVariant,
    category: customVariant === "result" ? customCategory : undefined,
    item: customVariant === "result" ? customItem : undefined,
    loc: customVariant === "result" ? customLoc : undefined,
    confidence: customVariant === "result" ? customConfidence : undefined,
    warning: customVariant === "result" ? customWarning || undefined : undefined,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">OG Image Debug</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Preview how share cards look across platforms. Each image is 1200x630 and dynamically
        generated.
      </p>

      {/* Custom builder */}
      <section className="mb-12 rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Custom OG Card Builder</h2>
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Variant</label>
            <select
              className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              value={customVariant}
              onChange={(e) => setCustomVariant(e.target.value)}
            >
              {["result", "homepage", "about", "faq", "games", "facilities", "privacy"].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          {customVariant === "result" && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                <select
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as DisposalCategory)}
                >
                  {["recycle", "trash", "compost", "dropoff", "hazardous", "unknown"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Item Name</label>
                <Input value={customItem} onChange={(e) => setCustomItem(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                <Input value={customLoc} onChange={(e) => setCustomLoc(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Confidence (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={customConfidence}
                  onChange={(e) => setCustomConfidence(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Warning (optional)</label>
                <Input
                  value={customWarning}
                  onChange={(e) => setCustomWarning(e.target.value)}
                  placeholder="e.g. Can cause fires in garbage trucks"
                />
              </div>
            </>
          )}
        </div>

        <div className="rounded-lg border overflow-hidden mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={customUrl}
            alt="Custom OG preview"
            className="w-full"
            style={{ aspectRatio: "1200/630" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-muted px-3 py-2 text-xs font-mono break-all">
            {typeof window !== "undefined" ? window.location.origin : ""}{customUrl}
          </code>
          <button
            onClick={() => {
              const fullUrl = `${window.location.origin}${customUrl}`;
              navigator.clipboard.writeText(fullUrl);
            }}
            className="rounded border px-3 py-2 text-xs font-medium hover:bg-accent transition-colors"
          >
            Copy
          </button>
        </div>
      </section>

      {/* Page variant cards */}
      <h2 className="text-lg font-semibold mb-4">Page Variants</h2>
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {PAGE_VARIANT_SAMPLES.map((sample) => {
          const url = buildOgUrl({ variant: sample.variant });
          return (
            <div key={sample.label} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{sample.variant}</Badge>
                <span className="text-sm font-medium">{sample.label}</span>
              </div>
              <div className="rounded-lg border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={sample.label}
                  className="w-full"
                  loading="lazy"
                  style={{ aspectRatio: "1200/630" }}
                />
              </div>
              <code className="block rounded bg-muted px-2 py-1 text-[10px] font-mono text-muted-foreground break-all">
                {url}
              </code>
            </div>
          );
        })}
      </div>

      {/* Result sample cards */}
      <h2 className="text-lg font-semibold mb-4">Result Cards (Category Variants)</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {RESULT_SAMPLES.map((sample) => {
          const url = buildOgUrl(sample);
          return (
            <div key={sample.label} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{sample.category}</Badge>
                <span className="text-sm font-medium">{sample.label}</span>
              </div>
              <div className="rounded-lg border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={sample.label}
                  className="w-full"
                  loading="lazy"
                  style={{ aspectRatio: "1200/630" }}
                />
              </div>
              <code className="block rounded bg-muted px-2 py-1 text-[10px] font-mono text-muted-foreground break-all">
                {url}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
