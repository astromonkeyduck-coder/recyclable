import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";

export const metadata: Metadata = {
  title: "Providers",
  description:
    "Browse available local recycling and waste disposal rule providers. Add your city's rules to help your community recycle correctly.",
  alternates: { canonical: `${getSiteUrl()}/providers` },
};

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
