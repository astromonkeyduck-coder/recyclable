"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImagePreviewProps = {
  imageDataUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
  onCancel: () => void;
};

export function ImagePreview({
  imageDataUrl,
  onConfirm,
  onRetake,
  onCancel,
}: ImagePreviewProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative flex-1 overflow-hidden">
        <img
          src={imageDataUrl}
          alt="Captured photo preview"
          className="h-full w-full object-contain"
        />

        <button
          ref={cancelButtonRef}
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          aria-label="Cancel"
        >
          <X className="h-5 w-5" />
        </button>

        <motion.div
          className="absolute top-6 inset-x-0 flex justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="rounded-full bg-black/50 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/80">
            Review your photo
          </span>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-4 bg-gradient-to-t from-black via-black/95 to-transparent px-6 py-6">
        <Button
          variant="outline"
          size="lg"
          onClick={onRetake}
          className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Retake
        </Button>
        <Button
          size="lg"
          onClick={onConfirm}
          className="gap-2 bg-green-600 text-white hover:bg-green-700"
        >
          <Check className="h-4 w-4" />
          Use Photo
        </Button>
      </div>
    </motion.div>
  );
}
