import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Is this recyclable?",
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
    a: "General Guidance gives conservative US best-practice advice. City-specific providers (like Orlando, FL) use official local rules that may differ — for example, some cities accept items that others don't.",
  },
  {
    q: "Can I use this for my business?",
    a: "The focus is residential waste disposal. Commercial and industrial waste often has different rules. Contact your local waste management provider for business-specific guidance.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
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
