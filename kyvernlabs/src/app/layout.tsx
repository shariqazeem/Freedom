import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

const siteUrl = "https://kyvernlabs.com";
const siteName = "Kyvern Labs";
const siteDescription =
  "Full-Stack Web3 Venture Studio specializing in autonomous AI agents, smart contracts, and high-performance interfaces for the decentralized web. Based in Pakistan, serving clients worldwide.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kyvern Labs | Full-Stack Web3 Venture Studio",
    template: "%s | Kyvern Labs",
  },
  description: siteDescription,
  keywords: [
    "Web3 Development",
    "Venture Studio",
    "Smart Contracts",
    "Solana Development",
    "AI Agents",
    "Autonomous Agents",
    "Full Stack Development",
    "Blockchain Development",
    "DeFi Development",
    "Web3 Agency",
    "Solana Smart Contracts",
    "Anchor Framework",
    "React Development",
    "Next.js Development",
    "TypeScript",
    "Rust Development",
    "MVP Development",
    "Startup Studio",
    "Crypto Development",
    "NFT Development",
  ],
  authors: [{ name: "Kyvern Labs", url: siteUrl }],
  creator: "Kyvern Labs",
  publisher: "Kyvern Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "Kyvern Labs | Full-Stack Web3 Venture Studio",
    description: siteDescription,
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Kyvern Labs - Web3 Venture Studio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyvern Labs | Full-Stack Web3 Venture Studio",
    description: siteDescription,
    site: "@kyvernlabs",
    creator: "@kyvernlabs",
    images: ["/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon-32x32.png",
        color: "#050505",
      },
    ],
  },
  manifest: "/site.webmanifest",
  category: "technology",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  other: {
    "msapplication-TileColor": "#050505",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Kyvern Labs",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Kyvern Labs",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
      },
      description: siteDescription,
      foundingDate: "2025",
      sameAs: [
        "https://twitter.com/kyvernlabs",
        "https://github.com/kyvernlabs",
        "https://linkedin.com/company/kyvernlabs",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@kyvernlabs.com",
        contactType: "customer service",
        availableLanguage: ["English"],
      },
      areaServed: "Worldwide",
      serviceType: [
        "Web3 Development",
        "Smart Contract Development",
        "AI Agent Development",
        "MVP Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Kyvern Labs | Full-Stack Web3 Venture Studio",
      description: siteDescription,
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Kyvern Labs",
      url: siteUrl,
      description: siteDescription,
      priceRange: "$$",
      image: `${siteUrl}/android-chrome-512x512.png`,
      telephone: "",
      email: "hello@kyvernlabs.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "Worldwide",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "",
        longitude: "",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Web3 Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "MVP Sprint",
              description:
                "Full-stack development from concept to deployed product in 2 weeks",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI Agents",
              description:
                "Custom autonomous agents for monitoring, execution, and automation",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Smart Contracts",
              description:
                "Secure, gas-optimized programs for Solana and EVM chains",
            },
          },
        ],
      },
    },
  ],
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#050505] text-[#F3F4F6] antialiased font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
