"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "itr-provider-id";
const CITY_STORAGE_KEY = "itr-geo-city";
const GEO_FETCHED_KEY = "itr-geo-fetched";
const DEFAULT_PROVIDER =
  process.env.NEXT_PUBLIC_DEFAULT_PROVIDER ?? "general";

type GeoData = { city: string | null; providerId: string | null };

function applyGeo(
  data: GeoData,
  setCity: (c: string | null) => void,
  setProvider: (id: string) => void
) {
  localStorage.setItem(GEO_FETCHED_KEY, "1");
  if (data.city) {
    setCity(data.city);
    localStorage.setItem(CITY_STORAGE_KEY, data.city);
  }
  if (data.providerId) {
    setProvider(data.providerId);
    localStorage.setItem(STORAGE_KEY, data.providerId);
  }
}

function fetchGeo(url: string): Promise<GeoData | null> {
  return fetch(url)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
}

function tryBrowserGeolocation(): Promise<GeolocationPosition | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { timeout: 8000, maximumAge: 600_000 }
    );
  });
}

export function useLocation() {
  const [providerId, setProviderIdState] = useState<string>(DEFAULT_PROVIDER);
  const [cityName, setCityName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedCity = localStorage.getItem(CITY_STORAGE_KEY);

    if (stored) {
      setProviderIdState(stored);
    }
    if (storedCity) {
      setCityName(storedCity);
    }

    setIsLoaded(true);

    const alreadyFetched = localStorage.getItem(GEO_FETCHED_KEY);
    if (stored || alreadyFetched) return;

    (async () => {
      const pos = await tryBrowserGeolocation();

      const url = pos
        ? `/api/geo?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
        : "/api/geo";

      const data = await fetchGeo(url);
      if (data) {
        applyGeo(data, setCityName, setProviderIdState);
      }
    })();
  }, []);

  const setProviderId = useCallback((id: string, displayName?: string) => {
    setProviderIdState(id);
    localStorage.setItem(STORAGE_KEY, id);

    if (displayName) {
      setCityName(displayName);
      localStorage.setItem(CITY_STORAGE_KEY, displayName);
    } else if (id === "general") {
      setCityName(null);
      localStorage.removeItem(CITY_STORAGE_KEY);
    }
  }, []);

  const detectLocation = useCallback(async () => {
    localStorage.removeItem(GEO_FETCHED_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CITY_STORAGE_KEY);

    const pos = await tryBrowserGeolocation();
    const url = pos
      ? `/api/geo?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
      : "/api/geo";

    const data = await fetchGeo(url);
    if (data) {
      applyGeo(data, setCityName, setProviderIdState);
      if (!data.providerId) {
        setProviderIdState(DEFAULT_PROVIDER);
        localStorage.setItem(STORAGE_KEY, DEFAULT_PROVIDER);
      }
    }

    return data;
  }, []);

  return { providerId, setProviderId, cityName, isLoaded, detectLocation };
}
