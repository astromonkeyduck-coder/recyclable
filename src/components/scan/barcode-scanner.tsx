"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Loader2, RotateCcw } from "lucide-react";

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;
    let stopped = false;
    const el = containerRef.current;
    if (!el) return;

    const init = async () => {
      try {
        const mod = await import("html5-qrcode");
        if (stopped) return;

        const Html5Qrcode = mod.Html5Qrcode;
        const Formats = mod.Html5QrcodeSupportedFormats;

        const formats = [
          Formats.EAN_13,
          Formats.EAN_8,
          Formats.UPC_A,
          Formats.UPC_E,
          Formats.CODE_128,
          Formats.CODE_39,
          Formats.QR_CODE,
          Formats.ITF,
          Formats.CODABAR,
        ];

        const id = `barcode-reader-${Date.now()}`;
        el.innerHTML = `<div id="${id}" style="width:100%;height:100%"></div>`;

        scanner = new Html5Qrcode(id, {
          formatsToSupport: formats,
          verbose: false,
        });

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => ({
              width: Math.floor(viewfinderWidth * 0.8),
              height: Math.floor(viewfinderHeight * 0.35),
            }),
          },
          (decodedText: string) => {
            if (stopped) return;
            stopped = true;
            if (navigator.vibrate) navigator.vibrate(100);
            scanner?.stop().catch(() => {});
            onScanRef.current(decodedText);
          },
          () => {},
        );
        if (!stopped) setLoading(false);
      } catch (e) {
        if (!stopped) {
          const msg = e instanceof Error ? e.message : String(e);
          if (msg.includes("NotAllowedError") || msg.includes("Permission")) {
            setError("Camera permission denied. Allow camera access in your browser settings.");
          } else if (msg.includes("NotFoundError") || msg.includes("no camera")) {
            setError("No camera found on this device.");
          } else {
            setError("Could not start barcode scanner. Try using the regular camera scan instead.");
          }
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      stopped = true;
      scanner
        ?.stop()
        .catch(() => {})
        .finally(() => {
          try { scanner?.clear(); } catch {}
        });
    };
  }, [retryCount]);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setRetryCount((c) => c + 1);
  }, []);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Scan barcode</h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Close barcode scanner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0 relative overflow-hidden">
        {loading && !error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-white/70">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Starting camera...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-sm text-white/80">{error}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="p-4 text-center text-sm text-white/60">
        Point your camera at a product barcode (UPC / EAN / QR)
      </p>
    </div>
  );
}
