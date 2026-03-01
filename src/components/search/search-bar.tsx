"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, Camera } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/utils/categories";
import { CategoryIcon } from "@/components/common/category-icon";
import type { DisposalCategory } from "@/lib/providers/types";
import { useSfx } from "@/components/sfx/sfx-context";

type SearchResult = {
  materialId: string;
  name: string;
  category: DisposalCategory;
  score: number;
};

type SearchResponse = {
  results: SearchResult[];
  suggestions: string[];
};

type SearchBarProps = {
  autoFocus?: boolean;
  defaultValue?: string;
  onSearch?: (query: string) => void;
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function SearchBar({ autoFocus = false, onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebouncedValue(query, 300);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { providerId } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sfx = useSfx();

  useEffect(() => {
    if (!autoFocus) return;
    const t = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(t);
  }, [autoFocus]);

  const { data, isFetching, isFetched } = useQuery<SearchResponse>({
    queryKey: ["search", providerId, debouncedQuery],
    queryFn: async () => {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}&provider=${providerId}`
      );
      if (!res.ok) return { results: [], suggestions: [] };
      const json = await res.json();
      if (Array.isArray(json)) return { results: json, suggestions: [] };
      return { results: json.results ?? [], suggestions: json.suggestions ?? [] };
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60_000,
  });

  const results = data?.results;
  const suggestions = data?.suggestions ?? [];
  const showDropdown = isOpen && query.trim().length >= 2;
  const hasResults = !!results?.length;
  const showEmpty = showDropdown && !hasResults && !isFetching && isFetched;

  useEffect(() => {
    setHighlightIndex(-1);
  }, [results]);

  const handleSubmit = useCallback(
    (searchQuery?: string) => {
      const q = (searchQuery ?? query).trim();
      if (!q) return;
      sfx.whoosh();
      onSearch?.(q);
      setIsOpen(false);
      router.push(`/result?q=${encodeURIComponent(q)}&provider=${providerId}`);
    },
    [query, providerId, router, onSearch, sfx]
  );

  const handleSelect = useCallback(
    (materialId: string, name: string) => {
      sfx.pop();
      setQuery(name);
      setIsOpen(false);
      onSearch?.(name);
      router.push(
        `/result?q=${encodeURIComponent(name)}&materialId=${materialId}&provider=${providerId}`
      );
    },
    [providerId, router, onSearch, sfx]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown || !hasResults) {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") setIsOpen(false);
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev < results!.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev > 0 ? prev - 1 : results!.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightIndex >= 0 && results![highlightIndex]) {
            const r = results![highlightIndex];
            handleSelect(r.materialId, r.name);
          } else if (results!.length > 0) {
            const first = results![0];
            handleSelect(first.materialId, first.name);
          } else {
            handleSubmit();
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightIndex(-1);
          break;
      }
    },
    [showDropdown, hasResults, results, highlightIndex, handleSubmit, handleSelect]
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

  const activeDescendant =
    highlightIndex >= 0 && results?.[highlightIndex]
      ? `search-option-${results[highlightIndex].materialId}`
      : undefined;

  const showCursor = isFocused && !query.trim();

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        {isFetching ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search any item... (e.g. plastic bag, batteries)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="h-12 pl-10 pr-10 text-base"
          autoFocus={autoFocus}
          aria-label="Search for an item to check disposal"
          aria-expanded={showDropdown && hasResults}
          aria-activedescendant={activeDescendant}
          aria-controls="search-listbox"
          role="combobox"
          autoComplete="off"
        />
        {showCursor && (
          <span
            className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none text-foreground animate-cursor-blink"
            aria-hidden
          >
            |
          </span>
        )}
        {query && (
          <button
            onClick={() => {
              sfx.tap();
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground active:scale-90"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (hasResults || isFetching || showEmpty) && (
          <motion.ul
            id="search-listbox"
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg"
            role="listbox"
            aria-label="Search results"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            {isFetching && !hasResults && (
              <li className="px-4 py-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 flex-1 rounded bg-muted animate-pulse" style={{ width: `${60 + i * 10}%` }} />
                    <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
                  </div>
                ))}
              </li>
            )}
            {showEmpty && (
              <li className="px-4 py-5 text-center">
                <p className="text-sm text-muted-foreground">
                  No results for &ldquo;<span className="font-medium text-foreground">{query.trim()}</span>&rdquo;
                </p>
                {suggestions.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Did you mean?</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="rounded-full border bg-accent/50 px-3 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                          onClick={() => {
                            setQuery(s);
                            setIsOpen(true);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    The bins don&apos;t know that one yet. Try a different term or{" "}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      onClick={() => {
                        setIsOpen(false);
                        router.push("/?openCamera=true");
                      }}
                    >
                      <Camera className="h-3 w-3" />
                      scan the item
                    </button>
                  </p>
                )}
              </li>
            )}
            {results?.map((r, i) => {
              const meta = CATEGORY_META[r.category];
              const isHighlighted = i === highlightIndex;
              return (
                <li key={r.materialId}>
                  <button
                    id={`search-option-${r.materialId}`}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                      isHighlighted ? "bg-accent" : "hover:bg-accent"
                    )}
                    onClick={() => handleSelect(r.materialId, r.name)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    role="option"
                    aria-selected={isHighlighted}
                  >
                    <CategoryIcon category={r.category} size="xs" bare />
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
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
