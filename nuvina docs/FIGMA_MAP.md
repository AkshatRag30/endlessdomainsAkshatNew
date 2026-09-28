# Figma map

Source of truth: file 0ftgtvdbr0JURIS2VDkGTZ
Home frame: 1:3771 (1512 x 6104). Product frame: 1:4505 (1512 x 6364). No mobile frames yet.

Older file: U801ftFDIs7CewVfx4jFdl. The current code was built from it (home from node 22:7966
and mobile 108:502, product from node 224:7322, 1512 x 6525). Use it only to trace where
existing code came from. Build and check against the new file.

Fetch one node at a time with get_design_context and get_screenshot. The whole page frames
return far too much data to be useful.

## Status key

todo      nothing built yet
proto     a prototype exists (hardcoded data, old location); still needs migrating to the target file
done      migrated, fed by real data, checked against the new file

## Home

| Section                  | Node   | Target file                   | Status | Current code                         |
|--------------------------|--------|-------------------------------|--------|--------------------------------------|
| Announcement bar         | 1:3848 | layout/AnnouncementBar.tsx    | proto  | components/home/AnnouncementBar.tsx  |
| Header                   | 1:3773 | layout/Header.tsx             | proto  | components/home/Header.tsx           |
| Hero copy and CTAs       | 1:3816 | home/HomeHero.tsx             | proto  | components/home/Hero.tsx             |
| Hero image               | 1:3839 | home/HomeHero.tsx             | proto  | components/home/Hero.tsx             |
| Rotating badge           | 1:3840 | home/HomeHero.tsx             | proto  | components/home/Hero.tsx             |
| Hero slider controls     | 1:4488 | ui/Carousel.tsx               | proto  | components/home/SliderControls.tsx   |
| Claims marquee           | 1:3807 | sections/ClaimsMarquee.tsx    | todo   |                                      |
| Shop by health goal      | 1:3902 | sections/HealthGoals.tsx      | proto  | components/home/HealthGoals.tsx      |
| Most loved               | 1:3965 | sections/MostLoved.tsx        | proto  | components/home/MostLoved.tsx        |
| Why NUVINA banner        | 1:4172 | home/WhyNuvina.tsx            | proto  | components/home/WhyNuvina.tsx        |
| Glow up timeline         | 1:4177 | sections/RitualTimeline.tsx   | proto  | components/product/HowToUse.tsx (same block) |
| Useful resources reels   | 1:4186 | sections/Reels.tsx            | proto  | components/home/UsefulResources.tsx  |
| Testimonials             | 1:4303 | sections/Testimonials.tsx     | proto  | components/home/Testimonials.tsx     |
| Blog cards               | 1:4354 | home/BlogCards.tsx            | proto  | components/home/BlogResources.tsx    |
| FAQ                      | 1:4410 | sections/Faq.tsx              | proto  | components/home/FAQ.tsx              |
| Newsletter (Circle)      | 1:4448 | sections/Newsletter.tsx       | proto  | components/home/Newsletter.tsx       |
| Footer                   | 1:3851 | layout/Footer.tsx             | proto  | components/home/Footer.tsx           |

## Product

| Section                  | Node   | Old node  | Target file                   | Status | Current code                              |
|--------------------------|--------|-----------|-------------------------------|--------|-------------------------------------------|
| Gallery                  | 1:4544 | 224:7360  | product/ProductGallery.tsx    | proto  | components/product/ProductGallery.tsx     |
| Product info             | 1:4591 | 224:7409  | product/ProductInfo.tsx       | proto  | components/product/ProductInfo.tsx        |
| WhatsApp button          | 1:4842 |           | layout/WhatsAppButton.tsx     | todo   |                                           |
| Trust strip              | 1:4698 | 224:7515  | sections/TrustStrip.tsx       | proto  | components/product/TrustRow.tsx           |
| Section tab row          | none   | 250:9186  | (not in new design)           | proto  | components/product/KeyBenefitsTabs.tsx    |
| Health goals             | 1:4728 | 224:7545  | sections/HealthGoals.tsx      | proto  | components/product/HealthGoalChips.tsx (old chip style) |
| Our lab tests            | 1:4791 | 224:7608  | product/LabTests.tsx          | proto  | components/product/LabTestBanner.tsx      |
| Key benefits             | 1:4804 | 224:7620  | product/KeyBenefits.tsx       | proto  | components/product/HealthGoalChips.tsx    |
| How to use timeline      | 1:4833 | 224:7650  | sections/RitualTimeline.tsx   | proto  | components/product/HowToUse.tsx           |
| What's inside matters    | 1:4846 | 224:7662  | product/Ingredients.tsx       | proto  | components/product/WhatsInside.tsx        |
| What makes it better     | 1:4865 | 224:7683  | product/WhatMakesItBetter.tsx | proto  | components/product/WhatsInside.tsx        |
| Most loved               | 1:4866 | 224:7683  | sections/MostLoved.tsx        | proto  | components/product/ProductRecommendations.tsx (duplicate of home) |
| Reels                    | 1:5073 | 224:7890  | sections/Reels.tsx            | proto  | components/product/UsefulResources.tsx (duplicate of home) |
| Testimonials             | 1:5190 | 224:8007  | sections/Testimonials.tsx     | proto  | components/home/Testimonials.tsx (reused) |
| FAQ                      | 1:5241 | 224:8058  | sections/Faq.tsx              | proto  | components/product/ProductFAQ.tsx (duplicate of home) |
| Newsletter               | 1:5278 | 224:8095  | sections/Newsletter.tsx       | proto  | components/home/Newsletter.tsx (reused)   |
| Footer                   | 1:5318 | 224:8135  | layout/Footer.tsx             | proto  | components/home/Footer.tsx (reused)       |

## Differences between the old and new product frames

Check these before migrating each block. The new file wins unless the designer says otherwise.

| Area               | Old file (built)                                         | New file (target)                                    |
|--------------------|----------------------------------------------------------|------------------------------------------------------|
| Section tab row    | Four "Key Benefits" tabs under the hero                  | Not present                                          |
| Health goals       | Five small tinted chips reading "Provides antioxidant"  | The same five tinted cards as the home page          |
| Trust strip        | Under the product info column                            | Its own row under the hero, centered                 |
| Frame height       | 6525                                                     | 6364                                                 |

The code also changed things neither file shows: the tab row was repurposed as in-page links
(FAQ, Testimonials, Useful Resources, Most Loved, How to Use, What's Inside), a pack size
selector with four packs was added, and the trust icons were moved under the gallery.
Confirm each with the designer.
