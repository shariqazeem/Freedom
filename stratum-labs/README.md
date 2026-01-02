# Stratum Labs

> The Intelligence Layer for Web3 Communities

Dark institutional SaaS landing page built with Next.js 14, Tailwind CSS, and Framer Motion.

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
- **Smooth Scroll:** Lenis
- **Icons:** Lucide React
- **Language:** TypeScript

## Project Structure

```
stratum-labs/
├── src/
│   ├── app/
│   │   ├── globals.css    # Global styles + custom utilities
│   │   ├── layout.tsx     # Root layout with metadata
│   │   └── page.tsx       # Main landing page
│   ├── components/
│   │   ├── Hero.tsx       # Hero section with animated grid
│   │   ├── Problem.tsx    # Problem/pain points section
│   │   ├── BentoGrid.tsx  # Product cards in bento layout
│   │   ├── Pricing.tsx    # Pricing tiers
│   │   ├── CTA.tsx        # Final call-to-action
│   │   ├── Footer.tsx     # Site footer
│   │   ├── Navbar.tsx     # Fixed navigation
│   │   └── SmoothScroll.tsx # Lenis scroll wrapper
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
| Foreground | `#F3F4F6` | Primary text |
| Accent | `#3B82F6` | Primary brand color |
| Accent Bright | `#60A5FA` | Hover states |
| Accent Cyan | `#06B6D4` | Gradient endpoints |

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** Bold, tight tracking (-0.04em)
- **Body:** Regular, relaxed line height

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Railway

```bash
railway login
railway init
railway up
```

## Customization

1. Update brand colors in `tailwind.config.ts`
2. Modify copy in component files
3. Replace placeholder links with real URLs
4. Add your own logos/images to `/public`

---

Built with the Vibe Coding workflow.
