# Scope

## In

Home, product page (every product from one route), collections (shop all, best sellers,
new arrivals, one per health goal), search, policy pages, cart drawer, Shopify checkout
handoff, newsletter signup, WhatsApp button, SEO basics (metadata, sitemap, robots, Product JSON-LD).
Product page actions: Add to Cart (adds and opens the drawer) and Buy Now (adds, then goes
straight to cart.checkoutUrl). Image zoom lightbox and product video in the gallery.

## Out (for now)

Custom checkout, customer account pages (the account icon links to Shopify customer accounts),
a separate /cart page, subscriptions, quiz, loyalty, multiple currencies or markets.
Blog article pages are optional in P7.

## Devices

Mobile first. Check at 375, 768, 1024, 1280 and 1512 wide.
Latest Chrome, Safari (iOS and macOS), Firefox, Samsung Internet.

## Mobile rules (until the designer sends mobile frames)

| Area             | Rule                                                           |
|------------------|----------------------------------------------------------------|
| Header           | Logo, search icon, account, cart; nav links in a slide out menu |
| Home hero        | Image above copy; arrows below the copy; rotating badge hidden |
| Product hero     | Gallery above info; thumbnails become a horizontal strip       |
| Card rows        | Horizontal scroll with snap, about 1.3 cards visible           |
| FAQ              | One column                                                     |
| Footer           | Columns stack; socials and legal at the bottom                 |

## Placeholder copy in Figma: do not use

"Remap" testimonial repeated under four names, Webflow and BRIX Templates FAQ questions,
Latin blog excerpts and generic marketing article titles, footer tagline "Building
coordination tools for organizations of all shapes and sizes", "firat" typo in the
newsletter line, all five health goal cards titled "Hydration", the same product on every
Most Loved card, duplicate "Why NUVINA" and "Useful resources" headings on the home page.

Also placeholder in the current /product prototype (lib/figmaProductData.ts):
"Provides antioxidant" on every health goal and key benefit chip; "All About ACV CQR Plus
Effervescent" on all seven video cards; "Performance Hydration Powder, Citrus Charge" in
the What's inside banner while the page sells ACV Moringa; every recommendation card is
"HYDRATE ₹363.44"; prices for the 1, 3 and 6 pack sizes (only Pack of 12 at ₹799 / ₹1,099
comes from Figma); gallery photos show Glow, not ACV Moringa; page title
"NUVINA — Figma product page test build".

## Open questions

| Question                                         | Owner       | Needed by | Answer |
|--------------------------------------------------|-------------|-----------|--------|
| Mobile frames for home and product pages         | Designer    | P3        |        |
| Real copy for testimonials, FAQ, blog, footer    | Brand team  | P4        |        |
| Must nutrition facts show on the PDP (FSSAI)?    | Brand team  | P5        |        |
| Reviews app (Judge.me suggested)                 | Store owner | P2        |        |
| Newsletter provider (Klaviyo or Shopify)         | Marketing   | P4        |        |
| WhatsApp Business number                         | Marketing   | P3        |        |
| Store access and Storefront API token            | Store owner | P2        |        |
| Which Figma file is final: 0ftgtvdbr0 (docs) or U801ftFDIs7 (used for /product)? | Designer | P3 | |
| Keep the in-page section tab row? (only in old file) | Designer | P5     |        |
| Real pack sizes and prices (1, 3, 6, 12 packs?)  | Brand team  | P2        |        |
| Image hosting: Shopify media for products, Cloudinary for marketing video only? | Store owner | P2 | |
| Are the ChatGPT-generated gallery images approved for production, and who owns the Cloudinary account (qstekdyi)? | Brand team | P5 | |
