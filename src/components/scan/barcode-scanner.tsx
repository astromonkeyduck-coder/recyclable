"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

const BARCODE_FORMATS = [
  0,  // QR_CODE
  1,  // AZTEC
  2,  // CODABAR
  3,  // CODE_39
  4,  // CODE_93
  5,  // CODE_128
  6,  // DATA_MATRIX
  7,  // MAXICODE
  8,  // ITF
  9,  // EAN_13
  10, // EAN_8
  11, // PDF_417
  12, // RSS_14
  13, // RSS_EXPANDED
  14, // UPC_A
  15, // UPC_E
  16, // UPC_EAN_EXTENSION
];

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;
    let stopped = false;
    const el = containerRef.current;
    if (!el) return;

    const init = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (stopped) return;

        const id = "barcode-reader";
        el.innerHTML = `<div id="${id}" style="width:100%;height:100%"></div>`;
        const readerEl = document.getElementById(id);
        if (!readerEl) return;

        scanner = new Html5Qrcode(id, {
          formatsToSupport: BARCODE_FORMATS,
          verbose: false,
        });

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => ({
              width: Math.floor(viewfinderWidth * 0.8),
              height: Math.floor(viewfinderHeight * 0.35),
            }),
            aspectRatio: 16 / 9,
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
          const msg = e instanceof Error ? e.message : "Could not start camera";
          setError(
            msg.includes("NotAllowedError") || msg.includes("Permission")
              ? "Camera permission denied. Allow camera access in your browser settings and try again."
              : msg,
          );
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
        .finally(() => scanner?.clear());
    };
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Scan barcode</h2>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Close"
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
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
            >
              Close
            </button>
          </div>
        )}
      </div>
      <p className="p-4 text-center text-sm text-white/60">
        Point your camera at a product barcode (UPC / EAN / QR)
      </p>
    </div>
  );
}
