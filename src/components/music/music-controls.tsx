"use client";

import { useMusic } from "./music-context";
import { Volume2, VolumeX, SkipForward, Play, Pause, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioVisualizer } from "./audio-visualizer";
import { motion, AnimatePresence } from "framer-motion";

export function MusicControls() {
  const { isPlaying, isMuted, trackTitle, toggle, toggleMute, next } = useMusic();

  return (
    <div className="flex items-center gap-1">
      {/* Mini visualizer + track name (visible when playing) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            className="hidden sm:flex items-center gap-2 mr-1"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-6">
              <AudioVisualizer barCount={12} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground max-w-[80px] truncate">
              {trackTitle}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play / Pause */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
      </Button>

      {/* Mute */}
      {isPlaying && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
        </Button>
      )}

      {/* Skip */}
      {isPlaying && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={next}
          aria-label="Next track"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
