# Plan

Eight phases, about 3 to 4 weeks for one developer. One branch and one pull request per phase.
Tick items as they are finished. Prompts for each phase are in
docs/reports/nuvina-claude-code-plan.html.

## P0 Documents and setup (1 day) · branch chore/p0-docs

* [x] CLAUDE.md
* [x] docs/SCOPE.md, docs/FIGMA_MAP.md, docs/SHOPIFY_SETUP.md, docs/PLAN.md
* [ ] Review every document and correct anything wrong
* [ ] Check each FIGMA_MAP node against a screenshot
* [ ] Send the open questions in SCOPE.md to their owners
* [ ] Add .claude/settings.json (permissions) after P1 installs Prettier, then the format hook

Done when: Claude Code fetches the screenshot of node 1:3965 and you agree with every rule in CLAUDE.md.

## P1 Clean up and foundation (2 days) · branch chore/p1-foundation

* [ ] Delete debug.log (root, lib, components/home) and tsconfig.tsbuildinfo; add both to .gitignore
* [ ] Move app, components and lib into src/; keep the @/* alias pointing at src
* [ ] Turn on strict in tsconfig.json and fix every error (no any, no ts-ignore)
* [ ] Add ESLint (next/core-web-vitals, simple-import-sort) and Prettier with the Tailwind plugin
* [ ] Add lint, typecheck and format scripts and a GitHub Actions job (install, lint, typecheck, build)
* [ ] Rename tokens by role in globals.css, remove the legacy cream/forest/gold set, add --container-page
* [ ] Replace every figma-* class and hex value in components
* [ ] Load the Figma fonts with next/font
* [ ] Remove the stale comment in the home page, the nested copy exclusions and the "Figma" import names
* [ ] Fix max-w-w8xl in Header.tsx

Done when: lint, typecheck and build pass, the home page looks unchanged, and no figma- class or hex value remains in components.

## P2 Shopify store and data layer (2 days) · branch feat/p2-shopify

* [ ] Store: Headless channel, 5 products with Flavor and Pack variants, metafield definitions, collections, menus, pages, Judge.me
* [ ] .env.local (not committed) and .env.example (committed)
* [ ] Allow cdn.shopify.com in next.config
* [ ] src/lib/shopify/client.ts (shopifyFetch, server-only, cache tags)
* [ ] src/lib/shopify/queries.ts and types.ts
* [ ] src/lib/shopify/index.ts: getProduct, getProductHandles, getCollectionProducts, getRecommendations, getMenu, getPage, searchProducts
* [ ] JSON metafields parsed in one place with safe fallbacks
* [ ] formatMoney and discountPercent in src/lib/utils.ts

Done when: a temporary page prints typed data for all five products, including variants and metafields (then delete it).

## P3 UI and layout components (3 days) · branch feat/p3-ui-layout

* [ ] ui/Button, Price, StarRating, QuantityStepper, Accordion (details/summary), Carousel (from SliderControls), Container, SectionHeading, Icon
* [ ] layout/AnnouncementBar, Header (server) with MobileMenu and SearchBar (client), Footer, WhatsAppButton
* [ ] app/(shop)/layout.tsx composing the layout, menus from getMenu()
* [ ] next/link everywhere; no href="#"
* [ ] Header and footer imports removed from the home page

Done when: the header stays mounted between pages, matches Figma at 1512px, and works with the keyboard at 375px.

## P4 Home page (4 days) · branch feat/p4-home

* [ ] product/ProductCard (with quick add slot)
* [ ] home/HomeHero, sections/ClaimsMarquee, sections/HealthGoals
* [ ] sections/MostLoved with MostLovedTabs (client)
* [ ] home/WhyNuvina, sections/RitualTimeline, sections/Reels, sections/Testimonials
* [ ] home/BlogCards, sections/Faq, sections/Newsletter (server action in lib/actions.ts)
* [ ] Brand copy moved into src/lib/content.ts with real text
* [ ] Home page loads collections with Promise.all and passes props down
* [ ] Home metadata and Open Graph image
* [ ] Delete components/home/PlaceholderArt.tsx, SliderControls.tsx and lib/figmaLandingData.ts

Done when: the home page matches Figma section by section with real products and Lighthouse mobile performance is 90 or better.

## P5 Product page (4 days) · branch feat/p5-product

* [ ] app/(shop)/products/[handle]/page.tsx with generateStaticParams, generateMetadata, Product JSON-LD, notFound()
* [ ] product/ProductGallery (vertical thumbnails, +6 overflow, arrows, swipe, flavor image switch)
* [ ] product/ProductInfo (server) with VariantPicker (client, ?variant= in URL), Price, QuantityStepper, AddToCartButton
* [ ] product/LabTests, KeyBenefits, Ingredients, WhatMakesItBetter (hidden when empty)
* [ ] Shared sections reused: TrustStrip, HealthGoals, RitualTimeline, MostLoved (recommendations), Reels, Testimonials, Faq
* [ ] Sold out variants disabled

Done when: all five products render from one route, an unknown handle shows not found, and a shared ?variant= link opens with that flavor selected.

## P6 Cart and checkout (2 days) · branch feat/p6-cart

* [ ] src/lib/shopify/cart.ts: create, get, add, update, remove
* [ ] Server actions addToCart, updateCartLine, removeCartLine; cart id in an httpOnly cookie
* [ ] cart/CartProvider (drawer open state only), CartDrawer, CartButton with count, AddToCartButton with useTransition
* [ ] Free shipping progress toward ₹699 in the drawer
* [ ] Checkout button links to cart.checkoutUrl
* [ ] Quick add on ProductCard

Done when: a test order placed from the storefront appears in Shopify admin and the cart survives a reload.

## P7 Remaining pages, QA and launch (3 days) · branch feat/p7-launch

* [ ] collections/[handle] with ProductGrid and sort
* [ ] search page
* [ ] pages/[handle] for shipping, returns, privacy, terms
* [ ] sitemap.ts, robots.ts, canonical URLs, branded not-found.tsx
* [ ] api/revalidate/route.ts with HMAC check; webhook registered in Shopify
* [ ] Optional: learn/[handle] for blog articles

### Launch checklist

* [ ] Responsive at 375, 768, 1024, 1280, 1512 on every page
* [ ] Keyboard walkthrough: menu, search, gallery, picker, drawer, accordion
* [ ] Every image has real alt text; lime and green tokens pass contrast
* [ ] Lighthouse mobile 90 or better on home and product pages
* [ ] No console errors; no placeholder copy from SCOPE.md anywhere
* [ ] Playwright smoke test (home, product, add to cart, checkout link) passing in CI
* [ ] Deployed to Vercel with env variables; domain connected
* [ ] One real order completed on the live domain

Done when: every header and footer link opens a real page and the launch checklist is fully ticked.
