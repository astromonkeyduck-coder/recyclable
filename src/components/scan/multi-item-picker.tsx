"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, X, ArrowRight } from "lucide-react";
import { useSfx } from "@/components/sfx/sfx-context";

type MultiItemPickerProps = {
  labels: string[];
  guessedName: string;
  onSelect: (label: string) => void;
  onClose: () => void;
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function MultiItemPicker({
  labels,
  guessedName,
  onSelect,
  onClose,
}: MultiItemPickerProps) {
  const sfx = useSfx();

  const uniqueLabels = [...new Set(labels.map((l) => l.toLowerCase()))].map(
    (lower) => labels.find((l) => l.toLowerCase() === lower)!
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-background border shadow-2xl p-6 pb-8 sm:pb-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Multiple items detected</h3>
            <p className="text-xs text-muted-foreground">
              Which item would you like to check?
            </p>
          </div>
        </div>

        <motion.div
          className="space-y-2"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Best guess highlighted */}
          {guessedName && (
            <motion.div variants={item}>
              <Button
                variant="default"
                className="w-full justify-between gap-2 h-auto py-3 px-4"
                onClick={() => {
                  sfx.pop();
                  onSelect(guessedName);
                }}
              >
                <span className="text-sm font-medium text-left truncate">
                  {guessedName}
                </span>
                <span className="flex items-center gap-1 text-xs opacity-80 shrink-0">
                  Best match
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Button>
            </motion.div>
          )}

          {/* Other labels */}
          {uniqueLabels
            .filter(
              (l) => l.toLowerCase() !== guessedName.toLowerCase()
            )
            .map((label) => (
              <motion.div key={label} variants={item}>
                <Button
                  variant="outline"
                  className="w-full justify-between gap-2 h-auto py-3 px-4"
                  onClick={() => {
                    sfx.pop();
                    onSelect(label);
                  }}
                >
                  <span className="text-sm font-medium text-left truncate">
                    {label}
                  </span>
                  <ArrowRight className="h-3 w-3 opacity-50 shrink-0" />
                </Button>
              </motion.div>
            ))}
        </motion.div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}
