import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";
import { buildOgImageUrl } from "@/lib/utils/og-params";

const siteUrl = getSiteUrl();
const ogImageUrl = buildOgImageUrl(siteUrl, { variant: "facilities" });

export const metadata: Metadata = {
  title: "Drop-off Facilities",
  description:
    "Find recycling centers, hazardous waste sites, and drop-off facilities near you.",
  alternates: { canonical: `${siteUrl}/facilities` },
  openGraph: {
    title: "Drop-off Facilities | Is this recyclable?",
    description:
      "Find recycling centers and hazardous waste drop-off sites near you with interactive maps.",
    url: `${siteUrl}/facilities`,
    siteName: "isthisrecyclable.com",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Drop-off Facilities — isthisrecyclable.com",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drop-off Facilities | Is this recyclable?",
    description:
      "Find recycling centers and hazardous waste drop-off sites near you with interactive maps.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Drop-off Facilities — isthisrecyclable.com",
      },
    ],
  },
};

export default function FacilitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
