"use client";

import { useLocation } from "@/hooks/use-location";
import { useQuery } from "@tanstack/react-query";
import { CategoryBadge } from "@/components/common/category-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Lightbulb } from "lucide-react";
import { useState, useMemo } from "react";
import type { Provider, DisposalCategory } from "@/lib/providers/types";
import { CATEGORY_META } from "@/lib/utils/categories";

async function fetchProviderFull(id: string): Promise<Provider> {
  const res = await fetch(`/api/providers/${id}`);
  if (!res.ok) throw new Error("Failed to load provider");
  return res.json();
}

export default function RulesPage() {
  const { providerId } = useLocation();
  const [filter, setFilter] = useState("");

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider-full", providerId],
    queryFn: () => fetchProviderFull(providerId),
    staleTime: 30 * 60_000,
  });

  const grouped = useMemo(() => {
    if (!provider) return {};
    const groups: Record<string, typeof provider.materials> = {};
    for (const m of provider.materials) {
      const lowerFilter = filter.toLowerCase();
      if (
        lowerFilter &&
        !m.name.toLowerCase().includes(lowerFilter) &&
        !m.aliases.some((a) => a.toLowerCase().includes(lowerFilter))
      ) {
        continue;
      }
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    }
    return groups;
  }, [provider, filter]);

  const categoryOrder: DisposalCategory[] = [
    "recycle",
    "compost",
    "trash",
    "donate",
    "yard-waste",
    "deposit",
    "dropoff",
    "hazardous",
    "unknown",
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Disposal Rules</h1>
      <p className="text-muted-foreground mb-6">
        {provider ? `Rules for ${provider.displayName}` : "Loading..."}
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filter materials..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      )}

      {provider && (
        <div className="space-y-8">
          {categoryOrder.map((cat) => {
            const materials = grouped[cat];
            if (!materials?.length) return null;
            return (
              <section key={cat}>
                <div className="mb-3 flex items-center gap-2">
                  <CategoryBadge category={cat} size="md" />
                  <span className="text-xs text-muted-foreground">
                    ({materials.length} item{materials.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {materials.map((m) => (
                    <Card key={m.id} className="text-sm">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">{m.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <ul className="space-y-1 text-muted-foreground text-xs">
                          {m.instructions.slice(0, 2).map((inst, i) => (
                            <li key={i}>• {inst}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Tips */}
          {provider.rulesSummary.tips.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Tips
              </h2>
              <ul className="space-y-2">
                {provider.rulesSummary.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-yellow-500 shrink-0">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
