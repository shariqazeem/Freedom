import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kyvern Labs',
  description: 'Security Infrastructure for Autonomous AI Agents',

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#050505' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Kyvern Labs',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Shield', link: '/shield/' },
      { text: 'Research', link: '/research/' },
      { text: 'API Reference', link: '/api/' },
      {
        text: 'Try Shield',
        link: 'https://shield.kyvernlabs.com/dashboard'
      }
    ],

    sidebar: {
      '/shield/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/shield/' },
            { text: 'Quick Start', link: '/shield/quickstart' },
            { text: 'Installation', link: '/shield/installation' },
          ]
        },
        {
          text: 'Integration',
          items: [
            { text: 'TypeScript SDK', link: '/shield/sdk-typescript' },
            { text: 'Python SDK', link: '/shield/sdk-python' },
            { text: 'REST API', link: '/shield/rest-api' },
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Transaction Analysis', link: '/shield/transaction-analysis' },
            { text: 'Source Detection', link: '/shield/source-detection' },
            { text: 'Circuit Breaker', link: '/shield/circuit-breaker' },
          ]
        }
      ],
      '/research/': [
        {
          text: 'Research Papers',
          items: [
            { text: 'Overview', link: '/research/' },
            { text: 'Indirect Prompt Injection Defense', link: '/research/indirect-injection' },
            { text: 'AI Agent Security Crisis', link: '/research/agent-security-crisis' },
            { text: 'Threat Landscape 2026', link: '/research/threat-landscape' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Analyze Endpoint', link: '/api/analyze' },
            { text: 'Transactions', link: '/api/transactions' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kyvernlabs' },
      { icon: 'twitter', link: 'https://twitter.com/kyvernlabs' }
    ],

    footer: {
      message: 'Building security infrastructure for autonomous AI agents.',
      copyright: 'Copyright 2024-present Kyvern Labs'
    },

    search: {
      provider: 'local'
    }
  },

  appearance: 'dark',

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
