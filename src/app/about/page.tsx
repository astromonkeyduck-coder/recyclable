import { Recycle, Camera, Search, MapPin, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";
import { buildOgImageUrl } from "@/lib/utils/og-params";
import { AnimatedStats } from "./animated-stats";

const siteUrl = getSiteUrl();
const ogImageUrl = buildOgImageUrl(siteUrl, { variant: "about" });

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Is this recyclable? and how it helps you dispose of waste correctly using local rules, AI scanning, and smart search.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About | Is this recyclable?",
    description:
      "The mission behind instant waste disposal guidance. Snap a photo, search an item, get local rules.",
    url: `${siteUrl}/about`,
    siteName: "isthisrecyclable.com",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "About isthisrecyclable.com",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Is this recyclable?",
    description:
      "The mission behind instant waste disposal guidance. Snap a photo, search an item, get local rules.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "About isthisrecyclable.com",
      },
    ],
  },
};

const features = [
  {
    icon: Camera,
    title: "Camera Scanning",
    description: "Snap a photo of any item and get instant disposal guidance powered by AI vision.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Type any item name and find matches instantly with fuzzy search and synonym support.",
  },
  {
    icon: MapPin,
    title: "Local Rules",
    description:
      "Get disposal instructions specific to your city or region, not generic advice.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "We don't store your photos. No account needed. No tracking. Just answers.",
  },
  {
    icon: Zap,
    title: "Fast & Offline",
    description:
      "Text search works offline with cached data. Installable as a PWA on your phone.",
  },
  {
    icon: Recycle,
    title: "Open Data",
    description:
      "Provider data is open JSON. Anyone can contribute rules for their city.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Mission */}
      <h1 className="text-2xl font-bold mb-2">About</h1>
      <p className="text-lg text-muted-foreground max-w-xl mb-2">
        Recycling shouldn&apos;t require a PhD.
      </p>
      <p className="text-muted-foreground max-w-xl mb-8">
        <strong>Is this recyclable?</strong> helps you figure out the right way
        to dispose of any item (recycle, trash, compost, or drop-off) based on
        your local jurisdiction&apos;s rules. No sign-up, no data collection, just
        answers in seconds.
      </p>

      {/* Animated stats */}
      <AnimatedStats />

      {/* Impact callout */}
      <div className="rounded-xl border bg-muted/30 p-5 mb-12">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Why it matters:</span>{" "}
          The average American generates 4.4 lbs of trash every single day.
          Contaminated recycling (tossing the wrong item in the bin) costs
          municipalities millions and sends recyclable material to landfills. We
          built this tool so you never have to guess again.
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {features.map((f) => (
          <div key={f.title} className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
            <span><strong>Identify:</strong> Scan a photo, upload an image, or type the item name.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
            <span><strong>Match:</strong> We match your item against your local jurisdiction&apos;s rules database.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
            <span><strong>Dispose:</strong> Get clear instructions for recycle, trash, compost, drop-off, or hazardous.</span>
          </li>
        </ol>
      </section>
    </div>
  );
}
