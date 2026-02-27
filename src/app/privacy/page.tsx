import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";
import { buildOgImageUrl } from "@/lib/utils/og-params";

const siteUrl = getSiteUrl();
const ogImageUrl = buildOgImageUrl(siteUrl, { variant: "privacy" });

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Is this recyclable? No photos stored, no accounts, no tracking.",
  alternates: { canonical: `${siteUrl}/privacy` },
  openGraph: {
    title: "Privacy Policy | Is this recyclable?",
    description:
      "No photos stored. No accounts. No tracking. Period. Read our privacy policy.",
    url: `${siteUrl}/privacy`,
    siteName: "isthisrecyclable.com",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Privacy Policy — isthisrecyclable.com",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Is this recyclable?",
    description:
      "No photos stored. No accounts. No tracking. Period. Read our privacy policy.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Privacy Policy — isthisrecyclable.com",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-sm text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">Photos and Images</h2>
          <p>
            When you scan an item using the camera or upload a photo, the image is sent to
            OpenAI&apos;s API for item identification. <strong>We do not store your images.</strong>{" "}
            Images are processed in real-time and discarded immediately after the response is
            generated. We have no access to your photos after processing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Local Storage</h2>
          <p>
            We store your location/provider preference in your browser&apos;s localStorage so we can
            remember your city between visits. This data never leaves your device.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Analytics</h2>
          <p>
            If analytics are implemented, we only collect non-identifying events such as:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Page views (no IP addresses stored)</li>
            <li>Search queries (aggregated, not tied to individuals)</li>
            <li>Scan started / scan succeeded events</li>
            <li>Category results (e.g., &quot;recycle&quot; was shown 500 times this week)</li>
          </ul>
          <p>
            We do <strong>not</strong> collect: names, email addresses, IP addresses, precise
            location, device identifiers, or any other personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Third-Party Services</h2>
          <p>
            We use OpenAI&apos;s API for image recognition and item matching assistance. OpenAI&apos;s
            use of data sent through their API is governed by their own privacy policy and data
            usage policies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">No Account Required</h2>
          <p>
            This service does not require you to create an account, provide an email address, or
            sign in. It works entirely without authentication.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p>
            If you have questions about this privacy policy, please reach out to us at
            isthisrecyclable.com.
          </p>
        </section>
      </div>
    </div>
  );
}
