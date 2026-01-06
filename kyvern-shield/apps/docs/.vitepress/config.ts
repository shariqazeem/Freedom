import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Kyvern Shield",
  description: "Security Infrastructure for Web3 AI Agents",

  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#10B981" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Kyvern Shield Documentation" }],
    ["meta", { property: "og:description", content: "Security Infrastructure for Web3 AI Agents" }],
    ["meta", { property: "og:url", content: "https://docs.shield.kyvernlabs.com" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@kyvernlabs" }],
  ],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Kyvern Shield",

    nav: [
      { text: "Guide", link: "/guides/getting-started" },
      { text: "API Reference", link: "/api-reference/" },
      { text: "Research", link: "/research/" },
      {
        text: "Links",
        items: [
          { text: "Dashboard", link: "https://shield.kyvernlabs.com" },
          { text: "GitHub", link: "https://github.com/kyvernlabs/kyvern-shield" },
          { text: "Kyvern Labs", link: "https://kyvernlabs.com" },
        ],
      },
    ],

    sidebar: {
      "/guides/": [
        {
          text: "Introduction",
          items: [
            { text: "Getting Started", link: "/guides/getting-started" },
            { text: "Quick Start", link: "/guides/quick-start" },
            { text: "Core Concepts", link: "/guides/concepts" },
          ],
        },
        {
          text: "Integration",
          items: [
            { text: "SDK Installation", link: "/guides/sdk-installation" },
            { text: "Agent Registration", link: "/guides/agent-registration" },
            { text: "Policy Configuration", link: "/guides/policy-configuration" },
            { text: "Circuit Breaker", link: "/guides/circuit-breaker" },
          ],
        },
        {
          text: "Advanced",
          items: [
            { text: "Custom Rules", link: "/guides/custom-rules" },
            { text: "Webhooks", link: "/guides/webhooks" },
            { text: "Self-Hosting", link: "/guides/self-hosting" },
          ],
        },
      ],
      "/api-reference/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/api-reference/" },
            { text: "Authentication", link: "/api-reference/authentication" },
            { text: "Agents", link: "/api-reference/agents" },
            { text: "Transactions", link: "/api-reference/transactions" },
            { text: "Alerts", link: "/api-reference/alerts" },
            { text: "Policies", link: "/api-reference/policies" },
          ],
        },
      ],
      "/research/": [
        {
          text: "Research",
          items: [
            { text: "Overview", link: "/research/" },
            { text: "AI Agent Security Crisis", link: "/research/agent-security-crisis" },
            { text: "Threat Landscape", link: "/research/threat-landscape" },
            { text: "Attack Vectors", link: "/research/attack-vectors" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/kyvernlabs/kyvern-shield" },
      { icon: "twitter", link: "https://twitter.com/kyvernlabs" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Kyvern Labs",
    },

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/kyvernlabs/kyvern-shield/edit/main/apps/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});
