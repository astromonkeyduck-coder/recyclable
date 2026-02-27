import fs from "fs/promises";
import path from "path";
import { ProviderSchema } from "./schemas";
import type { Provider } from "./types";

const PROVIDERS_DIR = path.join(process.cwd(), "data", "providers");

const cache = new Map<string, Provider>();

export async function loadProvider(id: string): Promise<Provider> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = path.join(PROVIDERS_DIR, `${id}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  const provider = ProviderSchema.parse(data);

  cache.set(id, provider);
  return provider;
}

export async function listProviderIds(): Promise<string[]> {
  const files = await fs.readdir(PROVIDERS_DIR);
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort();
}

export async function listProviders(): Promise<
  Array<{ id: string; displayName: string; coverage: Provider["coverage"] }>
> {
  const ids = await listProviderIds();
  const providers = await Promise.all(ids.map((id) => loadProvider(id)));
  return providers.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    coverage: p.coverage,
  }));
}

export async function findProviderByLocation(
  query: string
): Promise<Provider | null> {
  const normalizedQuery = query.toLowerCase().trim();
  const ids = await listProviderIds();
  const providers = await Promise.all(ids.map((id) => loadProvider(id)));

  for (const provider of providers) {
    if (provider.id === "general") continue;

    const { city, region, zips, aliases } = provider.coverage;

    if (city?.toLowerCase() === normalizedQuery) return provider;
    if (region?.toLowerCase() === normalizedQuery) return provider;
    if (zips?.some((z) => z === normalizedQuery)) return provider;
    if (aliases?.some((a) => a.toLowerCase() === normalizedQuery))
      return provider;
    if (
      city &&
      region &&
      `${city}, ${region}`.toLowerCase() === normalizedQuery
    )
      return provider;
  }

  return null;
}

export function clearProviderCache(): void {
  cache.clear();
}
