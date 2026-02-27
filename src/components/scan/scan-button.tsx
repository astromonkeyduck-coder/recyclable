"use client";

import { Camera, Upload, Loader2, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/hooks/use-location";
import { AnimatePresence, motion } from "framer-motion";
import { AnalyzingOverlay } from "./analyzing-overlay";
import { ImagePreview } from "./image-preview";
import { BarcodeScanner } from "./barcode-scanner";
import { useSfx } from "@/components/sfx/sfx-context";
import { toast } from "sonner";

export type AnalysisPhase = "uploading" | "scanning" | "matching" | "finalizing";

const CameraView = lazy(() =>
  import("./camera-view").then((m) => ({ default: m.CameraView }))
);

type ScanUploadButtonsProps = {
  autoOpenCamera?: boolean;
};

export function ScanUploadButtons({ autoOpenCamera }: ScanUploadButtonsProps) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [phase, setPhase] = useState<AnalysisPhase>("uploading");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { providerId } = useLocation();
  const sfx = useSfx();

  useEffect(() => {
    if (autoOpenCamera) {
      setCameraOpen(true);
    }
  }, [autoOpenCamera]);

  const processImage = useCallback(
    async (dataUrl: string) => {
      setPreview(null);
      setPhase("uploading");
      setAnalyzing(dataUrl);
      setIsUploading(true);
      try {
        setPhase("scanning");
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId, image: dataUrl }),
        });

        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ error: "Scan failed" }));
          const msg = err.error || "Scan failed";
          router.push(
            `/result?q=&provider=${providerId}&scan=true&error=${encodeURIComponent(msg)}`
          );
          return;
        }

        setPhase("matching");
        const data = await res.json();

        // Handle funny non-waste detection
        if (data.isNotWaste && data.funnyResponse) {
          setPhase("finalizing");
          const params = new URLSearchParams({
            q: "",
            provider: providerId,
            scan: "true",
            funny: data.funnyResponse,
          });
          if (data.productDescription) {
            params.set("product", data.productDescription);
          }
          router.push(`/result?${params.toString()}`);
          return;
        }

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
        setPhase("finalizing");
        router.push(`/result?${params.toString()}`);
      } catch {
        const msg = navigator.onLine
          ? "Scan failed. Please try again."
          : "No internet connection. Photo scanning requires the internet.";
        router.push(
          `/result?q=&provider=${providerId}&scan=true&error=${encodeURIComponent(msg)}`
        );
      } finally {
        setIsUploading(false);
        setAnalyzing(null);
        setCameraOpen(false);
      }
    },
    [providerId, router]
  );

  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      setBarcodeOpen(false);
      try {
        const res = await fetch(
          `/api/barcode?upc=${encodeURIComponent(barcode)}`
        );
        const data = await res.json();
        if (data.found && data.productName) {
          router.push(
            `/result?q=${encodeURIComponent(data.productName)}&provider=${providerId}&barcode=1`
          );
        } else {
          toast.error("Product not found. Try searching by name.");
          router.push(
            `/result?q=${encodeURIComponent(barcode)}&provider=${providerId}`
          );
        }
      } catch {
        toast.error("Lookup failed. Try searching by name.");
        router.push(`/result?q=&provider=${providerId}`);
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
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  return (
    <>
      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={() => {
            sfx.click();
            setCameraOpen(true);
          }}
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
          onClick={() => {
            sfx.click();
            fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className="gap-2 flex-1 sm:flex-none"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            sfx.click();
            setBarcodeOpen(true);
          }}
          disabled={isUploading}
          className="gap-2 flex-1 sm:flex-none"
          aria-label="Scan barcode"
        >
          <Barcode className="h-4 w-4" />
          Barcode
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

      {/* Image preview overlay */}
      <AnimatePresence>
        {preview && (
          <ImagePreview
            imageDataUrl={preview}
            onConfirm={() => processImage(preview)}
            onRetake={() => {
              setPreview(null);
              setCameraOpen(true);
            }}
            onCancel={() => setPreview(null)}
          />
        )}
      </AnimatePresence>

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
                    <span className="text-sm text-white/50">
                      Starting camera...
                    </span>
                  </div>
                </div>
              }
            >
              <CameraView
                onCapture={(dataUrl) => {
                  setCameraOpen(false);
                  setPreview(dataUrl);
                }}
                onClose={() => setCameraOpen(false)}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barcode scanner overlay */}
      <AnimatePresence>
        {barcodeOpen && (
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onClose={() => setBarcodeOpen(false)}
          />
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
            <AnalyzingOverlay imageDataUrl={analyzing} phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
