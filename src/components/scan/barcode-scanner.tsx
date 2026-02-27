"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;
    const el = containerRef.current;
    if (!el) return;

    const init = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const id = "barcode-reader";
        el.innerHTML = `<div id="${id}" class="w-full h-full min-h-[200px]"></div>`;
        const readerEl = document.getElementById(id);
        if (!readerEl) return;

        scanner = new Html5Qrcode(id);
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10 },
          (decodedText: string) => {
            scanner?.stop().catch(() => {});
            onScan(decodedText);
          },
          () => {}
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not start camera");
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => {
      scanner?.stop().catch(() => {}).finally(() => scanner?.clear());
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold text-white">Scan barcode</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            Starting camera...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-white/80">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
      <p className="p-4 text-center text-sm text-white/60">
        Point your camera at a product barcode (UPC / EAN)
      </p>
    </div>
  );
}
