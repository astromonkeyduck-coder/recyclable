import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";
import { buildOgImageUrl } from "@/lib/utils/og-params";

const siteUrl = getSiteUrl();
const ogImageUrl = buildOgImageUrl(siteUrl, { variant: "games" });

export const metadata: Metadata = {
  title: "Recycling Games",
  description:
    "Test your waste-sorting skills with fun recycling games. Learn what goes where and climb the leaderboard.",
  alternates: { canonical: `${siteUrl}/games` },
  openGraph: {
    title: "Recycling Games | Is this recyclable?",
    description:
      "Test your waste-sorting skills and learn what goes where with fun recycling challenges.",
    url: `${siteUrl}/games`,
    siteName: "isthisrecyclable.com",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Recycling Games — isthisrecyclable.com",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recycling Games | Is this recyclable?",
    description:
      "Test your waste-sorting skills and learn what goes where with fun recycling challenges.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Recycling Games — isthisrecyclable.com",
      },
    ],
  },
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
