"use client";

import { useMusic } from "./music-context";
import { AudioVisualizer } from "./audio-visualizer";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingVisualizer() {
  const { isPlaying } = useMusic();

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          className="pointer-events-none h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AudioVisualizer barCount={64} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
