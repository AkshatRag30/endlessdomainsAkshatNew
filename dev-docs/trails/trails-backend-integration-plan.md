# Trails Checkout: Switching the Frontend to the Backend APIs

Written 17 Nov 2026 from the backend team's document "Trails Checkout: Backend APIs for Frontend Integration" (v2, prepared 16 Nov 2026), checked against the frontend `trails` branch at `1622027` and the backend `origin/uat` at `dffd15e2`. This replaces "Phase B" in `trails-implementation-plan.md` §4.

Local only, like every file in `dev-docs/`: never stage or commit it.

---

## 1. In plain words

Today the buyer's browser does everything for a Trails purchase: it checks the listing, builds the payment, asks Trails for the status, and remembers running purchases in the browser's storage. The backend has now built the same work on the server, as six APIs. This plan moves the frontend onto them, one piece at a time, so that:

1. The server decides who may use Trails (no more pilot wallet list in the env file).
2. The server checks the listing and builds the payment, so a buyer can't tamper with it.
3. Status checks go to our server, not to Trails from every buyer's browser (this ends the Trails rate limit problem, Q15).
4. A running purchase is remembered on the server, so it survives a reload, a closed tab and even a different device.
5. Refunds get an email even when the buyer closed the tab.

The screens stay the same. Buyers should not notice the switch, except where a phase says otherwise.

---

## 2. The six APIs and where they plug in

All under `{backendBaseUrl}/api/v1/marketplacev2/trails`, called through `callBackend` (`src/lib/marketplace-order-client.ts`). Amounts are USDT minor units as strings ("100000" is 0.10 USDT).

| # | API | Replaces today | Frontend place |
|---|---|---|---|
| 1 | `GET /config` | env `NEXT_PUBLIC_TRAILS_PILOT_WALLETS`, hardcoded slippage | `BuyFlowModal.tsx:264` gate, `useTrailsCheckout` |
| 2 | `POST /checkouts` (prepare) | browser order checks and call building | `useTrailsCheckout.ts:60` |
| 3 | `POST /checkouts/:id/intent` (attach) | saving the quote in localStorage | `useTrailsCheckout.ts:108`, `BuyFlowModal.tsx:811` |
| 4 | `GET /checkouts/:id` (status) | browser polling of Trails (`trailsReceipt.service.ts`) | `watchCheckout.ts:31` |
| 5 | `GET /checkouts?status=&limit=` (list) | localStorage store (`checkoutStore.service.ts`) | `useTrailsTracker.ts`, `useTrailsPendingCheckouts.ts`, `HistoryTrailsNotice.tsx` |
| 6 | `GET /marketplacev2/orders/transactions/:orderHash` (changed) | gas figures on the receipt | `useTransactionReceipt.ts`, `orderDetails.ts:144`, `OrderReceiptCard.tsx:56` |

APIs 1 to 5 and the two attach changes are on uat now. API 6 arrives only after the next production release.

---

## 3. What we found when checking the document (17 Nov)

The document's file references, data shapes, the eight statuses and the error codes all match our code. These need action:

| # | Finding | Who | What we do |
|---|---|---|---|
| F1 | **Refund shown as "is yours".** The backend copied our rule 1: if the same wallet owns the domain, the checkout counts as succeeded even when Trails refunded the payment (`trails-tracker.rules.ts:132`, `trails-checkout-state.mapper.ts`). On the server this also skips the refund email and counts the refund as a sale. Same case as the 12 Nov check 12. | Backend | Ask them to count success only when the sale's transaction is the Trails destination transaction (`destinationTxHash`). Phase 8 waits on it. |
| F2 | **Resume advice would show unpaid quotes as "in progress".** The document says list `attached,executing`; `attached` means only quoted, not paid. | Frontend | Use `executing,failed` (failed can still become refunded). |
| F3 | **Slippage does nothing.** The document says keep passing 0.005; on 12 Nov the widget's quote request had no slippage field, so the value is ignored. | Mohit (Q13) | Keep passing it, don't promise buyers any protection from it. |
| F4 | `/config` timing contradicts itself: "call when the drawer opens" vs "`getCheckoutSource()` calls it once". | Frontend | Read `/config` each time the drawer opens; `getCheckoutSource()` doesn't read it. |
| F5 | Attach now returns `{ status, intentId }` but our `CheckoutSource.attachIntent` returns nothing. | Frontend | Change the contract (phase 1). |
| F6 | `/config` returns min and max price; the document doesn't say to use them. | Frontend | Hide the option for listings outside the range, instead of failing after the click. |
| F7 | 401 on the status API (login expired while waiting) has no action in the document. | Frontend | Never treat it as expired; keep the purchase tracked and ask the buyer to log in again. |
| F8 | New error `ALREADY_ATTACHED`. | Frontend | Add to the error codes, log only. |
| F9 | **Polygon USDT payments always refused (found in phase 4 testing, 17 Nov).** When the buyer pays with USDT on Polygon, nothing needs swapping or bridging, so Trails puts our three calls in `originCalls` and leaves `destinationCalls` and `quote.routeProviders` empty. The backend verifier (`intent-verifier.ts` on uat dffd15e2) only reads `destinationCalls` (line 69, check 3, needs exactly three calls) and needs `routeProviders` (line 141, check 8), so every such checkout ends as mismatch. Our frontend sends the same calls for every token; this is a case the verifier doesn't handle yet, not a mistake in either codebase. | Backend and Mohit (Q27) | Two ways to fix it, see **F9 options** below. Until one is chosen, test with tokens other than Polygon USDT/USDT0, and either wait for the fix before deploying or ship with `NEXT_PUBLIC_TRAILS_SOURCE=browser`. |

**F9 options (for Q27):**

1. **Backend accepts the same chain shape.** When the payment chain is Polygon (origin chain = destination chain), the verifier reads the three calls from `originCalls` instead of `destinationCalls`, and skips check 8 (`routeProviders`), since no route exists for a same chain payment. All other checks (amount, buyer, sweep target, time) stay as they are. Frontend change: none. Buyers keep the option to pay USDT on Polygon through Trails.
2. **USDT on Polygon doesn't go through Trails at all.** A buyer holding USDT on Polygon already has exactly what the order needs, so the normal "USDT from your wallet" option is the right path for them, and it is cheaper (no Trails fee). The frontend hides Polygon USDT and USDT0 from the Trails widget's token list (and, if the widget can't hide them, shows a short message pointing to the USDT option). Backend change: none, or optionally a clearer error code than mismatch for this case. Frontend change: small, in the widget settings and the pay step.

Our suggestion: option 2 is quicker and gives the buyer the cheaper path; option 1 is the more complete fix if the team wants Trails to accept every token. **Not checked yet (test T18):** whether other tokens on Polygon (POL, USDC) have the same shape. They need a swap but no bridge, so Trails may also put the calls in `originCalls`. If they do, option 2 alone isn't enough (we'd have to hide every Polygon token) and option 1 becomes the real fix. Test one 0.10 purchase with POL or USDC on Polygon on the server path before choosing.

Send F1, F2 and F3 to the backend team and Mohit before phase 5. A short note is in §7.

---

## 4. Phases

Every phase: its own small commit on `trails` (only when the user says commit), `npx tsc --noEmit`, eslint on changed files, Vitest for every touched helper and service, the §8 layering greps, and an update of `trails-backend-progress.html` after the phase: status table, phase log (in plain words, files), findings, decisions, open questions, files list, and a Testing log entry (who tested, how, environment, result, what wasn't covered). Never start or build servers; check through the user's dev server on 3002 against the stage API. New wording for buyers is shown to the user before it lands.

### Phase 0: confirm the APIs are live (no code)

1. With the user's logged in session on stage, call `GET /config` (no login needed) and, with a token, `GET /checkouts?limit=5`, to confirm both answer in the documented shape.
2. Send the §7 note (F1 to F3) to the backend team and Mohit.
3. Get answers to Q22 to Q26 (§6), or accept the defaults.

**Done when** both calls answer as documented and the note is sent.

**Status 17 Nov: done, except sending the note.** All five routes answer as documented on stage (list with the user's login: 200, empty). `/config`: available to everyone on stage, minimum price 0.10 USDT, no maximum. Q22 to Q26 set aside by the user; defaults stand. Logged in `trails-backend-progress.html`.

> **Prompt:** Start Trails backend integration phase 0 per `dev-docs/trails/trails-backend-integration-plan.md` §4: confirm `GET /marketplacev2/trails/config` and `GET /marketplacev2/trails/checkouts` answer on the stage API as documented, show me the responses, and draft the §7 note.

### Phase 1: contract and types (no behaviour change)

1. `src/types/trails/checkout.ts`:
   1. `attachIntent` returns `Promise<AttachResult>`, with `AttachResult = { status: CheckoutStatus; intentId: Hex | null }`.
   2. Add `'ALREADY_ATTACHED'` to `CheckoutErrorCode`.
   3. Add `CheckoutListItem` (API 5 row) and `TrailsServerConfig` (API 1 result: `enabled`, `available`, `minPriceUsdt`, `maxPriceUsdt`, `route`).
2. `browserCheckoutSource.ts`: return `{ status: 'attached', intentId }` from attach, so it keeps working as the fallback.
3. `useTrailsCheckout.ts`: pass the attach result up (not used yet).

**Done when** tsc and all existing Trails tests pass with no change on screen.

**Status 17 Nov: done (uncommitted).** 93 tests. Logged in `trails-backend-progress.html`.

> **Prompt:** Start Trails backend integration phase 1 per the plan §4: update the CheckoutSource contract (attach result, ALREADY_ATTACHED, list and config types), keep the browser source working, no screen changes.

### Phase 2: the backend checkout source

1. `src/core/services/trails/trailsBackend.service.ts` (the only file that calls the five Trails routes): `getTrailsConfig()`, `prepareCheckout(orderHash)`, `attachCheckoutIntent(id, intentId)`, `getCheckoutState(id)`, `listCheckouts(statuses, limit)`, all through `callBackend`, reading `result`.
2. `src/helpers/trails/checkoutError.ts`: a pure `toCheckoutError(err)` that turns a `BackendError` code into a `CheckoutError` (unknown code or 5xx becomes `CHAIN_UNAVAILABLE`, 429 becomes a rate limit the watcher already backs off from, 404 "Checkout not found" becomes expired).
3. `src/core/services/trails/backendCheckoutSource.ts`: implements `CheckoutSource` with the service; `prepare` ignores the `buyer` argument (the server uses the verified wallet) but checks the returned `buyer` equals the connected wallet and throws `WALLET_NOT_VERIFIED` if not.
4. `src/core/services/trails/index.ts`: `getCheckoutSource()` returns the backend source, or the browser source when `NEXT_PUBLIC_TRAILS_SOURCE=browser` (rollback switch until production is proven, Q22).
5. Vitest for the service (mocked `callBackend`) and the error mapping.

**Done when** the tests pass and, with the switch on `browser`, nothing changes.

**Status 17 Nov: done (uncommitted).** 110 tests. Default is the browser source until phases 3 to 6 are done (only `NEXT_PUBLIC_TRAILS_SOURCE=backend` turns the new path on); flip the default at the end of phase 6. Logged in `trails-backend-progress.html`.

> **Prompt:** Start Trails backend integration phase 2 per the plan §4: add trailsBackend.service.ts, backendCheckoutSource.ts and the error mapping, with tests, and the `NEXT_PUBLIC_TRAILS_SOURCE` rollback switch.

### Phase 3: who sees the option (API 1)

1. `useTrailsCheckout` reads `GET /config` each time the drawer opens (it's `no-store`; this stays inside the drawer's own hook, so no new layering exception, plan Q5).
2. The "Any token, any chain" card shows only when `available` is true **and** the listing price is within `minPriceUsdt` and `maxPriceUsdt` (F6). While `/config` is loading or fails, the option stays hidden (the server fails closed, so do we).
3. `checkoutGate.ts`: `isTrailsAvailable` takes the server config instead of the pilot list; `NEXT_PUBLIC_TRAILS_ENABLED` stays as our own kill switch and `NEXT_PUBLIC_TRAILS_API_KEY` stays for the widget. `NEXT_PUBLIC_TRAILS_PILOT_WALLETS` is no longer read.
4. The widget gets `route` from the prepared checkout (already the case at `TrailsWidget.tsx:54`; the value now comes from the server).

**Done when** the option appears for a wallet the server allows, disappears for one it doesn't, and disappears for a listing outside the price range. Light and dark, phone and desktop.

**Status 17 Nov: done (uncommitted), 114 tests; user checked in the browser: shown at 0.10 USDT and above, hidden below.** Logged in `trails-backend-progress.html`.

> **Prompt:** Start Trails backend integration phase 3 per the plan §4: gate the Trails option on GET /config (available plus price range), drop the pilot list env, keep the kill switch.

### Phase 4: starting a purchase (APIs 2 and 3)

1. Before `prepare` (`BuyFlowModal.tsx:500`): `ensureWalletVerified(signer, { onVerifying })`, with the existing "sign a message" step shown only when a signature is really coming. On `WALLET_NOT_VERIFIED` from the server, retry once with `force: true`.
2. Prepare errors reuse today's screens by code: `ORDER_NOT_FILLABLE` (no longer available), `OWN_LISTING`, `EXPIRING_SOON`, `PRICE_OUT_OF_RANGE`, `TRAILS_DISABLED` (hide the option), `CHAIN_UNAVAILABLE` (try again). New: `CHECKOUT_IN_PROGRESS` needs a line such as "Someone else is paying for this domain right now. Try again in a couple of minutes." (wording to the user first).
3. Attach on every widget quote, as today, now reading the result:
   1. `mismatch`: stop and show the error screen.
   2. `expired` with `intentId: null`: show the expired screen with a button that prepares again.
   3. Anything else: carry on (a bad late quote no longer spoils a good one).
   4. `ALREADY_ATTACHED` (409): log only, keep tracking the paid checkout (F8).

**Done when** a real purchase starts and pays on uat, and each error screen was triggered once (own listing, delisted listing, second tab quote).

**Status 17 Nov: code done (uncommitted), 115 tests; wording approved by the user (Mohit's approval recorded as a question in the progress doc); browser checks pending, they need `NEXT_PUBLIC_TRAILS_SOURCE=backend`.** Logged in `trails-backend-progress.html`.

> **Prompt:** Start Trails backend integration phase 4 per the plan §4: verify the wallet before prepare, map the prepare errors, handle the attach result (mismatch, expired, ALREADY_ATTACHED). Show me any new wording first.

### Phase 5: status (API 4)

1. `watchCheckout.ts` polls `GET /checkouts/:id` through the backend source. The server refreshes from Trails when its data is older than 5 s, so poll every 5 s, then every 15 s after 5 minutes (was 3 s).
2. 404 "Checkout not found": treat as expired (as today).
3. 401 (login expired): don't end the purchase. Pause polling, show "Log in again to see your purchase status", resume after login (F7). The server keeps tracking meanwhile and emails a refund.
4. Rule 1 now comes from the server's `sale` field; our own `toCheckoutState` is no longer used on the backend path (keep it for the browser fallback).
5. `trailsReceipt.service.ts` is no longer called on the backend path.

**Done when** a paid purchase goes from paying to "is yours" on the backend status alone, and a forced 401 (expired cookie) doesn't show a failure.

**Status 17 Nov: code done (uncommitted), 120 tests; login message approved by the user (Mohit pending, W5). Needs a real payment to check (T5, T6 in the progress doc).** Logged in `trails-backend-progress.html`, which now also lists every problem we hit (P1 to P13) and every test still owed (T1 to T16).

> **Prompt:** Start Trails backend integration phase 5 per the plan §4: poll GET /checkouts/:id for status, handle 404 and 401, stop calling Trails from the browser on the backend path.

### Phase 6: resume after reload and the /history banner (API 5)

1. On app load (`useTrailsTracker`), when logged in: `GET /checkouts?status=executing,failed&limit=20` and track each (F2). Unpaid quotes (`attached`) are not resumed: nothing was paid.
2. `/history` banner (`useTrailsPendingCheckouts`, `HistoryTrailsNotice`): the same list, `executing` only, using `domainName` and `amount` from the API.
3. "Finished while you were away" toasts: the server list has no "already shown" flag. Keep a small localStorage list of checkout ids this browser has already shown a result for, so a result is shown once (Q23).
4. `checkoutStore.service.ts`: no longer used on the backend path (kept for the browser fallback until phase 9).

**Done when** a purchase paid in one tab shows as in progress after a reload, in a second browser logged into the same account, and on /history; its result is shown once.

**Status 17 Nov: code done (uncommitted), 126 tests; server path is now the default (`NEXT_PUBLIC_TRAILS_SOURCE=browser` rolls back). Needs a real payment to check (T5, T8, T9, T10, T17). Deploy depends on F9 (see the progress doc).** Logged in `trails-backend-progress.html`.

> **Prompt:** Start Trails backend integration phase 6 per the plan §4: resume and the /history banner from GET /checkouts (executing and failed only), show each finished result once.

### Phase 7: receipt network fee note (API 6, after the production release)

1. `useTransactionReceipt.ts` and `MarketplaceRecentTransactionRow`: `gasUsed` and `effectiveGasPrice` may be null; add optional `networkFeeNote`.
2. `orderDetails.ts:144`: carry `networkFeeNote` into the order.
3. `OrderReceiptCard.tsx:56`: when present, show it as the Network fee row. Today our receipt never shows a Network fee number for real orders, so there's no 0 or NaN risk.
4. Check the backend's wording ("Network fee: included in the Trails fee") with the user before showing it.

**Done when** a Trails sale's receipt shows the note and a direct sale's receipt is unchanged. Only after API 6 is on uat.

> **Prompt:** Start Trails backend integration phase 7 per the plan §4 once API 6 is on uat: nullable gas fields and the network fee note on the receipt.

### Phase 8: refund wording and the same wallet case (waits on F1)

1. `src/data/trails/copy.ts`: the refund screen and toast say the listing changed before the payment arrived (bought, cancelled, expired or changed), matching the refund email; never "the domain was sold". Exact text to the user first.
2. After the backend fixes F1: when a wallet bought the domain directly and its Trails payment was refunded, the server returns `refunded`; the screen shows the refund. Check whether it should also say "You already own it". This answers Q20.

**Done when** the user approved the text and the 12 Nov check 12 (same wallet, two tabs) shows the refund screen and sends the refund email.

> **Prompt:** Start Trails backend integration phase 8 per the plan §4: new refund wording (show me first), and retest the same wallet race once the backend fix F1 is on uat.

### Phase 9: clean up (after production is proven)

1. Remove the browser path: `browserCheckoutSource.ts`, `orderChecks.service.ts`, `trailsReceipt.service.ts`, `checkoutStore.service.ts` (except the "shown once" list), their tests, and the `NEXT_PUBLIC_TRAILS_SOURCE` switch.
2. Remove `NEXT_PUBLIC_TRAILS_PILOT_WALLETS` from env files and tell DevOps.
3. Check the bundle: the drawer chunk should get smaller (the Seaport encoder and order checks leave the browser).
4. Update `trails-implementation-plan.md` and `trails-backend-progress.html`.

**Done when** the user says production is stable, and the bundle and tests are clean.

> **Prompt:** Start Trails backend integration phase 9 per the plan §4: remove the browser checkout path and the pilot env, check the bundle size.

### Phase 10: QA on uat with real money

Small listings (0.10 to 0.30 USDT), burner wallets, the stage API, Polygon mainnet. Repeat the 12 Nov checks on the backend path, plus the new cases:

| # | Case | Expect |
|---|---|---|
| 1 | Wallet not on the allowed list (server) | No Trails option |
| 2 | Listing below the minimum price | No Trails option |
| 3 | First purchase on a session not wallet verified | Sign a message, then the widget |
| 4 | Main run: no POL, pay in USDC on Base | "is yours", receipt, emails |
| 5 | Second buyer opens the same listing while the first pays | "Someone else is paying" |
| 6 | Quote, wait 16 minutes, then pay | Expired screen, start again works |
| 7 | Pay, close the tab, reopen later | Result shown once; refund email if refunded |
| 8 | Pay on laptop, open the site on phone (same account) | In progress on /history |
| 9 | Login expires during payment | No failure screen; status after logging in |
| 10 | Lost race to another wallet | Refund screen and refund email |
| 11 | Same wallet pays directly and through Trails (after F1) | Domain owned, refund shown and emailed |
| 12 | `NEXT_PUBLIC_TRAILS_SOURCE=browser` | The old path still works (rollback) |

Each run is logged in the Testing log with who, where, the result and what wasn't covered.

---

## 5. Order and what waits on whom

| Phase | Waits on | Size |
|---|---|---|
| 0 | Stage API up | Small |
| 1, 2 | Nothing | Medium |
| 3, 4 | Phase 2 | Medium |
| 5 | Phase 2; better after F2 is acknowledged | Small |
| 6 | Phase 5; Q23 | Medium |
| 7 | API 6 on uat (after the production release) | Small |
| 8 | F1 fixed on the backend; wording approved | Small |
| 9 | Production proven | Small |
| 10 | Phases 1 to 6 (7 and 8 when ready) | Two sessions of real money tests |

---

## 6. Open questions

| # | Question | Default if unanswered |
|---|---|---|
| Q22 | Keep the browser path behind `NEXT_PUBLIC_TRAILS_SOURCE=browser` as a rollback until production is proven? | Yes, removed in phase 9 |
| Q23 | Show "finished while you were away" results once per browser (small localStorage list), or once per account (needs a backend "seen" flag)? | Once per browser |
| Q24 | Same branch `trails`, or a new branch from it? | Same branch, one commit per phase |
| Q25 | Wording for `CHECKOUT_IN_PROGRESS`, the 401 message and the refund text | Drafts in phases 4, 5 and 8, shown to the user first |
| Q26 | Status poll interval: 5 s then 15 s after 5 minutes, matching the server's 5 s refresh? | Yes |
| Q13 | Slippage (still open with Mohit, see F3) | Keep passing the value; no buyer facing promise |
| Q20 | Same wallet race (now F1 on the backend) | Wait for the backend fix |
| Q21 | "You paid 0.10 USDT" for a Trails sale | Wait for the backend `paymentMethod` |
| Q27 | F9: should the backend accept same chain Polygon USDT payments (option 1), or should the frontend keep Polygon USDT out of Trails and send those buyers to the USDT option (option 2)? | Option 2 if no answer before deploy, since it needs no backend change |
| Q28 | A2 (18 Nov check): keep watching a `failed` checkout longer than 20 minutes so a late refund shows on screen, or rely on the refund email? | Keep 20 minutes; the email covers it |

---

## 7. Note for the backend team and Mohit (draft)

1. **Refund shown as success when the same wallet bought directly.** `toCheckoutState` and `toStateFromRow` mark a checkout succeeded whenever a sale of that listing to the buyer exists. If the same wallet bought it directly and Trails refunded this checkout, the row ends as succeeded: no refund screen, no refund email (`onRefunded` is skipped), and admin stats count a sale. Suggested rule: succeeded only when the sale's transaction equals the checkout's `destinationTxHash`; otherwise keep Trails' status.
2. **Resume list:** the document suggests `status=attached,executing`. `attached` is an unpaid quote, so we'll use `executing,failed`. Please confirm nothing else is needed.
3. **Slippage:** the widget ignores `slippageTolerance` (no such field in its `QuoteIntent` request on 12 Nov), so 0.005 has no effect today.
