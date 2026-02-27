import fs from "fs/promises";
import path from "path";
import { GameModeDataSchema } from "./schemas";
import type { GameModeData } from "./types";

const GAMES_DIR = path.join(process.cwd(), "data", "games");
const cache = new Map<string, GameModeData>();

export async function loadGameMode(id: string): Promise<GameModeData> {
  const cached = cache.get(id);
  if (cached) return cached;

  const filePath = path.join(GAMES_DIR, `${id}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw);
  const mode = GameModeDataSchema.parse(data);
  cache.set(id, mode);
  return mode;
}

export async function listGameModeIds(): Promise<string[]> {
  const files = await fs.readdir(GAMES_DIR);
  return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", "")).sort();
}
