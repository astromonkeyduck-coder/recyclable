"use client";

import { useCamera } from "@/hooks/use-camera";
import type { CameraError } from "@/hooks/use-camera";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, SwitchCamera, Upload, RotateCcw, Settings } from "lucide-react";
import { useSfx } from "@/components/sfx/sfx-context";

type CameraViewProps = {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
};

function detectPlatform(): "ios-safari" | "android-chrome" | "desktop-chrome" | "desktop-firefox" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS/.test(ua)) return "ios-safari";
  if (/Android/.test(ua) && /Chrome/.test(ua)) return "android-chrome";
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) return "desktop-chrome";
  if (/Firefox/.test(ua)) return "desktop-firefox";
  return "other";
}

const PERMISSION_STEPS: Record<string, string[]> = {
  "ios-safari": [
    "Tap the \"aA\" button in the address bar",
    "Tap \"Website Settings\"",
    "Set Camera to \"Allow\"",
    "Reload this page",
  ],
  "android-chrome": [
    "Tap the lock/tune icon in the address bar",
    "Tap \"Permissions\" or \"Site settings\"",
    "Set Camera to \"Allow\"",
    "Tap the back arrow, then refresh",
  ],
  "desktop-chrome": [
    "Click the lock/tune icon in the address bar",
    "Find \"Camera\" and set it to \"Allow\"",
    "Reload this page",
  ],
  "desktop-firefox": [
    "Click the lock icon in the address bar",
    "Click \"Clear permissions\" for camera",
    "Reload this page and allow when prompted",
  ],
  other: [
    "Open your browser settings",
    "Find site permissions for this website",
    "Allow camera access",
    "Reload this page",
  ],
};

function CameraPermissionHelp({
  error,
  onRetry,
  onClose,
}: {
  error: CameraError;
  onRetry: () => void;
  onClose: () => void;
}) {
  const platform = detectPlatform();
  const steps = PERMISSION_STEPS[platform] ?? PERMISSION_STEPS.other;

  if (error.type !== "denied") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-black p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <span className="text-3xl">📷</span>
        </div>
        <p className="text-sm text-white/70 max-w-xs">{error.message}</p>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 inline-flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-black p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
        <Settings className="h-8 w-8 text-amber-400" />
      </div>
      <div className="max-w-xs">
        <h2 className="text-base font-semibold text-white mb-2">
          Camera access needed
        </h2>
        <p className="text-sm text-white/60 mb-4">
          Follow these steps to enable your camera:
        </p>
        <ol className="text-left space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-white/70">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/80">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="w-full rounded-full bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 inline-flex items-center justify-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload a photo instead
        </button>
      </div>
    </div>
  );
}

export function CameraView({ onCapture, onClose }: CameraViewProps) {
  const {
    videoRef,
    canvasRef,
    isActive,
    error,
    hasMultipleCameras,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame,
  } = useCamera();
  const [flash, setFlash] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showTimerHint, setShowTimerHint] = useState(false);
  const sfx = useSfx();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (!error) closeButtonRef.current?.focus();
  }, [error]);

  useEffect(() => {
    if (!isActive) return;
    const seen = localStorage.getItem("itr-seen-camera-hints");
    if (!seen) {
      setShowTimerHint(true);
      const t = setTimeout(() => {
        setShowTimerHint(false);
        localStorage.setItem("itr-seen-camera-hints", "1");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  const handleCapture = () => {
    sfx.shutter();
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
      <CameraPermissionHelp
        error={error}
        onRetry={() => startCamera()}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-black">
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
            <Corner position="top-left" />
            <Corner position="top-right" />
            <Corner position="bottom-left" />
            <Corner position="bottom-right" />

            <motion.div
              className="absolute left-[10%] right-[10%] h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(34,197,94,0.6), rgba(34,197,94,0.8), rgba(34,197,94,0.6), transparent)",
                boxShadow: "0 0 20px rgba(34,197,94,0.3)",
              }}
              animate={{ top: ["12%", "85%", "12%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
              }}
            />

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
          ref={closeButtonRef}
          onClick={() => {
            sfx.tap();
            onClose();
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Close camera"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Capture button */}
        <div className="relative">
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
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
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
            />
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex flex-col items-center gap-3">
          {/* Camera switch button */}
          {hasMultipleCameras ? (
            <button
              onClick={() => {
                sfx.click();
                switchCamera();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Switch camera"
            >
              <SwitchCamera className="h-5 w-5 text-white" />
            </button>
          ) : (
            <div className="relative">
              {/* Timer hint */}
              <AnimatePresence>
                {showTimerHint && (
                  <motion.div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white/80"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                  >
                    3s timer
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => {
                  setShowTimerHint(false);
                  if (countdown !== null) {
                    setCountdown(null);
                    return;
                  }
                  sfx.click();
                  let c = 3;
                  setCountdown(c);
                  sfx.countdown();
                  const interval = setInterval(() => {
                    c--;
                    if (c <= 0) {
                      clearInterval(interval);
                      setCountdown(null);
                      handleCapture();
                    } else {
                      setCountdown(c);
                      sfx.countdown();
                    }
                  }, 1000);
                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Timer capture"
              >
                <Zap className="h-5 w-5 text-white" />
                {showTimerHint && (
                  <motion.span
                    className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Corner({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const size = "28px";
  const thickness = "3px";
  const offset = "10%";
  const color = "rgba(255,255,255,0.7)";
  const radius = "8px";

  const styles: Record<string, React.CSSProperties> = {
    "top-left": {
      top: offset,
      left: offset,
      borderTop: `${thickness} solid ${color}`,
      borderLeft: `${thickness} solid ${color}`,
      borderTopLeftRadius: radius,
    },
    "top-right": {
      top: offset,
      right: offset,
      borderTop: `${thickness} solid ${color}`,
      borderRight: `${thickness} solid ${color}`,
      borderTopRightRadius: radius,
    },
    "bottom-left": {
      bottom: offset,
      left: offset,
      borderBottom: `${thickness} solid ${color}`,
      borderLeft: `${thickness} solid ${color}`,
      borderBottomLeftRadius: radius,
    },
    "bottom-right": {
      bottom: offset,
      right: offset,
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
