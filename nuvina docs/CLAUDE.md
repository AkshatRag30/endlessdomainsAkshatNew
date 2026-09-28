# Nuvina storefront

Small headless Shopify storefront for Nuvina effervescent supplements. Visitors browse
products, add to cart, and pay on Shopify checkout (cart.checkoutUrl). No accounts, no
custom checkout, no global state library.

Stack: Next.js 16 App Router, React 19, Tailwind v4, TypeScript strict, Shopify Storefront API.

## Current state (as of commit 72f0b6f, 26 Sep 2026)

Two static routes, both still prototypes built straight from Figma with hardcoded data:

  /          app/(main)/page.tsx   components/home/*     lib/figmaLandingData.ts
  /product   app/product/page.tsx  components/product/*  lib/figmaProductData.ts

Images and video are served from Cloudinary (lib/cloudinary.ts, components/CloudinaryImage.tsx).
Both pages render the header and footer themselves; there is no shared layout, no Shopify
connection and no cart yet (Add to Cart only shows a timed "Added" label).

The /product page was built from the OLD Figma file (U801ftFDIs7CewVfx4jFdl, node 224:7322).
The source of truth is now 0ftgtvdbr0JURIS2VDkGTZ; see docs/FIGMA_MAP.md for the differences.

The structure below is the target. Migration happens phase by phase; check docs/PLAN.md for
what is done. Do not restructure ahead of the current phase.

## Commands

npm run dev | npm run build | npm run start
(lint, typecheck and format scripts are added in phase P1)

## Read before working

docs/PLAN.md  docs/SCOPE.md  docs/FIGMA_MAP.md  docs/SHOPIFY_SETUP.md
Full reasoning: docs/reports/nuvina-frontend-blueprint.html and nuvina-claude-code-plan.html

## Target structure

src/app/                  routes; (shop)/layout.tsx holds header, footer, cart drawer
src/components/ui/        generic pieces, no data knowledge (Button, Price, Carousel...)
src/components/layout/    on every page (Header, Footer, AnnouncementBar, WhatsAppButton)
src/components/sections/  used on two or more pages (MostLoved, Faq, Reels, HealthGoals...)
src/components/home/      home page only (HomeHero, WhyNuvina, BlogCards)
src/components/product/   product cards and the product page
src/components/cart/      CartProvider, CartDrawer, CartButton, AddToCartButton
src/lib/shopify/          the ONLY place that talks to Shopify (client, queries, cart, types, index)
src/lib/actions.ts        server actions for the cart and newsletter
src/lib/content.ts        brand copy that is not in Shopify
src/lib/utils.ts          cn, formatMoney, discountPercent
src/lib/cloudinary.ts     Cloudinary loader and video URLs (marketing media only; see SCOPE.md)
src/components/ui/CloudinaryImage.tsx   next/image preset to the Cloudinary loader

## Rules

1. Pages fetch, components display. Only src/app and src/lib/actions.ts import from lib/shopify.
2. Put a file where it is used. Move home or product files to sections once a second page uses them.
3. Server components by default. Put state in a small sibling file with "use client" (MostLovedTabs.tsx).
4. Colors, fonts and widths come from tokens in globals.css. No hex values or max-w-[...] in components.
5. Product content comes from Shopify; brand copy from lib/content.ts. Never type content into a component.
6. One component per file, PascalCase, named export, props type in the same file.
7. Figma: read one node from docs/FIGMA_MAP.md at a time. Never fetch a whole page frame.
8. Before finishing a task: run lint, typecheck and build, then tick docs/PLAN.md.
9. One concern per commit. Never mix dependency upgrades with deletions.
10. Never build a second copy of a section. Before creating a component, search components/ for
    one that already renders the same Figma block (see the duplicate list in docs/PLAN.md).
11. A component file never imports from another page's folder (product/* must not import
    home/*). If two pages need it, it belongs in ui/ or sections/.

## Tokens (role names; replace the old figma-* names in P1)

brand #0047BB, brand-strong #0C3578, accent-lime #E3F6A4, cta-from #99E261, cta-to #78BB45,
ink #122511, ink-green #227722, ink-muted #726A63, surface-soft #F3F5F0, sale #EF4B81,
whatsapp #6DB76A, container-page 90rem (1440px, the only page width)

## Never

Expose SHOPIFY_STOREFRONT_TOKEN to the client or commit .env files. Add Redux, a slider
library or new top level folders without asking. Copy placeholder text listed in docs/SCOPE.md.
Commit debug.log or tsconfig.tsbuildinfo.
