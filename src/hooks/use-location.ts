"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "itr-provider-id";
const DEFAULT_PROVIDER =
  process.env.NEXT_PUBLIC_DEFAULT_PROVIDER ?? "general";

export function useLocation() {
  const [providerId, setProviderIdState] = useState<string>(DEFAULT_PROVIDER);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProviderIdState(stored);
    }
    setIsLoaded(true);
  }, []);

  const setProviderId = useCallback((id: string) => {
    setProviderIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return { providerId, setProviderId, isLoaded };
}
