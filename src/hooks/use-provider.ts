"use client";

import { useQuery } from "@tanstack/react-query";

type ProviderSummary = {
  id: string;
  displayName: string;
  coverage: {
    country: string;
    region?: string;
    city?: string;
    zips?: string[];
    aliases?: string[];
  };
};

export function useProviderList() {
  return useQuery<ProviderSummary[]>({
    queryKey: ["providers"],
    queryFn: async () => {
      const res = await fetch("/api/providers");
      if (!res.ok) throw new Error("Failed to load providers");
      const data = await res.json();
      if (Array.isArray(data)) return data;
      throw new Error("Invalid providers response");
    },
    staleTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
