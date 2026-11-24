# History Page: Implementation Plan

Figma: file `hq6HmB04UFUlFiJp9f9eGv` (marketplace akshat), section **"History"** `140:16047`.
Branch: build on `dark-mode` (the page must be dark ready from day one, and the profile work it reuses lives there).
Written 16 Oct 2026, revised 19 Oct 2026 (live vs demo split, §1.1 and §8). Code comments cite this file as "history plan §N.N".

---

## 1. Context

One page, **History**, is the signed in user's activity log: "Every purchase, bid, offer, transfer and sign in tied to your on chain identity, in one place." It sits in the sidebar's Seller Hub section between Payouts and Promotions (that is where Figma draws the active **History** row).

The page has:

| Area | What it does |
|---|---|
| **Header card** | Title "History" and the subtitle above |
| **Tabs** | All Activities, Transactions, Bids, Listings, Offers, Transfers, Account |
| **Toolbar** | Search (with clear and search button), Newest First sort, Export |
| **Status legend** | "Status: Pending (orange), Completed (green)"; the colour is the strip on each row's left edge |
| **Activity table** (desktop) | Item, Details, Type, Amount, Date and Time, a chevron per row, "Show 14 more" |
| **Activity cards** (mobile) | One card per activity with a Pending/Completed chip on top |
| **Right rail** | Summary (period select, total, 6 stat tiles), Filters (4 selects, Clear All, Apply Filters), Need help? |
| **Mobile filter sheet** | The same 4 filters, opened from a Filter button |

### 1.1 Scope: live where the backend returns it for the signed in user, demo everywhere else

Same approach as the profile page (profile plan §1.1). Rule: a section is **live** only when an existing endpoint returns that exact information for the signed in user; otherwise it is **demo** data with the **Sample data** chip (`primitives/badges/sample-data-chip`). Full mapping in §8.3.

| Live (real API) | Demo (sample data) |
|---|---|
| Transactions tab: purchases (`transactions/mine`) | Bids tab (no bid system in the backend) |
| Transactions tab: sales (`listing-history` SOLD events, price from the receipt) | Offers tab (no offer system) |
| Listings tab (`listing-history`, every event type) | Transfers tab (no transfer log) |
| Renewals (ETH + BNB/ARB renewal history, merged) | Account tab (no sign in / account event log) |
| All Activities tab, as the merge of the live sources above | Whole Summary card: period total, spent/earned line, pending count, six tiles |
| Search, sort, Date range and Asset type filters, applied client side | The `#ED-YYYY-MMDD-NNNNN` reference format (demo rows only) |
| Export of the loaded live rows | Pending status and the orange strip (live v2 rows are always Completed) |

1. The page reads everything through **one hook**, `useHistoryActivities(filters)`, that returns one page of `HistoryActivity` rows. Each row carries `isMock`; a tab whose rows are all demo shows the chip once at the top of the list, a mixed tab (All Activities) shows it on each demo row.
2. **Build order**: every section is built against demo data first (phases 1 to 5), then Transactions, Listings and Renewals switch to live one at a time in phase 6. Components never change when a source goes live.
3. **Summary stays demo on purpose**: counting only the loaded pages would show wrong totals, so labelled demo numbers are better than misleading real ones until `GET /history/summary` exists (§8.2).
4. **Verified wallet gate**: every v2 source requires a wallet verified in the last hour (Q2). Until the backend relaxes that for read only endpoints, live tabs show a "Verify your wallet to see your history" state (§7.12) instead of failing.
5. Phase 0 asks the backend for one merged activity endpoint and a summary endpoint (§8.2). When they land, the demo sections switch the same way.

### 1.2 Dark mode from the first line

Every frame has a dark twin (§2.1). Follow `CLAUDE.md` §7: role tokens for surfaces, text and borders, `@include dark` only where a role can't express it, both themes checked at mobile, tablet and desktop. Where the dark frame changes more than colours, follow the dark frame (see §2.6).

---

## 2. Screen inventory

### 2.1 Frame map

| Frame | Light | Dark |
|---|---|---|
| Desktop (1512) | `140:16049` | `140:18073` |
| Mobile (392) | `140:17439` | `140:19456` |
| Mobile filter sheet (296 × 435) | `140:17398` | `140:18032` |

Big frames return metadata only from `get_design_context`; query the children. Useful light desktop children: header + tabs `140:16068`, toolbar + table `140:16230` (rows are `140:16281`, `140:16393`, `140:16505`, `140:16617`, `140:16729`, `140:16841`, `140:16953`, `140:17065`; "Show 14 more" `140:17177`), right rail `140:16087`. Mobile list section `140:17495`, mobile bottom nav `140:18002`.

### 2.2 Header card and tabs (`140:16068`)

1. Header card: title 18px Satoshi Medium, subtitle 14px Regular at 62% black, same card as Profile's `ProfileSettingsHeader`.
2. Tabs: 36px tall pills, 10px gap, active pill blue `#2639ED` with white bold text, inactive text 36% black, Satoshi Medium 14px. On mobile the row scrolls horizontally (Figma shows All Activities, Transactions, Bids, Listings, cut off).

### 2.3 Toolbar, legend and table (`140:16230`)

1. Search box 243 × 48 with a clear X and a dark square search button.
2. Right side: **Newest First** dark dropdown and **Export** dark button with a download icon.
3. Legend: "Status" then a Pending chip (orange) and a Completed chip (green).
4. Column header row: Item, Details, Type, Amount, Date and Time, separated by vertical rules.
5. Row (59px tall, 1px border, radius 3px):
   1. Left accent strip 5 × 48, orange for pending, green for completed.
   2. **Item**: domain avatar (31px), name 15px Satoshi Bold, extension badge (`.ud`, yellow outline), meta line in JetBrains Mono 11px `#A6A1BB`: chain icon, "bnb · 7 chars ·", crown icon, verified icon. This is the same identity block Watchlist already renders.
   3. **Details**: action label 12px Bold ("Domain purchased"), reference ID 12px Medium at 53% black with a copy icon ("#ED-2026-1013-00148").
   4. **Type**: a pill 78px min width, 24px tall, gradient fill with white text. Seven types: Purchase (green `#12A05C`), Listing (black), Renewal (blue), Offer (purple), Transfer (green), Accounts (grey), Bids (navy).
   5. **Amount**: token icon + "120.00" 13.6px Medium, "$120" 10px under it.
   6. **Date and Time**: calendar icon, "Oct 13, 2026 | 4:00 PM", chevron right.
6. Footer: "Show 14 more" small white button, centred.

### 2.4 Right rail (`140:16087`)

1. **Summary** card: "Summary" + a "This month" select (103 × 30); "$40,162" 22px Bold; "Spent · $0 earned from sales · **9 pending**" (9 pending is a blue bold button); a 2 column grid of stat tiles (131 wide, gradient grey fill, 3px white border, 28px coloured icon square): Purchases 11, Domains sold 0, Auctions won 0, Offers accepted 0, Transfers 2, Withdrawals 2.
2. **Filters** card: "Filters" + "Clear All" (blue); four labelled selects (45px tall): Date range "All time", Activity type "All types", Status "All statuses", Asset type "All assets"; **Apply Filters** gradient button.
3. **Need help?** card: a "?" circle, "Every record here is backed by an on chain transaction. Visit our Help Center to learn how to read them." and "Go to Help Center →".

### 2.5 Mobile (`140:17439`)

1. No right rail: no Summary, no Filters card, no Need help.
2. Toolbar becomes: full width search, then a row of three dark buttons: **Filter**, **Newest First**, **Export**. Filter opens the sheet (`140:17398`).
3. Each activity is a card: Pending/Completed chip on top, identity block, a 2 cell row (Details: "Domain Purchased" + reference with copy | Amount), then a row with Type pill and the date with a chevron.
4. The status legend is not shown (each card has its own chip), same reasoning as My Domains (`CLAUDE.md` §5).

### 2.6 Dark specifics (follow the dark frame)

1. Desktop dark: the active tab is a **white chip with black text** (same as Profile's tabs in dark). Mobile dark keeps the **blue** pill. Build it as drawn: white chip from `tablet-up`, blue on mobile.
2. Type pills, status chips and the accent strip keep their brand colours in dark (comment them as brand fills, §7.1 of `CLAUDE.md`).
3. Stat tiles become `--color-bg-surface-active` style tiles with tinted icon squares; Apply Filters becomes the dark see through primary (`--color-button-primary-*` dark tokens).

### 2.7 Figma quirks to flag in comments (do not silently fix)

1. **Light Summary hides the Withdrawals tile** (the grid puts it in row 4 behind Transfers); the dark frame shows all six in a 2 × 3 grid. Build six.
2. **Every row's Details says "Domain purchased"** whatever its type. The label must come from the activity type (Listing → "Domain listed", Renewal → "Domain renewed", and so on, §6.1).
3. Tab says "Account", pill says "Accounts"; tab says "Bids", pill says "Bids" though one activity is a single bid. Proposal: singular pill labels (Account, Bid) unless the designer says otherwise.
4. The Activity type select duplicates the tabs. Proposal: one shared state; choosing a tab sets Activity type and the other way round (Q4).
5. "Clear all" in the light rail node text, "Clear All" in the render. Use "Clear All".
6. The mobile filter frame has no sheet chrome (no handle, no close, no backdrop). Proposal: reuse the existing `Modal` drawer (Q5).
7. The meta line says "bnb" on desktop and "pol" on mobile, the mobile name has spaces ("Christopher X. Vanderbilt."). Sample data only, not a rule.

---

## 3. What already exists to reuse

Checked 16 Oct. Per the standing rule, extend additively before building anything new.

| Need | Reuse | Note |
|---|---|---|
| Page shell | `MainLayout` + `MarketplacePageShell` with `mobileRailPlacement="after-main-tablet"` | Same as Profile: hero ends in tabs, so the rail must not sit between tabs and list |
| Header card | `composites/profile/shared/ProfileSettingsHeader` (`title`, `subtitle` props) | Already prop driven |
| Tabs | `composites/profile/shared/ProfileTabs` if its icon is optional, otherwise `ListingCategoryTabs` (`variant`, `ariaLabel`, `idPrefix`) | ProfileTabs already does the blue pill / white dark chip; check and pick in phase 1 |
| Search | `primitives/inputs/search-input` `SearchInput` | Has the clear X and search button |
| Sort, period and the 4 filter selects | `primitives/inputs/filter-dropdown` `FilterDropdown` (`variant="pill"` for Newest First / This month, `variant="field"` for the Filters card) | `field` was added for Profile |
| Export, Filter, Show more | `primitives/buttons/default-buttons` `DefaultButton` (`variant="dark"`, `size`, `icon`) | |
| Apply Filters | `primitives/buttons/primary-button` `PrimaryButton` | Default gradient, dark tint in dark |
| Pending / Completed chips | `primitives/badges/badge` `Badge` (`warning`, `success`) | `StatusChip` has no orange |
| Domain identity | `composites/marketplace/watchlist/WatchlistDomainIdentity` (`layout="row" \| "card"`) | Built from `DomainAvatar`, `ExtensionBadge`, `ChainBadge` |
| Amount | `TokenChainIcon` / `TokenSuffix`, or `WatchlistPriceCell` | |
| Stat tiles | `primitives/cards/summary-tile` or `stat-card`; grid like `PortfolioStatsRow` (2 columns, 4 at tablet) | Pick the one closest to the Figma tile in phase 4 |
| Need help? | `primitives/cards/info-list-card` `InfoListCard` with one row, or `GlassCard` | |
| Rail card frame | `composites/profile/shared/SettingsCard` / `GlassCard` | |
| Mobile filter sheet | `primitives/modal` `Modal` (slide in drawer with footer) | `ConfirmDrawer` shows the bottom style |
| "Show N more" pattern | `MyDomainsTable`, `LiveListingsTable` | Copy the pageSize pattern |
| Table vs card on mobile | `useIsMobile()` like `MyDomainsTable` (`CLAUDE.md` §5) | |
| Receipt link from a row | `orderReceiptHref(orderId)` in `src/helpers/marketplace/routes.ts`, `useTransactionReceipt` | For rows that are marketplace orders |
| Explorer link | `txExplorerHref(chainId, txHash)` in the same file | |
| Errors | `getUserFriendlyToastMessage` from `src/helpers/error-messages` | |
| Sample data chip | `primitives/badges/sample-data-chip` | |
| Auth | global `ProtectedRoute` (`src/component/ProtectedRoute.tsx`) | `/history` is protected automatically |

**Genuinely new** (no equivalent today): the activity row, the activity card, the type pill colours, the Filters card wrapper, the Summary card wrapper, and a small CSV helper (the repo has none).

**Old code to leave alone**: `GetUserHistory` in `src/core/redux/userProfile.ts:107` (typed `any`, writes into `historySlice`, used only by `src/_archive/transaction-history`). Phase 1 adds a properly typed endpoint next to it instead of reusing the archive's slice.

---

## 4. Routing and navigation

1. Route **`/history`**: `pages/history/index.tsx` + `history.module.scss`.
2. `HISTORY_HREF` and `historyHref(tab?)` in `src/helpers/marketplace/routes.ts`. Tab state in `?tab=` (`all`, `transactions`, `bids`, `listings`, `offers`, `transfers`, `account`), `router.replace` shallow, validated like Profile.
3. Sidebar: add `{ id: 'history', label: 'History', href: '/history', icon: <clock icon>, requiresAuth: true }` to the Seller Hub section of `src/data/marketplace/navigation.ts`, after the commented out Payouts and before Promotions. The drawer picks it up automatically. Active state already works (`SidebarSection`: exact `pathname === item.href`).
4. Mobile bottom nav: map `/history` to `account` in `BOTTOM_NAV_ROUTE_TO_ID` (`src/design-system/layouts/main-layout/index.tsx`) so a tab is selected (Q6).
5. Note: `CLAUDE.md` §2 still lists the sidebar under `composites/marketplace/sidebar`; it now lives in `src/design-system/layouts/sidebar/`. Fix that line in the same change.

---

## 5. New components

### 5.1 Primitives

Only one, and only if `Badge` can't take it additively: **type pill** colours. Preferred: add the seven type tones to `Badge` as a new `tone` prop or extra variants (`purchase`, `listing`, `renewal`, `offer`, `transfer`, `account`, `bid`), keeping existing callers untouched.

### 5.2 Composites: `src/design-system/composites/history/`

Exported through a curated `index.ts` barrel like `my-domains`.

| Folder | Component | Figma |
|---|---|---|
| `listings/HistoryToolbar` | Search, sort, Export; on mobile also the Filter button | `140:16233` |
| `listings/HistoryStatusLegend` | "Status: Pending Completed", hidden on mobile | `140:16259` |
| `listings/HistoryActivityRow` | One desktop row | `140:16281` |
| `listings/HistoryActivityCard` | One mobile card | inside `140:17495` |
| `listings/HistoryActivityTable` | Header row, rows or cards (`useIsMobile`), empty, loading and error states, Show N more | `140:16230` |
| `right-rail/HistorySummaryCard` | Period select, total, sub line, six tiles | `140:16088` |
| `right-rail/HistoryFiltersCard` | Four field selects, Clear All, Apply | `140:16175` |
| `right-rail/HistoryHelpCard` | Need help? | `140:16220` |
| `shared/HistoryFilterSheet` | Mobile/tablet sheet wrapping the same filter fields | `140:17398` |

`HistoryFiltersCard` and `HistoryFilterSheet` share one `HistoryFilterFields` component so the four selects are defined once.

### 5.3 Assets

Download from the Figma nodes (never temporary URLs): calendar icon, copy icon, chevron, the six summary tile icons, the "?" help icon if not a glyph. Single colour icons as `currentColor` components or `react-icons` equivalents already used in the repo (`FiCalendar` is used by `MyDomainRow`). Accent strip and pill gradients are CSS, not images.

---

## 6. Data model

Folders follow My Domains and Watchlist exactly: types in `src/types/history/`, sample data in `src/data/history/`, mappers in `src/helpers/history/`, one hook per file in `src/hooks/history/`, RTK Query endpoints in `src/core/redux/`.

### 6.1 View model: `src/types/history/index.ts`

```ts
export type HistoryTab = 'all' | 'transactions' | 'bids' | 'listings' | 'offers' | 'transfers' | 'account'
export type HistoryActivityType = 'purchase' | 'sale' | 'listing' | 'delisting' | 'renewal' | 'offer' | 'bid' | 'transfer' | 'withdrawal' | 'account'
export type HistoryStatus = 'pending' | 'completed' | 'failed'
export type HistoryAssetType = 'all' | 'domain' | 'token'   // confirm with design (Q7)
export type HistoryDateRange = 'all' | '7d' | '30d' | 'this-month' | '90d' | 'this-year'
export type HistorySort = 'newest' | 'oldest' | 'amount-high' | 'amount-low'

export interface HistoryActivity {
  id: string
  type: HistoryActivityType
  status: HistoryStatus
  occurredAt: string            // ISO
  reference: string             // demo rows: "#ED-2026-1013-00148"; live rows: shortened orderHash or txHash (no ED reference exists in the backend), copyable
  domain?: DomainNameFacts & { isPremium: boolean; isVerified: boolean }   // built 19 Oct: reuses the marketplace facts shape
  amount?: { value: number; token: string; tokenIcon: string; usd: number }
  orderId?: string              // → orderReceiptHref
  txHash?: string; chainId?: string // → txExplorerHref
  description?: string          // for account events ("Signed in with Google")
  isMock: boolean               // true for demo rows, drives the Sample data chip (§1.1)
}

export interface HistoryFilters {
  tab: HistoryTab
  search: string
  sort: HistorySort
  dateRange: HistoryDateRange
  status: 'all' | HistoryStatus
  assetType: HistoryAssetType
}

export interface HistorySummary {
  period: HistoryDateRange
  spentUsd: number
  earnedUsd: number
  pendingCount: number
  purchases: number; domainsSold: number; auctionsWon: number
  offersAccepted: number; transfers: number; withdrawals: number
  isMock: boolean               // always true until GET /history/summary exists (§8.2)
}
```

Tab → types: Transactions = purchase, sale, renewal, withdrawal; Bids = bid; Listings = listing, delisting; Offers = offer; Transfers = transfer; Account = account. The Details label and the pill label come from `type` through one map in `src/helpers/history/labels.ts`.

### 6.2 Hooks: `src/hooks/history/` (one per file, no barrel)

1. `useHistoryFilters()` holds `tab` in the URL and the rest in state; keeps a **draft** for the Filters card/sheet and an **applied** copy that Apply Filters commits (Clear All resets both). Search applies on submit or Enter, sort applies immediately.
2. `useHistoryActivities(filters, pageSize)` returns `QueryResult<{ items, total, hasMore }>` plus `showMore()` and `needsWalletVerification`. Source per tab per §8.3: live tabs call the mapped endpoints (merged and sorted by `occurredAt` for All Activities), demo tabs use `useMockQuery`.
3. `useHistorySummary(period)` returns `QueryResult<HistorySummary>`, always demo for now (§1.1 point 3).
4. `useHistoryExport(filters)` builds a CSV of the filtered list (§7.4).

### 6.3 Sample data: `src/data/history/`

`activities.ts` with ~30 activities across every type and both statuses (so "Show 14 more" and every tab can be seen; after phase 6 only the demo types are shown, the live types stay as a dev fallback), `summary.ts` matching Figma's numbers, filtered and sorted by a pure `filterHistory()` in `src/helpers/history/filterHistory.ts` (same split as Watchlist's `filterWatchlist`).

---

## 7. Page states and behaviour

1. **Loading**: skeleton rows (desktop) / skeleton cards (mobile), summary tiles show placeholders.
2. **Empty**: per tab ("No bids yet"), and a filtered empty state with a Clear filters button.
3. **Error**: friendly message with Retry, toast through `getUserFriendlyToastMessage`.
4. **Export**: CSV of the loaded rows that match the filters (live sources are merged client side, so "all pages" isn't available until §8.2 item 3). Demo rows are excluded once any live source is active, so a downloaded file never mixes real and sample records. New helper `src/helpers/history/toCsv.ts` (escape quotes and commas, `Blob` + object URL download, file name `endless-history-YYYY-MM-DD.csv`). Disabled while loading or empty.
5. **Row click / chevron**: marketplace orders open the receipt (`orderReceiptHref`); anything with only a `txHash` opens the explorer in a new tab; account events have no chevron (Q3).
6. **Copy reference**: copies the reference, short "Copied" feedback, same pattern as the copy buttons on the receipt.
7. **"9 pending"** in Summary sets Status = Pending and applies.
8. **Summary period** select is independent of the list's Date range.
9. **Show N more**: page size 8 like Figma; the label shows the remaining count capped at the page size.
10. **Tablet** (768 to 1039): rail moves under the list (`after-main-tablet`). The Filters card is hidden there and the Filter button + sheet are used instead, so filters stay next to the list; Summary and Need help sit side by side in a 2 column `panelGroup` (`CLAUDE.md` §5 tablet rule). The table stays a table at tablet if it fits at 768; if not, it switches to the card list in a 2 column grid. Decide in phase 3 from screenshots.
11. **Accessibility**: the table is a real `<table>` (or `role="table"` grid) with column headers; the tabs are a `tablist`; status is text, not only the strip colour; the sheet traps focus and closes on Escape.
12. **Wallet not verified**: when a live source returns the verified wallet error, the live tabs show an inline state "Verify your wallet to see your history" with the existing verify action, demo tabs keep working, and no error toast fires.
13. **Pending**: live v2 rows are written only after on chain confirmation, so they are always Completed; Pending and the orange strip appear on demo rows (and on renewals only if their response carries a pending state, check in phase 6).

---

## 8. Real API

### 8.1 What exists (backend checked 16 Oct, rechecked 19 Oct against fetched `origin/uat` b205dfc7, `D:\Akshat Endless\backend\backend`; fetch and pull it first, the local clone goes stale; never edit its files)

| Endpoint | Gives | Fit |
|---|---|---|
| `GET /history/get-all` (auth) | `type` BUY / LISTING / SOLD / PROMOTION / DELIST, `search`, `tld`, `network`, `page`, `limit`, `sort`; returns `data [{dateTime, type, domain, network, txnHash}]`, `total`, `totalPages`, `hasNext`, `totals {buyTotal, listingTotal, delistTotal, promotionTotal, soldTotal}` | The only merged list, but it reads the **legacy v1** buy and listing tables, and has no amount, status or reference |
| `GET /marketplacev2/orders/transactions/mine` | Paginated v2 receipts: `transactionType`, `orderHash`, `txHash`, `occurredAt`, `chainId`, `domainName`, `tld`, `buyer`, `seller`, `priceUsdt`, `feeUsdt` | Best source for purchases (**buyer side only**, `findByBuyer`), needs a wallet verified in the last hour |
| `GET /marketplacev2/orders/transactions/:orderHash` | One receipt | Already used by the receipt page |
| `GET /marketplacev2/orders/listing-history` (auth + verified wallet) | Per user listing events, scoped to the caller's userId; `domainName`/`tokenId` are optional filters, `page`, `limit`; returns `orderHash`, `domainName`, `tokenId`, `tokenContract`, `eventType` (LISTED / CANCELLED / SOLD / INVALIDATED / EXPIRED / REACTIVATED), `txHash`, `occurredAt` | **Corrected 19 Oct**: per user, not per domain. Real source for the Listings tab and for sales (SOLD events); no price on the row |
| `GET /marketplacev2/orders/my-purchases`, `GET /marketplacev2/orders/my-listings` (auth + verified wallet) | Buyer side purchases and seller side current listings, paginated | Extra sources the 16 Oct check missed |
| `GET /eth-domain-renewal/history`, `GET /bnb-arb-domain-renewal/history` | Paginated renewals | Renewals |
| Admin only: `/order/management/history/:userId`, `/order/management/exports/csv` | | Not usable |

**Missing**: offers, bids, transfers, withdrawals, account events (sign ins), a merged per user activity feed, per user summary totals by period, and a user CSV export.

### 8.1.1 New: `GET /api/v1/marketplacev2/history/get-all` (added 19 Oct 2026, backend PR #985, on staging)

Given to us by the backend developer. Source: `src/components/marketplacev2/history/` on backend `origin/uat` (a6200c6e). Staging answers 401 without a token, so it's deployed there.

1. **Auth**: `Authorization: Bearer <access_token>` (our `callBackend` already sends it), plus `RequireVerifiedWalletGuard`. The wallet check is a claim inside the access token (`walletVerifiedAt`, fresh for 1 hour), not another header. Without it: **403 `WALLET_NOT_VERIFIED`**. Our existing `ensureWalletVerified` in `src/lib/marketplace-order-client.ts` (nonce, sign, prove-wallet) puts a fresh token in the cookie.
2. **Query** (all optional): `type` = `BUY | LISTING | SOLD | DELIST` (anything else is a 400), `tld` (`bn`, `.bn`, `BN` all work), `network` (the NFT **contract address**, not a chain name), `search` (substring of the domain, max 100), `sort` = `ASC | DESC` by time (default DESC), `page` (default 1), `limit` (default 10, max 100).
3. **Response** `result`: `{ page, limit, total, totalPages, hasPrevious, hasNext, data, listOfTlds, network, totals: { buyTotal, listingTotal, delistTotal, soldTotal } }`. Each `data` row: `type, orderHash, domainName, tld, tokenId, tokenContract, seller, buyer, priceUsdt, feeUsdt, sellerUsdt, txHash, occurredAt` (missing fields are `null`, never absent).
4. **What each type means**: BUY and SOLD are settled sales (buyer or seller is the verified wallet). LISTING is the caller's **currently active** listings, not past listing events. DELIST is cancel events only.
5. **Fit with the page**: one merged, paginated, server filtered source for **Transactions (purchases, sales)** and **Listings (active, cancelled)**, with prices included, which replaces most of §8.3's client side merge. Still not covered: renewals, offers, bids, transfers, withdrawals, account events, status (every row is settled or active), date range and amount sort, and per period summary totals (`totals` are all time counts, unaffected by filters). `priceUsdt` is a string in USDT's smallest unit (6 decimals, as elsewhere in marketplacev2), so divide by 1,000,000.
6. **Tested on staging, 19 Oct 2026**, with the user's own wallet signed session: 200, `total` 39 (3 BUY + 4 LISTING + 30 DELIST + 2 SOLD, matching `totals`), 4 pages of 10. Confirmed: 6 decimal USDT (`"100000000"` = 100, `"100000"` = 0.10); `network` is the single contract `0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f` = `DEFAULTS.domainNftAddress` (Polygon, chain 137); delists carry the cancelled order's price; `txHash` null on LISTING and DELIST. To handle on the page: delists are most rows (group, filter or hide by default); a price edit shows as a DELIST then a LISTING of the same token seconds apart (merge into one "Price updated" row, or ask for a flag); a listing later cancelled has no LISTING row (LISTING is active only; past LISTED events exist in the listing history table); listing rows have no explorer link, so their chevron opens the domain page; amounts below 1 USDT must keep their decimals. Asks recorded in the coverage doc (`dev-docs/history/history-api-coverage.md`).

### 8.2 What the backend should add (for the phase 0 message)

1. `GET /history/activities?tab&type&status&assetType&from&to&search&sort&page&limit` → `{ data: HistoryActivity[], total, hasNext }` shaped like §6.1, merging v2 orders, renewals, transfers, offers, bids and account events.
2. `GET /history/summary?period=` → `HistorySummary`.
3. Optional: `GET /history/export.csv` with the same filters, if the client CSV (all pages) is too heavy.
4. Short term, smaller asks that make the phase 6 live tabs cleaner: a login only guard (no verified wallet) on the read only `transactions/mine` and `listing-history`, or login based variants (Q2); `priceUsdt` on `listing-history` rows (saves a receipt call per SOLD row, Q11); and a seller side option on `transactions/mine` so sales come from one source.

### 8.3 Live vs demo per area (until §8.2 exists)

| Area | Source | Notes |
|---|---|---|
| Transactions: purchases | **Live**, `GET /marketplacev2/orders/transactions/mine` | Buyer side only. Amount = `priceUsdt`, reference = short `orderHash`, chevron → `orderReceiptHref`, explorer via `txExplorerHref(chainId, txHash)` |
| Transactions: sales | **Live**, `listing-history` rows with `eventType` SOLD | Label "Domain sold". No price on the row: fetch `transactions/:orderHash` per visible SOLD row (cached by hash) until §8.2 item 4 adds `priceUsdt` |
| Listings tab | **Live**, `listing-history` (no `domainName`) | LISTED → "Domain listed", CANCELLED → "Listing cancelled", EXPIRED → "Listing expired", INVALIDATED → "Listing invalidated", REACTIVATED → "Listing reactivated". Amount shows "—", or the price from `my-listings` for still active listings |
| Renewals | **Live**, `GET /eth-domain-renewal/history` + `GET /bnb-arb-domain-renewal/history` | Merged and sorted client side (small lists). Confirm response fields and whether a pending state exists in phase 6 |
| All Activities | **Live merge** of the rows above, plus demo rows for the demo types (marked per row) | Each source fetched page by page; the merged list is sorted by `occurredAt`, and "Show N more" fetches the next page of any source whose loaded rows run out first |
| Bids, Offers, Transfers, Account tabs | **Demo** | No backend support |
| Summary card (total, spent/earned, pending, six tiles) | **Demo** | No per period totals; partial counts would mislead |
| Reference `#ED-…` format | **Not used** | Live rows use the short hash; decided 26 Oct 2026 to keep it, no backend ID needed |
| Search, sort, Date range, Asset type, Status filters | Client side over loaded rows | Server side once §8.2 item 1 exists |
| `GET /history/get-all` (legacy v1) | Not used | Old v1 tables, no amount or status |

If the verified wallet guard stays (Q2), live tabs show the §7 item 12 state for users without a recent verification.

---

## 9. Out of scope / follow ups

1. Activity detail page for non order types (no design).
2. Real time updates of pending rows.
3. Help Center destination (link target is a placeholder until a URL is given, Q8).
4. Updating the archived `transaction-history` code or `historySlice`.

### 9.1 Known bugs found while building (19 Oct 2026, not fixed, outside History)

Found during the phase 2 to 7 build and screenshot pass. Neither is caused by History, and History works around the first; both need their own fix.

| # | Bug | Where | Effect | Suggested fix |
|---|---|---|---|---|
| B1 | `orderReceiptHref` and `domainOverviewHref` build `//orders/<id>` and `//<name>`, because `MARKETPLACE_HREF` is `/` and both prepend it to a path that already starts with `/` | `src/helpers/marketplace/routes.ts` (lines 12 and 21); used by `DomainHeroCard`, `ComparableSalesPanel`, `ListingRow`, `PromotedDomainCard` | A link starting with `//` is protocol relative: the browser treats `orders` or the domain name as a host, so these links leave the site. `orderReceiptHref` also points at `/orders/…`, but the real receipt page is `/receipt/[orderHash]` | Build the path without the doubled slash, and point receipts at the new `receiptHref` (added for History, which uses it instead of `orderReceiptHref`). Check each caller in the browser after the change |
| B2 | `useWatchlistCount` lets a failed request throw an unhandled "Failed to fetch" | `src/hooks/marketplace/watchlist/useWatchlistCount.ts` (via `callBackend` in `src/lib/marketplace-order-client.ts`) | Whenever the backend can't be reached (offline, API down, blocked), every page with the sidebar shows the Next dev error overlay, and production logs an unhandled rejection | Catch the error in the count's fetch and treat it as "count unknown" (hide the badge), the way the other sidebar data degrades |

### 9.2 Still to check by hand (from the phase 7 pass)

1. Keyboard and screen reader pass over the tabs, table, sheet and selects.
2. Open an exported CSV in Excel and Google Sheets (UTF-8 names, quoted cells, the formula guard).
3. The Watchlist page after the `WatchlistDomainIdentity` change (only type checked).
4. The whole page with a real signed in session (the screenshots used a dummy one).

---

## 10. File map (planned)

```
pages/history/index.tsx, history.module.scss
src/helpers/marketplace/routes.ts            (+ HISTORY_HREF, historyHref)
src/data/marketplace/navigation.ts           (+ History item)
src/design-system/layouts/main-layout/index.tsx (+ /history → account)
src/design-system/composites/history/        (§5.2 + index.ts)
src/design-system/primitives/badges/badge    (+ type tones, additive)
src/types/history/index.ts
src/data/history/{activities,summary}.ts
src/helpers/history/{labels,filterHistory,mapActivity,toCsv}.ts
src/hooks/history/{useHistoryFilters,useHistoryActivities,useHistorySummary,useHistoryExport}.ts
src/core/redux/history.ts                    (typed endpoints, only when a source goes real)
public/assets/img/history/                   (downloaded icons)
```

---

## 11. Verification (every phase)

1. `npx tsc --noEmit -p .` clean; `eslint` on changed files with no new warnings; no `!important`, no native `<img>` or `<a>`, no fragments in `.map()`, inline style only for runtime values (`CLAUDE.md` §4).
2. No raw colours for surfaces, text or borders (`CLAUDE.md` §7.1); brand fills commented.
3. Screenshots through the running dev server on port **3002** (never `next build`, `next start` or `next dev`) at 390, 834, 1024 and 1440, in **light and dark**, compared with §2.1.
4. Keyboard: tab order, focus rings, arrow keys in tabs and selects, Escape closes the sheet.
5. Update `dev-docs/history/history-progress.html` (local only, `dev-docs` is gitignored).
6. Don't commit unless asked.

---

## 12. Open questions (answers change the build)

| # | Question | Proposal |
|---|---|---|
| Q1 | Sample first, or real where possible from day one? | **Decided 19 Oct**: demo first behind one hook; Transactions (purchases, sales), Listings and Renewals go live in phase 6; Bids, Offers, Transfers, Account and Summary stay demo (§8.3) |
| Q2 | Is "wallet verified in the last hour" acceptable for History, given it's protected by login, not wallet? | Ask backend for a login only guard on the read only endpoints (§8.2 item 4); meanwhile show the §7 item 12 state |
| Q3 | Where does a row's chevron go for non order types? | Receipt for orders, explorer for tx only rows, no chevron for account events |
| Q4 | Tabs and the Activity type select: one state or two? | One state |
| Q5 | Mobile filter sheet: bottom sheet or the existing slide in `Modal`? | Existing `Modal` |
| Q6 | Which bottom nav tab is active on `/history`? | Account |
| Q7 | What are "Asset type" options? | Domains, Tokens (USDT etc.); confirm with designer |
| Q8 | Help Center URL? | Placeholder until given |
| Q9 | Pill wording: "Accounts"/"Bids" or "Account"/"Bid"? | Singular |
| Q10 | Should "Withdrawals" exist (no payouts page yet)? | Keep the tile, show sample |
| Q11 | Sales price: one receipt call per SOLD row, or wait for `priceUsdt` on `listing-history`? | Receipt calls for now (cached), switch when backend adds it |

---

## 12.1 Build status (19 Oct 2026)

Phases 1 to 5 and 7 are built on demo data and checked (details and screenshots list in `dev-docs/history/history-progress.html`). Phase 6 (live data) is on hold: the user asked for demo data everywhere for now. Deviations from this plan: type pills and status chips are their own `shared/HistoryPills`, not Badge variants (shape differs); the domain field is `DomainNameFacts`; the table becomes cards below 1280px, not 1040px; Help Center links to the footer's support site.

## 12.2 API integrated (21 Oct 2026)

The table now reads `GET /marketplacev2/history/get-all`; the right rail (Summary, Filters, Need help) stays as it was, Summary on demo data. Decisions from the user: follow the API as it is (no past listing events merged in), remove the Account tab and its demo data.

1. **Tabs → API types**: All Activities = one call, no `type`; Transactions = BUY + SOLD; Listings = LISTING + DELIST (two calls each, merged by time on the page); Bids, Offers, Transfers = no API, empty state, no request.
2. **Loading**: 100 rows per call (the API max), shown 8 at a time; the next page loads only when a call's rows run short of the screen, which keeps two call merges in order.
3. **Server side**: search (domain name) and sort (Newest/Oldest only; the amount sorts were removed). **Client side, on loaded rows**: date range, status, asset type.
4. **Wallet**: if the token has no fresh wallet verification, the table shows "Verify your wallet to see your history" with a Verify wallet button (`ensureWalletVerified`, same as delist); a 403 WALLET_NOT_VERIFIED does the same. **Fixed 21 Oct**: the button first did nothing useful without a connected wallet, because the page never set up AppKit. It now does what ListingFlowModal does (`createAppKit`, wagmi `useAccount`): no wallet connected → the Connect Wallet modal opens, and signing starts by itself once a wallet connects; the signer comes from AppKit's `walletProvider`.
5. **Rows**: reference = short order hash, copy = full hash; chevron: purchase/sale → `/receipt/[orderHash]`, listing/delist → `/details/[orderHash]`; prices ÷ 1,000,000; under $1 keeps cents; chain Polygon.
6. **Removed**: `src/data/history/activities.ts`, the `account` tab and type, the amount sorts. **Added**: `src/helpers/history/mapApiActivity.ts`, `orderDetailsHref` in routes.ts, API types in `src/types/history`.
7. **Layout change**: cards now from 1365px down (the table's 712px minimum didn't fit beside the 260px rail at 1280); rail card headers wrap.
8. **Checked**: tsc and eslint clean; Node checks against real staging rows (mapper, links, merge, filters: 39 passed; CSV: 14 passed); screenshots with the user's real response served locally to headless Chrome (nothing sent to staging) at 1280, 1440 and 390 in both themes, plus the verify state. **Not checked**: a live call from the page with a real session, and the Verify wallet button with a real wallet.
9. **Known with this API**: the demo Summary's "9 pending" link filters to Pending, which real rows never are, so it shows the empty state. The course (`history-course.html`) predates this change.

## 12.3 Right rail on the API (21 Oct 2026)

User decisions: Summary calculated from the API; tiles with no data say Coming Soon; Filters keeps Date range and Activity type only.

1. **Summary** (`useHistorySummary` + `src/helpers/history/summarizeHistory.ts`): loads every BUY and SOLD row once (`fetchAllHistory`, pages of 100, capped at 50 pages per type), then for the chosen period: spent = sum of BUY `priceUsdt`, earned = sum of SOLD `sellerUsdt` (price if missing), purchases and domains sold = counts; pending is always 0. Skipped while the list asks for wallet verification; loads once it's done. Replace with `GET /history/summary` when it exists (§8.2 item 2).
2. **Tiles**: Purchases and Domains sold are real; Auctions won, Offers accepted, Transfers and Withdrawals show the shared `ComingSoonBadge` (icon dimmed).
3. **Filters card and mobile sheet**: Date range + Activity type. Status and Asset type removed from the UI, `HistoryFilters`, the draft and `filterHistory` (`HistoryAssetType` deleted). The "N pending" shortcut is gone (nothing is pending).
4. **Removed**: `src/data/history/` (no demo data left on the page). **Added**: `src/helpers/history/historyApi.ts` (shared by the list and the Summary).
5. **Checked**: tsc and eslint clean; Node 49 checks (mapper, links, filters, summary sums per period); screenshots with the real staging rows served locally: Summary "This month" = $0.10 spent, 1 purchase, both themes; mobile sheet with two fields. **Not checked**: with a real session on staging.

## 13. Build order and per phase prompts

Each phase is reviewable on its own and leaves the page working. Paste a prompt as is to start it.

| Phase | Scope |
|---|---|
| 0 | Backend and designer message (no code) |
| 1 | Route, navigation, page shell, header, tabs, types, sample data, hook scaffold |
| 2 | Toolbar, legend, desktop table and rows |
| 3 | Mobile cards, tablet layout, filter sheet |
| 4 | Right rail: Summary, Filters, Need help |
| 5 | Behaviour: filters, sort, search, show more, copy, export, row links |
| 6 | Live data: purchases, sales, listings, renewals, then the All Activities merge (§8.3) |
| 7 | Final QA, states, accessibility, polish |

### Phase 0: Backend and designer message (no code)

```
Read dev-docs/history/history-implementation-plan.md §2.7, §8 and §12.
Write a short plain message for the backend team (the endpoints in §8.2
with request and response shapes matching the TypeScript in §6.1, the
short term asks in §8.2 item 4, and Q2, Q11)
and one for the designer (the quirks in §2.7 and Q7, Q9, Q10). Frame it as
"what to build, in which order", not a blocker, since we start on sample
data. No code changes.
```

### Phase 1: Foundations

```
Start history phase 1 from dev-docs/history/history-implementation-plan.md
(§1, §2.1, §2.2, §3, §4, §6, §10). Follow CLAUDE.md including §4, §5 and §7.

Build:
1. pages/history/index.tsx + history.module.scss with MainLayout and
   MarketplacePageShell (mobileRailPlacement="after-main-tablet"), hero =
   header card + tabs, main = placeholder, rail = placeholder cards hidden
   on mobile.
2. HISTORY_HREF and historyHref(tab) in routes.ts; tab in ?tab= with
   router.replace shallow, validated.
3. The History item in the Seller Hub section of navigation.ts (§4.3), the
   bottom nav mapping (§4.4), and fix the sidebar path line in CLAUDE.md §2.
4. Header via ProfileSettingsHeader (title/subtitle props). Tabs via
   ProfileTabs if it can render without icons additively, else
   ListingCategoryTabs; active pill blue, white chip in dark from tablet up,
   blue on mobile dark (§2.6). Horizontal scroll on mobile.
5. Types (§6.1), sample data (§6.3), labels.ts and filterHistory.ts, and
   hook stubs (§6.2) returning sample data through useMockQuery with the
   Sample data chip.

Use get_design_context on 140:16068 and 140:18344 (dark). Verify per §11.
Don't commit.
```

### Phase 2: Toolbar and desktop table

```
Start history phase 2 from dev-docs/history/history-implementation-plan.md
(§2.3, §2.7, §3, §5). Follow CLAUDE.md including §4 and §7.

Build HistoryToolbar (SearchInput, FilterDropdown pill for sort, DefaultButton
dark Export), HistoryStatusLegend (Badge warning/success), the type tones on
Badge (additive, §5.1), HistoryActivityRow (accent strip by status,
WatchlistDomainIdentity row layout, Details label from the type map,
copyable reference, type pill, amount, date, chevron) and
HistoryActivityTable (header row, rows, Show N more like MyDomainsTable,
loading skeleton, empty and error states).

Query each row node in §2.1 (140:16281 and siblings, dark rows under
140:18506) for exact sizes and colours. Download icons per §5.3. Verify per §11.
Don't commit.
```

### Phase 3: Mobile and tablet

```
Start history phase 3 from dev-docs/history/history-implementation-plan.md
(§2.5, §2.6, §5.2, §7.10). Follow CLAUDE.md including §5.

Build HistoryActivityCard (status chip, identity in card layout, details |
amount row, type + date row) and switch HistoryActivityTable to cards below
mobile with useIsMobile, like MyDomainsTable. Mobile toolbar: full width
search, then Filter / Newest First / Export. Build HistoryFilterFields and
HistoryFilterSheet on the existing Modal (Q5), shown below desktop. Hide the
legend on mobile. Decide the tablet list (table vs 2 column cards) from
screenshots at 768, 834 and 1024 and record the choice in the progress log.

Figma: 140:17439 / 140:19456 and the sheet 140:17398 / 140:18032.
Verify per §11. Don't commit.
```

### Phase 4: Right rail

```
Start history phase 4 from dev-docs/history/history-implementation-plan.md
(§2.4, §2.6, §2.7.1, §3, §7.10). Follow CLAUDE.md including §5 and §7.

Build HistorySummaryCard (FilterDropdown pill period, total, sub line with
the "N pending" button, six tiles from summary-tile or stat-card in a 2
column grid, Withdrawals included per §2.7.1), HistoryFiltersCard
(HistoryFilterFields, Clear All, PrimaryButton Apply) and HistoryHelpCard.
Rail: Filters hidden below desktop; Summary and Help side by side at tablet
in a panelGroup.

Figma 140:16087 (light) and the dark rail under 140:18363. Verify per §11.
Don't commit.
```

### Phase 5: Behaviour

```
Start history phase 5 from dev-docs/history/history-implementation-plan.md (§6.2, §7).

Wire useHistoryFilters (URL tab, draft vs applied, Clear All, tab and
Activity type sharing one state per Q4), search on submit, sort, Show N
more, "N pending" shortcut, copy reference, row links (orderReceiptHref,
txExplorerHref, none for account), and Export through toCsv.ts. Test the
pure helpers (filterHistory, toCsv) directly with node before the UI.
Verify per §11. Don't commit.
```

### Phase 6: Real data

```
Start history phase 6 from dev-docs/history/history-implementation-plan.md
(§1.1, §7 items 12 and 13, §8.3). git fetch and pull the backend repo first (read it only, never edit
it), then check its current uat branch and src/core/redux.

Add typed RTK Query endpoints in src/core/redux/history.ts for
transactions/mine, listing-history, transactions/:orderHash and the two
renewal history endpoints. Map each in src/helpers/history/mapActivity.ts
to HistoryActivity (labels and references per §8.3, isMock false). Switch
purchases, sales, listings and renewals to live one source at a time,
checking each in the browser before the next, then the All Activities
merge. Keep Bids, Offers, Transfers, Account and the Summary card on demo
data with the chip. Handle the verified wallet error with the §7 item 12
state. Exclude demo rows from Export once a live source is on. Leave
GetUserHistory and historySlice untouched. Verify per §11, including a
signed in session with and without a recently verified wallet.
Don't commit.
```

### Phase 7: Final QA

```
Start history phase 7 from dev-docs/history/history-implementation-plan.md (§7, §11).

Go through every state (loading, empty per tab, filtered empty, error,
long names, huge amounts, 0 results after search) at 390, 834, 1024 and
1440 in both themes; keyboard and screen reader pass; remove dead code;
update the progress log with what was and wasn't verified. Don't commit.
```

## 12.4 What was asked of the backend (confirmed 27 Oct 2026)

The user asked the backend for exactly three things: a summary endpoint with periods (would replace the page's own sums), date range parameters on `get-all` (today the range only filters loaded rows), and renewals as a history type. Nothing else was asked: not several types in one call (Transactions and Listings keep merging two calls on the page), not a way to exclude cancellations, not bids, offers or transfers. None of the three had landed as of backend uat `ebcc85b9` (history last changed in `bd232ac6`, 19 Oct).

## 12.5 Summary, date range and type lists wired ahead of deploy (27 Oct 2026)

Guru shared a Postman collection ("MPV2 History - Summary, Date Range, Multi-Type") covering `GET /history/summary?period=all|7d|30d|90d|this_month|this_year` (result `{ period, spentUsdt, earnedUsdt, purchases, domainsSold, pendingCount }`), `from`/`to` (UTC `YYYY-MM-DD`, inclusive) and `type=BUY,SOLD` on `get-all`. Type lists came along although they weren't asked (§12.4). As of backend uat `87826e36` and stage on 27 Oct none of it was deployed (stage `/history/summary` 404, no commit anywhere has `spentUsdt`), so the page was built against the collection with a fallback:

1. `historyApiHasRanges()` (`src/helpers/history/historyApi.ts`) asks `/history/summary?period=all` once per page load. A 404 means the old backend; anything else but success (a 403 before verification) is retried next time. The three features ship together, so one check gates all of them. Needed because the old backend silently drops `from`/`to` (whitelist only) and 400s a type list. `BackendError` gained an optional `status` for this.
2. New backend: Summary card asks the route per period (`mapApiSummary`); Transactions and Listings are one call each (`type=BUY,SOLD`, `type=LISTING,DELIST`); the date range goes to the API as `from` (`historyRangeParams`, whole UTC days, so "Last 7 days" starts at midnight UTC seven days back), and totals count only rows in range.
3. Old backend: unchanged behaviour (summed summary, two calls per tab, date range on loaded rows).
4. Checked on the dev server with the API mocked both ways (headless, 27 Oct). Not yet checked against the real routes.
5. To confirm with Guru once deployed: `spentUsdt`/`earnedUsdt` are 6 decimal minor units like `priceUsdt` (assumed); `earnedUsdt` is after the 2.5% fee, as the old sum used `sellerUsdt`; whether `pendingCount` follows the period; whether `7d` is rolling or by UTC day. Renewals are still not in.
6. When the routes are on every environment, remove `historyApiHasRanges`, `fetchAllHistory`, `summarizeHistory` and the two call merge.

## 12.6 Extension filter (29 Oct 2026)

The user asked for Figma's Asset type back as a real filter. An **Extension** select now sits under Activity type in the Filters card and the mobile sheet (`HistoryFilterFields`). It sends get-all's `tld` (on the endpoint since its first version, 19 Oct, so no `historyApiHasRanges` check), counts in the Filter badge, and Clear All resets it; `filterHistory` checks it too. Options are the response's `listOfTlds` (the extensions in the current tab, search and date range); the backend works that list out after `tld`, so while an extension is picked the hook keeps the options from the last answer without one, plus the picked one. Status stays out (no status on rows); Network was left out because `network` returns token contract addresses, not chain names. Checked: tsc and eslint clean; headless Chrome with get-all mocked like the backend, both themes at 1440, 834 and 390 (options .nft .og .polygon .x, picking .x requests `tld=x` and shows only the .x rows, options stay complete, badge shows 1). Not committed.
