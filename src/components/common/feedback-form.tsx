"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import type { DisposalCategory } from "@/lib/providers/types";
import { CATEGORY_META } from "@/lib/utils/categories";
import { CategoryIcon } from "./category-icon";

type FeedbackFormProps = {
  itemName: string;
  category: DisposalCategory;
  providerName: string;
  children: React.ReactNode;
  query?: string;
  providerId?: string;
  conceptId?: string;
  materialId?: string;
};

const CATEGORY_OPTIONS: DisposalCategory[] = [
  "recycle",
  "trash",
  "compost",
  "donate",
  "yard-waste",
  "deposit",
  "dropoff",
  "hazardous",
  "unknown",
];

const FEEDBACK_KEY = "itr-feedback-log";

const ENGINE_CATEGORIES = [
  "recycle",
  "compost",
  "trash",
  "dropoff",
  "hazardous",
] as const;

export function FeedbackForm({
  itemName,
  category,
  providerName,
  children,
  query,
  providerId,
  conceptId,
  materialId,
}: FeedbackFormProps) {
  const [open, setOpen] = useState(false);
  const [correctCategory, setCorrectCategory] = useState<
    DisposalCategory | ""
  >("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        providerId: providerId ?? "general",
        query: query ?? itemName,
        expectedCategory: correctCategory
          ? (ENGINE_CATEGORIES.includes(correctCategory as (typeof ENGINE_CATEGORIES)[number])
              ? correctCategory
              : undefined)
          : undefined,
        reportedCategory: ENGINE_CATEGORIES.includes(category as (typeof ENGINE_CATEGORIES)[number])
          ? category
          : undefined,
        conceptId,
        materialId,
        comment: details || undefined,
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Feedback request failed");
      }

      const existing = JSON.parse(
        localStorage.getItem(FEEDBACK_KEY) || "[]"
      );
      existing.push({
        itemName,
        shownCategory: category,
        correctCategory: correctCategory || undefined,
        details,
        providerName,
        timestamp: Date.now(),
      });
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(existing.slice(-50)));

      toast.success("Thank you for your feedback!");
      setOpen(false);
      setCorrectCategory("");
      setDetails("");
    } catch {
      toast.error("Could not submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{children}</span>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Report wrong result
          </DialogTitle>
          <DialogDescription>
            Help us improve by reporting incorrect disposal guidance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border p-3 bg-muted/30 text-sm">
            <p>
              <span className="text-muted-foreground">Item:</span>{" "}
              <strong>{itemName}</strong>
            </p>
            <p>
              <span className="text-muted-foreground">Shown as:</span>{" "}
              <span className="inline-flex items-center gap-1.5">
                <CategoryIcon category={category} size="xs" bare />
                {CATEGORY_META[category].label}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Location:</span>{" "}
              {providerName}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              What should the correct disposal be?
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const meta = CATEGORY_META[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCorrectCategory(cat)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      correctCategory === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <CategoryIcon category={cat} size="xs" bare />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Feedback is stored locally and not sent to a server.
          </p>

          <div className="space-y-2">
            <label htmlFor="feedback-details" className="text-sm font-medium">
              Additional details (optional)
            </label>
            <Input
              id="feedback-details"
              placeholder="e.g. This is actually compostable in my area..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="gap-1.5">
              Submit feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
