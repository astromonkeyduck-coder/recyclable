import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/site-url";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Is this recyclable? How it works, privacy, accuracy, and adding your city.",
  alternates: { canonical: `${getSiteUrl()}/faq` },
};

const faqs = [
  {
    q: "Is this free?",
    a: "Yes, completely free. No account needed.",
  },
  {
    q: "Do you store my photos?",
    a: "No. Photos are processed in real-time and never stored on our servers. They are sent to OpenAI's API for item identification and immediately discarded.",
  },
  {
    q: "How accurate are the results?",
    a: "Results are based on official rules from your local jurisdiction's waste management program. For text searches, matching is deterministic and highly accurate. For photo scans, accuracy depends on image quality and AI identification. We always show a confidence score so you know how sure we are.",
  },
  {
    q: "My city isn't listed. Can I add it?",
    a: "Yes! The system is designed to support any jurisdiction. You can create a provider JSON file with your city's rules and submit it. See the Providers page for instructions.",
  },
  {
    q: "Does it work offline?",
    a: "Text search works offline for previously loaded providers. Photo scanning requires an internet connection for AI processing.",
  },
  {
    q: "Why does it say 'Not Sure'?",
    a: "When we can't confidently match your item to a specific disposal category, we show 'Not Sure' rather than guessing wrong. Try a more specific search term or choose from the suggested alternatives.",
  },
  {
    q: "What's the difference between 'General Guidance' and a city provider?",
    a: "General Guidance gives conservative US best-practice advice. City-specific providers (like Orlando, FL) use official local rules that may differ. For example, some cities accept items that others don't.",
  },
  {
    q: "Can I use this for my business?",
    a: "The focus is residential waste disposal. Commercial and industrial waste often has different rules. Contact your local waste management provider for business-specific guidance.",
  },
  {
    q: "Why do recycling rules vary by city?",
    a: "Each municipality contracts with different recycling processors who accept different materials based on their equipment and local markets. What's recyclable in one city may not be in another — that's exactly why we built city-specific providers.",
  },
  {
    q: "How often is the data updated?",
    a: "Provider data is updated whenever a city changes its recycling program rules. We pull from official municipal waste management sources. If you notice outdated info, use the feedback button on any result card to let us know.",
  },
  {
    q: "Can I report incorrect information?",
    a: "Absolutely. Every result card has a flag icon you can tap to report an issue. Include what you think the correct disposal method is and we'll review it.",
  },
  {
    q: "What about electronics and e-waste?",
    a: "Electronics (phones, laptops, TVs, cables) should never go in curbside bins. We'll tell you it needs a drop-off and link you to nearby e-waste collection points via Google Maps.",
  },
  {
    q: "What disposal categories do you support?",
    a: "Six categories: Recycle (curbside blue bin), Trash (landfill), Compost (food/yard waste), Drop-off (special collection sites), Hazardous (chemicals, batteries, paint), and Not Sure (when we can't make a confident determination).",
  },
  {
    q: "Do you support countries outside the US?",
    a: "Currently we focus on US municipalities, but the system is designed to be international. If you want to contribute rules for your country or region, the provider format supports it.",
  },
  {
    q: "How does the barcode scanner work?",
    a: "Point your camera at a product barcode and we'll look up the product via the Open Food Facts database, then match its packaging material against your local disposal rules.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="text-2xl font-bold mb-1">FAQ</h1>
      <p className="text-muted-foreground mb-8">
        Frequently asked questions about Is this recyclable?
      </p>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i}>
            <h3 className="font-semibold text-sm mb-1">{faq.q}</h3>
            <p className="text-sm text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
