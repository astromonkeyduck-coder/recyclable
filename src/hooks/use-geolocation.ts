"use client";

import { useState, useCallback, useEffect } from "react";
import type { Coordinates } from "@/lib/facilities/types";

const STORAGE_KEY = "itr-user-coords";

type GeoState = {
  coordinates: Coordinates | null;
  source: "gps" | "manual" | "stored" | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => void;
  setManualLocation: (coords: Coordinates) => void;
  clearLocation: () => void;
};

export function useGeolocation(): GeoState {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [source, setSource] = useState<GeoState["source"]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.lat && parsed.lng) {
          setCoordinates(parsed);
          setSource("stored");
        }
      } catch {}
    }
  }, []);

  const persist = useCallback((coords: Coordinates) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setError("Location requires a secure (HTTPS) connection.");
      return;
    }

    setLoading(true);
    setError(null);

    // Check browser permission state first (if available)
    if ("permissions" in navigator) {
      try {
        const status = await navigator.permissions.query({ name: "geolocation" });
        if (status.state === "denied") {
          setError(
            "Location is blocked for this site. Open your browser settings, find this site's permissions, and allow Location. Then try again."
          );
          setLoading(false);
          return;
        }
      } catch {
        // Permissions API not supported for geolocation on this browser — continue
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoordinates(coords);
        setSource("gps");
        setLoading(false);
        persist(coords);
      },
      (err) => {
        let message: string;
        if (err.code === err.PERMISSION_DENIED) {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          message = isIOS
            ? "Location denied. On iOS: tap the \"AA\" button in the address bar → Website Settings → Location → Allow. Then try again."
            : "Location denied. Check your browser's site settings and make sure Location is set to Allow for this site.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message =
            "Unable to determine your location. Make sure Location Services are turned on in your device settings, or search by ZIP code.";
        } else {
          message =
            "Location request timed out. Make sure you have a clear GPS signal, or search by ZIP code.";
        }
        setError(message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  }, [persist]);

  const setManualLocation = useCallback(
    (coords: Coordinates) => {
      setCoordinates(coords);
      setSource("manual");
      setError(null);
      persist(coords);
    },
    [persist]
  );

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setSource(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    coordinates,
    source,
    loading,
    error,
    requestPermission,
    setManualLocation,
    clearLocation,
  };
}
