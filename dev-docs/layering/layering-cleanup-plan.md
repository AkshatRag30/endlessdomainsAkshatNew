# Layering Cleanup: Implementation Plan (every page)

Written 30 Oct 2026. Brings every page, Portfolio included, to the rules in CLAUDE.md §8, one safe phase at a time. (A Portfolio only cleanup was done and then reverted the same day at the user's request; see §3.0.)
Branch: to be decided (Q1). Code comments cite this file as "layering plan §N".
Audit script: `dev-docs/layering/layer_audit.py` (multi line aware; run from `src/`). The one line greps in CLAUDE.md §8 miss imports written over several lines, so use the script.

---

## 1. Why

On 30 Oct the user spotted a helper importing from a hook file and data hooks called inside a design system composite. The cause: the repo never wrote down which folder may do what, so each page copied whatever nearby code did, and the codebase ended up mixing styles. The rules are now in CLAUDE.md §8. This plan fixes everything that breaks them, page by page, **without changing behaviour**: every phase is a move or a split, never a redesign, and every affected page is checked in the browser after it.

---

## 2. The rules (CLAUDE.md §8)

| # | Folder | May | May not |
|---|---|---|---|
| 1 | `core/redux`, `core/services` (and the client in `lib/marketplace-order-client`) | Talk to the backend | Hold React state or draw |
| 2 | `hooks/` | Fetch through `core`, hold state, use `helpers`, `data`, `types` | Contain endpoint URLs (Q2) |
| 3 | `helpers/` | Pure functions; import `types`, static constants from `data`, other helpers | Network, React, hooks, components |
| 4 | `data/` | Static sample data and constants; import `types`, helpers | Hooks, network |
| 5 | `types/` | Every shared type | (types must not live in hook or component files) |
| 6 | `design-system/primitives`, `composites` | Draw: props in, callbacks out; pure helpers; display hooks (`useIsMobile`, `useState`, refs) | Data hooks, network |
| 7 | **Feature level**: the page file under `pages/`, or one connected wrapper per page (its location is Q6) | Call **data hooks** and pass results down | Call raw services (`getX()` in a `useEffect`); be imported by another page |

**Allowed exceptions (decided 30 Oct):** an action hook owned by one button (`MyDomainRow`, `MyDomainCard`, `NeedsAttentionPanel` calling `useDelistListing` / `useRenewRedirect`), and the app shell's global counts (`layouts/main-layout`, `MarketplaceSidebar`, `MobileDrawerMenu` reading the watchlist and My Domains counts). **These stay as they are.** The buying and listing flow hooks used by their own modal are treated the same way (they are the modal's actions), but the hook files move to `hooks/` and their network calls go through `core` (phase 5).

---

### 2.1 Decided 30 Oct 2026: data is called at the feature level, through hooks

After comparing with the main site (`D:\Akshat Endless\new-landing-page\webui`, where 62 design system composites, 9 helpers and 29 pages import services directly), the user chose:

| Layer | Calls data? |
|---|---|
| `design-system/primitives` | Never |
| `design-system/composites` | Never: props in, callbacks out |
| **Feature level**: the page file, or **one connected wrapper per page** | **Yes, through hooks only** (`usePortfolioDomains()`, `useAccountSummary()`, RTK Query hooks) |
| `helpers` | Never |
| Anywhere | **Never a raw service call in a `useEffect`**: data goes through a hook, so loading, errors and caching are handled once |

Why: drawing only composites keep sample data, design previews, both themes and pages served by two routes easy (Portfolio's own/public switch worked because only the hooks knew the source); hooks with a shared cache avoid the same data being fetched twice; the page shows at a glance what it requests. The two exceptions in §2 still apply.

"One connected wrapper per page" means a single component per page whose only job is calling the page's hooks and rendering the drawing composites with the results. It is not a design system composite. Where that file lives is Q6 (never `src/component`).

---

## 3. Findings, page by page

Audit run 30 Oct 2026 on branch `portfolio` (multi line aware). Each finding is confirmed by reading the file, not just a grep hit; false alarms are listed in §3.10 so they aren't rechecked.

### 3.0 Portfolio (`/portfolio`, `/u/[username]`)

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| PF1 | `composites/portfolio/shared/PortfolioPageView` calls six data hooks: it already is Portfolio's connected wrapper (§2.1), but it sits in the design system folder | 6 | Move it to the connected wrapper location Q6 decides; everything under `design-system/composites/portfolio` keeps only drawing. No logic change | 6 |
| PF2 | `helpers/portfolio/mapOwnPortfolio.ts` imports `deriveChain` from `hooks/my-domains/useMyDomainsData.ts` | 3 | Move `deriveChain` (a pure function) to `helpers/marketplace/chain.ts`; My Domains and Portfolio import it there | 1 |

Both were fixed on 30 Oct by moving the wiring to `src/component/portfolio-page`, then **reverted the same day**: `src/component` is no longer used in this project (user, 30 Oct 2026). Don't put new code there.

### 3.1 Marketplace home (`/`)

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| H1 | `composites/marketplace/activity/LiveActivityPanel` calls `useLiveActivity` | 6 | Call the hook in `pages/index.tsx`, pass `items`, `isLoading` etc. as props | 7 |
| H2 | `composites/marketplace/activity/LiveActivityTicker` calls `useLiveActivity` | 6 | Same (the page calls the hook once and feeds both) | 7 |
| H3 | `composites/marketplace/analytics/MarketActivityPanel` calls `useMarketStats` | 6 | Call it in `pages/index.tsx`, pass stats as props | 7 |
| H4 | `ListingFilterBar` imports type `ListingFilters` from `hooks/marketplace/useListingFilters` | 5 | Move the type to `types/marketplace` | 1 |

### 3.2 Order details (`/details/[orderId]`) and receipt (`/receipt/[orderHash]`)

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| D1 | `hooks/marketplace/useOrderDetails` calls `callBackend('/marketplacev2/orders/…')` | 2 (Q2) | `getOrderDetails(hash)` in `core/services/marketplace.service.ts`; the hook calls it | 4 |
| D2 | `hooks/marketplace/useTransactionReceipt` calls `callBackend` | 2 (Q2) | `getTransactionReceipt(hash)` in the same service | 4 |

### 3.3 Buying flow (modal on `/` and `/details`)

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| B1 | `composites/marketplace/buying-flow/useBuyFlowActions.ts`: a hook living in a composite folder, calling `callBackend` and the Seaport client | 1, 6 | Move the file to `hooks/marketplace/useBuyFlowActions.ts`; its backend calls go through `marketplace.service.ts` | 5 |
| B2 | `BuyFlowModal` imports `isUserRejection` (pure) from `lib/marketplace-order-client` | none, but `lib` mixes client and pure helpers (Q4) | Optional split | 9 |

### 3.4 Watchlist (`/watchlist`, the heart everywhere, sidebar count)

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| W1 | Type `WatchlistEntry` defined in `hooks/marketplace/useWatchlist.ts`, imported by `helpers/marketplace/watchlist.ts` and `data/marketplace/watchlistItems.ts` | 3, 4, 5 | Move to `types/marketplace/watchlist.ts` | 1 |
| W2 | `WatchlistFilterBar` imports type `WatchlistFilters` from `hooks/marketplace/watchlist/useWatchlistFilters` | 5 | Move to `types/marketplace` | 1 |
| W3 | `hooks/marketplace/useWatchlist` calls `callBackend` (GET, POST, DELETE `/orders/watchlist`) | 2 (Q2) | `getWatchlist`, `addToWatchlist`, `removeFromWatchlist` in `marketplace.service.ts` | 4 |
| W4 | `hooks/marketplace/watchlist/useWatchlistCount` calls `callBackend` | 2 (Q2) | Use the same `getWatchlist` service | 4 |

### 3.5 My Domains (`/seller-hub/my-domains`, listing flow)

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| M1 | `MyDomainsFilterBar` imports type `MyDomainsFilters` from `hooks/my-domains/useMyDomainsFilters` | 5 | Move to `types/my-domains` | 1 |
| M2 | `hooks/my-domains/useMyDomainsFilters` imports type `MyDomainsStatusFilter` from the composite `MyDomainsCategoryTabs` (a hook importing from the design system) | 5 | Move to `types/my-domains`; the composite imports it from there | 1 |
| M3 | `composites/my-domains/listing-flow/useListingFlowActions.ts`: a hook in a composite folder, calling `callBackend` and `core/redux/domain` | 1, 6 | Move to `hooks/my-domains/useListingFlowActions.ts`; backend calls through a service | 5 |
| M4 | `hooks/my-domains/useDelistListing` calls `callBackend('/orders/:hash/cancel')` | 2 (Q2) | `cancelOrder(hash)` in `marketplace.service.ts` | 4 |
| M5 | `hooks/my-domains/useSyncListingStatus` calls `callBackend` | 2 (Q2) | `syncListingStatus()` in the service | 4 |
| M6 | `MyDomainRow`, `MyDomainCard`, `NeedsAttentionPanel` call `useDelistListing` / `useRenewRedirect` | allowed exception | **No change** | none |
| M7 | `composites/my-domains/listing-flow/format.ts` imports `DEFAULTS` (constant) from `lib/marketplace-order-client` | none (Q4) | Optional split | 9 |
| M8 | `composites/my-domains/listing-flow/listingOrder.ts` (bulk-list): builds, signs and `callBackend` POSTs `/marketplacev2/orders` from a composite folder | 1, 6 | POST into `core/services/my-domains` (next to `bulkOrders.service.ts`), the sign and verify flow into `hooks/my-domains` (with M3) | 5 |
| M9 | `hooks/my-domains/useBulkListingActions.ts` imports `useListingFlowActions` and `listingOrder` from the composite folder (a hook importing from the design system) | 2 | Resolved by M3 and M8 moving those files | 5 |
| M10 | `BulkListingFlowModal`, `BulkDelistModal`, `ListingFlowModal` call `useBulkListingActions`, `useNftApprovals`, `useOnChainCancel`, `useDelistListing` | 6, 7 | Lift into the My Domains page or its connected wrapper (Q6) and pass state and callbacks as props | 6 |

> Recorded 24 Nov 2026 from the bulk-list code review (`dev-docs/bulk-listing/bulk-list-code-review.html`, H5), user chose option B (record now, refactor with the other pages). Already fixed on the branch: phase types to `types/my-domains/bulk.ts`, `MAX_PRICE` to `data/my-domains/pricing.ts`.

### 3.6 History (`/history`)

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| Y1 | `helpers/history/historyApi.ts` calls `callBackend` (`/history/get-all`, `/history/summary`) | 1, 3 | Move to `core/services/history.service.ts`; `useHistoryActivities` and `useHistorySummary` import from there. Its pure parts (if any) stay in `helpers/history` | 3 |

History's composites are already clean (the page wires its hooks in `pages/history/index.tsx`).

### 3.7 Profile (`/profile`)

The page renders the panels, and each panel fetches its own data. Fix (§2.1): `pages/profile/index.tsx` (only one route uses it, Q5) calls the hooks and passes data and callbacks down; the panels only draw.

| # | Composite | Data hooks it calls today | Phase |
|---|---|---|---|
| P1 | `ProfileTabPanel` (170 lines) | `useAccountSummary`, `useProfileDraft` | 6 |
| P2 | `ProfileRail` (and `ProfileRailAccount` in the same folder) | `useAccountSummary`, `useProfileDetails`, `useYourData` | 6 |
| P3 | `SecurityTabPanel` (157 lines) | `useActiveSessions`, `useChangePassword`, `useSignInMethods` (plus `useAuth` from context) | 6 |
| P4 | `WalletsTabPanel` (110 lines) | `useConnectedWallets`, `useLinkWallet`, `useWalletSettings` | 6 |
| P5 | `NotificationsTabPanel` (113 lines) | `useNotificationSettings`, `useProfileDetails` | 6 |

`PreferencesTabPanel` is clean (its hook use is commented out). Watch out: mutations (save, change password, link wallet) become callbacks passed down, and the unsaved changes guard (`onDirtyChange`) must keep working.

### 3.8 App shell

| # | Where | Breaks | Fix | Phase |
|---|---|---|---|---|
| S1 | `src/component/AppContent.tsx` calls `fetch(GetCheckSession)` on every load | 1 | Use the existing RTK endpoint `useGetCheckSessionQuery` (`core/redux/apicall.ts`) or a `checkSession()` in `core/services/auth.service.ts`. Auth critical: own phase, careful testing | 8 |
| S2 | Sidebar, drawer and main layout read the counts | allowed exception | **No change** | none |

### 3.9 Dead code (fetches from the wrong layer, used by nothing)

| # | File | Evidence | Fix | Phase |
|---|---|---|---|---|
| X1 | `helpers/file-from-url/CreateFileFromUrl .tsx` (note the space in the name) | No importer outside its folder | Delete | 2 |
| X2 | `src/component/domain-self-item/index.tsx` | No importer | Delete | 2 |
| X3 | `src/component/modals/DomainListingModal.tsx` (calls `fetch`) | Only imported by X2 | Delete with X2 | 2 |

Phase 2 rechecks each for dynamic imports and string references before deleting.

### 3.10 Checked and fine (don't recheck)

1. `helpers/error-messages` matched a network keyword but makes no calls.
2. `PreferencesTabPanel`'s `useProfilePreferences` is commented out.
3. `BuyFlowModal`'s and `PromotedDomainsSection`'s mentions of `useTransactionReceipt` / `useWatchlist` are comments.
4. `useDelistListing` does not import the design system (an earlier grep matched names in comments).
5. History, Watchlist and My Domains composites other than those listed only import types or display hooks.
6. Portfolio: two findings, §3.0.

---

## 4. Order of work and risk

| Phase | What | Pages to recheck | Risk |
|---|---|---|---|
| 0 | Decisions (Q1 to Q6), branch | none | none |
| 1 | Types out of hook and composite files (H4, W1, W2, M1, M2); `deriveChain` to helpers (PF2) | Home, Watchlist, My Domains (type check is enough; quick look) | Very low: type only |
| 2 | Delete dead code (X1 to X3) | none (nothing uses it) | Very low |
| 3 | History API helper → `core/services/history.service.ts` (Y1) | History | Low |
| 4 | Endpoint URLs out of hooks into `core/services/marketplace.service.ts` (D1, D2, W3, W4, M4, M5) | Details, Receipt, Watchlist, sidebar count, My Domains, History, Portfolio heart | Medium: many callers, same requests |
| 5 | Flow hooks out of composite folders (B1, M3) | Buy flow, listing flow, delist | Medium: wallet signing flows |
| 6 | Profile wiring lifted to the page (P1 to P5); Portfolio wiring out of the composite (PF1, after Q6) | Profile, every tab, both rail layouts | Medium to high: forms, dirty guard |
| 7 | Home activity panels wired by the page through their hooks (H1 to H3, §2.1) | Home | Medium: shared with other devs |
| 8 | App session check through `core` (S1) | Every page, login from the main site | High: auth |
| 9 | Optional: split `lib/marketplace-order-client` into client vs pure helpers (B2, M7) | Buy and listing flows | Low to medium |
| 10 | Final audit, CLAUDE.md §8 updated (fixed items removed) | All | none |

Phases 1 to 3 are small and can be done in one sitting. 4 to 8 each get their own sitting and browser pass.

---

## 5. Verification (every phase)

1. **Layering audit:** `cd src && python ../dev-docs/layering/layer_audit.py` shows none of the items fixed in this phase (and nothing new).
2. Feature level rule (§2.1): no composite, primitive or helper calls a data hook or a service; no `useEffect` calls a service directly; each page's data hooks are called in its page file or its one connected wrapper.
3. `npx tsc --noEmit -p .` clean; `eslint` on changed files: no new warnings.
4. **No behaviour change:** the affected pages from §4 checked through the running dev server on port 3002 (never `next build`, `next start` or `next dev`), light and dark, desktop and 390. For API backed pages, compare the same requests are made (method, URL, body) before and after.
5. Comments that name a moved file updated to its new path.
6. Update this file's §8 build log and remove fixed items from CLAUDE.md §8's outstanding list.
7. Don't commit unless asked.

---

## 6. Open questions (answers change the build)

| # | Question | Proposal |
|---|---|---|
| Q1 | Which branch? This touches pages other people work on (home, My Domains, details) | A new `layering-cleanup` branch off `dark-mode`, merged after review; or phase by phase on the branch each page lives on |
| Q2 | Rule 2 strictly: must hooks stop holding endpoint URLs (call `core/services` functions instead of `callBackend('/path')`)? | Yes: one service file per area, so every URL lives in `core`, like `profile-settings.service.ts` already does |
| Q3 | Delete the dead code (X1 to X3) or move it to `src/_archive`? | Delete (it's in git history); archive only if someone still wants to read it |
| Q4 | Split `lib/marketplace-order-client` (network client + constants + pure helpers in one file)? | Later (phase 9, optional); it's a library file, not a page |
| Q5 | Profile: wire in `pages/profile/index.tsx`? | Yes, the page file (only one route uses it), like History |
| Q6 | Where does a page's **connected wrapper** live (§2.1)? Needed for Portfolio, whose one wrapper serves `/portfolio` and `/u/[username]`. Not `src/component` (not used anymore), not `design-system` (drawing only), not `pages/` (every file there is a route) | Decide with the user |

---

## 7. Per phase prompts

Paste one to start it.

### Phase 0: Decisions

```
Read dev-docs/layering/layering-cleanup-plan.md §6 and ask me Q1 to Q6,
one screen, with your recommendation first. Record the answers in §6 and
create the branch I choose. No code changes.
```

### Phase 1: Types out of hook and composite files

```
Start layering phase 1 from dev-docs/layering/layering-cleanup-plan.md
(§3.1 H4, §3.4 W1 W2, §3.5 M1 M2). Move WatchlistEntry, ListingFilters,
WatchlistFilters, MyDomainsFilters and MyDomainsStatusFilter into src/types
(marketplace, my-domains), re-export nothing from the old files, update every
importer. Type only, no behaviour change. Verify per §5. Don't commit.
```

### Phase 2: Dead code

```
Start layering phase 2 (§3.9). For X1, X2, X3 confirm no importer, no
dynamic import and no string reference anywhere (pages, src, next.config),
then delete them (or archive, per Q3). Verify per §5. Don't commit.
```

### Phase 3: History API out of helpers

```
Start layering phase 3 (§3.6 Y1). Move the network functions in
helpers/history/historyApi.ts to src/core/services/history.service.ts,
keep any pure parts in helpers/history, update useHistoryActivities and
useHistorySummary. Same requests as before. Check /history in the browser
(list, summary, filters, wallet verify state) per §5. Don't commit.
```

### Phase 4: Endpoint URLs out of hooks

```
Start layering phase 4 (§3.2 D1 D2, §3.4 W3 W4, §3.5 M4 M5; Q2 must be yes).
Create src/core/services/marketplace.service.ts with getOrderDetails,
getTransactionReceipt, getWatchlist, addToWatchlist, removeFromWatchlist,
cancelOrder, syncListingStatus, all on callBackend (keeps its auth refresh).
Hooks call these instead of building URLs. Compare requests before and after,
then check details, receipt, watchlist (heart and page), sidebar count,
My Domains (delist, sync), History and Portfolio's heart per §5. Don't commit.
```

### Phase 5: Flow hooks out of composite folders

```
Start layering phase 5 (§3.3 B1, §3.5 M3). Move useBuyFlowActions to
src/hooks/marketplace/ and useListingFlowActions to src/hooks/my-domains/;
their backend calls go through marketplace.service.ts (phase 4). The modals
keep calling them (allowed: the modal's own actions, §2). Check buying and
listing up to the wallet prompt, and delist, per §5. Don't commit.
```

### Phase 6: Profile wiring lifted to the page

```
Start layering phase 6 (§3.7 P1 to P5; Q5). One panel at a time: move its
data hooks into pages/profile/index.tsx (feature level, §2.1: hooks only,
never a raw service in a useEffect), pass data and callbacks as props,
keep the panel's look and behaviour identical (save, change password, link
wallet, notifications, the unsaved changes guard, mobile ProfileRailAccount).
After each panel: tsc, then that tab in the browser. Verify per §5.
Don't commit.
```

### Phase 7: Home activity panels

```
Start layering phase 7 (§3.1 H1 to H3, §2.1). Call useLiveActivity and
useMarketStats once in pages/index.tsx and pass the results into
LiveActivityTicker, LiveActivityPanel and MarketActivityPanel as props.
Same requests, same polling. Check / at 1440, 1024 and 390 in both themes
per §5. Don't commit.
```

### Phase 8: App session check

```
Start layering phase 8 (§3.8 S1). Replace the raw fetch in
src/component/AppContent.tsx with the existing useGetCheckSessionQuery
(core/redux/apicall.ts) or a checkSession() in core/services/auth.service.ts,
keeping the same behaviour: once on mount, cookies set, login() called,
failures silent. Test signed out, signed in, and arriving from the main site
redirect. Verify per §5. Don't commit.
```

### Phase 9 (optional): Split the order client

```
Start layering phase 9 (§3.3 B2, §3.5 M7; Q4). Split
lib/marketplace-order-client.ts into the network client (callBackend,
ensureWalletVerified, …) and pure parts (DEFAULTS, isUserRejection, …),
update importers. Verify per §5. Don't commit.
```

### Phase 10: Final audit

```
Run layering phase 10. Run dev-docs/layering/layer_audit.py and the
CLAUDE.md §8 greps over src; everything left must be an allowed exception
(§2). Remove fixed items from CLAUDE.md §8's outstanding list, update §8 of
this plan, and report what's left and why.
```

---

## 8. Build log

Decision 30 Oct 2026: data is called at the feature level through hooks (§2.1); Q6 narrowed to where the connected wrapper lives.

| Date | Phase | What | Checked |
|---|---|---|---|
| 30 Oct 2026 | (Portfolio) | Portfolio cleanup (`deriveChain` to helpers, wiring to `src/component/portfolio-page`) done and then **reverted** at the user's request (`src/component` is not used anymore). Portfolio is back to its original structure; PF1, PF2 in §3.0 | Browser, tsc, eslint after the revert |
