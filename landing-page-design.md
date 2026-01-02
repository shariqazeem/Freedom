# Stratum Labs: Landing Page Design System

> "Dark Institutional Futurism" — Where Wall Street meets the bleeding edge.

---

## 1. Hero Copy & Value Proposition

### Primary Headline (H1)
```
The Intelligence Layer
for Web3 Communities.
```

### Secondary Headline (Subhead)
```
Deploy autonomous systems that monitor, protect, and scale
your community—before threats reach your treasury.
```

### CTA Buttons
- **Primary:** "Request Access" (implies exclusivity)
- **Secondary:** "View Documentation" (implies depth)

### Social Proof Line (Below CTA)
```
Protecting $12M+ in community assets across 40+ projects.
```
*(Start with real numbers when you have them. Until then, use "Trusted by leading Solana communities.")*

---

## 2. Full Page Copy Architecture

### Hero Section
```
THE INTELLIGENCE LAYER
FOR WEB3 COMMUNITIES.

Deploy autonomous systems that monitor, protect, and scale
your community—before threats reach your treasury.

[Request Access]  [View Documentation]

Trusted by teams backed by ▲ Multicoin  ▲ Paradigm  ▲ Jump
```

### Logos Bar (Supported Chains)
```
INFRASTRUCTURE FOR THE MODULAR ERA

[Solana]  [Base]  [Ethereum]  [Arbitrum]
```
*All logos in monochrome white, 40% opacity, subtle hover to 100%*

### Problem Statement Section
```
THE OLD WAY IS BROKEN.

Community managers monitor 12 channels manually.
Whale movements trigger panic before anyone reacts.
Fake holders infiltrate token-gated groups.
Coordinated FUD attacks strike at 3 AM.

You need systems that never sleep.
```

### Product Bento Grid Header
```
AUTONOMOUS INTELLIGENCE SYSTEMS

Three layers of protection. One unified infrastructure.
```

### Bento Card 1: WhaleWatch
```
WHALEWATCH
Real-Time Treasury Intelligence

Track top holder movements before they hit the orderbook.
Instant alerts. Labeled wallets. Preemptive communication.

• Top 50 wallet monitoring
• Custom threshold alerts
• Raydium/Jupiter detection
• Team wallet labeling
```

### Bento Card 2: Sentinel
```
SENTINEL
Threat Detection & Response

AI-powered FUD detection and raid identification.
Automated moderation. Human-level judgment at machine speed.

• Sentiment velocity tracking
• Coordinated attack detection
• Auto-mute repeat offenders
• Escalation protocols
```

### Bento Card 3: HolderGate
```
HOLDERGATE
Verified Access Control

Cryptographic proof of holdings. No screenshots. No trust.
Automatic verification. Continuous re-validation.

• Wallet-based authentication
• Tiered access levels
• Daily balance sweeps
• Revocation automation
```

### Pricing Section Header
```
INSTITUTIONAL INFRASTRUCTURE.
ACCESSIBLE PRICING.

No per-message fees. No hidden costs.
Flat monthly infrastructure access.
```

### Final CTA Section
```
YOUR COMMUNITY NEVER SLEEPS.
NEITHER SHOULD YOUR INFRASTRUCTURE.

Deploy Stratum in under 5 minutes.

[Request Access]

Questions? team@stratumlabs.com
```

### Footer Tagline
```
STRATUM LABS

Infrastructure runs deep.

© 2026 Stratum Labs. All rights reserved.
Built for communities that move markets.
```

---

## 3. React/Tailwind Hero Component

### File: `components/Hero.tsx`

```tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />

    {/* Animated grid */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, #3B82F6 1px, transparent 1px),
          linear-gradient(to bottom, #3B82F6 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
      }}
    />

    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
        initial={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          y: Math.random() * 600,
          opacity: 0,
        }}
        animate={{
          y: [null, -100],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}

    {/* Glow orb */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
  </div>
);

const GlowButton = ({
  children,
  variant = 'primary',
  icon: Icon,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ElementType;
}) => {
  if (variant === 'primary') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative px-8 py-4 rounded-lg font-medium text-white overflow-hidden"
      >
        {/* Radioactive gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />

        {/* Animated glow layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {children}
          {Icon && <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group px-8 py-4 rounded-lg font-medium text-gray-300 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
    </motion.button>
  );
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden">
      <GridBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400 font-medium tracking-wide">
            NOW PROTECTING $12M+ IN ASSETS
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F3F4F6] tracking-[-0.04em] leading-[0.9] mb-6"
        >
          The Intelligence Layer
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            for Web3 Communities.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Deploy autonomous systems that monitor, protect, and scale
          your community—before threats reach your treasury.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <GlowButton variant="primary" icon={ArrowRight}>
            Request Access
          </GlowButton>
          <GlowButton variant="secondary" icon={FileText}>
            Documentation
          </GlowButton>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-12 border-t border-white/5"
        >
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-6">
            Infrastructure for the modular era
          </p>
          <div className="flex items-center justify-center gap-12 opacity-40 hover:opacity-60 transition-opacity">
            {['Solana', 'Base', 'Ethereum', 'Arbitrum'].map((chain) => (
              <span key={chain} className="text-gray-400 font-medium tracking-wide">
                {chain}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}
```

---

## 4. Bento Grid Component

### File: `components/BentoGrid.tsx`

```tsx
'use client';

import { motion } from 'framer-motion';
import { Eye, Shield, KeyRound, Activity, Zap, Lock } from 'lucide-react';

const features = [
  {
    title: 'WHALEWATCH',
    subtitle: 'Real-Time Treasury Intelligence',
    description: 'Track top holder movements before they hit the orderbook. Instant alerts. Labeled wallets. Preemptive communication.',
    icon: Eye,
    metrics: ['Top 50 wallets', 'Custom thresholds', 'DEX detection'],
    size: 'large',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'SENTINEL',
    subtitle: 'Threat Detection & Response',
    description: 'AI-powered FUD detection and raid identification at machine speed.',
    icon: Shield,
    metrics: ['Sentiment tracking', 'Raid detection', 'Auto-response'],
    size: 'medium',
    gradient: 'from-purple-500/20 to-blue-500/20',
  },
  {
    title: 'HOLDERGATE',
    subtitle: 'Verified Access Control',
    description: 'Cryptographic proof of holdings. No screenshots. No trust.',
    icon: KeyRound,
    metrics: ['Wallet auth', 'Tiered access', 'Auto-revoke'],
    size: 'medium',
    gradient: 'from-emerald-500/20 to-blue-500/20',
  },
];

const BentoCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const Icon = feature.icon;
  const isLarge = feature.size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${feature.gradient}
        border border-white/10 hover:border-white/20
        backdrop-blur-xl
        transition-all duration-500
        ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
      `}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-[#050505]/80" />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/10 to-transparent" />

      {/* Content */}
      <div className={`relative z-10 ${isLarge ? 'p-10' : 'p-8'}`}>
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>

        {/* Title */}
        <h3 className="text-xs font-bold text-blue-400 tracking-[0.2em] mb-2">
          {feature.title}
        </h3>
        <h4 className={`font-semibold text-[#F3F4F6] mb-4 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          {feature.subtitle}
        </h4>

        {/* Description */}
        <p className="text-gray-400 mb-6 leading-relaxed">
          {feature.description}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-2">
          {feature.metrics.map((metric) => (
            <span
              key={metric}
              className="px-3 py-1 text-xs text-gray-300 bg-white/5 rounded-full border border-white/10"
            >
              {metric}
            </span>
          ))}
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
      </div>
    </motion.div>
  );
};

export default function BentoGrid() {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-xs font-bold text-blue-400 tracking-[0.3em] mb-4">
            AUTONOMOUS INTELLIGENCE SYSTEMS
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
            Three layers of protection.
            <br />
            <span className="text-gray-500">One unified infrastructure.</span>
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {features.map((feature, index) => (
            <BentoCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 5. The Radioactive Button Gradient

### The Formula

```css
/* Base gradient - Directional energy flow */
background: linear-gradient(
  135deg,
  #2563eb 0%,      /* Deep blue - anchor */
  #3b82f6 25%,     /* Electric blue - brand */
  #06b6d4 50%,     /* Cyan - energy peak */
  #3b82f6 75%,     /* Electric blue - return */
  #2563eb 100%     /* Deep blue - anchor */
);

/* Hover state - Increased luminosity */
background: linear-gradient(
  135deg,
  #3b82f6 0%,
  #60a5fa 25%,
  #22d3ee 50%,
  #60a5fa 75%,
  #3b82f6 100%
);

/* The glow (box-shadow) */
box-shadow:
  0 0 20px rgba(59, 130, 246, 0.5),
  0 0 40px rgba(59, 130, 246, 0.3),
  0 0 60px rgba(59, 130, 246, 0.1);

/* Hover glow - "Radioactive" effect */
box-shadow:
  0 0 30px rgba(6, 182, 212, 0.6),
  0 0 60px rgba(59, 130, 246, 0.4),
  0 0 90px rgba(59, 130, 246, 0.2),
  inset 0 0 20px rgba(255, 255, 255, 0.1);
```

### Tailwind Implementation

```tsx
// Primary button with radioactive effect
<button className="
  relative px-8 py-4 rounded-lg font-semibold text-white
  bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600
  bg-[length:200%_100%]
  hover:bg-[position:100%_0]
  transition-all duration-500
  shadow-[0_0_20px_rgba(59,130,246,0.5)]
  hover:shadow-[0_0_30px_rgba(6,182,212,0.6),0_0_60px_rgba(59,130,246,0.4)]
">
  Request Access
</button>
```

---

## 6. Typography System

### Font Stack
```css
/* Primary: Geist (Vercel) or Inter */
font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace for data/code */
font-family: 'Geist Mono', 'JetBrains Mono', monospace;
```

### Scale
| Element | Size | Weight | Tracking | Line Height |
|---------|------|--------|----------|-------------|
| H1 (Hero) | 72-96px | 700 | -0.04em | 0.9 |
| H2 (Section) | 36-48px | 700 | -0.02em | 1.1 |
| H3 (Card) | 24px | 600 | -0.01em | 1.2 |
| Body | 16-18px | 400 | 0 | 1.6 |
| Label | 12px | 700 | 0.2em | 1 |
| Caption | 14px | 500 | 0.05em | 1.4 |

### Tailwind Config
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#F3F4F6',
        accent: '#3B82F6',
        'accent-bright': '#60A5FA',
        'accent-cyan': '#06B6D4',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        'tighter': '-0.04em',
        'tight': '-0.02em',
        'widest': '0.2em',
      },
    },
  },
};
```

---

## 7. Page Structure

```
├── Hero Section
│   ├── Animated grid background
│   ├── Badge ("NOW PROTECTING $12M+")
│   ├── H1 + Subhead
│   ├── CTA Buttons
│   └── Trust bar (chain logos)
│
├── Problem Section
│   ├── "THE OLD WAY IS BROKEN"
│   └── 4 pain point cards
│
├── Bento Grid (Products)
│   ├── WhaleWatch (large)
│   ├── Sentinel (medium)
│   └── HolderGate (medium)
│
├── Social Proof Section
│   ├── Metrics ("40+ communities")
│   └── Logo carousel (if available)
│
├── Pricing Section
│   ├── 2-3 tier cards
│   └── "Talk to us" CTA
│
├── Final CTA Section
│   ├── "YOUR COMMUNITY NEVER SLEEPS"
│   └── Primary CTA button
│
└── Footer
    ├── Logo + tagline
    ├── Links (Docs, Twitter, Discord)
    └── Copyright
```

---

## 8. Lenis Smooth Scroll Setup

### File: `components/SmoothScroll.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

---

## 9. Package Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "framer-motion": "^10.16.0",
    "@studio-freight/lenis": "^1.0.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.4.0",
    "clsx": "^2.0.0"
  }
}
```

---

## 10. Design Reference Keywords

For v0.dev or screenshot references, search:
- "Linear app landing page dark"
- "Vercel dashboard dark mode"
- "Raycast website design"
- "Resend email dark landing"
- "Liveblocks website bento"

These represent the current pinnacle of "Dark Institutional SaaS" design.

---

*Ship fast. Look expensive. Close deals.*
