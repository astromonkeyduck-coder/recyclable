import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";
import { buildOgImageUrl } from "@/lib/utils/og-params";
import { matchMaterial } from "@/lib/matching/engine";
import { loadProvider } from "@/lib/providers/registry";
import ResultClientPage from "./result-client";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const providerId = typeof params.provider === "string" ? params.provider : "general";
  const siteUrl = getSiteUrl();

  if (!q) {
    return {
      title: "Result",
      description: "Search for an item to see how to dispose of it.",
    };
  }

  let category = "unknown";
  let itemName = q;
  let providerName = "General guidance";
  let confidence = 0;
  let warning: string | undefined;
  let description = `Find out how to dispose of "${q}" correctly.`;

  try {
    const provider = await loadProvider(providerId);
    providerName = provider.displayName;
    const result = matchMaterial(provider, q);

    if (result.best) {
      category = result.best.category;
      itemName = result.best.name;
      confidence = Math.round(result.confidence * 100);

      const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
      description = `${categoryLabel}: ${itemName}. ${result.best.instructions[0] ?? ""} (${providerName}, ${confidence}% confidence)`;

      if (result.best.commonMistakes.length > 0) {
        warning = result.best.commonMistakes[0]!.slice(0, 80);
      }
    }
  } catch {
    // Provider load failed; use defaults
  }

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const title = `${categoryLabel}: ${itemName}`;

  const ogImageUrl = buildOgImageUrl(siteUrl, {
    category: category as "recycle" | "trash" | "compost" | "dropoff" | "hazardous" | "unknown",
    item: itemName,
    loc: providerName,
    confidence,
    warning,
  });

  const pageUrl = `${siteUrl}/result?q=${encodeURIComponent(q)}&provider=${encodeURIComponent(providerId)}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "isthisrecyclable.com",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${categoryLabel}: ${itemName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ResultPage() {
  return <ResultClientPage />;
}
