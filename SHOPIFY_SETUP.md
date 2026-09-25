# Shopify setup

This is the data contract between the store and the frontend. src/lib/shopify/types.ts and
the queries are written from this file. Change this file first when the data changes.

## Products

Five products (handles): hydrate, glow, multi-plus, immune-plus, reset.
Options: "Flavor" (with swatch colors) and "Pack" (for example "Pack of 12 (180 Tablets)").
Set a compare at price on sale variants; the frontend computes the save percentage.
Images: the first image is the card image. Attach a variant image to each flavor.
SEO title and description filled for every product.

## Product metafields (namespace: custom)

Tick "Storefront access" on every definition, or the API will not return it.

| Key          | Type                              | Used by                 | Example                                      |
|--------------|-----------------------------------|-------------------------|----------------------------------------------|
| tagline      | single_line_text_field            | ProductInfo kicker      | Helps break the craving cycle*               |
| claims       | list.single_line_text_field       | badges, attribute icons | No side effects, Natural, Vegan              |
| key_benefits | list.single_line_text_field       | KeyBenefits             | Provides antioxidant support                 |
| ritual       | json                              | RitualTimeline          | [{ "label": "Day 1", "text": "..." }]        |
| ingredients  | json                              | Ingredients             | [{ "name": "Moringa", "benefit": "..." }]    |
| free_from    | list.single_line_text_field       | WhatMakesItBetter       | Artificial Flavor, Artificial Color          |
| faqs         | json                              | Faq                     | [{ "q": "...", "a": "..." }]                 |
| lab_report   | file_reference                    | LabTests                | PDF of the lab report                        |

Variant metafield: custom.flavor_note (single_line_text_field), shown under the flavor picker.

Reviews: Judge.me writes reviews.rating and reviews.rating_count automatically.

## Collections

best-sellers, new-arrivals, all, and one per health goal:
hydration, skin-beauty, daily-nutrition, immune-support, digestive-wellness.
Card color and icon for each health goal live in src/lib/content.ts, keyed by handle.

## Menus

main-menu: Shop, Health Goals, Ingredients, Learn, Our Science
footer: Shop (All Products, Health Goals, Bundles), Learn (Ingredient Library, Health Guides),
Help (FAQs, Shipping, Returns, Contact us)

## Pages and policies

Pages: shipping, returns, contact. Policies: privacy, terms, refund.

## Apps and channels

Headless sales channel (creates the Storefront API token).
Judge.me (reviews). Klaviyo if chosen for the newsletter.

## Environment variables

| Name                         | Where         | Notes                          |
|------------------------------|---------------|--------------------------------|
| SHOPIFY_STORE_DOMAIN         | server        | nuvina.myshopify.com           |
| SHOPIFY_STOREFRONT_TOKEN     | server        | never prefix with NEXT_PUBLIC_ |
| SHOPIFY_API_VERSION          | server        | 2026-07                        |
| SHOPIFY_WEBHOOK_SECRET       | server        | verifies webhook HMAC          |
| NEXT_PUBLIC_SITE_URL         | public        | canonical URLs and sitemap     |
| NEXT_PUBLIC_WHATSAPP_NUMBER  | public        | WhatsApp button                |

## Webhook

Topics products/update, products/delete, collections/update, inventory_levels/update
POST to https://<site>/api/revalidate, which checks X-Shopify-Hmac-Sha256 and calls
revalidateTag('products', 'max') or revalidateTag('collections', 'max').

## Cache tags

products, collections, menus, pages
