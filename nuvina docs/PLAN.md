# Plan

Eight phases, about 3 to 4 weeks for one developer. One branch and one pull request per phase.
Tick items as they are finished. Prompts for each phase are in
docs/reports/nuvina-claude-code-plan.html.

## Change log

| Date        | Commit  | What changed in the repo                                   | Effect on this plan |
|-------------|---------|------------------------------------------------------------|---------------------|
| 25 Sep 2026 | 33595c6 | Baseline: home page prototype only                         | Plan written        |
| 26 Sep 2026 | 72f0b6f | /product prototype added: 11 components in components/product, lib/figmaProductData.ts, Cloudinary images and video, built from the old Figma file | P5 now starts from this code; new duplicates and literals added to P1, P3 and P5 |

## Known duplicates to merge (never build a third copy)

| Figma block     | Home version                      | Product version                              | Merge into                  | Phase |
|-----------------|-----------------------------------|----------------------------------------------|-----------------------------|-------|
| Most Loved      | components/home/MostLoved.tsx     | components/product/ProductRecommendations.tsx | sections/MostLoved.tsx      | P4    |
| Useful resources| components/home/UsefulResources.tsx | components/product/UsefulResources.tsx     | sections/Reels.tsx          | P4    |
| FAQ             | components/home/FAQ.tsx           | components/product/ProductFAQ.tsx            | sections/Faq.tsx            | P4    |
| Health goals    | components/home/HealthGoals.tsx   | components/product/HealthGoalChips.tsx       | sections/HealthGoals.tsx (cards, per new Figma) | P4 |
| Glow up timeline| components/home/WhyNuvina.tsx (part) | components/product/HowToUse.tsx           | sections/RitualTimeline.tsx | P4    |
| Page chrome     | app/(main)/page.tsx               | app/product/page.tsx                         | app/(shop)/layout.tsx       | P3    |

## P0 Documents and setup (1 day) · branch chore/p0-docs

* [x] CLAUDE.md
* [ ] Keep CLAUDE.md at the repo root (it is currently in docs/). Claude Code only loads it
      automatically from the root or .claude/, so rules in docs/CLAUDE.md are skipped at session start
* [x] docs/SCOPE.md, docs/FIGMA_MAP.md, docs/SHOPIFY_SETUP.md, docs/PLAN.md
* [x] Docs updated for commit 72f0b6f (product page prototype)
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
* [ ] Fold the product page literals into tokens or existing ones: #004141, #0B4A3F, #0245B1,
      #A0342A, #179D46, #4F85F9, #170F49, #74AA50, #F9FFF7, #FBF4EC, #FBF9D9, #EEF0F4, #E0E0E0
      (about 40 uses across components/product), and the arbitrary sizes like text-[15px]
* [ ] Load the Figma fonts with next/font
* [ ] Remove the stale comments in app/(main)/page.tsx and app/product/page.tsx (both point to
      the old Figma file and a /figma-landing route that no longer exists), the nested copy
      exclusions, and the "Figma" import names (FigmaHeader, FigmaProductPage...)
* [ ] Fix max-w-w8xl in Header.tsx
* [ ] Set a real git author name and email on every machine (72f0b6f was committed as "unknown")

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
* [ ] Move components/CloudinaryImage.tsx to ui/CloudinaryImage.tsx; keep lib/cloudinary.ts
* [ ] SliderControls becomes ui/Carousel; ProductRecommendations and product/UsefulResources stop importing from components/home
* [ ] PlaceholderArt GoalIcon (used by HealthGoalChips) moves to ui/Icon.tsx
* [ ] app/(shop)/layout.tsx composing the layout, menus from getMenu()
* [ ] Move app/(main)/page.tsx and app/product/page.tsx under app/(shop)/ (keep /product working until P5)
* [ ] next/link everywhere; no href="#"
* [ ] Header and footer imports removed from both pages

Done when: the header stays mounted between pages, matches Figma at 1512px, and works with the keyboard at 375px.

## P4 Home page (4 days) · branch feat/p4-home

* [ ] Merge the duplicates in the table at the top of this file; both pages use the merged sections
* [ ] product/ProductCard (with quick add slot), shared by MostLoved on both pages
* [ ] home/HomeHero, sections/ClaimsMarquee, sections/HealthGoals
* [ ] sections/MostLoved with MostLovedTabs (client)
* [ ] home/WhyNuvina, sections/RitualTimeline, sections/Reels, sections/Testimonials
* [ ] home/BlogCards, sections/Faq, sections/Newsletter (server action in lib/actions.ts)
* [ ] Brand copy moved into src/lib/content.ts with real text
* [ ] Home page loads collections with Promise.all and passes props down
* [ ] Home metadata and Open Graph image
* [ ] Delete components/home/PlaceholderArt.tsx, SliderControls.tsx and lib/figmaLandingData.ts

Done when: the home page matches Figma section by section with real products and Lighthouse mobile performance is 90 or better.

## P5 Product page (3 to 4 days) · branch feat/p5-product

Starting point: the /product prototype from 72f0b6f. Keep what works (gallery with thumbnails,
"+N" overflow, video with poster, lightbox with zoom and Escape, pack and flavor selection,
quantity limits, aria labels). Change how it gets data and where it lives.

* [ ] app/(shop)/products/[handle]/page.tsx with generateStaticParams, generateMetadata, Product JSON-LD, notFound()
* [ ] Delete app/product/page.tsx and add a redirect from /product to the first product
* [ ] ProductGallery takes media as props (Shopify media) instead of importing productHero.gallery
* [ ] Split ProductInfo (235 lines, fully client) into a server ProductInfo plus client VariantPicker
      (flavor and pack, ?variant= in URL), QuantityStepper and AddToCartButton
* [ ] Flavor and pack come from Shopify options and variants; remove packSizes from figmaProductData
* [ ] Buy Now wired in P6 (add, then go to checkoutUrl); until then it stays disabled, not fake
* [ ] Rename to the target files: LabTestBanner → LabTests, WhatsInside → Ingredients + WhatMakesItBetter,
      TrustRow → sections/TrustStrip, HealthGoalChips → KeyBenefits (health goals use sections/HealthGoals)
* [ ] Decide on KeyBenefitsTabs (section links; not in new Figma). Remove it, or keep it as
      product/SectionNav.tsx if the designer approves
* [ ] Recheck every block against the NEW Figma nodes in docs/FIGMA_MAP.md (differences table)
* [ ] Sections hidden when their metafield is empty
* [ ] Sold out variants disabled
* [ ] Delete lib/figmaProductData.ts once nothing imports it

Done when: all five products render from one route, an unknown handle shows not found, and a shared ?variant= link opens with that flavor selected.

## P6 Cart and checkout (2 days) · branch feat/p6-cart

* [ ] src/lib/shopify/cart.ts: create, get, add, update, remove
* [ ] Server actions addToCart, updateCartLine, removeCartLine; cart id in an httpOnly cookie
* [ ] cart/CartProvider (drawer open state only), CartDrawer, CartButton with count, AddToCartButton with useTransition
* [ ] Free shipping progress toward ₹699 in the drawer
* [ ] Checkout button links to cart.checkoutUrl
* [ ] Replace the timed "Added" label in ProductInfo with the real addToCart action
* [ ] Buy Now: add the selected variant, then redirect to cart.checkoutUrl
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
