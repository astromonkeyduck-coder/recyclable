"use client";

import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useRef, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/hooks/use-location";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const CameraView = lazy(() =>
  import("./camera-view").then((m) => ({ default: m.CameraView }))
);

export function ScanUploadButtons() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { providerId } = useLocation();

  const processImage = useCallback(
    async (dataUrl: string) => {
      setIsUploading(true);
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId, image: dataUrl }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Scan failed" }));
          router.push(
            `/result?q=&provider=${providerId}&error=${encodeURIComponent(err.error || "Scan failed")}`
          );
          return;
        }

        const data = await res.json();
        const q = data.guessedItemName || data.labels?.[0] || "";
        router.push(
          `/result?q=${encodeURIComponent(q)}&provider=${providerId}&scan=true&labels=${encodeURIComponent(JSON.stringify(data.labels || []))}&confidence=${data.visionConfidence ?? 0}`
        );
      } catch {
        router.push(`/result?q=&provider=${providerId}&error=Network+error`);
      } finally {
        setIsUploading(false);
        setCameraOpen(false);
      }
    },
    [providerId, router]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          processImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [processImage]
  );

  return (
    <>
      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={() => setCameraOpen(true)}
          disabled={isUploading}
          className="gap-2 flex-1 sm:flex-none"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          Scan
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2 flex-1 sm:flex-none"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload a photo"
        />
      </div>

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogTitle className="sr-only">Camera Scanner</DialogTitle>
          <Suspense
            fallback={
              <div className="flex h-80 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <CameraView
              onCapture={(dataUrl) => {
                processImage(dataUrl);
              }}
              onClose={() => setCameraOpen(false)}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </>
  );
}
