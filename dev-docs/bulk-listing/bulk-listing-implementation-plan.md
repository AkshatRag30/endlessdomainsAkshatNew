# Bulk Listing: Implementation Plan

Figma: file `hq6HmB04UFUlFiJp9f9eGv` (marketplace akshat), section **"Bulk decign section"** `172:16293`.
Branch: build on `dark-mode` (every frame has a dark twin, and the My Domains page and listing flow it extends live there).
Written 27 Oct 2026. Code comments cite this file as "bulk plan §N.N". Phases 1 to 5 built 28 Oct on branch `bulk-list` (§14); phase 4 confirmed with a real wallet by the user. Progress log: `bulk-listing-progress.html`.

---

## 1. Context

Bulk listing lets a seller price and list many of their **unlisted** domains in one go from the real **My Domains** page (`/seller-hub/my-domains`), instead of opening the single listing drawer once per name. It is not a new page: it is a **selection mode** on the existing My Domains table plus a **new drawer flow** next to the existing single listing flow.

| Area | What it does |
|---|---|
| **Entry points** | Hero "Bulk List" button, Quick Actions "Bulk list" row. Both show a toast today ("Bulk list is coming soon.") |
| **Selection banner** | "18 unlisted names in this view. Price them in one go instead of one at a time." with **Select All 18**, **close**, and once something is selected a **List** button |
| **Row selection** | The Action column's button becomes **Select / Selected** on every row (desktop table and mobile cards) |
| **Bulk drawer: form** | "Bulk list · 18 domains": Pricing (3 options), Listing type (Fixed price, Auction coming soon), How long it runs (7 / 30 / 90 days), The names (extension chips, one row per name with est value, editable price, remove), summary (Domains, Combined asking price, Platform fee 2.5%, Total), CTA "Approve, then list 18" |
| **Bulk drawer: approval** | "One time approval / Approve once, list forever": Seaport approval for the domain contract, network fee, "Listing all 18 names: Free" |
| **Bulk drawer: signing** | "Sign once for all 18", progress bar, "Preparing orders…" |
| **Bulk drawer: success** | "18 domains are live", combined asking price, you receive if all sell, all expire date |

### 1.1 The three things that don't exist yet (drive the whole plan)

1. **One signature for all names.** Figma promises "One signature covers all 18". Seaport supports this (a *bulk order*: one EIP712 signature over a merkle tree of orders, each order then carries the signature plus its proof). But our backend's `POST /marketplacev2/orders` takes one order and recovers the signature against **that order's own hash** (`order.service.ts` check 2, BAD_SIGNATURE), so a bulk signature is rejected today, and our order code (`src/lib/seaport-order-builder-v5.ts`) has no bulk tree support. **What works today without the backend:** one signature per name (N wallet prompts), each posted to the existing endpoint. The plan builds that path first, behind one action, and swaps to a true bulk signature when the backend accepts it (§8).
2. **A per domain estimate.** "Percentage of model estimate" and the "est 900" label need an estimate per name. `useMyDomainsData` hardcodes `estimatedValueUsd: 0` ("No appraisal/analytics endpoint feeds this page yet"). The only endpoint is the legacy `POST /marketplace/domain-appraisel/estimate-price` (one name per call, public, returns a simple length plus extension score, not a market estimate). Until the backend adds a real estimate (ideally a field on `/marketplacev2/orders/my-domains`), the percentage option must handle "no estimate" (§7.3).
3. **Row selection.** Nothing in `MyDomainsTable`, `MyDomainRow` or `MyDomainCard` supports selection. It is added additively (§5).

### 1.2 Dark mode from the first line

Every desktop frame and drawer has a light and a dark version (§2.1). Follow `CLAUDE.md` §7: role tokens, `@include dark` only where a role can't express it, check both themes at mobile, tablet and desktop. Mobile is drawn **in dark only**; light mobile follows the light desktop styles.

---

## 2. Screen inventory

### 2.1 Frame map

| Frame | Light | Dark |
|---|---|---|
| Desktop: selection banner, nothing selected | `172:23457` | `172:28099` |
| Desktop: rows selected, banner shows List | `172:16294` | `172:31413` |
| Desktop: bulk drawer open over the page | `172:19604` | `172:34740` |
| Drawer: Bulk list form, full length (540 × 1609) | `172:26814` | `172:27356` |
| Drawer: One time approval | `172:26756` | `172:27898` |
| Drawer: Approving / signing | `172:28066` | `172:38610` |
| Drawer: Listed (success) | `172:28011` | `172:27956` |
| Mobile 390: selection banner and cards | none | `172:38650`, `172:39310`, `172:39979` (the last two are identical) |
| Mobile drawer: Bulk list form | none | `172:40648` ("Dialog - Buy", 390 wide) |

Screenshots taken 27 Oct are in the session scratchpad only; re-export from Figma when building.

### 2.2 Selection mode (desktop `172:23457`, `172:16294`)

1. The page is the existing My Domains layout (hero, tabs, Live Listings, filter bar, table, right rail). Bulk mode only adds the banner and changes the Action column.
2. **Banner** under the filter bar: blue tint (light) / surface with border (dark), text "**18** unlisted names in this view. Price them in one go instead of one at a time." Buttons: **List** (dark chip, appears once at least one row is selected), **Select All 18** (primary), **close** (red text link, exits bulk mode).
3. **Action column**: every row shows **Select** (light: dark filled; dark: outlined). Selected rows show **✓ Selected** (blue fill). Other row actions (List, Delist, Renew) are hidden while in bulk mode.
4. "18" counts the **eligible** names in the current view (tab plus search plus filters), not the whole account.

### 2.3 Bulk drawer: form (`172:26814` light, `172:27356` dark)

Top to bottom inside the existing 540px Modal drawer:

1. **Pricing** (right label "applies to all 18"), three stacked radio cards:
   * **Percentage of model estimate**: "Each name gets its own price, scaled from our estimate." Input "90%" with label "Percentage %". Selected by default.
   * **Same price for every name**: "Simplest option when the names are similar." Input "90" with the USDT icon. Disabled look until chosen.
   * **Set each one myself**: "Start from 90% of estimate and edit the rows below."
2. **Listing type**: two cards side by side, **Fixed price** ("One price, instant purchase, settles on chain.") and **Auction** with Coming Soon ("Timed bidding. In the contract, not yet in the interface."), same as the single flow.
3. **How long it runs**: 7 / 30 / 90 day chips (30 selected), then a red **Expires 15 Oct 2026, 16:50** line and "All 18 expire 20 Nov 2026. They come back to your unlisted set automatically and relisting is free."
4. **The names** (right label "11 extensions"): extension chips with counts (".og 2", ".eth 4"…), then a bordered list, one row per name: avatar, name, extension badge, "est 900", a price input (810), and ✕ to remove.
5. **Summary**: Domains 18, Combined asking price 8,460.00 USDT, Platform fee on sale · 2.5%, Total.
6. **Footer** (pinned): lock note "Written into the order you sign. Nobody can change these afterwards.", CTA **Approve, then list 18**, green note "**No gas to list.** One signature covers all 18, and cancelling is free."

### 2.4 Approval (`172:26756`, `172:27898`)

Icon tile, "Approve once, list forever", paragraph ("Before your first listing, Seaport needs permission to move a domain when a sale settles…"), a card with three ticks ("One approval covers this whole batch and every listing you make after it." / "A transfer only happens on a completed sale at the price you set." / "You are approving Seaport, the settlement contract, not Endless Domains."), a fee row "One time approval, network fee ≈ 0.02 POL", a green row "Listing all 18 names: Free". Footer: **Approve in wallet**, **Back**.

### 2.5 Signing (`172:28066`, `172:38610`)

Wave icon, "Sign once for all 18", "Your wallet is open. This is a signature, not a transaction, so nothing is charged and there is nothing to wait for.", a progress bar and "Preparing orders…". Footer: **Cancel in wallet**.

### 2.6 Success (`172:28011`, `172:27956`)

Green tick, "18 domains are live", a summary card (Combined asking price, You receive if all sell, All expire), "Cancel any of them any time, free and instant. Cancelling stops us serving the listing immediately, though the signature exists until the expiry above." Footer: light **Done / List more**, dark **View receipt / Keep browsing**.

### 2.7 Mobile (`172:38650`, `172:40648`)

Cards instead of rows (the existing `MyDomainCard`), the banner wraps (text, then List and Select All 18 and close on one line), each card's bottom right button is Select / ✓ Selected. The drawer is full width with the same sections; the Fixed price and Auction cards stack, the percentage label moves under its input.

### 2.8 Figma quirks to flag in comments (do not silently fix)

1. **Fee math is wrong**: 2.5% of 8,460.00 is 211.50, Figma shows "− 2,233.95" and a Total of 8,460.42. Build from the real split (§6.3).
2. **Success numbers contradict the form**: combined 810.00 and "you receive 0.42" for 18 names.
3. **Success copy is from the buy flow**: "Ownership transferred in the same transaction as the payment. It will appear in your account within 10 to 15 minutes." is buyer text. Use listing copy.
4. **Two expiry dates**: "Expires 15 Oct 2026, 16:50" (red, earlier than today) and "All 18 expire 20 Nov 2026". Show one date, computed from the chosen days.
5. **Success footer differs per theme**: light Done / List more, dark View receipt / Keep browsing. Listings have no receipt; use Done / List more in both.
6. **Signing step title says "Approving"**; it is the signing step. Title it "Signing".
7. **"Cancel in wallet"** can't be done from the page (the wallet owns the prompt). Follow the single flow: no cancel while the wallet is open, the user rejects in the wallet.
8. **Hidden text** in the approval frame says "USDT is a token contract, so it has to be told…". The approval is for the **domain** contract (setApprovalForAll to Seaport), not USDT. The visible copy is right.
9. **Dark Auction card is empty** in `172:27356` (title and text missing). Follow the light card.
10. **Rows already for sale are selectable** in Figma (green strip rows and "For Sale" mobile cards show Selected). Bulk listing only makes sense for unlisted names (Q3).
11. **"Selected" has two looks** in light (`172:16294`): blue with a tick and dark without. Use blue with a tick.
12. **Duration**: the frame metadata has a "7 / days / 30" chip row with a hidden custom days input, the screenshots show 7 / 30 / 90. Build 7 / 30 / 90 like the single flow.
13. **Tab "sole"** (typo for Sold) and a **"Recently Added" sort** the real page removed on purpose (it sorted nothing). Keep the real page as it is.
14. **Name list avatars** are placeholder letters; the real page uses provider logos (`DomainAvatar`). Keep `DomainAvatar`.
15. **No light mobile frames**, and two mobile frames are identical.

---

## 3. What already exists to reuse

Surveyed 27 Oct 2026. Extend additively, never fork ([[reuse-existing-primitives]]).

### 3.1 Page and data (reuse as is unless noted)

| Piece | Path | Use |
|---|---|---|
| My Domains page | `pages/seller-hub/my-domains/index.tsx` | Owns `listingModal` state; `handleQuickAction('bulk-list')` and the hero's `onBulkList` are the hook points (toast today) |
| Data | `src/hooks/my-domains/useMyDomainsData.ts` | Two calls to `GET /marketplacev2/orders/my-domains` (LISTED, UNLISTED, limit 1000), `mapDomain` → `MyDomainListing`. **Extend**: expose the raw LISTED/UNLISTED flag (`deriveDomainStatus` turns near expiry names into `expiring-soon`, which hides whether they are listed) |
| Filters | `src/hooks/my-domains/useMyDomainsFilters.ts`, `filterMyDomains` | The banner count comes from the filtered array |
| Tabs, filter bar | `MyDomainsCategoryTabs`, `MyDomainsFilterBar` | As is |
| Table | `composites/my-domains/listings/MyDomainsTable` | **Extend**: optional `selection` props, a banner slot. Column grid lives in `MyDomainsTable.module.scss` (≈ lines 132 to 228) and `MyDomainRow.module.scss` (≈ 40 to 65) |
| Row, card | `MyDomainRow`, `MyDomainCard` | **Extend**: `selectable`, `selected`, `onToggleSelect`; the action cell renders Select / Selected in bulk mode |
| Entry points | `MyDomainsHeroBanner` (`onBulkList`), `QuickActionsPanel` (`'bulk-list'`), copy in `src/data/my-domains/actions.ts` | Wire to "enter bulk mode" |
| Listing status refresh | `useSyncListingStatus`, RTK tag `['domain']` | Invalidate after listing |

### 3.2 Listing flow (`composites/my-domains/listing-flow/`)

| Piece | Use |
|---|---|
| `ListingFlowModal` | Pattern to copy: steps, `titleByStep`, gates (login via `useAuth`, wallet via `createAppKit` + `open({view:'Connect'})`, network via `checkNetwork`/`switchNetwork`), non dismissible steps, toasts for rejected / mismatch / error. Per domain state, so bulk gets a **sibling** `BulkListingFlowModal`, not a mode |
| `useListingFlowActions` | Approval is wallet wide (`isApprovedForAll(owner, Seaport)` on the domain contract, `approve()` = `setApprovalForAll`), reusable as is. `signAndSubmit` is per domain; bulk adds `signAndSubmitBulk` |
| `ListingFormStep` | Not reusable whole (single domain). Copy its banner trio (logged out, wallet disconnected, wrong network), the Listing type block and the duration block. Widen nothing: `ListingDurationDays` stays 7 / 30 / 90 |
| `OneTimeApprovalStep` + footer | **Extend**: optional `count` and copy props for "Listing all 18 names: Free" and the batch tick list. Fee stays "A small network fee" (no gas estimate exists; "≈ 0.02 POL" is mock) |
| `ListingSuccessStep` | Layout pattern; bulk gets `BulkListingSuccessStep` using `KeyValueRows` |
| `LoadingStep` | As is |
| `format.ts` | `computeSplit`-based exact fee math (imported by nothing today), `formatToken`, `formatDate`, `formatExpiry`. **Use for bulk totals** (§6.3) |

### 3.3 Order and wallet library

| Piece | Path | Use |
|---|---|---|
| Order builder | `src/lib/seaport-order-builder-v5.ts` | `buildOrderComponents`, `computeSplit`, `seaportDomain`, `EIP712_TYPES`, `toWireParameters`, `computeOrderHash`. **Extend additively** with the bulk tree type and proofs (phase 6) |
| Backend client | `src/lib/marketplace-order-client.ts` | `DEFAULTS` (Polygon 137, feeBps 250), `callBackend`, `ensureWalletVerified` (55 minute window), `isUserRejection`, `isWalletNotVerified`, `isWalletMismatch` |

### 3.4 Primitives

| Need | Primitive | Note |
|---|---|---|
| Drawer | `primitives/modal` | As is; title "Bulk list · 18 domains" |
| Selection banner | `primitives/banners/notice-banner` (tone info, action) or a small composite | The banner has three actions; likely a `BulkSelectBanner` composite built from `PrimaryButton` / `DefaultButton` |
| Pricing cards, Fixed/Auction, day chips | `primitives/toggles/segmented-toggle` (`radio`, `centered`) | Radio cards lay out as equal columns; the stacked pricing cards need a `stacked` option (additive). Pricing cards also hold an input, which SegmentedToggle has no slot for, so a small `PricingOptionCard` composite may be cleaner |
| Same price input, per row price | `primitives/inputs/price-input` | Add a `size="sm"` for the row inputs (additive) |
| Percentage input | `primitives/inputs/text-field` with `trailing="%"` | Caller filters to digits, 1 to 100 (or more, Q7) |
| Extension chips | `primitives/buttons/pill-button` | Counts as children |
| Name row avatar, badges | `DomainAvatar`, `ExtensionBadge` | As is |
| Coming Soon | `primitives/badges/coming-soon-badge` | As is |
| Summary and success rows | `primitives/cards/key-value-rows` | As is (`emphasis` for Total) |
| USDT label | `primitives/token-suffix` | As is |
| Signing step | `primitives/wallet-pending-step` + `primitives/progress/transaction-checklist` | As is; add a progress bar for "n of 18" (additive prop or small element) |
| Tooltip, toasts | `primitives/tooltip`, `primitives/toast-message` | As is |

### 3.5 Not reusable

`src/component/modals/DomainBulkListingModal.tsx` (v1 contract, gas transaction, react-bootstrap, native img, effectively dead), `useSetBulkDomainListingMutation` / `useGetUnlistedDomainsByProviderQuery` (v1), `BULK_LISTING` / `UNLISTED_DOMAINS` endpoint constants, the v1 ABIs. UX reference only.

---

## 4. Routing and navigation

No new route. Bulk mode is page state on `/seller-hub/my-domains`:

1. Entering: hero "Bulk List", Quick Actions "Bulk list", or `?bulk=1` (optional deep link, like the existing `?list=<name>`).
2. Leaving: banner "close", Escape when no drawer is open, switching to a tab with no eligible names keeps bulk mode but shows "0 unlisted names in this view".
3. Selection survives tab and filter changes; the drawer only receives the selected names that are still eligible.

---

## 5. New and extended components

### 5.1 New composites: `src/design-system/composites/my-domains/bulk-listing/`

| Component | What |
|---|---|
| `BulkSelectBanner` | Count text, List (when n > 0), Select All N, close |
| `BulkListingFlowModal` | Step machine: `form` → `approval` → `approval-pending` → `signing` → `success` (plus `partial` and error toasts). Non dismissible while approval-pending and signing |
| `BulkListingFormStep` + `BulkListingFormFooter` | Pricing, Listing type, duration, names, summary, footer CTA |
| `BulkPricingOptions` | The three pricing cards with their inputs |
| `BulkNamesList` | Extension chips, rows with est, price input, remove |
| `BulkListingSigningStep` | WalletPendingStep + progress ("Signing 3 of 18" in the per order path, "Preparing orders…" then "Sign once for all 18" in the bulk path) |
| `BulkListingSuccessStep` + footer | KeyValueRows summary; partial result list when some failed |

Add `BulkListingFlowModal` and `BulkSelectBanner` to `composites/my-domains/index.ts`.

### 5.2 Additive changes

| File | Change |
|---|---|
| `MyDomainsTable` | `selection?: { ids: Set<string>; onToggle(id); isEligible(d) }`, `banner?: ReactNode` |
| `MyDomainRow`, `MyDomainCard` | `selectMode?`, `selected?`, `onToggleSelect?`; ineligible rows show a disabled Select with a tooltip ("Already listed" / "Polygon only" / "Expired") |
| `useMyDomainsData` / `mapDomain` | `isListed: boolean` from the raw row; `estimatedValueUsd` once a source exists |
| `OneTimeApprovalStep` | Optional `count`, `variant='bulk'` copy |
| `PriceInput` | `size?: 'sm'` |
| `SegmentedToggle` | `stacked?` (only if the pricing cards use it) |
| `seaport-order-builder-v5.ts` | Phase 6: `buildBulkOrderTree`, `bulkOrderTypes(height)`, `proofFor(index)`, `encodeBulkSignature` |
| `MyDomainRow.module.scss` | Remove the outstanding `!important` (CLAUDE.md §6) while adding the column |

### 5.3 Assets

Approval icon tile, wave icon and success tick are already used by the single and buy flows. No new images expected; check against Figma during phase 3.

---

## 6. Data model

### 6.1 Types: `src/types/my-domains/bulk.ts`

```ts
export type BulkPricingMode = 'percent' | 'same' | 'each'

export interface BulkListingItem {
  id: string              // tokenId, same as MyDomainListing.id
  domainName: string
  extension: string
  domainProvider: string
  tokenId: string
  estimateUsd: number | null   // null = no estimate for this name
  priceUsd: number | null      // null = not priced yet (blocks submit)
  edited: boolean              // the user typed this row's price
}

export interface BulkListingDraft {
  mode: BulkPricingMode
  percent: number          // default 90
  samePriceUsd: number | null
  durationDays: 7 | 30 | 90
  items: BulkListingItem[]
}

export interface BulkListingResult {
  domainName: string
  ok: boolean
  orderHash?: string
  error?: string
}
```

### 6.2 Pure helpers: `src/helpers/my-domains/bulkListing.ts` (unit checked in node like History's helpers)

1. `isBulkEligible(d)`: unlisted (`isListed === false`), Polygon, not expired, not sold. Expiring soon is allowed (Q3).
2. `priceFor(item, draft)`: percent → `round2(estimate × percent / 100)` (null when no estimate); same → `samePriceUsd`; each → the row's own value, starting from the percent price.
3. Editing a row in percent or same mode switches the draft to `each` and marks the row edited (so a later percent change doesn't overwrite it; matches "Start from 90% of estimate and edit the rows below").
4. `extensionCounts(items)` → chips.
5. `bulkTotals(items, feeBps)` → `{ count, combinedUsd, feeUsd, receiveUsd }` as the **sum of per order `computeSplit` results** in USDT minor units, so the summary equals what is signed.
6. `bulkExpiry(days)` → one date for the "All expire" line (display; the signed end time is from block time, same as the single flow).
7. `validateDraft(draft)` → errors per row (empty, zero, above `MAX_PRICE`, more than 6 decimals) and a global one (no rows).

### 6.3 Fee and totals

Platform fee 2.5% (`DEFAULTS.feeBps = 250`), USDT 6 decimals. Use `computeSplit` per order (integer math, fee rounded down), not the float `computeFeeBreakdown`. Summary rows: Domains n, Combined asking price Σ price, Platform fee on sale · 2.5% −Σ fee, Total (you receive) Σ (price − fee). Label the last row **"You receive if all sell"** in the form too (Figma's "Total" is ambiguous and its numbers are wrong, §2.8.1).

### 6.4 Hooks: `src/hooks/my-domains/` (one per file)

| Hook | What |
|---|---|
| `useBulkSelection(domains)` | `selectMode`, `enter()`, `exit()`, `ids`, `toggle(id)`, `selectAll(eligibleInView)`, `clear()`, `selectedItems` |
| `useBulkListingDraft(items)` | Draft state and the helpers above, `totals`, `errors`, `canSubmit` |
| `useBulkEstimates(names)` | Phase 3 only if the backend adds no field: fetches estimates (batched, cached per name), returns `Map<name, number \| null>` and `isLoading` |
| `useBulkListingActions()` | Wraps `useListingFlowActions`' approval and network parts, adds `signAndSubmitBulk(items, days, onProgress)` (§8) |

---

## 7. Page states and behaviour

1. **Not signed in / no wallet / wrong network**: same banners as the single form, CTA becomes Log in / Connect wallet / Switch to Polygon.
2. **Eligibility**: only unlisted Polygon names that aren't expired are selectable; others show Select disabled with a tooltip. "Select All N" selects every eligible name in the **filtered set**, not only the rows revealed by "Show N more" (Q4).
3. **No estimate**: percent mode prices only names with an estimate; rows without one show "No estimate" and an empty price input that must be filled, and the CTA stays disabled until every row has a price. If **no** selected name has an estimate, the drawer opens on "Same price for every name" and the percent card is disabled with "Estimates aren't available yet."
4. **Removing a row** (✕) deselects that name on the page too. Removing the last row closes the drawer.
5. **Batch cap**: max per batch (Q6, suggested 50). Above it, "Select All" selects the first 50 and the banner says so.
6. **CTA label**: "Approve, then list N" when not approved, "List N" when approved; "Log in" / "Connect wallet" / "Switch to Polygon" when gated.
7. **Approval**: skipped when `isApprovedForAll` is already true (it is wallet wide, so after the first listing it never shows again).
8. **Signing, per order path** (works today): sign and post one order at a time, progress "Signing 3 of 18", each result recorded. Rejecting one prompt stops the batch and asks "Stop here or continue with the rest?" (Q8). Already posted orders stay listed.
9. **Signing, bulk path** (once the backend accepts it): "Preparing orders…" (build tree), one wallet prompt, then post every order with its proof.
10. **Partial result**: success step lists what failed with the reason and a "Try these again" button that reopens the form with only the failed names.
11. **After success**: invalidate `['domain']`, exit bulk mode, clear the selection; "List more" reenters bulk mode.
12. **Closing mid form** with edits asks "Discard this bulk listing?" (reuse the profile ConfirmDrawer pattern) since 18 typed prices are easy to lose.

---

## 8. Backend

### 8.1 What exists (checked 27 Oct 2026 against backend `uat` `ebcc85b9`)

| Need | Endpoint | Notes |
|---|---|---|
| List the seller's names | GET `/marketplacev2/orders/my-domains?status=LISTED\|UNLISTED` | Used today |
| Create one listing | POST `/marketplacev2/orders` `{ parameters, signature, domainName }` | Needs `AccessTokenGuard` + `RequireVerifiedWalletGuard`; recovers the signature against the order hash, so **bulk signatures are rejected** |
| Wallet proof | GET `/marketplacev2/orders/auth/wallet-nonce`, POST `.../prove-wallet` | `ensureWalletVerified` |
| Estimate | POST `/marketplace/domain-appraisel/estimate-price` `{ domain_name }` | Legacy, one per call, heuristic score |
| Sync statuses | POST `/marketplacev2/orders/listing-status/sync` | Used today |

No bulk route exists in marketplacev2.

### 8.2 What to ask the backend (phase 0 message)

1. **Accept Seaport bulk order signatures**, either on POST `/marketplacev2/orders` (detect a signature longer than 65 bytes, derive the tree root from the proof and verify against it, as Seaport itself does) or on a new POST `/marketplacev2/orders/bulk` taking `{ orders: [{ parameters, signature, domainName }] }` and returning a per order result `[{ domainName, ok, orderHash?, code?, message? }]`. The bulk route is better either way: one request, per order results, one wallet check.
2. **A per domain estimate** on the `my-domains` rows (`estimatedValueUsdt` or similar), or a batch POST `/marketplace/domain-appraisel/estimate-price` taking many names. Also: is the current appraisal score meant to be shown as a price?
3. **The raw listed flag** is already in the row (LISTED/UNLISTED); confirm it stays even when the name is near expiry.
4. **Batch limit** the backend is comfortable with per request (we suggest 50).

### 8.3 Live vs fallback

| Part | Today | When the backend lands |
|---|---|---|
| Signing | One signature per name, existing POST | One signature, bulk route |
| Percent pricing | Hidden or limited to names with an estimate (§7.3) | Every name |
| Everything else | Real | Real |

---

## 9. Out of scope / follow ups

1. Auction listing type (Coming Soon, same as the single flow).
2. Bulk delist, bulk reprice of names already for sale (Q3).
3. Custom duration days (Figma's hidden input, §2.8.12).
4. A real approval gas estimate ("≈ 0.02 POL").

---

## 10. File map (planned)

```
src/types/my-domains/bulk.ts
src/helpers/my-domains/bulkListing.ts
src/hooks/my-domains/useBulkSelection.ts
src/hooks/my-domains/useBulkListingDraft.ts
src/hooks/my-domains/useBulkEstimates.ts          (only if needed, §6.4)
src/hooks/my-domains/useBulkListingActions.ts
src/design-system/composites/my-domains/bulk-listing/
  BulkSelectBanner/
  BulkListingFlowModal/
  BulkListingFormStep/
  BulkPricingOptions/
  BulkNamesList/
  BulkListingSigningStep/
  BulkListingSuccessStep/
src/lib/seaport-order-builder-v5.ts                (additive, phase 6)
Extended: MyDomainsTable, MyDomainRow, MyDomainCard, useMyDomainsData, OneTimeApprovalStep,
PriceInput, pages/seller-hub/my-domains/index.tsx, composites/my-domains/index.ts
```

---

## 11. Verification (every phase)

1. `tsc --noEmit` and `eslint` clean.
2. Node checks for the pure helpers (pricing modes, editing switches to each, totals equal the sum of `computeSplit`, eligibility, validation).
3. Screenshots on the user's dev server (port 3002, never start a server) with the dummy JWT recipe, both themes, 390 / 834 / 1440.
4. Light mode of the existing My Domains page unchanged when not in bulk mode.
5. Phases 5 and 6: a real wallet on staging (approval, N signatures, then the bulk signature).

---

## 12. Open questions (answers change the build)

| # | Question | Default if no answer |
|---|---|---|
| Q1 | Will the backend accept Seaport bulk signatures (§8.2.1), and on which route? | Ship the per order path (N prompts), copy says "One signature per name" until then |
| Q2 | Where do per domain estimates come from? | Percent mode limited to names with an estimate (§7.3) |
| Q3 | Only unlisted names, or also reprice names already for sale (Figma selects them)? | Unlisted only |
| Q4 | "Select All N": the whole filtered set or only the rows shown? | Whole filtered set, capped by Q6 |
| Q5 | Is expiring soon allowed (listing may outlive the registration)? | Allowed, with the listing expiry capped before the domain expiry |
| Q6 | Batch size limit? | 50 |
| Q7 | Percentage range (below 100% only, or above too)? | 1% to 500% |
| Q8 | In the per order path, does rejecting one prompt stop the batch? | Ask "Stop or continue" |
| Q9 | Designer: the §2.8 quirks, light mobile frames, success footer | Follow §2.8 defaults |

---

## 13. Build order and per phase prompts

Optimised so nothing waits on the backend until phase 6: phases 1 to 5 ship a working bulk listing with one signature per name, phase 6 swaps in the single signature when the backend is ready. Each phase is reviewable on its own and leaves My Domains working.

| Phase | Scope | Needs backend |
|---|---|---|
| 0 | Backend and designer message (no code) | — |
| 1 | Types, pure helpers, selection and draft hooks, node checks | No |
| 2 | Bulk mode on My Domains: entry points, banner, Select / Selected on rows and cards, eligibility | No |
| 3 | Bulk drawer form: pricing, listing type, duration, names, summary, gates, footer | Estimates optional |
| 4 | Approval, per order signing with progress, success, partial results, refresh | No |
| 5 | Mobile, tablet, dark, accessibility, discard confirm, final QA | No |
| 6 | One signature for all (bulk order tree) and the bulk route | Yes (Q1) |

### Phase 0: Backend and designer message (no code)

```
Read dev-docs/bulk-listing/bulk-listing-implementation-plan.md §1.1, §2.8,
§8 and §12. Write one short plain message for the backend (the asks in §8.2
with request and response shapes from §6.1, plus Q1, Q2, Q6) and one for the
designer (the quirks in §2.8, missing light mobile frames, Q3, Q9). Frame it
as "what to build, in which order"; we start without them. No code changes.
```

### Phase 1: Foundations

```
Read the bulk plan §3, §6 and §7, and CLAUDE.md. Create
src/types/my-domains/bulk.ts and src/helpers/my-domains/bulkListing.ts
(isBulkEligible, priceFor, extensionCounts, bulkTotals using computeSplit
from src/lib/seaport-order-builder-v5.ts, bulkExpiry, validateDraft).
Add isListed to MyDomainListing in useMyDomainsData's mapDomain (additive).
Create useBulkSelection and useBulkListingDraft in src/hooks/my-domains.
Check the helpers with a node script in the scratchpad (pricing modes, a
row edit switching to "each", totals equal the per order splits, validation).
No UI yet. tsc and eslint clean. Update the plan's status.
```

### Phase 2: Bulk mode on My Domains

```
Read the bulk plan §2.2, §2.7, §5 and §7.2, Figma 172:23457 / 172:16294
(light) and 172:28099 / 172:31413 (dark), mobile 172:38650 / 172:39310.
Build BulkSelectBanner; extend MyDomainsTable, MyDomainRow and MyDomainCard
additively with select mode (Select / ✓ Selected, disabled with a tooltip
for ineligible names); wire the hero Bulk List button and the Quick Actions
"bulk-list" row to enter bulk mode (replace the "coming soon" toast). Remove
the outstanding !important in MyDomainRow.module.scss while adding the
column. List opens nothing yet (log the selection). Screenshot both themes
at 390, 834, 1440 on the dev server, and confirm the page is unchanged
outside bulk mode.
```

### Phase 3: Bulk drawer form

```
Read the bulk plan §2.3, §2.8, §3.2, §3.4, §6 and §7, Figma 172:26814 /
172:27356 and mobile 172:40648. Build BulkListingFlowModal (form step only),
BulkListingFormStep and footer, BulkPricingOptions, BulkNamesList, reusing
Modal, SegmentedToggle, PriceInput (add size sm), TextField, PillButton,
DomainAvatar, ExtensionBadge, ComingSoonBadge, KeyValueRows and the single
form's gate banners. Totals from bulkTotals; follow §2.8 for the quirks
(real fee math, one expiry date, 7 / 30 / 90). Handle "no estimate" per §7.3
(add useBulkEstimates only if the backend gave no field by then). Wire List
in the banner to open it. Screenshot both themes, three widths.
```

### Phase 4: Approval, signing, success

```
Read the bulk plan §2.4 to §2.6, §7.6 to §7.11 and §8.3. Add
useBulkListingActions: approval and network from useListingFlowActions,
signAndSubmitBulk signing and posting one order per name to the existing
POST /marketplacev2/orders (ensureWalletVerified once up front, retry once
on WALLET_NOT_VERIFIED, record a BulkListingResult per name). Add the
approval (extend OneTimeApprovalStep with count), signing (WalletPendingStep
with "Signing n of N" progress) and success / partial steps. After success
invalidate ['domain'] and exit bulk mode. Copy says one signature per name
until phase 6. Test with a real wallet on staging with 2 to 3 names.
```

### Phase 5: Final QA

```
Read the bulk plan §7 and §11. Discard confirm when closing an edited
draft, keyboard and screen reader pass (selection, radio cards, inputs,
drawer focus), tablet layout (MyDomainsTable forces grid 1040 to 1279),
batch cap from Q6, both themes at 390 / 834 / 1440, the page unchanged
outside bulk mode. Update the plan and a progress log.
```

### Phase 6: One signature for all (needs the backend, Q1)

```
Read the bulk plan §1.1.1, §8.2.1 and the Seaport 1.6 bulk order format
(BulkOrder EIP712 type: OrderComponents[2]...[2] tree of height
ceil(log2 N), padded with empty orders, signature = 64 or 65 byte signature
+ 3 byte index + height × 32 byte proof). Add buildBulkOrderTree,
bulkOrderTypes, proof and encodeBulkSignature to
seaport-order-builder-v5.ts (additive), verify each derived signature
locally before posting, switch signAndSubmitBulk to one prompt and the
backend's bulk route, and restore the "One signature covers all N" copy.
Keep the per order path as a fallback behind one config flag.
```

---

## 14. Status

27 Oct 2026: plan written, nothing built. Next: phase 0 messages, then phase 1.

28 Oct 2026: branch `bulk-list` cut from `dark-mode`. **Phase 1 done** (uncommitted): `src/types/my-domains/bulk.ts`, `src/helpers/my-domains/bulkListing.ts`, `useBulkSelection`, `useBulkListingDraft`, `isListed` on `MyDomainListing` (set in `mapDomain`). tsc and eslint clean; 10 Node checks pass (scratchpad `bulk-check/`: transpiles the helper with the repo's TypeScript, stubs MAX_PRICE). Changes from §6 while building:
1. Prices are **text** (`price: string`), parsed straight into minor units like the single flow, never round tripped through a number. No `priceUsd` / `edited` on the item.
2. The draft holds only the rule (`mode`, `percent`, `samePrice`, `durationDays`) plus a `prices` map for hand typed rows; rows are derived from the selection, so removing a row is just deselecting it. Editing a row in percent or same mode freezes every row's current price and switches to `each`; choosing a pricing card again drops typed prices.
3. Defaults taken for open questions: Q3 unlisted only, Q5 expiring soon allowed with the order cut to end a day before the domain expires (`bulkDurationSeconds`), Q6 cap 50 (`BULK_MAX_ITEMS`, enforced in `toggle` and `selectAll`), Q7 percent 1 to 500. A name with under a day left counts as expired.
4. `estimatedValueUsd` of 0 counts as no estimate (`bulkEstimate`), so today the drawer always opens on "same price".
Next: phase 2 (bulk mode on My Domains).

28 Oct 2026: **Phase 2 done** (uncommitted). New `composites/my-domains/bulk-listing/BulkSelectBanner` (in the barrel) and `BulkSelectButton` (Select / ✓ Selected / disabled with a reason tooltip). `MyDomainRow` and `MyDomainCard` take an optional `bulk` prop, `MyDomainsTable` an optional `bulk: { ids, onToggle }`; eligibility comes from `bulkIneligibleReason`. `PrimaryButton` gained optional `ariaPressed` / `ariaLabel`. The page renders the banner between the filter bar and the table (not inside the table: it has role="table", where a region would be invalid ARIA); hero Bulk List and Quick Actions "Bulk list" enter bulk mode; Escape (no drawer open) and close leave it and clear the selection; List logs the selection until phase 3. Choices: the List chip says "List N" (Figma says "List"); the banner says when the batch is full or the view has no eligible names. The `MyDomainRow.module.scss` `!important` listed in CLAUDE.md §6 was already gone. Checked: tsc clean, eslint clean apart from two existing `onEditPrice` unused warnings, headless Chrome with mocked my-domains rows at 1440 / 834 / 390 in both themes (5 eligible, 4 disabled: 2 listed, 1 Base, 1 expired; Select All, Escape, close; page unchanged outside bulk mode). Already there before this phase: in dark at 1440 the narrow EST. value column's "Steady" runs under the Action button.
Next: phase 3 (bulk drawer form).

28 Oct 2026: **Phase 3 done** (uncommitted). New `BulkListingFlowModal` (form step only, in the barrel), `BulkListingFormStep` + `BulkListingFormFooter`, `BulkPricingOptions`, `BulkNamesList`. `PriceInput` gained optional `size="sm"` (34px, centred bold, no token chip), `ariaLabel` and `invalid`. The page keys the drawer per opening so the draft starts fresh; removing the last row closes it; Escape on the page is ignored while it's open. Choices: pricing cards are their own composite (native radios in labels), not SegmentedToggle, because two cards hold inputs and an input can't sit inside a button; typing in a card's field picks that card, focus alone doesn't (tabbing past would drop typed row prices). Extension chips are plain text counts, not PillButtons (they don't filter). The percent field is a small native input (TextField is the 45px labelled profile field). Same price field is 112px like the rows (Figma's 76px is too narrow for real prices). Row errors only show once a row has text; the footer counts names still missing a valid price. Gas note says "One signature per name" until phase 6. Gates (log in, connect wallet, wrong network) and "Approve, then list N" / "List N" reuse `useListingFlowActions(domains[0])`, whose approval and network parts are wallet wide; phase 4 swaps in `useBulkListingActions`. List N logs the batch for now. No estimates exist, so `useBulkEstimates` was not built. Checked: tsc and eslint clean; headless Chrome with mocked rows, both themes at 1440 / 834 / 390: opens on same price, same price fills every row, editing a row switches to "Set each one myself" and keeps the others, a 7th decimal is refused, totals 3 × 120 + 99.5 + 1.123456 = 460.62, fee 11.52, receive 449.11; "One name ends sooner" shows for the name expiring in 30 days. Not checked: a connected wallet (approval label, wrong network banner).
Next: phase 4 (approval, signing, success).

28 Oct 2026: **Phase 4 built** (uncommitted, not yet tried with a real wallet). The single flow's sign and post code moved into `listing-flow/listingOrder.ts` (`signAndPostListingOrder`, `classifyListingError`); `useListingFlowActions.signAndSubmit` now calls it, same behaviour. New `src/helpers/my-domains/bulkSigning.ts` (`runBulkSigning`, pure: wallet proof, counter and block time once per batch, then one signed order per name; a rejected prompt asks Stop or Continue, except on the last name; a backend error is recorded and the batch carries on; a wrong wallet stops the rest; a name with under a day left is skipped as "Expires too soon to list"). New `useBulkListingActions` (approval and network from `useListingFlowActions(domains[0])`, signing through `runBulkSigning`, invalidates `['domain']` when anything listed). `OneTimeApprovalStep` takes an optional `count` for the Figma 172:26756 copy. New `BulkListingSigningStep` ("Signing n of N", progress bar, wallet check first), `BulkRejectPrompt` / `BulkRejectFooter`, `BulkListingSuccessStep` / footer (full, partial and nothing listed; Try these again / Done, or Done / List more). `useBulkSelection.replace`. The page keeps the drawer mounted after a batch empties the selection, Done leaves bulk mode, List more stays in it, Try again reopens on the failed names. If the batch stops before the first name (wallet check rejected), the drawer goes back to the form with a toast. Checked: tsc and eslint clean; 8 Node checks of the signing loop plus the 10 phase 1 checks; every step screenshot in both themes at 1440 and 390 through a temporary page (deleted); the form still opens from the page. **Still to do:** a real wallet on staging with 2 to 3 names (approval, signatures, one rejected, the success step and the table refresh).
28 Oct 2026: the user tested phase 4 with a real wallet on staging and reported it working.
Next: phase 5 (mobile, tablet, dark, accessibility, discard confirm, final QA).

28 Oct 2026: **Phase 5 done** (uncommitted). Discard confirm through the profile `ConfirmDrawer` when closing an edited form. Shared `Modal` gained focus handling for every drawer: focus moves in on open, Tab is trapped, focus returns to the opener on close (next tick, skipping an opener inside another closing drawer), and only the top drawer answers Escape. Removing a row moves focus to the next row's remove button; the signing progress line is a status region; the selection banner's buttons wrap under the text when the main column is narrow. Checked with 55 mock names, both themes, 1440 / 1100 / 834 / 390 (cap at 50, focus in and back, Tab wrap, remove focus, Escape clean vs edited, Escape on the prompt, Discard); the single listing drawer rechecked. Progress log: `dev-docs/bulk-listing/bulk-listing-progress.html`.
Next: phase 0 messages if still wanted, then phase 6 once the backend accepts bulk signatures (Q1).
