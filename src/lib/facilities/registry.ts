import fs from "fs/promises";
import path from "path";
import { FacilityProviderSchema } from "./schemas";
import type { Facility, FacilityProvider } from "./types";

const FACILITIES_DIR = path.join(process.cwd(), "data", "facilities");
const cache = new Map<string, FacilityProvider>();

export async function loadFacilityProvider(id: string): Promise<FacilityProvider> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = path.join(FACILITIES_DIR, `${id}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  const provider = FacilityProviderSchema.parse(data);

  cache.set(id, provider);
  return provider;
}

export async function listFacilityProviderIds(): Promise<string[]> {
  const files = await fs.readdir(FACILITIES_DIR);
  return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", "")).sort();
}

export async function getAllFacilities(): Promise<Facility[]> {
  const ids = await listFacilityProviderIds();
  const providers = await Promise.all(ids.map(loadFacilityProvider));
  return providers.flatMap((p) => p.facilities);
}
