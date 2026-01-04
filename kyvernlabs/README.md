# Kyvern Labs

> Full-Stack Web3 Venture Studio

Premium dark landing page for Kyvern Labs - a venture studio specializing in AI agents, smart contracts, and high-performance interfaces.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## Project Structure

```
kyvernlabs/
├── src/
│   ├── app/
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout with metadata
│   │   └── page.tsx       # Main landing page
│   ├── components/
│   │   ├── Hero.tsx       # Hero section with stats card
│   │   ├── Work.tsx       # Portfolio/case studies
│   │   ├── Services.tsx   # Service offerings
│   │   ├── Footer.tsx     # Contact & footer
│   │   └── Navbar.tsx     # Navigation
│   └── lib/
│       └── utils.ts       # Utility functions
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
└── package.json
```

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#050505` | Page background |
| Card BG | `#0a0a0a` | Card backgrounds |
| Foreground | `#F3F4F6` | Primary text |
| Muted | `#6B7280` | Secondary text |
| Border | `rgba(255,255,255,0.1)` | Borders |

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** Bold, tight tracking (-0.03em)
- **Body:** Regular, relaxed line height

## Sections

1. **Hero** - Main headline, stats card, client logos
2. **Work** - Portfolio with featured project and case studies
3. **Services** - MVP Sprint, AI Agents, Smart Contracts
4. **Footer** - Contact form, email, social links

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Manual

```bash
npm run build
npm start
```

## Links

- Website: [kyvernlabs.com](https://kyvernlabs.com)
- Twitter: [@kyvernlabs](https://twitter.com/kyvernlabs)
- Email: hello@kyvernlabs.com

---

Built by Kyvern Labs. Est. 2026.
