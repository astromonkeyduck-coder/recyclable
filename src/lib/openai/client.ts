import OpenAI from "openai";
import { env } from "@/lib/env";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = env.server.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

export function getVisionModel(): string {
  return env.server.OPENAI_MODEL_VISION;
}

export function getTextModel(): string {
  return env.server.OPENAI_MODEL_TEXT;
}
