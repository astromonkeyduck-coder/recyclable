"use client";

import { useCamera } from "@/hooks/use-camera";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, AlertCircle } from "lucide-react";

type CameraViewProps = {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
};

export function CameraView({ onCapture, onClose }: CameraViewProps) {
  const { videoRef, canvasRef, isActive, error, startCamera, stopCamera, captureFrame } =
    useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    const frame = captureFrame();
    if (frame) {
      stopCamera();
      onCapture(frame);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-[4/3] object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanning overlay */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-8 rounded-2xl border-2 border-white/40" />
          <div className="absolute inset-8 rounded-2xl border-t-2 border-white/80 animate-pulse" />
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between bg-gradient-to-t from-black/60">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
        <button
          onClick={handleCapture}
          disabled={!isActive}
          className="h-16 w-16 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm transition-transform active:scale-90 disabled:opacity-50"
          aria-label="Take photo"
        >
          <Camera className="h-6 w-6 mx-auto text-white" />
        </button>
        <div className="w-10" />
      </div>
    </div>
  );
}
