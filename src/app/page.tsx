"use client";

import { motion } from "framer-motion";
import { Recycle } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { SearchChips } from "@/components/search/search-chips";
import { ScanUploadButtons } from "@/components/scan/scan-button";
import { EcoTree } from "@/components/common/eco-tree";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center px-4 pb-16">
      {/* Desktop tree - left side */}
      <EcoTree className="fixed left-8 bottom-0 opacity-50 xl:left-16 xl:opacity-70 2xl:left-24" />
      {/* Desktop tree - right side (mirrored, smaller) */}
      <div className="hidden lg:block fixed right-8 bottom-0 opacity-30 xl:right-16 xl:opacity-50 2xl:right-24 select-none pointer-events-none" style={{ transform: "scaleX(-1)" }}>
        <EcoTree />
      </div>

      {/* Hero */}
      <motion.div
        className="flex flex-col items-center gap-4 pt-16 pb-10 text-center sm:pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Recycle className="h-14 w-14 text-green-600 sm:h-16 sm:w-16" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Is this recyclable?
        </h1>
        <p className="max-w-md text-muted-foreground text-base sm:text-lg">
          Snap it, search it, sort it. Stop guessing and start disposing
          like a pro with your local rules.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex w-full max-w-lg flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <ScanUploadButtons />

        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            or search
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <SearchBar />
      </motion.div>

      {/* Popular searches */}
      <motion.div
        className="mt-10 w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="mb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Popular searches
        </p>
        <SearchChips />
      </motion.div>
    </div>
  );
}
