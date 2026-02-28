"use client";

import { useVoice } from "./voice-context";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic } from "lucide-react";

/**
 * Subtle caption for the current voice line. Renders nothing when no caption.
 * Does not use aria-live to avoid conflicting with screen readers.
 */
export function VoiceCaption() {
  const { caption } = useVoice();
  if (!caption) return null;
  return (
    <p
      className="text-xs text-muted-foreground text-center py-1 px-2 max-w-md mx-auto"
      aria-hidden
    >
      {caption}
    </p>
  );
}

/** Fixed pill at bottom center for voice caption. Use inside layout. */
export function VoiceCaptionFixed() {
  const { caption, reducedMotion } = useVoice();
  const reduced = useReducedMotion() ?? reducedMotion;

  return (
    <div
      className="fixed bottom-20 left-0 right-0 z-40 pointer-events-none flex justify-center px-4"
      aria-hidden
    >
      <AnimatePresence mode="wait">
        {caption ? (
          <motion.div
            key={caption}
            className="flex items-center gap-2.5 bg-background/95 dark:bg-background/90 backdrop-blur-md rounded-full py-2.5 px-4 border shadow-lg max-w-sm"
            initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="flex shrink-0 items-center justify-center">
              {reduced ? (
                <Mic className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <SpeakingIndicator />
              )}
            </div>
            <p className="text-sm font-medium text-foreground/90 leading-snug">
              {caption}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** Subtle animated bars to indicate "AI is speaking". */
function SpeakingIndicator() {
  return (
    <div className="flex items-end justify-center gap-0.5 h-3" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-0.5 min-h-1 rounded-full bg-primary/70"
          style={{ height: 4 }}
          animate={{
            height: [4, 10, 4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
