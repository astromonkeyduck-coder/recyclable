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

  const requestPermission = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

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
        const message =
          err.code === err.PERMISSION_DENIED
            ? "Location access denied. You can search by ZIP code or city instead."
            : err.code === err.POSITION_UNAVAILABLE
              ? "Unable to determine your location. Try searching by ZIP code."
              : "Location request timed out. Try searching by ZIP code.";
        setError(message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
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
