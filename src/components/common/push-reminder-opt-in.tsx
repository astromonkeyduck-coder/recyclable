"use client";

import { useState, useCallback, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

const STORAGE_KEY = "itr-push-subscribed";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(base64.replace(/-/g, "+").replace(/_/g, "/") + padding);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushReminderOptIn() {
  const [status, setStatus] = useState<"unsupported" | "idle" | "loading" | "subscribed" | "denied" | "error">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    const subscribed = localStorage.getItem(STORAGE_KEY) === "1";
    setStatus(subscribed ? "subscribed" : "idle");
  }, []);

  const subscribe = useCallback(async () => {
    if (status === "loading" || status === "subscribed" || status === "denied") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/push/vapid-public");
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const { publicKey } = (await res.json()) as { publicKey: string };
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const body = sub.toJSON();
      const postRes = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!postRes.ok) {
        setStatus("error");
        return;
      }
      localStorage.setItem(STORAGE_KEY, "1");
      setStatus("subscribed");
    } catch {
      if (Notification.permission === "denied") setStatus("denied");
      else setStatus("error");
    }
  }, [status]);

  const handleClick = useCallback(async () => {
    if (status !== "idle" && status !== "error") return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      await subscribe();
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribe();
    } else if (permission === "denied") {
      setStatus("denied");
    }
  }, [status, subscribe]);

  if (!mounted || status === "unsupported") return null;

  const linkClass =
    "relative flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-200 hover:after:w-full";

  if (status === "subscribed") {
    return (
      <span className={`inline-flex items-center gap-2 text-sm ${linkClass}`} aria-live="polite">
        <Bell className="h-3.5 w-3.5 text-green-600" />
        Reminders on
      </span>
    );
  }

  if (status === "denied") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground/70" title="Notifications were blocked">
        <BellOff className="h-3.5 w-3.5" />
        Reminders blocked
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm ${linkClass}`}
      disabled={status === "loading"}
      aria-label="Enable reminder notifications"
    >
      {status === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Bell className="h-3.5 w-3.5" />
      )}
      {status === "loading" ? "Enabling…" : status === "error" ? "Try again" : "Reminders"}
    </button>
  );
}
