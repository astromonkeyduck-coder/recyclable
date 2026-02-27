import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadProvider } from "@/lib/providers/registry";
import { getSiteUrl } from "@/lib/utils/site-url";
import { CATEGORY_META } from "@/lib/utils/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ListChecks, AlertTriangle, Info, MapPin } from "lucide-react";
import type { DisposalCategory } from "@/lib/providers/types";

const DEFAULT_PROVIDER_ID = "general";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const provider = await loadProvider(DEFAULT_PROVIDER_ID);
  return provider.materials.map((m) => ({ slug: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const provider = await loadProvider(DEFAULT_PROVIDER_ID);
  const material = provider.materials.find((m) => m.id === slug);
  if (!material) return { title: "Item not found" };

  const meta = CATEGORY_META[material.category];
  const title = `${material.name} — ${meta.label} | Is this recyclable?`;
  const description =
    material.instructions[0] ?? `How to dispose of ${material.name}. ${meta.description}`;

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/item/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "isthisrecyclable.com",
      type: "article",
    },
  };
}

export default async function ItemPage({ params }: Props) {
  const { slug } = await params;
  const provider = await loadProvider(DEFAULT_PROVIDER_ID);
  const material = provider.materials.find((m) => m.id === slug);
  if (!material) notFound();

  const meta = CATEGORY_META[material.category];
  const showDropOffLink =
    material.category === "dropoff" || material.category === "hazardous";
  const dropOffQuery = encodeURIComponent(`${material.name} recycling drop-off near me`);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div
        className={`rounded-t-xl ${meta.bgColor} flex flex-col items-center gap-3 px-4 py-8`}
      >
        <span className="text-3xl" aria-hidden>
          {meta.icon}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${meta.bgColor} ${meta.textColor} border border-current/20`}
        >
          {meta.label}
        </span>
        <h1 className="text-2xl font-bold text-center">{material.name}</h1>
        <p className="text-sm text-center opacity-90">General US guidance</p>
      </div>

      <Card className="rounded-t-none border-t-0">
        <CardContent className="space-y-6 pt-6">
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold mb-2.5">
              <ListChecks className="h-4 w-4" />
              What to do
            </h2>
            <ol className="space-y-2.5">
              {material.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {material.commonMistakes.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold mb-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Common mistakes
              </h2>
              <ul className="space-y-2">
                {material.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500 shrink-0 mt-0.5">!</span>
                    {m}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {material.notes.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold mb-2.5">
                <Info className="h-4 w-4 text-blue-500" />
                Good to know
              </h2>
              <ul className="space-y-2">
                {material.notes.map((n, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {n}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {showDropOffLink && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold mb-2.5">
                <MapPin className="h-4 w-4" />
                Find drop-off locations
              </h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${dropOffQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Search for {material.name} drop-off near me
              </a>
            </section>
          )}

          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Rules vary by city. Check your local provider for exact rules.
            </p>
            <Button asChild className="gap-2">
              <Link href="/">
                <Search className="h-4 w-4" />
                Search for your location
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
