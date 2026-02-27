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
          className="pointer-events-none w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-10 w-full" style={{ opacity: 0.35 }}>
            <AudioVisualizer barCount={64} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
