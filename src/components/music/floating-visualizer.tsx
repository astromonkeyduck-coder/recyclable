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
          className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-12 w-full" style={{ opacity: 0.4 }}>
            <AudioVisualizer barCount={64} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
