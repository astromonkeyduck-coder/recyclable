"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallContextValue = {
  /** True when the browser has offered the install prompt (Android Chrome, desktop Chrome/Edge). Call promptInstall() for one-tap install. */
  canInstallNative: boolean;
  /** Show the browser's native install dialog. No-op if canInstallNative is false. */
  promptInstall: () => Promise<void>;
  /** True when the app is already running as an installed PWA. */
  isStandalone: boolean;
};

const InstallContext = createContext<InstallContextValue>({
  canInstallNative: false,
  promptInstall: async () => {},
  isStandalone: false,
});

export function useInstall() {
  return useContext(InstallContext);
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone ===
          true);
    setIsStandalone(standalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  }, [deferredPrompt]);

  const value: InstallContextValue = {
    canInstallNative: !!deferredPrompt,
    promptInstall,
    isStandalone,
  };

  return (
    <InstallContext.Provider value={value}>{children}</InstallContext.Provider>
  );
}
