import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";

export const metadata: Metadata = {
  title: "Disposal Rules",
  description:
    "View all recycling, trash, compost, and hazardous waste disposal rules for your selected location.",
  alternates: { canonical: `${getSiteUrl()}/rules` },
};

export default function RulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
