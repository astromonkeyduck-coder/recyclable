import fs from "fs/promises";
import path from "path";
import { ConceptArraySchema } from "./types";
import type { Concept } from "./types";

const CONCEPTS_DIR = path.join(process.cwd(), "data", "concepts");

const cache = new Map<string, Concept>();
let allConcepts: Concept[] | null = null;

export async function loadConcepts(): Promise<Concept[]> {
  if (allConcepts !== null) return allConcepts;

  let files: string[];
  try {
    files = await fs.readdir(CONCEPTS_DIR);
  } catch {
    allConcepts = [];
    return allConcepts;
  }

  const jsonFiles = files
    .filter((f) => f.endsWith(".json"))
    .sort();

  const results: Concept[] = [];
  for (const file of jsonFiles) {
    const filePath = path.join(CONCEPTS_DIR, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    const parsed = ConceptArraySchema.parse(data);
    results.push(...parsed);
  }

  allConcepts = results;
  for (const c of results) {
    cache.set(c.id, c);
  }
  return allConcepts;
}

export function getConceptById(id: string): Concept | null {
  return cache.get(id) ?? null;
}

export function clearConceptCache(): void {
  cache.clear();
  allConcepts = null;
}
