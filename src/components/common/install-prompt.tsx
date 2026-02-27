"use client";

import { useState, useEffect } from "react";
import { Download, WifiOff, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const VISIT_COUNT_KEY = "itr-visit-count";
const PROMPT_DISMISSED_KEY = "itr-install-dismissed";
const MIN_VISITS_BEFORE_PROMPT = 2;

const BENEFITS = [
  { icon: WifiOff, text: "Works offline" },
  { icon: Zap, text: "Faster access" },
  { icon: Smartphone, text: "Home screen shortcut" },
];

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    if (standalone) {
      setIsStandalone(true);
      return;
    }

    const dismissed =
      typeof localStorage !== "undefined" &&
      localStorage.getItem(PROMPT_DISMISSED_KEY) === "1";
    if (dismissed) return;

    const count =
      parseInt(localStorage?.getItem(VISIT_COUNT_KEY) ?? "0", 10) + 1;
    localStorage?.setItem(VISIT_COUNT_KEY, String(count));

    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const currentCount = parseInt(
        localStorage?.getItem(VISIT_COUNT_KEY) ?? "0",
        10
      );
      if (currentCount >= MIN_VISITS_BEFORE_PROMPT) setShowBanner(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall as EventListener
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall as EventListener
      );
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage?.setItem(PROMPT_DISMISSED_KEY, "1");
  };

  if (!showBanner || isStandalone || !deferredPrompt) return null;

  const isMobile =
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg rounded-xl border bg-background/95 p-5 shadow-lg backdrop-blur sm:left-auto sm:right-4"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold">
              Add to Home Screen
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Get the full app experience
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 text-xs text-muted-foreground"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                  <Icon className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                {text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="gap-1.5 flex-1"
              onClick={handleInstall}
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </Button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
