"use client";

import { useState, useEffect } from "react";
import { Download, WifiOff, Zap, Smartphone, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/components/voice/voice-context";
import { useInstall } from "@/components/install/install-context";

const VISIT_COUNT_KEY = "itr-visit-count";
const PROMPT_DISMISSED_KEY = "itr-install-dismissed";
const MIN_VISITS_BEFORE_PROMPT = 2;

const BENEFITS = [
  { icon: WifiOff, text: "Works offline" },
  { icon: Zap, text: "Faster access" },
  { icon: Smartphone, text: "Home screen shortcut" },
];

function getMobileOS(): "ios" | "android" | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return null;
}

export function InstallPrompt() {
  const { caption } = useVoice();
  const { canInstallNative, promptInstall, isStandalone } = useInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [mobileOS, setMobileOS] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    if (isStandalone) return;
    setMobileOS(getMobileOS());

    const dismissed =
      typeof localStorage !== "undefined" &&
      localStorage.getItem(PROMPT_DISMISSED_KEY) === "1";
    if (dismissed) return;

    const count =
      parseInt(localStorage?.getItem(VISIT_COUNT_KEY) ?? "0", 10) + 1;
    localStorage?.setItem(VISIT_COUNT_KEY, String(count));
  }, [isStandalone]);

  // When the browser offers native install (Android/desktop), show banner after enough visits
  useEffect(() => {
    if (isStandalone || !canInstallNative) return;
    if (localStorage?.getItem(PROMPT_DISMISSED_KEY) === "1") return;
    const count = parseInt(localStorage?.getItem(VISIT_COUNT_KEY) ?? "0", 10);
    if (count >= MIN_VISITS_BEFORE_PROMPT) setShowBanner(true);
  }, [isStandalone, canInstallNative]);

  // On mobile (especially iOS), beforeinstallprompt never fires — show manual "Add to Home Screen" after enough visits
  useEffect(() => {
    if (isStandalone || showBanner) return;
    const os = getMobileOS();
    if (!os) return;
    const dismissed =
      typeof localStorage !== "undefined" &&
      localStorage.getItem(PROMPT_DISMISSED_KEY) === "1";
    if (dismissed) return;
    const count = parseInt(localStorage?.getItem(VISIT_COUNT_KEY) ?? "0", 10);
    if (count >= MIN_VISITS_BEFORE_PROMPT) setShowBanner(true);
  }, [isStandalone, showBanner]);

  const handleInstall = async () => {
    await promptInstall();
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage?.setItem(PROMPT_DISMISSED_KEY, "1");
  };

  const isMobile = mobileOS !== null;
  if (!showBanner || isStandalone) return null;
  // Don't show while voice is playing so caption and install prompt don't overlap
  if (caption != null) return null;
  // Desktop: only show if we have the native install prompt (beforeinstallprompt fired)
  if (!isMobile && !canInstallNative) return null;
  // Mobile: show either native prompt (Android) or manual instructions (iOS / Android without event)
  if (isMobile && !canInstallNative && !mobileOS) return null;

  const showManualInstructions = isMobile && !canInstallNative;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-label="Add to home screen"
        className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-lg rounded-xl border bg-background/95 p-5 shadow-lg backdrop-blur sm:left-auto sm:right-4"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold">
              {showManualInstructions ? "Install this app" : "Add to Home Screen"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {showManualInstructions
                ? "Add a shortcut to your home screen for quick access"
                : "Get the full app experience"}
            </p>
          </div>

          {showManualInstructions ? (
            <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              {mobileOS === "ios" ? (
                <>
                  <p className="font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <Share className="h-3.5 w-3.5" />
                    On iPhone / iPad
                  </p>
                  <p>Tap the <strong>Share</strong> button at the bottom of Safari (square with arrow), then scroll and tap <strong>“Add to Home Screen”</strong>.</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <Share className="h-3.5 w-3.5" />
                    On Android
                  </p>
                  <p>Tap the <strong>menu</strong> (⋮) in the browser, then choose <strong>“Add to Home screen”</strong> or <strong>“Install app”</strong>.</p>
                </>
              )}
            </div>
          ) : (
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
          )}

          <div className="flex items-center gap-3">
            {!showManualInstructions && (
              <Button
                size="sm"
                className="gap-1.5 flex-1"
                onClick={handleInstall}
              >
                <Download className="h-3.5 w-3.5" />
                Install
              </Button>
            )}
            <button
              type="button"
              onClick={handleDismiss}
              className={`text-xs text-muted-foreground hover:text-foreground px-2 py-1 ${showManualInstructions ? "flex-1 text-center" : ""}`}
              aria-label="Dismiss install prompt"
            >
              {showManualInstructions ? "Got it" : "Not now"}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
