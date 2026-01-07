import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Kyvern Shield | Security Infrastructure for AI Agents",
    template: "%s | Kyvern Shield",
  },
  description:
    "Monitor, govern, and secure your AI agents with real-time threat detection and circuit breaker protection for Web3.",
  keywords: [
    "AI Agent Security",
    "Web3 Security",
    "Solana Security",
    "Agent Monitoring",
    "Circuit Breaker",
    "DeFi Security",
    "Autonomous Agent",
    "Kyvern Labs",
  ],
  authors: [{ name: "Kyvern Labs", url: "https://kyvernlabs.com" }],
  creator: "Kyvern Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shield.kyvernlabs.com",
    siteName: "Kyvern Shield",
    title: "Kyvern Shield | Security Infrastructure for AI Agents",
    description:
      "Monitor, govern, and secure your AI agents with real-time threat detection.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kyvern Shield",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyvern Shield | Security Infrastructure for AI Agents",
    description:
      "Monitor, govern, and secure your AI agents with real-time threat detection.",
    creator: "@kyvernlabs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
