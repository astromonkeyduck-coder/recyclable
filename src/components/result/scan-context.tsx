"use client";

import { motion } from "framer-motion";
import { ScanLine, Type, Layers } from "lucide-react";

type ScanContextProps = {
  productDescription: string | null;
  textFound: string | null;
  materialComposition: string | null;
};

export function ScanContext({
  productDescription,
  textFound,
  materialComposition,
}: ScanContextProps) {
  const hasContent = productDescription || textFound || materialComposition;
  if (!hasContent) return null;

  return (
    <motion.div
      className="w-full max-w-lg rounded-lg border border-dashed border-violet-300 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <ScanLine className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          Scan detected
        </span>
      </div>

      <div className="space-y-2">
        {productDescription && (
          <Detail
            icon={<ScanLine className="h-3.5 w-3.5" />}
            label="Identified"
            value={productDescription}
          />
        )}
        {textFound && (
          <Detail
            icon={<Type className="h-3.5 w-3.5" />}
            label="Text read"
            value={textFound}
          />
        )}
        {materialComposition && (
          <Detail
            icon={<Layers className="h-3.5 w-3.5" />}
            label="Made of"
            value={materialComposition}
          />
        )}
      </div>
    </motion.div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-violet-500 dark:text-violet-400 shrink-0">{icon}</span>
      <div>
        <span className="font-medium text-violet-700 dark:text-violet-300">{label}: </span>
        <span className="text-violet-600/80 dark:text-violet-400/80">{value}</span>
      </div>
    </div>
  );
}
