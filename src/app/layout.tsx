import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteUrl } from "@/lib/utils/site-url";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

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
        url: `${siteUrl}/api/og?category=recycle&item=Is+this+recyclable%3F&loc=Your+area&confidence=0`,
        width: 1200,
        height: 630,
        alt: "Is this recyclable? - Instant waste disposal guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is this recyclable?",
    description:
      "Snap it, search it, sort it. Instant waste disposal guidance based on your local rules.",
    images: [
      `${siteUrl}/api/og?category=recycle&item=Is+this+recyclable%3F&loc=Your+area&confidence=0`,
    ],
  },
  icons: {
    icon: "/icons/icon-192.png",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>
          <div className="flex min-h-svh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
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
