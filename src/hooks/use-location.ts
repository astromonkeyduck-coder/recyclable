"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "itr-provider-id";
const CITY_STORAGE_KEY = "itr-geo-city";
const GEO_FETCHED_KEY = "itr-geo-fetched";
const DEFAULT_PROVIDER =
  process.env.NEXT_PUBLIC_DEFAULT_PROVIDER ?? "general";

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

    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { city: string | null; providerId: string | null } | null) => {
        if (!data) return;
        localStorage.setItem(GEO_FETCHED_KEY, "1");

        if (data.city) {
          setCityName(data.city);
          localStorage.setItem(CITY_STORAGE_KEY, data.city);
        }
        if (data.providerId) {
          setProviderIdState(data.providerId);
          localStorage.setItem(STORAGE_KEY, data.providerId);
        }
      })
      .catch(() => {});
  }, []);

  const setProviderId = useCallback((id: string) => {
    setProviderIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return { providerId, setProviderId, cityName, isLoaded };
}
