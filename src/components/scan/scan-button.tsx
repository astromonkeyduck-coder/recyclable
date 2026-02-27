"use client";

import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useRef, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/hooks/use-location";
import { AnimatePresence, motion } from "framer-motion";
import { AnalyzingOverlay } from "./analyzing-overlay";

const CameraView = lazy(() =>
  import("./camera-view").then((m) => ({ default: m.CameraView }))
);

export function ScanUploadButtons() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { providerId } = useLocation();

  const processImage = useCallback(
    async (dataUrl: string) => {
      setAnalyzing(dataUrl);
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
        const params = new URLSearchParams({
          q,
          provider: providerId,
          scan: "true",
          labels: JSON.stringify(data.labels || []),
          confidence: String(data.visionConfidence ?? 0),
        });
        if (data.productDescription) {
          params.set("product", data.productDescription);
        }
        if (data.textFound) {
          params.set("textFound", data.textFound);
        }
        if (data.materialComposition) {
          params.set("material", data.materialComposition);
        }
        router.push(`/result?${params.toString()}`);
      } catch {
        router.push(`/result?q=&provider=${providerId}&error=Network+error`);
      } finally {
        setIsUploading(false);
        setAnalyzing(null);
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
      if (fileInputRef.current) fileInputRef.current.value = "";
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

      {/* Full-screen camera overlay */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center bg-black">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                    <span className="text-sm text-white/50">Starting camera...</span>
                  </div>
                </div>
              }
            >
              <CameraView
                onCapture={(dataUrl) => {
                  setCameraOpen(false);
                  processImage(dataUrl);
                }}
                onClose={() => setCameraOpen(false)}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyzing overlay */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalyzingOverlay imageDataUrl={analyzing} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
