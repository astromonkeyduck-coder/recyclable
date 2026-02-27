import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

export function getVisionModel(): string {
  return process.env.OPENAI_MODEL_VISION ?? "gpt-4o";
}

export function getTextModel(): string {
  return process.env.OPENAI_MODEL_TEXT ?? "gpt-4o-mini";
}
