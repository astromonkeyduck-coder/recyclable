import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InstallPrompt } from "@/components/common/install-prompt";
import { OfflineIndicator } from "@/components/common/offline-indicator";
import { getSiteUrl } from "@/lib/utils/site-url";
import { buildOgImageUrl } from "@/lib/utils/og-params";
import { PageTransition } from "@/components/common/page-transition";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const dynamicOg = buildOgImageUrl(siteUrl, { variant: "homepage" });
const staticOg = `${siteUrl}/og/default.png`;
const embedPlayerUrl = `${siteUrl}/embed`;
const previewSongUrl = `${siteUrl}/audio/isthisredcyaudio.m4a`;

export const metadata: Metadata = {
  title: {
    default: "Is this recyclable?",
    template: "%s | Is this recyclable?",
  },
  description:
    "Snap a photo or search any item to instantly find out how to dispose of it correctly. Local recycling, trash, compost, and drop-off rules for your area.",
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Is this recyclable?",
    description:
      "Snap it, search it, sort it. Instant waste disposal guidance based on your local rules.",
    siteName: "isthisrecyclable.com",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: dynamicOg,
        width: 1200,
        height: 630,
        alt: "Is this recyclable? — Snap it, search it, sort it.",
        type: "image/png",
      },
      {
        url: staticOg,
        width: 1200,
        height: 630,
        alt: "Is this recyclable? — Snap it, search it, sort it.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "player",
    title: "Is this recyclable?",
    description:
      "Snap it, search it, sort it. Instant waste disposal guidance based on your local rules.",
    images: [
      {
        url: dynamicOg,
        width: 1200,
        height: 630,
        alt: "Is this recyclable? — Snap it, search it, sort it.",
      },
    ],
  },
  other: {
    "apple-mobile-web-app-title": "Recyclable?",
    "twitter:player": embedPlayerUrl,
    "twitter:player:width": "600",
    "twitter:player:height": "400",
    "twitter:player:stream": previewSongUrl,
    "twitter:player:stream:content_type": "audio/mp4",
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Recyclable?",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Is this recyclable?",
              url: siteUrl,
              description:
                "Snap a photo or search any item to instantly find out how to dispose of it correctly. Local recycling, trash, compost, and drop-off rules for your area.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/result?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5682687142632647"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <AppProviders>
          <div className="flex min-h-svh flex-col">
            <div data-site-header className="contents">
              <Header />
            </div>
            <OfflineIndicator />
            <main id="main-content" className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <div data-site-footer className="contents">
              <Footer />
            </div>
          </div>
          <InstallPrompt />
        </AppProviders>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
