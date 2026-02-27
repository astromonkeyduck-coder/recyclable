import { z } from "zod";

const serverSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL_VISION: z.string().default("gpt-4o"),
  OPENAI_MODEL_TEXT: z.string().default("gpt-4o-mini"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_DEFAULT_PROVIDER: z.string().default("general"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function validateEnv() {
  const server = serverSchema.safeParse(process.env);
  const client = clientSchema.safeParse(process.env);

  if (!server.success) {
    console.error("Invalid server environment variables:", server.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }

  if (!client.success) {
    console.error("Invalid client environment variables:", client.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables");
  }

  if (!server.data.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not set: photo scanning will be disabled, text search still works");
  }

  return { server: server.data, client: client.data };
}

export const env = validateEnv();
