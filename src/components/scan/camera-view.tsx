"use client";

import { useCamera } from "@/hooks/use-camera";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, SwitchCamera } from "lucide-react";

type CameraViewProps = {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
};

export function CameraView({ onCapture, onClose }: CameraViewProps) {
  const { videoRef, canvasRef, isActive, error, startCamera, stopCamera, captureFrame } =
    useCamera();
  const [flash, setFlash] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    if (navigator.vibrate) navigator.vibrate(50);

    const frame = captureFrame();
    if (frame) {
      stopCamera();
      onCapture(frame);
    }
  };

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-black p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <span className="text-3xl">📷</span>
        </div>
        <p className="text-sm text-white/70 max-w-xs">{error}</p>
        <button
          onClick={onClose}
          className="mt-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-black">
      {/* Video feed - takes up all available space */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Flash overlay */}
        <AnimatePresence>
          {flash && (
            <motion.div
              className="absolute inset-0 bg-white z-30"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* Viewfinder overlay */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Corner brackets */}
            <Corner position="top-left" />
            <Corner position="top-right" />
            <Corner position="bottom-left" />
            <Corner position="bottom-right" />

            {/* Scanning line that sweeps */}
            <motion.div
              className="absolute left-[10%] right-[10%] h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(34,197,94,0.6), rgba(34,197,94,0.8), rgba(34,197,94,0.6), transparent)",
                boxShadow: "0 0 20px rgba(34,197,94,0.3)",
              }}
              animate={{ top: ["12%", "85%", "12%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Edge vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
              }}
            />

            {/* Hint text */}
            <motion.div
              className="absolute top-6 inset-x-0 flex justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="rounded-full bg-black/50 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/80">
                Position the item in the frame
              </span>
            </motion.div>
          </div>
        )}

        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                key={countdown}
                className="text-8xl font-black text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {countdown}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-5 bg-gradient-to-t from-black via-black/95 to-transparent">
        {/* Close button */}
        <button
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Close camera"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Capture button */}
        <div className="relative">
          {/* Pulse ring */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ margin: "-6px" }}
            />
          )}
          <button
            onClick={handleCapture}
            disabled={!isActive}
            className="relative h-[72px] w-[72px] rounded-full border-[3px] border-white transition-all active:scale-90 disabled:opacity-30"
            aria-label="Take photo"
          >
            <motion.div
              className="absolute inset-[3px] rounded-full bg-white"
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
          </button>
        </div>

        {/* Timer button */}
        <button
          onClick={() => {
            if (countdown !== null) {
              setCountdown(null);
              return;
            }
            let c = 3;
            setCountdown(c);
            const interval = setInterval(() => {
              c--;
              if (c <= 0) {
                clearInterval(interval);
                setCountdown(null);
                handleCapture();
              } else {
                setCountdown(c);
              }
            }, 1000);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Timer capture"
        >
          <Zap className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}

function Corner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const size = "28px";
  const thickness = "3px";
  const offset = "10%";
  const color = "rgba(255,255,255,0.7)";
  const radius = "8px";

  const styles: Record<string, React.CSSProperties> = {
    "top-left": {
      top: offset, left: offset,
      borderTop: `${thickness} solid ${color}`,
      borderLeft: `${thickness} solid ${color}`,
      borderTopLeftRadius: radius,
    },
    "top-right": {
      top: offset, right: offset,
      borderTop: `${thickness} solid ${color}`,
      borderRight: `${thickness} solid ${color}`,
      borderTopRightRadius: radius,
    },
    "bottom-left": {
      bottom: offset, left: offset,
      borderBottom: `${thickness} solid ${color}`,
      borderLeft: `${thickness} solid ${color}`,
      borderBottomLeftRadius: radius,
    },
    "bottom-right": {
      bottom: offset, right: offset,
      borderBottom: `${thickness} solid ${color}`,
      borderRight: `${thickness} solid ${color}`,
      borderBottomRightRadius: radius,
    },
  };

  return (
    <div
      className="absolute"
      style={{ width: size, height: size, ...styles[position] }}
    />
  );
}
