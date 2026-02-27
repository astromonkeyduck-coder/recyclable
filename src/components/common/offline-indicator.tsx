"use client";

import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-1.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <WifiOff className="h-3.5 w-3.5" />
            You&apos;re offline &mdash; text search still works
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
