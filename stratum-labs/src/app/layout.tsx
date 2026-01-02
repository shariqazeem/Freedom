import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Stratum Labs | The Intelligence Layer for Web3 Communities",
  description:
    "Deploy autonomous systems that monitor, protect, and scale your community—before threats reach your treasury.",
  keywords: [
    "Web3",
    "Community Management",
    "Crypto",
    "Solana",
    "Whale Tracking",
    "Token Gating",
    "Discord Bot",
    "Telegram Bot",
  ],
  authors: [{ name: "Stratum Labs" }],
  openGraph: {
    title: "Stratum Labs | The Intelligence Layer for Web3 Communities",
    description:
      "Deploy autonomous systems that monitor, protect, and scale your community—before threats reach your treasury.",
    url: "https://stratumlabs.com",
    siteName: "Stratum Labs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stratum Labs | The Intelligence Layer for Web3 Communities",
    description:
      "Deploy autonomous systems that monitor, protect, and scale your community—before threats reach your treasury.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
