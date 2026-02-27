import { z } from "zod";
import { DisposalCategorySchema } from "@/lib/providers/schemas";

export const OgParamsSchema = z.object({
  category: DisposalCategorySchema.default("unknown"),
  item: z.string().max(80).default("Unknown Item"),
  loc: z.string().max(60).default("General guidance"),
  confidence: z.coerce.number().min(0).max(100).default(0),
  warning: z.string().max(80).optional(),
});

export type OgParams = z.infer<typeof OgParamsSchema>;

export function buildOgImageUrl(
  baseUrl: string,
  params: Partial<OgParams>
): string {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set("category", params.category);
  if (params.item) searchParams.set("item", params.item);
  if (params.loc) searchParams.set("loc", params.loc);
  if (params.confidence != null)
    searchParams.set("confidence", String(Math.round(params.confidence)));
  if (params.warning) searchParams.set("warning", params.warning);
  return `${baseUrl}/api/og?${searchParams.toString()}`;
}
