import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Kyvern Labs | Full-Stack Web3 Venture Studio",
  description:
    "We architect autonomous agents, smart contracts, and high-performance interfaces for the decentralized web.",
  keywords: [
    "Web3",
    "Venture Studio",
    "Smart Contracts",
    "Solana",
    "AI Agents",
    "Full Stack Development",
    "Blockchain",
    "DeFi",
  ],
  authors: [{ name: "Kyvern Labs" }],
  openGraph: {
    title: "Kyvern Labs | Full-Stack Web3 Venture Studio",
    description:
      "We architect autonomous agents, smart contracts, and high-performance interfaces for the decentralized web.",
    url: "https://kyvernlabs.com",
    siteName: "Kyvern Labs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyvern Labs | Full-Stack Web3 Venture Studio",
    description:
      "We architect autonomous agents, smart contracts, and high-performance interfaces for the decentralized web.",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#050505] text-[#F3F4F6] antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
