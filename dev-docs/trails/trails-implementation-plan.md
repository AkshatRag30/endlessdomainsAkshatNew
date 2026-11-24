# Trails Checkout: Implementation Plan

Source: Mohit's doc "Trails Checkout: Frontend Work That Starts Now" (4 Nov 2026, 12 pages). Plain language version: `dev-docs/trails/trails-checkout-explained.html`.
No companion doc: the source mentions "Trails Integration Plan: Marketplace Frontend", but Mohit confirmed (5 Nov) we work from the source doc alone. Screen copy, the analytics event list and the QA matrix are written by us in this plan (Q1).
Branch: `trails`, cut from `dark-mode` (closest to uat), decided 5 Nov. Written 4 Nov 2026. Code comments cite this file as "trails plan §N.N".
Nothing is built yet. Start a phase only when the user says so.

---

## 1. Context

Buyers can only pay in USDT on Polygon today. Trails lets them pay with any token on any chain: they sign once in a Trails widget, a Trails wallet on Polygon pays the exact USDT price and calls Seaport for them. Mohit proved it on mainnet on 3 Nov (probe P3).

Everything lives **inside the existing buy drawer**. No new modal. `BuyFlowModal` already moves through steps with one `step` state; Trails adds a payment method choice on the review screen and a few new steps after it.

### 1.1 What the code looks like today (checked 4 Nov on `promotions`)

| Thing | Where | Notes |
|---|---|---|
| Buy drawer | `src/design-system/composites/marketplace/buying-flow/BuyFlowModal/BuyFlowModal.tsx` (588 lines) | Steps: `loading`, `blocked`, `review`, `approval-explainer`, three `pending-*`, `success`, `reject`, `no-longer-available`. Opened from 7 places (pages/index, details, watchlist, ListingRow, LiveListingsTable, PromotedDomainCard, DomainHeroCard, WatchlistActions) |
| Buy actions | `buying-flow/useBuyFlowActions.ts` | `loadOrder()` fetches `/marketplacev2/orders/:orderHash`, checks own listing, `getOrderStatus`, start/end time vs block. Uses ethers v5 and `fulfillOrder` (recipient = payer, fine for direct buys, **never** for Trails) |
| Pay with | `buying-flow/PaymentMethodSection/PaymentMethodSection.tsx` | Two cards: "USDT from your wallet" (always selected), "Card" (disabled). Uses `PaymentMethodCard` primitive |
| Order client | `src/lib/marketplace-order-client.ts` | `DEFAULTS` (lines 32 to 48: `seaportAddress`, `usdtAddress`, `domainNftAddress`, `feeBps`), `getPolygonReadProvider()` (multi RPC with fallback), `callBackend` |
| Order builder | `src/lib/seaport-order-builder-v5.ts` | `toOrderParameters` (lines 162 to 165) drops `counter`, adds `totalOriginalConsiderationItems`; keeps decimal strings |
| Sale receipt | `src/hooks/marketplace/useTransactionReceipt.ts` | Real `GET /marketplacev2/orders/transactions/:orderHash`, retries 20 × 3 s |
| Toasts | `pages/_app.tsx` line 83 | `react-toastify` `ToastContainer` |
| RTK tags | `src/core/redux/api.ts` | `domain_listing`, `domain`, `all_domain_listing` exist. A direct buy invalidates nothing today |
| Reject copy bug | `BuyFlowModal.tsx` lines 542 to 552 | Reuses `BOUGHT_SUBTEXT`; the code comment says it was kept because Figma 1:1051 draws it that way |

### 1.2 Where the doc and the repo disagree (decided here unless a Q says otherwise)

1. **Env map.** The doc says add the three `NEXT_PUBLIC_TRAILS_*` vars to the `next.config.ts` env map. Not needed: Next inlines every `NEXT_PUBLIC_` var at build time, and `marketplace-order-client.ts` (comment above `DEDICATED_POLYGON_RPC`) already relies on that with no env map entry. We only add them to `.env` and the uat env. Tell Mohit.
2. **Versions.** Installed today: viem 2.41.2, @tanstack/react-query 5.90.12, wagmi 2.19.5 (matches the doc). `package.json` still says `^2.7.10` and `^5.66.0`, so the upgrade also bumps those ranges.
3. **Vitest is not installed.** No test runner exists in the repo. Phase 2 adds `vitest` as a dev dependency with a tiny config (alias `@` to `src`) and a `test` script. This is the repo's first test (Q6).
4. **`next build` in the definition of done.** We never run `next build` while the user's dev server is up (memory rule, 9 Oct incident). Claude verifies with `tsc`, ESLint, Vitest and the dev server on 3002; the user runs `next build` (or the bundle size check) once, with the dev server stopped, before phase 12 is signed off.
5. **Folder `buying-flow/trails/`.** The doc puts `checkoutSource.ts` inside the composite folder. That breaks our layering rules (CLAUDE.md §8: composites only draw). Section 3 splits it across `types`, `helpers`, `core/services`, `hooks` and composites, every folder named `trails`, so the doc's own rule "nothing outside `trails/` imports Trails packages" still holds as a grep.
6. **Live checks.** `loadOrder()` already covers signature present, cancelled or filled, own listing and the time window. Missing for Trails: the 15 minute margin, `ownerOf`, `isApprovedForAll`, `getCounter`. Those four are added to the Trails prepare path only; the direct buy path stays as it is (no behaviour change when Trails is off).

### 1.3 Dark mode, mobile, layering from the first line

Every new SCSS file follows CLAUDE.md §7 (role tokens, `@include dark` last). Every phase is checked light and dark at mobile, tablet and desktop. Every phase ends with the CLAUDE.md §8 grep check plus `grep -rn "0xtrails" src pages | grep -v "/trails/"` printing nothing.

---

## 2. User facing flow

```
review (Pay with: [USDT from wallet] [Any token, any chain] [Card, disabled])
  │
  ├─ USDT picked ─▶ today's flow, unchanged
  │
  └─ Any token picked ─▶ trails-preparing (live checks + build calls)
                           │  CheckoutError ─▶ blocked / no-longer-available (existing screens, new copy)
                           ▼
                         trails-pay (Trails widget inside the drawer, buyer picks token and signs)
                           │  cancelled in widget ─▶ back to review
                           ▼
                         trails-progress (attached ▸ executing ▸ succeeded "Purchase confirmed. Preparing your receipt.")
                           │
           ┌───────────────┼────────────────────┐
           ▼               ▼                    ▼
        success         trails-refunded      trails-failed
   (our sale receipt   (lost race or revert;  (keep polling 20 min,
    buyer == me)        refund tx link)        can still become refunded)
```

Review screen in Trails mode: no "wrong network" banner, no POL banner, no USDT balance banner (the buyer pays from another chain). Login is still required, same as today. CTA reads something like "Continue to payment" (we write the copy, Q1). `WhatYouPaySection` shows the USDT price plus "Trails network fee shown in the next step". `PurchaseTermsFooter` gets the Trails terms line.

Closing the drawer during `trails-progress` is allowed (like `pending-settling`); the result arrives later as a toast.

---

## 3. Where each file goes (layering)

| Layer | File | What it holds |
|---|---|---|
| `src/types/trails/` | `checkout.ts` | `Hex`, `PreparedCheckout`, `CheckoutStatus`, `CheckoutState`, `CheckoutErrorCode`, `StoredCheckout` (shapes copied exactly from the doc) |
| `src/helpers/trails/` | `checkoutError.ts` | `CheckoutError` class with a `code` (pure) |
| | `buildDestinationCalls.ts` | `toViemParams`, `seaportFulfillAbi`, `buildDestinationCalls(rawOrder, signature, buyer)`. viem encoding only, pure |
| | `buildDestinationCalls.test.ts` | The fixture test (doc page 6 and 7) |
| | `intentStatus.ts` | Trails status ▸ `CheckoutStatus`, refund link rule (probe E7), "is terminal", poll interval (3 s, 15 s after 5 min, 20 min for failed) |
| | `checkoutGate.ts` | `isTrailsAvailable(address, flags)`: enabled flag + pilot list (Q4) |
| `src/core/services/trails/` | `orderChecks.service.ts` | The live chain reads (block, `ownerOf`, `isApprovedForAll`, `getCounter`) through `getPolygonReadProvider()` |
| | `trailsReceipt.service.ts` | `new TrailsApi(key).getIntentReceipt({ intentId })` |
| | `checkoutStore.service.ts` | localStorage read/write of `{checkoutId, orderHash, intentId, buyer, createdAt}`, try/catch on every access (same spirit as `cookies.service.ts`) |
| | `checkoutSource.ts` | The `CheckoutSource` interface (re-exported from types) |
| | `browserCheckoutSource.ts` | Browser implementation: `prepare`, `attachIntent`, `getStatus` |
| | `index.ts` | `getCheckoutSource()`: the one place that picks backend vs browser. Today always the browser version; the backend version and its probe are only a comment until the backend ships (Phase B) |
| | `watchCheckout.ts` | Polls one checkout until final (3 s, 15 s after 5 min), removes it from the store |
| | `checkoutTracker.ts` | **Added 11 Nov (Mohit's review).** App wide tracker: one watch per running purchase, listeners, end handler; loads `watchCheckout` with `import()` only when needed |
| `src/hooks/trails/` | `useTrailsCheckout.ts` | Owns one checkout for the drawer: prepare, attach on `onQuote`, **listen** to the tracker (since 11 Nov it no longer polls itself); loads the checkout source with `import()` |
| | `useTrailsTracker.ts` | **Replaced `useTrailsResume.ts` on 11 Nov.** In `_app`: registers the end of purchase toast, resumes stored checkouts (paid 24 h, unpaid 30 min) |
| `src/core/services/analytics.service.ts` | `trackEvent(name, params)` | Pushes to `window.dataLayer` (Q7) |
| composites `buying-flow/trails/` | `TrailsWidgetLoader/` | `next/dynamic` with `ssr: false`, the only file importing the widget package |
| | `TrailsPayStep/` | Drawer body around the widget |
| | `TrailsProgressStep/`, refund/failed content | Reuse `BuyPendingStep` / `TransactionChecklist` / `BuyResultStep` where they fit |
| composites `buying-flow/` (edited) | `PaymentMethodSection`, `WhatYouPaySection`, `PurchaseTermsFooter`, `ReviewPurchaseStep`, `BuyFlowModal` | Additive props only; USDT path renders exactly as today |

`BuyFlowModal` calling `useTrailsCheckout` follows the same pattern as its existing `useBuyFlowActions` (an action hook owned by the drawer, CLAUDE.md §8 exception 1). Lifting both hooks to the seven callers is a bigger change and out of scope (Q5).

---

## 4. Phases

Mapped to the doc's ten tasks. Phases 1 to 3 remove risk and must be done in order; stop and report to Mohit if phase 3 check (a) fails.

| Phase | Doc task | Days | Output |
|---|---|---|---|
| 0 | prep | | Answers to §6, branch, uat key |
| 1 | 1 Keys and flags | 0.5 | Env vars in `.env` and uat env; `checkoutGate` helper; card hidden unless enabled |
| 2 | 2 Dependencies | 1 | viem ≥ 2.56.7, react-query ≥ 5.101, `0xtrails@0.20.0`, Trails wagmi adapter (exact pins), Vitest; `npm ls` clean; regression of buy, list, delist on uat |
| 3 | 3 Widget spike | 1 | Local only page, checks (a) (b) (c) plus `getIntentReceipt` CORS, screenshots, decoded quote |
| 4 | 4 Builder | 0.5 | Types, `CheckoutError`, `buildDestinationCalls`, fixture test green |
| 5 | 4 checks + 5 seam | 1 | `orderChecks.service`, `checkoutStore.service`, `browserCheckoutSource`, `getCheckoutSource` |
| 6 | 6 UI part 1 | 1.5 | Pay with card, `paymentMethod` state, Trails mode in review, `WhatYouPaySection`, `PurchaseTermsFooter` |
| 7 | 6 UI part 2 | 1.5 | `TrailsWidgetLoader`, `TrailsPayStep`, new steps in `BuyFlowModal`, error screens for every code |
| 8 | 6 UI part 3 + 7 status | 2 | `useTrailsCheckout` polling, progress, Done (sale receipt buyer == me), refunded, failed |
| 9 | 7 resume | 1 | `useTrailsResume` in `_app`, toasts after reload, `/history` banner from the store |
| 10 | 8 shared fixes | 0.5 | Invalidate `domain_listing` and `domain` after any purchase; real reject subtext |
| 11 | 9 analytics | 0.5 | `trackEvent` + event list |
| 12 | 10 QA | 1.5 | Doc's manual matrix on uat; definition of done ticked |
| R | Mohit's code review (11 Nov) | 1 | Six fixes: page weight, app wide tracking, refund wording, slippage 0.5%, unpaid polling cut off, widget logging; plus the bugs found while testing. Pushed `1622027`. See "Phase R" below |
| B | Backend checkout source (after the backend ships) | 0.5 | Backend version of `CheckoutSource`, config probe in `getCheckoutSource()`, both paths retested. See "Phase B" below |

### Phase 0: prep (no code)

Q1 and Q2 are answered (5 Nov). Branch `trails` exists, cut from `dark-mode`. Still useful: Q3 (designs). Ask Mohit for the uat Trails key. Line up the test wallets in §5.

### Phase 1: keys and flags

Add `NEXT_PUBLIC_TRAILS_API_KEY`, `NEXT_PUBLIC_TRAILS_ENABLED`, `NEXT_PUBLIC_TRAILS_PILOT_WALLETS` to `.env` (local) and give the uat values to whoever owns the AWS env. No `next.config.ts` change (§1.2.1). Write `src/helpers/trails/checkoutGate.ts`. Dev server must restart to read new env.

> **Prompt:** Start Trails phase 1 (trails plan §4). Add the three NEXT_PUBLIC_TRAILS_* vars to .env only (I'll restart the dev server), no next.config.ts change per §1.2.1. Write src/helpers/trails/checkoutGate.ts per §3 and Q4's answer. tsc, eslint, CLAUDE.md §8 grep. Start dev-docs/trails/trails-progress.html.

### Phase 2: dependencies and regression

Exact pins, no caret, for the two Trails packages. Run `npm ls wagmi @wagmi/core viem` and make sure there's one wagmi 2.19.5 (watch `@reown/appkit-adapter-wagmi`, which also depends on wagmi and viem). Add Vitest. Then the user regression tests a direct USDT buy, a listing and a delist on uat (real money, cheap listing).

> **Prompt:** Start Trails phase 2. Upgrade viem to 2.56.7 or newer and @tanstack/react-query to 5.101 or newer, add 0xtrails@0.20.0 and the Trails wagmi adapter pinned exactly, add vitest as a dev dependency with a config that maps @ to src and a "test" script. Show me npm ls wagmi @wagmi/core viem. tsc and eslint must stay clean. Don't run next build. Then give me the regression checklist for buy, list, delist.

### Phase 3: widget spike (local only, never committed)

Page `pages/trails-spike.tsx`, listed in `.git/info/exclude` (a local ignore that is never committed) so it can't ship. Renders the widget in Pay mode inside our `Modal` with the fixture calls (§ fixture in the doc, page 7). Record: (a) Pay mode accepts `actions`; (b) the quoted batch is approve + `fulfillAdvancedOrder` with recipient = buyer (decode the quote's calldata); (c) no z index or scroll lock fight with our drawer, light and dark, mobile; (d) `getIntentReceipt` works from the browser with the public key (CORS). Also note: widget theming options for dark mode, its mobile width, and what its callbacks return. Delete the page when done.

> **Prompt:** Start Trails phase 3, the spike. Create pages/trails-spike.tsx and add it to .git/info/exclude first, then show me git status proving it's not tracked. Render the Trails widget in Pay mode inside our Modal with the fixture calls from the doc. Help me record checks (a) to (d) from trails plan §4 phase 3. If (a) fails, stop and draft the message to Mohit.

### Phase 4: types and the destination builder

`src/types/trails/checkout.ts`, `src/helpers/trails/checkoutError.ts`, `src/helpers/trails/buildDestinationCalls.ts` with `toViemParams` and the ABI exactly as the doc gives it. Fixture test asserts selector `0xe7acab24`, length 1,444 bytes, keccak `0x81f1e3…7bd99`, and the exact approve calldata.

> **Prompt:** Start Trails phase 4. Types, CheckoutError and buildDestinationCalls per trails plan §3, using the doc's ABI and the fixture JSON verbatim in a Vitest test. Run the test and show me the output.

### Phase 5: live checks and the seam

`orderChecks.service.ts`: one call that reads block timestamp, `ownerOf(tokenId)`, `isApprovedForAll(offerer, Seaport)`, `getCounter(offerer)` and `getOrderStatus` in parallel through `getPolygonReadProvider()`, and maps failures to codes per the doc's table. `browserCheckoutSource.prepare` = fetch order (same endpoint as `loadOrder`) ▸ checks ▸ `buildDestinationCalls` ▸ `PreparedCheckout` with `crypto.randomUUID()` and `expiresAt` = now + 15 min. `attachIntent` writes the store. `getStatus` combines `trailsReceipt.service` and the sale receipt endpoint per the doc's rules 1 to 3. RPC unreachable ▸ `CHAIN_UNAVAILABLE`.

> **Prompt:** Start Trails phase 5 (trails plan §3 and §4 phase 5). Build orderChecks.service, checkoutStore.service, trailsReceipt.service, browserCheckoutSource and getCheckoutSource. Add Vitest tests for the pure parts (status mapping, refund link rule, poll interval). tsc, eslint, §8 grep, and the 0xtrails grep.

### Phase 6: UI part 1, Pay with and review

`PaymentMethodSection` gets optional props for a third card and a `selected` / `onSelect`; with Trails off it renders exactly today's two cards. `BuyFlowModal` gets `paymentMethod` state (`'usdt' | 'trails'`). In Trails mode the review notices for network, POL and USDT are skipped; CTA and helper text change; `WhatYouPaySection` and `PurchaseTermsFooter` get a Trails mode. Copy drafted by us and shown to the user before it lands (Q1), layout from Q3.

> **Prompt:** Start Trails phase 6. Add the "Any token, any chain" card and paymentMethod state per trails plan §2 and §4 phase 6. Trails off must render pixel identical to today; show me before/after screenshots of the review step at mobile and desktop, light and dark.

### Phase 7: UI part 2, the widget step

`TrailsWidgetLoader` (`next/dynamic`, `ssr: false`, loading skeleton). New `BuyFlowStep` values `trails-preparing`, `trails-pay`, `trails-progress`, `trails-refunded`, `trails-failed`. Each `CheckoutError` code maps to an existing screen: `ORDER_NOT_FILLABLE` ▸ `no-longer-available`; `OWN_LISTING` ▸ `blocked` own listing; `EXPIRING_SOON`, `PRICE_OUT_OF_RANGE`, `TRAILS_DISABLED`, `CHAIN_UNAVAILABLE` ▸ `blocked` with new copy. Widget cancel returns to review.

Carried over from the phase 3 spike (closed 5 Nov): check the widget in light mode and at phone width inside the drawer, and read the Next.js dev overlay's issues while the widget is open (only dark desktop was checked in the spike). The Trails wallet picker still appears once even when our wallet is connected; picking MetaMask reuses the connection with no new approval. Use `Pay` from `0xtrails/widget` with `actions: [custom(approve), custom(fulfill)]` and `wagmiAdapter()` from `@0xtrails/adapter-wagmi`, as the spike did. Delete `pages/trails-spike.tsx` and its SCSS (kept on disk at the user's request) before the feature ships.

> **Prompt:** Start Trails phase 7. TrailsWidgetLoader, TrailsPayStep and the new steps per trails plan §2 and §4 phase 7. Keep the new step rendering out of BuyFlowModal.tsx's body as much as possible (one branch per step that renders a component). Check the main bundle didn't grow by checking the widget is only imported through next/dynamic.

### Phase 8: status, Done and refunds

`useTrailsCheckout` handles widget callbacks (`onQuote` saves the store and calls `attachIntent`), then polls `getStatus`. Done only when the sale receipt buyer equals the connected address (lowercased). `succeeded` before that shows "Purchase confirmed. Preparing your receipt." Refund link: `refundTransaction` hash, or `destinationTransaction.txnHash` when the refund happened in the reverted fill (probe E7), linked to Polygonscan. `onPurchased(listing, txHash)` fires with the fill tx hash.

> **Prompt:** Start Trails phase 8 per trails plan §4 phase 8 and the doc's Purchase status rules 1 to 4. Show me every outcome screen (progress, confirmed, done, refunded, failed) with mocked getStatus results, light and dark, mobile and desktop.

### Phase 9: resume after reload

(Since 11 Nov: replaced by `useTrailsTracker` and the app wide tracker, see Phase R.) `useTrailsResume` mounted once from `pages/_app.tsx` (Q8). Reads the store, resumes entries under 24 h that aren't terminal, polls in the background, toasts the outcome via react-toastify, and clears finished entries. `/history` gets a small "Trails purchase in progress" banner reading the same store (Q9).

> **Prompt:** Start Trails phase 9 per trails plan §4 phase 9. Show me the toast after closing the drawer mid purchase and reloading.

### Phase R: fixes from Mohit's code review (11 Nov 2026)

Mohit reviewed the pushed branch (`10e06fc`) and raised six points; all six were confirmed against the code (full check: `dev-docs/trails/trails-mohit-review.html`) and fixed the same day; committed and pushed with the testing fixes below as `1622027` (11 Nov). The user's decisions: refund wording approved as drafted; unpaid cut off 30 minutes, later changed to 15 by the user the same day (`UNPAID_WATCH_MS`); remove only the widget event logging (keep `console.error`); small fixes first, then the tracker.

1. **Every page heavier (about 38 kB):** `_app` imported the resume hook, which statically pulled in the checkout source (Seaport encoder, order checks). Now `_app` imports only a small tracker; the polling code and the checkout source load with `import()` when a purchase is pending or "Any token" is used.
2. **Tracking stopped on page change or a second purchase:** polling lived in the drawer's hook. Now one app wide tracker watches every running purchase; the drawer only listens and tells the tracker whether it showed the result on screen; if not, `_app` shows the toast.
3. **Refund wording:** "sent back" and the unconfirmed "conversion fees aren't refunded" replaced with the doc's "not converted back to your original token".
4. **Slippage:** 0.05 ▸ 0.005, as in the probe (answers Q13). **Not in effect:** `0xtrails` 0.20.0 (latest) doesn't pass the Pay widget's `slippageTolerance` to its quote, so `QuoteIntent` carries none and Trails uses Auto (true for every purchase so far). Decision with Mohit, Q13.
5. **Unpaid committed intent polled forever:** an unpaid purchase (QUOTED, COMMITTED, or EXECUTING with nothing sent) now stops 15 minutes after its **newest quote** (silent, "abandoned"; first 30 minutes, changed to 15 by the user; `watchWindowStart`); unpaid entries are resumed after a reload only while under 15 minutes old; unknown statuses stop after 20 minutes.
6. **Widget console logging:** removed.

Extra, found while doing 2: a purchase another tab finished no longer errors on every poll.

Found while testing (11 Nov), all fixed:

1. **Drawer restarted after Pay** (`BuyFlowModal.tsx`): the start up effect re-ran on any wallet network change, and pressing Pay makes the widget switch network, so the drawer went back to Review and unmounted the widget. Now a wallet change on the Trails steps (`TRAILS_STEPS`) doesn't restart it; USDT path unchanged; Back re-checks the network.
2. **Cancelled payment treated as paid** (`intentStatus.ts` `effectiveIntentStatus`, `trailsReceipt.service.ts`, `browserCheckoutSource.ts`, `types/trails/checkout.ts`): Trails says EXECUTING as soon as Pay is pressed. EXECUTING with the deposit not SUCCEEDED and the origin transaction ON_HOLD with no hash now counts as COMMITTED (not paid). And `checkoutStatusFor`: FAILED, ABORTED or INVALID with nothing deposited (seen: INVALID "deposit transaction FAILED" after the quote expired) counts as `expired` and ends quietly, instead of "Payment didn't go through".
3. **Paid, but the drawer stayed on the widget** (`browserCheckoutSource.ts`, `types/trails/checkout.ts`): the widget made a second quote 5 seconds after Pay (seen over WalletConnect) and we followed it, losing the paid one. `StoredCheckout.earlierIntentIds` keeps the last 3 quotes; while the newest isn't paid, `getStatus` also checks the earlier ones and from the first paid one on follows only that one.
4. **Trails rate limit (429)** (`watchCheckout.ts`, `isRateLimited`, `rateLimitDelayMs`): the watch backs off 30 s, 60 s, then 2 min and logs a warning; the earlier quote lookup stops on a rate limit too.
5. **Unpaid window from the newest quote** (`watchWindowStart`, found in the end to end check): counting from the first quote could stop the watch while a buyer who re picked a token paid a fresh quote.

| File | Change | Point | What |
|---|---|---|---|
| `src/design-system/composites/marketplace/buying-flow/trails/TrailsWidgetLoader/TrailsWidget.tsx` | Edited | 6 | Removed `logEvent` and its 7 calls; each widget callback now just forwards the event. No more `[trails] widget …` console lines. |
| `src/core/services/trails/browserCheckoutSource.ts` | Edited | 4, extra | `SLIPPAGE_TOLERANCE` 0.05 to 0.005. `getStatus` for a checkout neither prepared in this tab nor stored (another tab finished it) returns `expired` instead of throwing on every poll. |
| `src/data/trails/copy.ts` | Edited | 3 | `TRAILS_REFUNDED_TOAST_BODY`: "X USDT was refunded to your wallet on Polygon, not converted back to your original token." |
| `src/design-system/composites/marketplace/buying-flow/BuyFlowModal/BuyFlowModal.tsx` | Edited | 3, 2 | Refund screen text (approved wording, fees sentence removed). The old outcome `useEffect` became `handleTrailsFinal(state)`, passed to `useTrailsCheckout`: shows success, refunded or failed when the drawer is on `trails-pay` / `trails-progress` and returns true, else returns false so `_app` toasts. Removed `handledCheckoutRef` and the `showTrailsOutcomeToast` import. Comment on Back: it stops listening, not tracking. |
| `src/helpers/trails/intentStatus.ts` | Edited | 5 | New `UNPAID_WATCH_MS` (30 min, changed to 15 min on 11 Nov). `isFinal`: `COMMITTED` stops at 30 min; an unknown Trails status stops at 20 min. `checkoutOutcome`: `COMMITTED` to `abandoned` (silent). `isResumable`: paid entries 24 h, unpaid only 30 min. |
| `src/helpers/trails/intentStatus.test.ts` | Edited | 5 | Replaced the test that asserted the bug ("committed is watched as usual"); added tests for the 30 min cut off, unknown statuses, a known EXECUTING still watched, unpaid resume window. |
| `src/core/services/trails/checkoutTracker.ts` | New | 1, 2 | The app wide tracker: a map of running purchases, one watch each, listeners (the drawer), marks the entry paid once, calls the app handler when no listener showed the result. Loads `watchCheckout` with `import()` only when there is something to watch. |
| `src/core/services/trails/checkoutTracker.test.ts` | New | 1, 2 | 7 tests (listed under Testing). |
| `src/hooks/trails/useTrailsTracker.ts` | New | 1, 2 | Mounted in `_app`: registers the end of purchase handler (toast) and, on load, tracks every resumable saved purchase and drops the rest. |
| `src/hooks/trails/useTrailsResume.ts` | Deleted | 1, 2 | Replaced by `useTrailsTracker`. |
| `src/hooks/trails/useTrailsCheckout.ts` | Edited | 1, 2 | No longer polls. `track()` subscribes to the tracker; `reset`, `prepare` and unmount only unsubscribe. Takes `onFinal` from the drawer. `prepare` and `attachIntent` load the checkout source with `import()`. |
| `pages/_app.tsx` | Edited | 1, 2 | `useTrailsResume` to `useTrailsTracker`; the toast reads `entry?.domainLabel` (the entry can be missing). |
| `src/core/services/trails/watchCheckout.ts` | Edited | testing | Rate limit back off; unpaid window from the newest quote (`watchWindowStart`). |
| `src/core/services/trails/browserCheckoutSource.test.ts` | New | testing | 4 tests: earlier quotes kept (max 3), paid earlier quote followed, stays on newest while unpaid, no extra checks when the newest is paid. |
| `src/types/trails/checkout.ts` | Edited | testing | `TrailsIntentSnapshot` gains deposit and origin transaction; `StoredCheckout.earlierIntentIds`. |

**Testing.** Automated (Claude, 11 Nov, final): `tsc` clean, ESLint clean on changed files (two old warnings), **Vitest 92 pass** (6 files), §8 greps unchanged, no static import of the checkout source outside its own chunk. Manual results (user, 11 Nov): A pass, B pass (quiet stop at 15 min), D pass (weiwuxianlanwangji.og, POL on Polygon); C, E, G still to do.

What the user tests (full steps in the progress doc, "Review fixes"):

1. Test A (free, point 6): open the widget, pick a token, press Back. No `[trails] widget` console lines.
2. Test B (free, about 15 min, point 5): press Pay, reject in MetaMask. `GetIntent` requests stop 15 min after the newest quote, no message, entry gone from `trails-checkouts`.
3. Test C (free, point 5): reload under 15 min, polling resumes; after 15 min, no requests.
4. Test D (paid, points 2 and 4): normal purchase staying on the drawer: progress, is yours, View Receipt. First run at 0.5% slippage.
5. Test E (paid, points 1 and 2): Keep browsing, go to /history. Banner shows, is yours message appears, banner clears without reload.
6. Test F (optional, paid): Pay, Back, confirm the waiting MetaMask request later. The message still appears.
7. Test G (user's build, point 1): `npx next build` with the dev server stopped; First Load JS of /login and /profile matches the `dark-mode` branch.
8. Refund wording (point 3): only on a real refund (pending lost race run).

### Phase B: switch to the backend checkout source (after the backend ships)

> **17 Nov 2026: replaced** by `dev-docs/trails/trails-backend-integration-plan.md` (phases 0 to 10), written from the backend team's API document v2. The text below is the original outline.

Mohit's doc has two versions of the checkout source: the browser one (runs today) and a backend one (order checks, the saved purchase and status checks on our backend, endpoints such as `POST /checkouts/:id/intent`, `GET /checkouts/:id`, `GET /marketplacev2/trails/config`). Checked 11 Nov: nothing on the backend yet (`uat` latest 6 Nov, no Trails branch or endpoints). When it ships:

1. `src/core/services/trails/backendCheckoutSource.ts`: the backend version behind the same `CheckoutSource` interface (`prepare`, `attachIntent`, `getStatus`), calling the endpoints through `callBackend`.
2. `getCheckoutSource()` in `index.ts`: probe `GET /marketplacev2/trails/config` once; use the backend version when it answers, the browser version otherwise.
3. Decide with Mohit what happens to localStorage resume and the `/history` banner (the backend may list pending checkouts itself).
4. Retest on uat with both versions: paid purchase, cancel, reload, page change.

This also moves status checks off the buyers' browsers, which answers the rate limit concern (Q15).

> **Prompt:** Start Trails phase B per trails plan §4 phase B, against the backend endpoints now on uat.

### Phase 10: fixes that help both methods

After any successful purchase (direct or Trails) dispatch `api.util.invalidateTags(['domain_listing', 'domain'])` (and `all_domain_listing` if Q10 says so). Replace the reject step's `BOUGHT_SUBTEXT` with real failure copy (drafted by us, Q1); update the code comment that says it was kept as drawn.

> **Prompt:** Start Trails phase 10 per trails plan §4 phase 10.

### Phase 11: analytics

`trackEvent(name, params)` in `src/core/services/analytics.service.ts`, guarded for SSR, pushing to `window.dataLayer`. Event names and params drafted by us (Q1): one event per step (method selected, prepare failed with code, widget opened, quote, signed, succeeded, refunded, failed, resumed), each with `orderHash` and price, never wallet addresses. Fire from the hooks, not from composites.

> **Prompt:** Start Trails phase 11 per trails plan §4 phase 11 and Q7's answer.

### Phase 12: QA on uat

Run the matrix in §5. User runs `next build` once with the dev server stopped to confirm no page's First Load JS grew.

---

## 5. Test setup and QA matrix (from the doc)

Real money on Polygon mainnet (uat points there; no Trails testnet). About 0.30 USD per purchase. Listings 0.10 to 0.30 USDT, burner wallets only.

| Need | How |
|---|---|
| uat Trails key | Mohit (dashboard.trails.build), separate from prod |
| Buyer | Fresh MetaMask burner: about 2 USDC and 0.10 USD of ETH on Base. **No POL ever** |
| Listing | Team wallet lists a real Endless domain on uat for 0.10 to 0.30 USDT |
| Repeat runs | Swap buyer and seller between two team wallets |
| Lost race | Second browser buys directly with USDT first, then finish Trails |
| Executing spike | Mohit's harness `p3:setup <tokenId>` |

Definition of done (doc page 11 and 12): fixture test green; spike (a) (b) (c) recorded; regression buy, list, delist OK; real Trails buy from the no POL burner shows Done, receipt, history BUY row, My Domains, both emails; lost race shows Refunded with link; not available, cancelled signature, own listing, expiring screens seen; reload mid purchase gives a toast; light and dark, desktop and mobile, MetaMask and one WalletConnect mobile wallet; tsc, ESLint, `next build`, no First Load JS growth; flag off = today's drawer; only `trails/` folders import Trails packages.

Release rule: uat freely; prod only with the pilot list set to staff wallets and Mohit's approval.

---

## 6. Open questions

| # | Question | Blocks | Default if unanswered |
|---|---|---|---|
| Q1 | ~~Can we get "Trails Integration Plan: Marketplace Frontend"?~~ **Answered 5 Nov:** not needed (Mohit). We write the screen copy and event list ourselves and show the copy to the user before it lands; QA matrix is §5 | | |
| Q2 | ~~Which branch?~~ **Answered 5 Nov:** new branch `trails` cut from `dark-mode`, the closest to uat | | |
| Q3 | Is there a Figma frame for the third card, the widget step and the refunded screen? | 6 to 8 | Reuse `PaymentMethodCard`, `BuyResultStep`, `TransactionChecklist` styling; ask design to review |
| Q4 | Flag on with an empty pilot list: everyone, or nobody? | 1 | Everyone (uat); prod must set the list (doc's release rule) |
| Q5 | OK that `BuyFlowModal` owns `useTrailsCheckout` like it owns `useBuyFlowActions` (§8 exception 1)? | 7 | Yes |
| Q6 | OK to add Vitest (first test runner in the repo)? | 2, 4 | Yes, the doc requires it |
| Q7 | Is GTM / `dataLayer` set up anywhere? Nothing in the repo pushes to it today | 11 | Push anyway; events are dropped until GTM is added |
| Q8 | Resume watcher mounted from `pages/_app.tsx`, or the main layout? | 9 | `_app.tsx` (it already holds the toast container) |
| Q9 | What does the `/history` banner look like? | 9 | Small `NoticeBanner` above the list |
| Q10 | Also invalidate `all_domain_listing` and `recent_transactions` after a purchase? | 10 | Yes, the marketplace list uses `all_domain_listing` |
| Q11 | `PRICE_OUT_OF_RANGE` bounds? The doc lists the code but no range | 5 | Ask Mohit; skip the check until known |
| Q12 | Widget dark mode and mobile: does it theme to our tokens? | 3 | Answered by the spike |
| Q13 | `slippageTolerance` for `PreparedCheckout.route`? The doc's shape has the field but no value (added 5 Nov, phase 5) | 5, 7 | **Answered by Mohit 11 Nov: `0.005` (0.5%), as in the probe.** (Was `0.05`, the widget's own default, from 6 Nov.) **Reopened 11 Nov:** the widget ignores the value (no `slippageTolerance` in `QuoteIntent`), so Trails uses Auto. Keep Auto and report to Trails, or force it via the widget's `localStorage['trails-slippage-tolerance'] = '0.005'`? Default: keep Auto |
| Q14 | Start status checks at the first quote (today) or when the buyer presses Pay (`onSign`)? Added 11 Nov | R | Keep the first quote (safer: doesn't depend on widget events); switch only after a paid run proves `onSign` fires |
| Q15 | Is the Trails rate limit per key? Every buyer's browser checks status with the same public key (429 seen 11 Nov) | R, B | Back off is in; Phase B removes the concern |
| Q16 | Can an ABORTED intent ever have taken the buyer's money? We end never paid FAILED / ABORTED / INVALID quietly | R | Keep the quiet end; show a message if Mohit says yes |
| Q17 | Who raises the widget issues with Trails (USDT re quote after Pay over WalletConnect, status stuck on Swap, console errors)? | | Mohit |
| Q18 | Rule 1 fallback: Trails SUCCEEDED but our sale receipt never shows the buyer within 20 min. Today the drawer still shows "is yours"; the doc says Done only from our receipt. Keep, or show "Purchase confirmed, receipt delayed"? (found 11 Nov, doc check). Extra problem with keeping it: that screen's View Receipt opens `/receipt/:orderHash`, which reads the same missing sale record, so it would be empty. Recommended (user agreed 11 Nov, pending Mohit): "Purchase confirmed. Your receipt is taking longer than usual; the domain will appear in your account shortly." with a Polygonscan link instead of View Receipt; wording to the user for approval first | R | Keep until Mohit answers |
| Q20 | Same buyer pays directly and through Trails at once: rule 1 shows "is yours" (true) and Trails' REFUNDED (as USDT, minus fees) is never mentioned. Add a line, or fine as is? (found 12 Nov, check 12; status doc question 8) | R | Fine as is |
| Q21 | Receipt and "is yours" say "You paid 0.10 USDT" for a Trails purchase paid in another token (sale record has no payment method). Wait for backend `paymentMethod`, or relabel now (e.g. "Price")? Also, older than Trails: "Seller received" and fee rounded to 2 decimals. (found 12 Nov, check 2; status doc question 9) | B | Wait for the backend |
| Q19 | The doc's definition of done lists a "cancelled signature" screen. We rely on the widget's own "Try again" (`onSignReject` not used by the drawer). Enough, or draw our own screen? (found 11 Nov, doc check) | 7 | Widget's own |

---

## 7. Committing, pushing and deploy (added 5 Nov 2026)

### 7.1 `package.json` and `package-lock.json` always travel together

Phase 2 changed both. They are committed **in the same commit**, never one without the other.

| What gets pushed | What happens on the deploy server (`npm ci`) |
|---|---|
| `package.json` without the lock file | The two disagree, `npm ci` stops with an error, the deploy fails |
| Neither | The server builds without Trails, viem 2.57 or Vitest; Trails code fails once it lands |
| Both together | The server installs exactly what was tested locally |

The lock file is for **DevOps** (the deploy pipeline). The **backend team** is unaffected: the backend is a separate repo with its own packages.

### 7.2 What DevOps needs that isn't in git

`.env` is gitignored, so uat needs these three added to its AWS environment (same way `NEXT_PUBLIC_POLYGON_RPC_URL` was):

| Variable | uat value |
|---|---|
| `NEXT_PUBLIC_TRAILS_API_KEY` | The uat key from Mohit (separate from prod's) |
| `NEXT_PUBLIC_TRAILS_ENABLED` | `true` |
| `NEXT_PUBLIC_TRAILS_PILOT_WALLETS` | Empty on uat (everyone, Q4); staff wallets on prod |

They start with `NEXT_PUBLIC_`, so Next bakes them in **at build time**: the uat build must run after they are set, and changing them later needs a rebuild. Prod gets them only with Mohit's approval of the pilot (§5 release rule).

### 7.3 What goes in the first commit, and what never does

First commit (phases 1 and 2): `package.json`, `package-lock.json`, `vitest.config.ts`, `src/types/trails/`, `src/helpers/trails/`, `src/constants/trails.ts`.

Never committed: `node_modules`, `.env`, `CLAUDE.md`, `dev-docs/` (all gitignored), the phase 3 spike page (`.git/info/exclude`).

### 7.4 When

**Update 10 Nov:** phases 1 to 9 committed as `10e06fc` and pushed to `origin/trails` at the user's request. **11 Nov:** the Phase R review and testing fixes committed as `1622027` and pushed to `origin/trails` at the user's request (tests C, E, G still open). No PR yet: open one from `trails` when the user says so, after §8 is done.

Earlier (5 Nov): nothing is committed yet. Decided with the user: **wait** until the phase 2 wallet regression (direct buy, list, delist) passes, so the viem upgrade doesn't reach anyone else untested. Commit and push only when the user says so, on branch `trails`, no Claude co-author line.

---

## 8. What's left (11 Nov 2026)

> **Update 12 Nov:** every check in §9.1 is done (results: `trails-plan-12-nov.html`, progress doc "12 Nov checks"). Tests C, E, G pass; main run (no POL, Base USDC), WalletConnect purchase, not available, own listing, kill switch, look and feel, page size pass. Lost race: refund proven on chain, Refunded screen not seen (same wallet both sides). Not seen for real: the Refunded screen, the re-quote after Pay, the expiring screen. New questions Q20, Q21. Q13 evidence: Trails Auto chose `maxSlippage 0.1` (10%) on both Base USDC purchases. Items 2 to 8 below are therefore done except as noted.

Everything still to do, in one place. Details are in the sections named.

**Waiting on the backend:**
1. Phase B, switch to the backend checkout source (§4 Phase B).

**Testing (the user):**
2. Test C, reload under and over 15 min (Phase R).
3. Test E, Keep browsing during a payment, then the `/history` banner and toast (Phase R).
4. Test G, `next build` First Load JS for /login and /profile equal to `dark-mode` (Phase R).
5. A lost race / refund run (second browser buys directly first): Refunded screen, refund link, new wording (doc definition of done).
6. The doc's main run: a **no POL burner paying Base USDC** (also covers a token that needs approval): Done, receipt page, history BUY row, My Domains, buyer and seller emails.
6b. Screens seen for real: not available, cancelled signature, own listing, expiring listing (doc definition of done).
6c. **12 Nov (user):** check `/history` after the Trails purchases already made (tpenguofficial.og, westbengal.og, tawhidabdullah.og, weiwuxianlanwangji.og): a BUY row each with name, 0.10 USDT and transaction; no leftover "Purchase in progress" banner. Not checked yet.
7. Trails switched off (`NEXT_PUBLIC_TRAILS_ENABLED=false`): the drawer shows only the original cards.
8. Final light, dark, phone and tablet pass of the Trails screens.

**Decisions from Mohit, then code:**
9. Q13 slippage, Q14 when to start checking, Q15 rate limit, Q16 ABORTED, Q17 widget issues, Q18 rule 1 fallback, Q19 cancelled signature screen (§6). Status doc for him: `dev-docs/trails/trails-status-for-mohit.html`.

**Remaining phases:**
10. Phase 10, shared fixes (on hold, the user is checking with their senior).
11. Phase 11, analytics (waits on GTM, Q7).
12. Phase 12, QA matrix on uat (§5).

**Release:**
13. DevOps env vars for uat and prod (§7.2); prod only with Mohit's approval of the pilot list.
14. The "Double check before this ships" list in the progress doc (copy claims, parked items).
15. Delete the spike page when the user says so (§4 Phase 3).
16. PR from `trails` and merge (§7.4).

---

## 9. Plan for 12 Nov 2026, and the road to production

### 9.1 Tomorrow's checks, free ones first

Standalone version for the day, with steps, pass conditions and the funding request: `dev-docs/trails/trails-plan-12-nov.html`.

Before starting: dev server on 3002 with the latest `trails` (`1622027`), DevTools open on Console and Network, `localStorage.removeItem('trails-checkouts')` and a full reload. Log every result in the progress doc's Testing log (who, env, result).

| # | Check | Cost | How | Pass when |
|---|---|---|---|---|
| 1 | `/history` after the Trails purchases | Free, 5 min | Open `/history` with the buyer wallet | tpenguofficial.og, westbengal.og, tawhidabdullah.og, weiwuxianlanwangji.og each a BUY row, 0.10 USDT, right transaction; no "Purchase in progress" banner |
| 2 | Receipt, My Domains, emails | Free, 10 min | Receipt page of one purchase; My Domains of the buyer; buyer and seller inboxes | Name in My Domains, receipt shows the buyer, both emails arrived |
| 3 | Test C, reload rule | Free, 20 min | Open the widget, pick a token (don't pay), reload within 15 min; reload again after 15 min | `GetIntent` starts again the first time, nothing the second time, no message |
| 4 | Own listing screen | Free | Seller wallet ▸ Buy Now on its own listing ▸ Any token ▸ Continue | "This is your own listing" |
| 5 | Expiring screen | Free | A listing ending in under 15 min ▸ Any token ▸ Continue | "This listing ends in less than 15 minutes…", USDT still offered |
| 6 | Not available screen | Free | Open a listing in two tabs, delist it in one, continue with Any token in the other | "No longer available" |
| 7 | Cancelled signature | Free | Pay ▸ reject in MetaMask | The widget's "Try again"; no message; checks stop after 15 min (Q19 decides if we need our own screen) |
| 8 | Look and feel | Free, 20 min | Light and dark; desktop, tablet (768 to 1039) and phone widths; every Trails screen | Matches the rest of the drawer, nothing cut off, widget theme follows |
| 9 | Trails switched off | Free, needs a dev restart | `NEXT_PUBLIC_TRAILS_ENABLED=false`, restart, open Buy | Only the original payment cards; drawer identical to `dark-mode` |
| 10 | Test G, page size | Free, about 10 min, user only | Stop the dev server, `npx next build`, note First Load JS of `/login` and `/profile`; compare with `dark-mode`; restart the dev server | Same as `dark-mode` |
| 11 | Doc's main run + test E | Paid, about 0.30 USD | Fresh MetaMask burner, about 2 USDC and 0.10 USD of ETH on **Base**, **no POL**. Buy a 0.10 USDT listing with Base USDC; at "Payment in progress" press Keep browsing, open `/history` | USDC approve then pay; banner shows, then "is yours" toast, banner clears without reload; checks 1 and 2 again for this purchase. Also open "Transaction details" and the `QuoteIntent` payload (slippage, Q13) |
| 12 | Lost race | Paid, about 0.30 USD plus a 0.10 direct buy | Same listing in two browsers; buy it directly with USDT in one, then pay with Trails in the other | "Payment refunded" with refund link and the new wording; USDT back on Polygon |

Needed from others for 11 and 12 (ask in the morning; the user's wallet on 11 Nov had about 10 POL, 0.15 USD of BNB, 0.10 USD of ETH, no USDT or USDC):

1. **New burner on Base** (main run, test E, lost race): **2 USDC** (each 0.10 USDT purchase costs about 0.11 to 0.15 USDC with Trails' fee, so 3 to 4 runs plus retries) and **about 1 USD of ETH** for gas (the doc says 0.10 USD; the first USDC payment also needs an approve). **No POL on it.**
2. **User's current wallet** (the direct USDT buy in the lost race): **1 USDT on Polygon**; its 10 POL covers gas.
3. **Updated 11 Nov (later):** no listings needed from anyone. The user's Account 1 is the seller (owns the four Trails bought domains, has POL); two new MetaMask accounts, "Trails buyer" (Base USDC + ETH, no POL) and "Direct buyer" (1 USDT + a little POL on Polygon). Listings can only be 7, 30 or 90 days, so the expiring screen can't be set up and stays covered by automated tests. Steps: `trails-plan-12-nov.html` section 1.

Total about 3 to 4 USD plus three listings. The free checks need nothing extra; do them while funds arrive.

### 9.2 Road to production

Mohit's doc: the browser version is fine for uat and an **internal prod pilot** (staff wallets only), **not for general availability**; GA needs the backend.

**A. Decisions (Mohit), then code:** Q13 slippage, Q14 when to start checking, Q15 rate limit on our key, Q16 ABORTED, Q17 widget issues to Trails, Q18 rule 1 fallback, Q19 cancelled signature screen.

**B. Fix before any prod pilot:**
1. Phase 10: after any purchase the bought domain still shows for sale and My Domains looks unchanged until a reload (invalidate `domain_listing`, `domain`, Q10); the reject screen shows success text. Affects USDT buys too. On hold with the user's senior.
2. The open items in the progress doc's "Double check before this ships" box (copy claims, parked items).
3. All of §9.1 passed, plus §5's QA matrix (phase 12).

**C. Release steps:**
1. Delete the spike page (`pages/trails-spike.tsx`) when the user says so.
2. PR from `trails` to the target branch, reviewed by Mohit.
3. DevOps: the three `NEXT_PUBLIC_TRAILS_*` vars on uat and prod (§7.2), then a rebuild; prod with `NEXT_PUBLIC_TRAILS_PILOT_WALLETS` set to staff wallets, only with Mohit's approval.
4. Kill switch today = set `NEXT_PUBLIC_TRAILS_ENABLED=false` and redeploy (minutes, not instant); make sure DevOps knows.
5. A short support note: how to find a buyer's Trails purchase (intent id in `trails-checkouts`, Trails explorer, our sale record by order hash), and the MetaMask 13.55 connect bug (update the extension or use WalletConnect).

**D. For general availability (needs the backend):**
1. Phase B: backend checkout source (server tracking on any device, refund email, attach checks, soft hold, live kill switch, `paymentMethod` on sales), status checks off buyers' browsers (Q15).
2. Phase 11 analytics (GTM, Q7), so Trails vs direct sales and stuck purchases are visible until the backend has stats and alerts.
3. Drop the env pilot list once the backend switch is live (doc page 10).

