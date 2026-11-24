# Promotions Page: Implementation Plan

Figma: file `hq6HmB04UFUlFiJp9f9eGv` (marketplace akshat), section **"Promotions"** `212:16535`.
Branch: open (Q12). Written 3 Nov 2026. Code comments cite this file as "promotions plan §N.N".
Nothing is built yet. Start a phase only when the user says so.

---

## 1. Context

The Promotions page lets a seller pay to push one of their listed names into the spotlight. It lives in Seller Hub (the sidebar item already exists as a "soon" placeholder in `src/data/marketplace/navigation.ts`). The page is about **one domain at a time** (Figma shows `vision.eth`): pick a plan in step 1, pick a token in step 2, review in the right rail, then a right side drawer runs Checkout, wallet signature, progress and the "Promotion live" result.

### 1.1 The headline problem: Figma and the backend describe different products

| | Figma (`212:16535`) | Backend today (`origin/uat` 7fb3e55f, fetched 3 Nov) |
|---|---|---|
| Plans | Boost, Featured, Premium, each 7 days, with a reach meter | `PromotionPlan` enum: `24h` ($1) and `7d` ($5), `payment/constants/promotion-plans.constant.ts` |
| Currency | ETH, USDC, WETH from the connected wallet | USD invoice |
| Payment | On chain: wallet signature, contract `0xED00…Pr0m`, tx hash | `POST /marketplace/payment/create/invoices` returns a hosted **Cryptomus** invoice URL; a webhook marks it paid |
| Activation | "Goes live right after payment confirms" | `isPromoted` on `domain_list` set by the paid webhook or by admin tags (`analytics.repo.ts:247`); `transaction-cron` clears it |
| Stats | Views 7d, Unique visitors, Watchers, Offers, Est. views, vs organic | `analytics` has views, clicks, saves per domain; no unique visitors, no offers, no estimate model |
| Placement | "Search + Category", "Homepage + Category + Search" | One `promoted-domains-list` feed (marketplace "Promoted" strip) |

The old v1 flow (`src/component/modals/PromoteModal.tsx` → `AgreeModal` → `PaymentMethodModal` → `ThankyouModal`) is the one wired to Cryptomus today through `useSetPaymentInvoiceMutation` in `src/core/redux/payment.ts`. The current sidebar promo card copy ("$1 for 24 hours, $5 for 7 days") also matches the backend, not Figma.

**Plan**: build the page and drawer exactly as Figma on **sample data with the Sample data chip** (same approach as Portfolio), and keep every number behind hooks so whichever payment model product picks (Q1) plugs in at phase 10 without touching composites. Nothing in the UI fakes a real payment: on sample data the Confirm buttons simulate the steps and say so.

### 1.2 Dark mode from the first line

Both themes are drawn. Every new SCSS file follows `CLAUDE.md` §7: role tokens only, `@include dark` last in the rule, brand gradients (hero, sign card, Featured card, Est. views tile) commented as brand fills.

---

## 2. Screen inventory

### 2.1 Frame map

| Frame | Light | Dark | Size |
|---|---|---|---|
| Desktop page | `212:20021` | `212:18354` | 1512 × 1106 |
| Mobile page | `212:19142` | `212:19582` | 390 × 1926 |
| Drawer: Checkout (desktop) | `212:16923` | `212:17182` | 540 wide |
| Drawer: Sign, "Confirm in your wallet" | `212:16657` | `212:16733` | 540 × 783 |
| Drawer: Sign, progress checklist | `212:16809` | `212:16866` | 540 × 783 |
| Drawer: Promotion live | `212:16537` | `212:16597` | 540 × 736 |
| Mobile Checkout ("Dialog - Buy") | `212:17440` / `212:17705` (pair) | | 390 |
| Mobile sign, progress, live | sections `212:17968`, `212:18117`, `212:18232` (one light + one dark frame each) | | 390 × 704 |

Inside the desktop page: hero `212:18373` (835 × 300), main column `212:18460` (steps 1 and 2 plus pay bar), right rail `212:18698` (305 × 729), sidebar `212:18870`.

### 2.2 Hero (`212:18373`)

Eyebrow "SELLER HUB · PROMOTION", title "Put Your Name In The Spotlight", subtitle "Promote your listing so more collectors discover vision.eth." Domain block: letter tile "V", name with green verified tick, `.eth` chip, "6 characters", "Premium" chip. Right: "Listed for 2.80 ETH / $6,777 USD". Four white tiles with icon: Views · 7d (412), Unique visitors (198), Watchers (23), Offers (3). Mobile: tiles go 2 × 2, price sits right of the name.

### 2.3 Step 1 "Choose Your Reach"

Numbered heading (1), "How promotion works ↗" link right. Three radio cards: icon tile (rocket, star, diamond), name, "7 days" chip, "Recommended" chip on Boost only, one line description, a six segment reach meter with label (Medium boost 2 filled + 1 half, High boost 4, Maximum boost 6), price "0.15 ETH" with token icon and "$363". Selected card gets a filled radio and a slightly stronger surface. Mobile: meter and price move under the text.

### 2.4 Step 2 "Pay With" and pay bar

Numbered heading (2), "Balances from 0x8A7F…3c9D" right. Three token tiles ETH, USDC, WETH: icon, symbol, check circle, "You pay", amount, "Balance …". Selected tile is the black filled card in both themes. Mobile: tiles stack full width. Below: a bar with shield icon "You pay **0.15 ETH** · balance after **1.10 ETH**" and an "Add Funds" button.

### 2.5 Right rail (`212:18698`)

1. "Live preview / Where buyers will see your listing." A fading list of four marketplace rows; the selected domain is first with a "Boosted" badge and a blue left edge.
2. Two tiles: "Est. views ~906" (blue gradient), "vs. organic +120%" (grey glass, green value).
3. Summary card: Plan, Runs for, Total (token icon), "Continue To Checkout →" button, lock line "Your domain never leaves your wallet".
4. "Our Tip" green card with bulb icon.

Mobile (`212:19142`) keeps only the summary card, placed after the pay bar. Live preview, the two tiles and Our Tip are not in the mobile frame.

### 2.6 Checkout drawer (`212:16923`)

Header "Checkout" + close. Warning banner "Your wallet is on Ethereum … Top up or pick a cheaper name." with Add Funds. Domain identity (avatar, name, extension chip, mono meta line "bnb · 7 chars · one time · no renewal"). "Pay with": three radio rows (token icon, symbol, balance, "Low" chip, amount + USD; selected row black). Red balance box: "Balance 1.25 ETH", a progress bar, "You need 0.40 WETH more. Add funds or pick another token." "Order summary": plan header (icon, "Boost plan", "7 days · Medium boost", Change button) over rows Placement, Promotion price, Marketplace fee (0%) with info icon, Est. network fee, dashed rule, **Total due** in accent with USD. "Schedule": three step vertical timeline (Today · Goes live, Nov 3 · Midway check, Nov 6 · Ends). Terms checkbox, non custodial note. Footer: "Confirm & Pay 0.15 ETH", "Back".

### 2.7 Sign transaction drawers

1. `212:16657`: green pen icon with glow, "Confirm in your wallet", "Review the request below. Nothing moves until you sign." Blue gradient card: wallet and site on top, "Promotion payment 0.30 ETH / $726 USD", rows Plan, Domain, Network fee, Contract. Footer Confirm, Reject.
2. `212:16809`: avatar icon, heading, four step checklist on the gradient card (Signature approved, Broadcasting transaction, Confirming on chain, Activating promotion).
3. `212:16537` "Promotion live": green check, "vision.eth is live", subline, Tx hash chip with copy, purple "FEATURED vision.eth" card, three tiles Plan / Paid / Ends. Footer "Promote again", "View analytics".

### 2.8 Sidebar in the frame

Promotions is the active Seller Hub item. The promo card ("Promote A Listing … Choose a domain") is shown while signed in. The frame's sidebar item list differs from production (Notification, no Portfolio/History); keep production's list, only activate Promotions.

### 2.9 Figma quirks to flag in comments (do not silently fix)

1. All three plans cost the same "0.15 ETH / $363". Prices per plan are unknown.
2. Checkout shows `banking .ud` with "bnb · one time · no renewal": copied from the buy flow, not this domain.
3. Checkout balance box says "Balance 1.25 ETH" but "You need 0.40 WETH more" while WETH is selected and USDC is marked Low though 520 USDC > 363.
4. Schedule: a 7 day plan going live today shows Midway Nov 3 and Ends Nov 6 (3 days).
5. Sign step 1 says Featured 0.30 ETH while the page selected Boost 0.15 ETH; success says "running for 14 days" while every plan is 7 days.
6. Sign step 2 heading "future.xyz is live" shows while still broadcasting, and its footer still offers Confirm and Reject.
7. Light page: the summary card repeats the "Live preview" heading; dark has no heading. Follow dark (Q8).
8. Dark page: the two unselected token tiles look disabled (dimmed); light shows them normal. Is that "insufficient balance" or a drawing slip (Q7)?
9. Checkout's "Pay with" repeats the page's step 2 choice; which one wins (Q6)?
10. Light reach meters stretch the filled segments wider than the empty ones; dark keeps all six equal. Built equal (found in phase 3).
11. Mobile step 1 draws "How promotion works" off canvas (x 664 in a 358 frame). It wraps under the title instead of disappearing (found in phase 3).

---

## 3. What already exists to reuse

Checked in code 3 Nov, props read from the files.

### 3.1 Page level

| Need | Reuse | Change |
|---|---|---|
| Page frame, sidebar, header, bottom nav | `layouts/main-layout`, `MarketplacePageShell` (`hero`, `rightRail`, `mobileRailPlacement`) | none; use `mobileRailPlacement="after-main"`, hide preview/tiles/tip below mobile with a CSS class (Figma drops them) |
| Sidebar item | `navigation.ts` entry `promotions` | set `href` to `PROMOTIONS_HREF`, drop `badge: 'soon'` and `isPlaceholder` |
| Promo card | `layouts/sidebar/SidebarPromoCard` | CTA goes to `/promotions` instead of the coming soon toast; showing it signed in is Q9 |
| Sample chip | `primitives/badges/sample-data-chip` | none |
| Coming soon actions | `primitives/toast-message` | none |

### 3.2 Hero

| Need | Reuse | Change |
|---|---|---|
| Purple banner art | `PortfolioHeroBanner`'s `bannerbg.jpg` layer (with its 8px oversized `::before` fix) | copy the technique into a new `PromotionHeroBanner`; if the art is the same file, share the SCSS partial |
| `.eth` chip | `primitives/badges/extension-badge` | none |
| Premium chip | `primitives/badges/badge` | none (check contrast on the gradient) |
| Letter tile "V" | none: `DomainAvatar` draws a provider logo, not a letter | new `LetterTile` inside the composite; reused by the rail preview rows |
| Four stat tiles | `primitives/cards/summary-tile` variant `stat` (used by `PortfolioStatTiles`) | additive optional `icon` prop if it has none |
| Price + USD | `helpers/token-format` (`formatToken`) | none |

### 3.3 Steps, plan cards, token tiles

| Need | Reuse | Change |
|---|---|---|
| Step panels | `primitives/cards/glass-card` (`variant="plain"`) | new `PromotionStepCard` wraps it with the numbered heading and right slot |
| Plan radio group | `SegmentedToggle` `radio` is a label + sublabel list, too thin for icon, meter and price | new `PromotionPlanCard` + `PromotionPlanList` with real `role="radiogroup"` and arrow keys (copy the keyboard handling from `SegmentedToggle`) |
| "7 days", "Recommended" chips | `Badge` (`neutral`, `success`) | none |
| Reach meter | `InterestBars` is a bar chart, not a segment meter | **new primitive** `primitives/progress/segment-meter` (`total`, `filled`, `half?`, `label`) |
| Token icon next to price | `primitives/token-chain-icon` | none, maybe new ETH/USDC/WETH icon assets |
| Token tiles (page) | `PaymentMethodCard` is a one line radio row | new `PayTokenTile` composite (vertical tile) |
| Token rows (Checkout) | `PaymentMethodCard` (`label`, `sublabel`, `selected`, `disabled`) | **additive** `icon`, `trailing` (amount + USD), `chip` ("Low") props |
| Pay bar | `NoticeBanner` needs a title and body; the bar is one line | new `PromotionPayBar` (shield icon, text, `PrimaryButton` Add Funds) |

### 3.4 Right rail

| Need | Reuse | Change |
|---|---|---|
| Fading list | `primitives/lists/fade-scroll-list` | none |
| Preview rows | `ListingRow` is the full table row (too wide) | new `PromotionPreviewRow` (letter tile, name, "Boosted" `Badge accent`, meta, price) |
| Est. views / vs organic | `primitives/cards/stat-card` (`blue`, `gray` variants) | make `sublabel` optional (additive), check the gradients match |
| Summary rows | `primitives/cards/key-value-rows` (`plain`) | none |
| CTA | `primitives/buttons/primary-button` | none |
| Our Tip | `NoteBox` and `InfoNote` are grey/neutral | new `tone="success"` on `InfoNote` (additive) or a small `PromotionTipCard`; decide in phase 5 after reading both |

### 3.5 Drawer flow

| Need | Reuse | Change |
|---|---|---|
| Right drawer, 540px, header + close, pinned footer, full bleed on mobile | `primitives/modal` (`Modal`): built for exactly this | none |
| Step machine | `ListingFlowModal` / `BuyFlowModal` patterns | new `PromotionFlowModal` composite, steps: `checkout` → `sign` → `pending` → `live` / `error` |
| Wallet banner "Your wallet is on …" + Add Funds | `NoticeBanner` `tone="warning"` (same copy BuyFlowModal builds) | none |
| Domain identity block | the buy flow `ReviewPurchaseStep` `domainSection` | extract to a shared `DomainIdentityHeader` only if it is inline today; otherwise import |
| Shortfall box with bar | nothing matches (`WhatYouPaySection` is rows + callout, no bar) | new `BalanceShortfallCard` |
| Order summary | `KeyValueRows` `boxed` / `ruled` | plan header row is new markup inside `PromotionOrderSummary` |
| Schedule timeline | `TransactionChecklist` (`plain`, used by `OrderTimelineCard`) has done/active/pending rows with detail | reuse; icons per row may need an additive `icon` on the item |
| Terms + CTA + Back | `PurchaseTermsFooter` (`termsAccepted`, `ctaLabel`, `onBack`, `submitting`) | none; Figma puts the checkbox in the body, the footer version is the house pattern (note it) |
| Non custodial line | `InfoNote` | none |
| "Confirm in your wallet" | `primitives/wallet-pending-step` (`heading`, `subtext`, `children`) + `WalletPendingFooter` | children = new `PromotionSignCard` (gradient card with `KeyValueRows`) |
| Progress checklist | `TransactionChecklist` `card` (as `BuyPendingStep` uses it) | none |
| Result | `BuyResultStep` (`icon`, `heading`, `subtext`, `summaryRows`) + `BuyResultFooter` (`primaryLabel`, `secondaryLabel`) with `StatusIcon` | children slot for the Featured card + three `SummaryTile`s if `summaryRows` cannot hold them (additive) |
| Tx hash chip with copy | `truncateHash` in `helpers/token-format`; check `OrderReceiptCard` for an existing copy chip | reuse or extract |
| Balances and network | `useBuyFlowActions` reads USDT/POL via wagmi, but lives inside a composite folder (layering violation, `CLAUDE.md` §8) | do not import it; new `hooks/promotions/usePayTokenBalances.ts` using the same wagmi calls |

### 3.6 Genuinely new

Primitive: `segment-meter`. Composites (`src/design-system/composites/promotions/`): `hero/PromotionHeroBanner`, `plans/{PromotionStepCard,PromotionPlanCard,PromotionPlanList}`, `payment/{PayTokenTile,PayTokenList,PromotionPayBar}`, `right-rail/{PromotionPreviewPanel,PromotionPreviewRow,PromotionEstimateTiles,PromotionSummaryCard,PromotionTipCard}`, `flow/{PromotionFlowModal,CheckoutStep,BalanceShortfallCard,PromotionOrderSummary,PromotionSignCard,PromotionLiveStep}`, `shared/PromotionsPageView`, plus a curated `index.ts`.

---

## 4. Routing and navigation

1. Route `pages/promotions/index.tsx` (+ `promotions.module.scss`), auth only like My Domains.
2. `PROMOTIONS_HREF = '/promotions'` and `promotionHref(domainId)` in `src/helpers/marketplace/routes.ts`.
3. Query: `?domain=<listingId>` picks the domain, `?plan=boost|featured|premium`, `?token=eth|usdc|weth`; `router.replace` shallow, validated, unknown values fall back to defaults (Boost, ETH).
4. No `?domain`: the "choose a domain" state (Q4).
5. Bottom nav: Promotions marks the Account tab, like Portfolio (changed 4 Nov 2026: Sell is still a placeholder tab, so it can't be active).

---

## 5. Data model

### 5.1 Types: `src/types/promotions/index.ts`

```ts
export type PromotionPlanId = 'boost' | 'featured' | 'premium'
export type PayTokenSymbol = 'ETH' | 'USDC' | 'WETH'

export interface PromotionPlan {
  id: PromotionPlanId
  name: string
  description: string
  durationDays: number
  reachLabel: string          // 'Medium boost'
  reachFilled: number         // of 6 segments, may be .5
  priceToken: number          // in ETH
  priceUsd: number
  placement: string           // 'Search + Category'
  recommended?: boolean
}

export interface PromotionDomain {
  listingId: string
  name: string                // 'vision'
  extension: string           // '.eth'
  characters: number
  isPremium: boolean
  isVerified: boolean
  listedPriceToken: number
  listedPriceUsd: number
  stats: { views7d: number; uniqueVisitors: number | null; watchers: number | null; offers: number | null }
  activePromotion?: { planId: PromotionPlanId; endsAt: string } // already promoted state
}

export interface PayTokenBalance { symbol: PayTokenSymbol; balance: number; payAmount: number; isLow: boolean }

export interface PromotionEstimate { estViews: number; vsOrganicPct: number }

export interface PromotionReceipt { txHash: string; planId: PromotionPlanId; paidToken: number; symbol: PayTokenSymbol; endsAt: string }
```

### 5.2 Hooks: `src/hooks/promotions/` (one per file)

`usePromotionDomain(listingId)`, `usePromotionPlans()`, `usePayTokenBalances(planId)`, `usePromotionEstimate(listingId, planId)`, `usePromotionPreview(listingId)`, `usePromotionCheckout()` (the action: sample simulation now, real payment at phase 10), and `usePromotionWallet()` (the only file with wagmi calls; `usePayTokenBalances` and `usePromotionCheckout` use it). Backend data comes only from `src/core/redux/promotions.ts` (§5.6). All sample data through `useMockQuery` (exported from `src/hooks/marketplace/domain-overview/queryResult.ts`, same shape as an RTK Query result) with a **module level loader** (Portfolio lesson: an inline arrow loops on Loading).

### 5.3 Helpers: `src/helpers/promotions/` (pure)

`pricing.ts` (balance after, shortfall, `isLow`), `schedule.ts` (goes live, midway, ends from `durationDays`), `filterPreview.ts`. Node checks for each, like Portfolio.

### 5.4 Sample data: `src/data/promotions/`

`plans.ts`, `sampleDomain.ts` (`vision.eth` exactly as Figma), `previewListings.ts`, `tokenBalances.ts`.

### 5.5 Layering

Page file wires hooks into `PromotionsPageView` (or the page itself if Q11 says so); composites only draw. `PromotionFlowModal` may own `usePromotionCheckout` under exception 1 of `CLAUDE.md` §8 (action hook owned by one button). Run the §8 greps every phase.

### 5.6 Every API call comes from one place (decided 3 Nov 2026, user)

Every endpoint **Promotions owns** lives in **one file: `src/core/redux/promotions.ts`**. Data owned by other features comes through those features' existing hooks (item 3). No promotions page, component, helper or data file calls the network directly. This follows the existing pattern (`payment.ts`, `watchlist.ts`, `domain.ts`): one feature file that adds its endpoints to the shared `myApi` with `injectEndpoints`, so no store change is needed.

1. **URLs.** Every path is added to `API_ENDPOINT` in `src/core/enum/api-endpoint.enum.ts` and built once in `src/constants/Api.ts` (e.g. `PromotionPlansApi`). No URL string is typed anywhere else, not in a hook, a helper or a composite.
2. **Endpoints.** `promotions.ts` defines every query and mutation (plans, domain stats, estimate, preview, checkout or quote, receipt, active promotion) with typed request and response from `src/types/promotions`. It also maps raw API rows to view models with `transformResponse`, calling pure mappers in `src/helpers/promotions/`.
3. **Endpoints that already exist elsewhere: never declare them twice.**
   1. *The Cryptomus invoice* is really a promotions call, but it already lives in `payment.ts` (used by the v1 `PromoteModal`). This is the **only** re-export: `promotions.ts` has `export { useSetPaymentInvoiceMutation as useCreatePromotionInvoiceMutation } from './payment'`.
   2. *Other features' data* (your listed domains from My Domains for the choose a domain state, wallets from Profile, the marketplace promoted list in `domain.ts`) is **not** re-exported or re-declared. The promotions hooks use those features' existing hooks (e.g. `useMyDomainsData`), so each call keeps exactly one owner.
4. **Who may import `promotions.ts`, or another feature's data hook.** Only the hooks in `src/hooks/promotions/`. Pages, `PromotionsPageView`, composites, primitives, helpers and `data/` never import it, and never use `fetch`, `axios`, `request`, `callBackend` or a raw URL.
5. **Sample data goes through the same door.** Until an endpoint exists, the hook returns sample data from `src/data/promotions/` through `useMockQuery`, with the same return shape as the real RTK hook. Going live in phase 10 is then a change inside the hooks only, one hook at a time. Composites and the page do not change.
6. **RTK Query yes, Redux state no (decided 3 Nov 2026, user).** `promotions.ts` only adds RTK Query endpoints to the existing `myApi` (caching shared by page, rail and drawer, loading and error flags, tag invalidation after a promotion goes live, `pollingInterval` if the Cryptomus invoice is used). Promotions adds **no Redux slice** and no global store state: the selected plan and token live in the URL query (§4.3), drawer step and other UI state in local `useState`.
7. **Wallet and contract calls** (token balances, network check, sending the payment) are not backend calls, but they follow the same rule: they live in **one hook file, `src/hooks/promotions/usePromotionWallet.ts`**, which uses wagmi and the existing `@/config/wagmi`. Nothing else in Promotions talks to the chain. Do not import `useBuyFlowActions` (it sits in a composite folder, a known layering violation).

**Check (add to every phase, must print nothing):**

```sh
cd src
# no network call or URL outside core/redux/promotions.ts (a quote before /marketplace,
# so import paths like '@/hooks/marketplace/...' don't count; fixed 4 Nov 2026)
grep -rnE "fetch\(|axios|callBackend\(|request<|['\"`]/marketplace|baseUrl" hooks/promotions helpers/promotions data/promotions types/promotions design-system/composites/promotions ../pages/promotions
# only promotions hooks import the promotions API file
grep -rlnE "core/redux/promotions" . | grep -v "^./hooks/promotions/" | grep -v "^./core/redux/promotions.ts"
# chain calls only in usePromotionWallet
grep -rlnE "from '(wagmi|viem|ethers|@reown)" hooks/promotions helpers/promotions design-system/composites/promotions ../pages/promotions | grep -v "usePromotionWallet.ts"
```

---

## 6. Page states and behaviour

1. Loading: skeletons in hero tiles, plan list and rail (`SettingsCardSkeleton` pattern).
2. Signed out: shell redirect like My Domains.
3. No `?domain`: choose a domain state (Q4).
4. Domain not listed / not yours: message with a link to My Domains.
5. Already promoted: banner "Promoted until Nov 13", plan list disabled or "Extend" (Q5).
6. Wallet not connected: token tiles show "Connect wallet" instead of balances; Continue opens the wallet modal (as listing flow does).
7. Wrong network / insufficient balance: Checkout banner and shortfall box; CTA disabled.
8. Selecting a plan or token updates the rail summary, pay bar, preview badge and estimate tiles at once.
9. Continue opens the drawer on Checkout; Change in Checkout returns to the page with the drawer closed and step 1 focused.
10. Sign → pending → live; Reject → error result with Try again (BuyResultStep pattern); close mid flow asks nothing on sample data.
11. "How promotion works ↗", "Add Funds", "View analytics": coming soon toasts until targets exist (Q10).

---

## 7. Real API (phase 10)

Exists: `GET /marketplace/promoted-domains-list`, `POST /marketplace/payment/create/invoices` (`{ domain_id, selectedPlan: '24h' | '7d' }` → `{ invoice: url }`; the body field is snake case, checked on uat 10caf039), analytics `GET /marketplace/domain-listing-data/:listingId` (has `view_count`, check its shape), `isPromoted` on listings, history type `PROMOTION` in `userProfile.ts`.

Missing for Figma: plan catalogue with token prices and reach, on chain payment (contract, calldata or a signed quote), active promotion with end date per listing, unique visitors, watchers count per domain, offers, estimate model, receipt by tx hash. These go in the phase 0 message.

---

## 8. Out of scope / follow ups

Promotion analytics page, promotion history list, refunds (backend has refund events), cancelling a live promotion, auctions.

---

## 9. File map (planned)

```
pages/promotions/index.tsx, promotions.module.scss
src/core/redux/promotions.ts                 (the ONLY file with promotions API calls, §5.6)
src/core/enum/api-endpoint.enum.ts           (add promotions paths)
src/constants/Api.ts                         (add promotions URLs)
src/types/promotions/index.ts
src/data/promotions/{plans,sampleDomain,previewListings,tokenBalances}.ts
src/helpers/promotions/{pricing,schedule,filterPreview}.ts
src/hooks/promotions/{usePromotionDomain,usePromotionPlans,usePayTokenBalances,usePromotionEstimate,usePromotionPreview,usePromotionCheckout,usePromotionWallet}.ts
src/design-system/primitives/progress/segment-meter/
src/design-system/composites/promotions/{hero,plans,payment,right-rail,flow,shared}/ + index.ts
public/assets/img/promotions/ (plan icons, token icons, sign/live icons, light and -dark where they differ)
dev-docs/promotions/promotions-progress.html
```

Additive edits to shared code: `SummaryTile` (icon), `StatCard` (optional sublabel), `PaymentMethodCard` (icon, trailing, chip), `InfoNote` (success tone), `TransactionChecklistItem` (icon), `BuyResultStep` (children), `SidebarPromoCard`, `navigation.ts`, `routes.ts`.

---

## 10. Verification (every phase)

1. Layering greps from `CLAUDE.md` §8 print nothing for `composites/promotions`, and the three "one place" greps in §5.6 print nothing.
2. `npx tsc --noEmit -p .` clean; eslint on changed files, no new warnings; no `!important`, no `<img>`, no `<a>`, no fragments in `.map()`, inline style only for runtime values.
3. Role tokens only; brand fills commented.
4. Screenshots through the dev server on **3002** (never build, start or dev) at 390, 834, 1024, 1440 in light and dark against §2.1.
5. Keyboard: radio groups with arrows, drawer focus trap and Escape, visible focus.
6. Every shared component touched is checked on its other pages (SummaryTile: Portfolio, domain overview, receipt; StatCard: My Domains; PaymentMethodCard and BuyResultStep: buy flow; TransactionChecklist: buy flow, order timeline; sidebar: all pages).
7. Update `dev-docs/promotions/promotions-progress.html`. Don't commit unless asked.

---

## 11. Open questions

| # | Question | Proposal |
|---|---|---|
| Q1 | Payment model: Figma's on chain ETH/USDC/WETH with a contract, or the existing Cryptomus USD invoice (24h $1, 7d $5)? | Build Figma on sample data; product and backend decide; phase 10 follows the answer |
| Q2 | Real plan prices, durations and reach per plan? | Placeholder from Figma until answered |
| Q3 | Which chain? Figma says Ethereum; buy and list flows run on Polygon with USDT | Ask; it changes tokens and the network banner |
| Q4 | Page with no domain chosen: picker drawer, list of listed names, or redirect to My Domains? | A simple list of your LISTED names using the My Domains data hook, each linking to `?domain=`; ask the designer for a frame |
| Q5 | Already promoted domain: extend, upgrade or blocked? | Banner plus disabled plans until designed |
| Q6 | Token chosen on the page vs in Checkout: same state? | One state; Checkout rows edit it |
| Q7 | Dimmed unselected token tiles in dark: meaning? | Treat as drawing slip, follow light |
| Q8 | Summary card heading in light | Follow dark (no heading) |
| Q9 | Sidebar promo card while signed in | Figma shows it; follow Figma |
| Q10 | Targets for "How promotion works", "Add Funds", "View analytics" | Coming soon toasts |
| Q11 | Page body as `composites/promotions/shared/PromotionsPageView` calling hooks (like Portfolio, a rule 6 exception) or page file wiring? | Page file wires hooks, view stays pure (rule 7) |
| Q12 | Branch: off `portfolio` once committed (it already has the shell and SummaryTile changes) or off `main`? | Off `portfolio` after it is committed |
| Q13 | Entry points: a Promote action on My Domains rows/cards and on the domain overview? | Add in phase 9 if confirmed; Figma does not draw them |

---

## 12. Build order and per phase prompts

| Phase | Scope |
|---|---|
| 0 | Backend, product and designer messages (no code) |
| 1 | Foundations: route, nav, types, data, helpers, hook stubs, page skeleton |
| 2 | Hero banner and stat tiles |
| 3 | Step 1: plan cards and segment meter |
| 4 | Step 2: token tiles and pay bar |
| 5 | Right rail: preview, estimate tiles, summary, tip |
| 6 | Mobile and tablet |
| 7 | Checkout drawer |
| 8 | Sign, progress, live and error steps (simulated) |
| 9 | Entry points and page states (no domain, already promoted, wallet states) |
| 10 | Real data and payment per Q1 |
| 11 | Final QA |

### Phase 0: Messages (no code)

Done 3 Nov 2026: `dev-docs/promotions/promotions-phase0-messages.md` (product, backend, designer). Not sent yet.

```
Read dev-docs/promotions/promotions-implementation-plan.md §1.1, §2.9, §7 and §11.
Write three short plain messages: backend (the missing endpoints in §7
with request and response shapes from §5.1), product (Q1, Q2, Q3, Q5,
Q13) and designer (the quirks in §2.9 and Q4, Q7, Q8, Q10). Frame them
as "what to build, in which order", since we start on sample data.
No code changes.
```

### Phase 1: Foundations

```
Start promotions phase 1 from dev-docs/promotions/promotions-implementation-plan.md
(§1, §3.1, §4, §5, §9). Follow CLAUDE.md including §4, §7 and §8.

Build:
1. PROMOTIONS_HREF and promotionHref() in routes.ts; the Promotions
   sidebar item points there without the soon badge; bottom nav maps
   it to Sell.
2. pages/promotions/index.tsx + module.scss: MainLayout and
   MarketplacePageShell with hero, main and rightRail placeholders,
   mobileRailPlacement="after-main", query state per §4.3.
3. Types (§5.1), sample data (§5.4), pure helpers (§5.3) with Node
   checks, hook stubs (§5.2) through useMockQuery with a module level
   loader, and the Sample data chip.
4. The single API file per §5.6: src/core/redux/promotions.ts with
   myApi.injectEndpoints (no endpoints yet, plus the re-export of the
   existing invoice mutation), and an empty usePromotionWallet.ts. Run
   the §5.6 greps.
5. Create dev-docs/promotions/promotions-progress.html.

Verify per §10. Don't commit.
```

### Phase 2: Hero and stat tiles

```
Promotions phase 2 (plan §2.2, §3.2). Build composites/promotions/hero/
PromotionHeroBanner: banner art like PortfolioHeroBanner, letter tile,
name with verified tick, ExtensionBadge, characters, Premium Badge,
Listed for price + USD, and four SummaryTile stat tiles with icons
(add an optional icon prop to SummaryTile only if it has none, additive,
and check Portfolio and the domain overview are unchanged). Null stats
show "—". Mobile tiles 2 × 2. Light 212:20021, dark 212:18354.
Verify per §10. Don't commit.
```

### Phase 3: Choose Your Reach

```
Promotions phase 3 (plan §2.3, §3.3). Build primitives/progress/segment-meter
(total, filled with halves, label, aria as a meter), PromotionStepCard on
GlassCard, PromotionPlanCard and PromotionPlanList as a real radiogroup
with arrow keys, Badge chips, token icon price + USD. Selection writes
?plan. Keep Figma's identical prices and flag §2.9.1 in a comment.
Verify per §10. Don't commit.
```

### Phase 4: Pay With and pay bar

```
Promotions phase 4 (plan §2.4, §3.3). Build PayTokenTile and PayTokenList
(radiogroup, selected = black fill in both themes), "Balances from" with
the short wallet, and PromotionPayBar (shield, You pay, balance after,
Add Funds as a coming soon toast). Numbers come from usePayTokenBalances
and helpers/promotions/pricing. Selection writes ?token.
Verify per §10. Don't commit.
```

### Phase 5: Right rail

```
Promotions phase 5 (plan §2.5, §3.4). Build PromotionPreviewPanel on
FadeScrollList with PromotionPreviewRow (selected row first, Boosted
badge, accent edge), PromotionEstimateTiles on StatCard (make sublabel
optional, check My Domains unchanged), PromotionSummaryCard on
KeyValueRows + PrimaryButton (Continue To Checkout opens nothing yet)
and the lock line, and PromotionTipCard. Summary has no heading (Q8).
Verify per §10. Don't commit.
```

### Phase 6: Mobile and tablet

```
Promotions phase 6 (plan §2.2 to §2.5, CLAUDE.md §5). Match 212:19142 /
212:19582 at 390: hero tiles 2 × 2, plan cards with meter and price under
the text, token tiles stacked, pay bar wraps, summary card after the pay
bar, preview, estimate tiles and tip hidden below mobile. At tablet
(768 to 1039) decide the rail layout like Marketplace's railGroup:
preview + estimate side by side, summary and tip underneath.
Verify at 390, 834, 1024, 1440 in both themes. Don't commit.
```

### Phase 7: Checkout drawer

```
Promotions phase 7 (plan §2.6, §3.5, §6). Build PromotionFlowModal on
Modal with the checkout step: NoticeBanner warning, domain identity
(reuse the buy flow's block), PaymentMethodCard rows (add icon, trailing,
chip additively; check the buy flow unchanged), BalanceShortfallCard,
PromotionOrderSummary (plan header with Change, KeyValueRows, Total
due), schedule on TransactionChecklist from helpers/promotions/schedule,
InfoNote, PurchaseTermsFooter "Confirm & Pay {amount}" + Back. Continue
To Checkout opens it. Use the correct domain and real schedule math,
not the copied Figma values (§2.9.2 to .4). Mobile 212:17440.
Verify per §10. Don't commit.
```

### Phase 8: Sign, progress, live, error

```
Promotions phase 8 (plan §2.7, §3.5). Add the sign step (WalletPendingStep
+ PromotionSignCard), the pending step (TransactionChecklist card, footer
without Confirm, §2.9.6), the live step (BuyResultStep + StatusIcon,
tx chip with copy, Featured card, three SummaryTiles, Promote again
resets to step 1, View analytics toast) and an error step (Reject →
Try again). On sample data usePromotionCheckout simulates each step
with short delays and the toast says it is a preview; never send a
real transaction. Verify per §10. Don't commit.
```

### Phase 9: Entry points and states

```
Promotions phase 9 (plan §4.4, §6, Q4, Q5, Q9, Q13). SidebarPromoCard
CTA goes to /promotions and shows when signed in if Q9 says so; the no
domain state per Q4; not yours / not listed; already promoted per Q5;
wallet not connected and wrong network; loading skeletons. Add Promote
actions on My Domains only if Q13 is confirmed.
Verify per §10, including every page with the sidebar. Don't commit.
```

### Phase 10: Real data

```
Promotions phase 10 (plan §7, Q1 to Q3). Read the backend on origin/uat
(git fetch, never edit). Add every endpoint ONLY to
src/core/redux/promotions.ts (paths in api-endpoint.enum.ts, URLs in
constants/Api.ts, §5.6), then swap the hooks in src/hooks/promotions
from sample to live one area at a time, keep sample with the chip where
no endpoint exists. Wire the payment the way Q1 decided: on chain
through usePromotionWallet, or the Cryptomus invoice re-exported from
promotions.ts (open the returned URL, then poll isPromoted).
Composites and the page must not change in this phase.
Verify per §10 with backend shaped fixtures. Don't commit.
```

### Phase 11: Final QA

```
Promotions phase 11. Full sweep: layering greps, tsc, eslint, a11y
(keyboard through both radiogroups and the whole drawer), every state
in §6, 16 screenshot sweep (4 widths × 2 themes × page and drawer),
shared component regression from §10.6. Update the progress log and
list anything left for the user. Don't commit.
```
