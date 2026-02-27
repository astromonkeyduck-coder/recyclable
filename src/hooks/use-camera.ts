"use client";

import { useCallback, useRef, useState } from "react";

export type CameraError = {
  type: "denied" | "not-found" | "unknown";
  message: string;
};

type FacingMode = "environment" | "user";

type UseCameraReturn = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isActive: boolean;
  error: CameraError | null;
  facingMode: FacingMode;
  hasMultipleCameras: boolean;
  startCamera: (facing?: FacingMode) => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => Promise<void>;
  captureFrame: () => string | null;
};

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<CameraError | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const startCamera = useCallback(
    async (facing?: FacingMode) => {
      const mode = facing ?? facingMode;
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setFacingMode(mode);
        setIsActive(true);

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(
            (d) => d.kind === "videoinput"
          );
          setHasMultipleCameras(videoDevices.length >= 2);
        } catch {
          // ignore enumeration failure
        }
      } catch (err) {
        const cameraError: CameraError =
          err instanceof DOMException && err.name === "NotAllowedError"
            ? {
                type: "denied",
                message:
                  "Camera access denied. Please allow camera access in your browser settings.",
              }
            : err instanceof DOMException && err.name === "NotFoundError"
              ? {
                  type: "not-found",
                  message: "No camera found on this device.",
                }
              : {
                  type: "unknown",
                  message:
                    "Unable to access camera. Please try uploading a photo instead.",
                };
        setError(cameraError);
        setIsActive(false);
      }
    },
    [facingMode]
  );

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const switchCamera = useCallback(async () => {
    stopCamera();
    const newMode = facingMode === "environment" ? "user" : "environment";
    await startCamera(newMode);
  }, [facingMode, stopCamera, startCamera]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.85);
  }, []);

  return {
    videoRef,
    canvasRef,
    isActive,
    error,
    facingMode,
    hasMultipleCameras,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame,
  };
}
