"use client";

import { useProviderList } from "@/hooks/use-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Globe, Plus } from "lucide-react";

export default function ProvidersPage() {
  const { data: providers, isLoading } = useProviderList();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Available Providers</h1>
      <p className="text-muted-foreground mb-6">
        Disposal rules are sourced from local jurisdictions. Here are the currently installed providers.
      </p>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {providers?.map((p) => (
          <Card key={p.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {p.coverage.city ? (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                  {p.displayName}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {p.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
              {p.coverage.city && p.coverage.region && (
                <p>
                  {p.coverage.city}, {p.coverage.region}, {p.coverage.country}
                </p>
              )}
              {!p.coverage.city && <p>{p.coverage.country} (nationwide fallback)</p>}
              {p.coverage.zips && (
                <p className="text-xs mt-1">
                  Covers {p.coverage.zips.length} ZIP codes
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How to add a provider */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add a New Provider
        </h2>
        <Card>
          <CardContent className="p-6 text-sm space-y-3 text-muted-foreground">
            <p>Want to add your city or region? It&apos;s straightforward:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Create a JSON file following the provider schema at{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  data/providers/your-city.json
                </code>
              </li>
              <li>
                Include materials, disposal categories, instructions, and common mistakes for
                your jurisdiction.
              </li>
              <li>
                The app will auto-discover it on next build — no code changes needed.
              </li>
              <li>
                See{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  PROVIDERS.md
                </code>{" "}
                in the repo for the full guide and schema reference.
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
