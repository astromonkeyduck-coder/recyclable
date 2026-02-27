"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/utils/categories";
import type { DisposalCategory } from "@/lib/providers/types";

type SearchResult = {
  materialId: string;
  name: string;
  category: DisposalCategory;
  score: number;
};

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { providerId } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results, isFetching } = useQuery<SearchResult[]>({
    queryKey: ["search", providerId, query],
    queryFn: async () => {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&provider=${providerId}`
      );
      if (!res.ok) return [];
      return res.json();
    },
    enabled: query.trim().length >= 2,
    staleTime: 60_000,
  });

  const handleSubmit = useCallback(
    (searchQuery?: string) => {
      const q = (searchQuery ?? query).trim();
      if (!q) return;
      setIsOpen(false);
      router.push(`/result?q=${encodeURIComponent(q)}&provider=${providerId}`);
    },
    [query, providerId, router]
  );

  const handleSelect = useCallback(
    (materialId: string, name: string) => {
      setQuery(name);
      setIsOpen(false);
      router.push(
        `/result?q=${encodeURIComponent(name)}&materialId=${materialId}&provider=${providerId}`
      );
    },
    [providerId, router]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search any item... (e.g. plastic bag, batteries)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") setIsOpen(false);
          }}
          className="h-12 pl-10 pr-10 text-base"
          autoFocus={autoFocus}
          aria-label="Search for an item to check disposal"
          aria-expanded={isOpen && !!results?.length}
          role="combobox"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </button>
        )}
      </div>

      {isOpen && results && results.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg"
          role="listbox"
        >
          {results.map((r) => {
            const meta = CATEGORY_META[r.category];
            return (
              <li key={r.materialId}>
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                  onClick={() => handleSelect(r.materialId, r.name)}
                  role="option"
                  aria-selected={false}
                >
                  <span className={cn("text-sm", meta.textColor)}>{meta.icon}</span>
                  <span className="flex-1 text-sm font-medium">{r.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      meta.bgColor,
                      meta.textColor
                    )}
                  >
                    {meta.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
