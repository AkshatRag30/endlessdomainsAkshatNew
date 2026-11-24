# Bulk Listing v2: Implementation Plan (one signature, on chain delist)

Planned 18 Nov 2026 for the week of 23 Nov. Owner: Akshat (alone). The multi chain frontend work (C1 to C9) is the other frontend developer's, separately.

Source: Mohit's "Bulk Listing and Multi Chain Marketplace: Backend and WebUI Requirements" (10 Nov 2026, PDF), called **the requirements** below. This plan covers its **Phase 1, bulk listing for UD on Polygon, frontend tickets F1 to F9**. Backend tickets B1 to B8 are the backend developer's; webui W2 is the webui developer's. Mohit is away this week.

Builds on: branch `bulk-list` (`5968cbc` "Bulk listing on My Domains", plus two dark mode merges), the first plan `bulk-listing-implementation-plan.md` and its progress log `bulk-listing-progress.html`. Every phase below is logged in that same progress file, in a new section "v2: one signature (Nov 2026)".

---

## 1. In plain words

Today the bulk drawer asks the wallet to sign **once per name** (up to 50 popups) and posts each order separately. Seaport can accept **one signature for many orders**: the orders become the leaves of a small tree, the wallet signs the tree's root once, and each order carries its own proof that it belongs to that root. v2 switches the drawer to that, posts the whole batch to one new backend endpoint, keeps per name signing as a fallback for wallets that can't do it, and adds delisting **on chain** (one Seaport `cancel` transaction for one or many listings) so a delisted order can no longer be bought.

What changes for the seller:

| Today on `bulk-list` | After v2 |
|---|---|
| Up to 50 signature popups | 1 approval at most (per contract), then 1 signature |
| Each order posted on its own | One post for the batch; names that fail are shown with the reason and can be retried without signing again |
| Three pricing modes (one is dead) | Two: same price for all, set each myself |
| Orders end 1 day before the domain expires | 7 days; names with under 14 days left can't be listed |
| Approval step reuses the single listing hook; gas is a mock | Approval per (chain, contract) with a real gas estimate |
| Delist only hides the order on our server | One on chain cancel for one or many, with "Cancelling", "Cancelled" and "Cancel not confirmed" |

## 2. What stays out

1. Backend (B1 to B8): built by the backend developer. **B1 to B7 are merged into uat and live on the uat server since 19 Nov (PR #1024)**, so we build against the real endpoints, no mocks (§5). Only B8 is left: one real Trails test buy of a bulk signed order before launch (phase 10).
2. Multi chain (C1 to C9): the other developer. We only make sure bulk listing doesn't block it (§6).
3. Webui W2 ("List several" entry in webui): webui developer; we only make `?bulk=1` open select mode (phase 7).
4. Auctions, offers, bulk buy: out of scope in the requirements.

## 3. Rules for every phase (from CLAUDE.md and memory)

1. **Layering (§8):** the tree and signature code are pure helpers in `src/helpers/my-domains/` (no network, no React); every backend call lives in `src/core/services/my-domains/`; hooks fetch; composites only draw. Run the §8 greps before calling a phase done.
2. **Dark mode (§7):** role tokens only; check light and dark at phone, tablet and desktop.
3. **Checks:** `npx tsc --noEmit`, `npx vitest run`, `npx eslint` on changed files, and the user's dev server on 3002. Claude never runs `next build` or starts servers; a production build check uses the separate copy method in memory.
4. **Wording:** every new or changed line of copy is shown to the user before it lands.
5. **Git:** commit only when the user says, no Claude co-author line; CLAUDE.md and dev-docs stay out of git.
6. **Log:** after each phase, update `bulk-listing-progress.html`: an "In plain words" part, files, tests, and a testing log (automated vs manual, who, environment, result, gaps). Claim manual results only when the user confirms them.

## 4. Phases

Rough sizes for one developer: about a week for phases 0 to 9. Phase 10 needs the Trails test buy (B8). Since 19 Nov nothing waits on the backend; phase 8 still waits on Mohit's answer to V7 for price cuts.

### Phase 0: messages and decisions (no code, Monday morning)

1. ~~Ask the backend developer for the B1, B5 and B7 shapes.~~ Not needed: the backend went live on uat on 19 Nov and the shapes are read from its code (§5). The smaller questions left for Guru are on the review page.
2. Ask the other developer to agree on the shared files in §6 (bulk listing merges first).
3. Answer the open questions in §8 that block phase 2 (V1, test fixtures).

### Phase 1 (F1): rebase `bulk-list` onto current uat

**Why first:** the branch was last merged with dark mode on 29 Oct; everything else builds on a clean base.

1. Rebase `bulk-list` onto `origin/uat`, keeping the `listingOrder.ts` refactor. List every conflict and how it was resolved.
2. Trails merged into uat on 18 Nov (PR #237), so this one rebase covers both halves of F1 (onto uat, and onto Trails).
3. Regression on 3002: single listing, single delist, bulk select mode, the current per name bulk flow on 2 names (real, low value names), dark and light.

**Done when:** tsc, tests and lint pass; the existing bulk flow works exactly as before on the new base.

### Phase 2 (F2, part 1): the bulk signature as pure helpers

New `src/helpers/my-domains/bulkOrderTree.ts` (and its test), using the existing `EIP712_TYPES`, `seaportDomain`, `computeOrderHash` from `src/lib/seaport-order-builder-v5.ts`:

1. Tree height `h = max(1, ceil(log2(n)))`; pad the leaves to `2^h` with an **empty** OrderComponents (all zero fields), as Seaport.js does. Cap 50 gives `h = 6` (64 leaves).
2. The EIP712 type for each height: `BulkOrder` with field `tree` of type `OrderComponents[2][2]...` (one `[2]` per level), built in code from Seaport.js's `Eip712MerkleTree` logic, never typed by hand.
3. The tree value to sign (nested pairs of OrderComponents) and the root.
4. Per order signature: 64 byte compact signature (EIP 2098), then the 3 byte leaf index, then `h` proof hashes of 32 bytes.
5. Local verification: for each order, rebuild the root from its proof and recover the signer from `keccak256(0x1901 ‖ domainSeparator ‖ keccak256(bulkOrderTypehash(h) ‖ root))`; it must equal the seller (mirrors today's `verifyTypedData` check).
6. Tests: heights 1, 2 and 6 (2, 4 and 50 orders), against fixtures produced by Seaport.js (question V1), plus the backend's B2 vectors once shared. A test that a tampered proof or a wrong leaf index fails verification.

**Done when:** our signatures for 2, 4 and 50 orders match Seaport.js's and verify locally. Nothing on screen changes yet.

### Phase 3 (F2, part 2; F6 item 4): sign once, publish once

1. New `src/core/services/my-domains/bulkOrders.service.ts`: `POST /marketplacev2/orders/bulk` with `{ chainId, orders: [{ parameters, signature, domainName }] }`, answer `{ batchId, results: [{ domainName, orderHash, status, code, message, batchId, olderOrderHashes? }] }` (§5). **Real endpoint on uat, no mock.** The automated tests pass a fake post function into the batch logic instead of an env switch, so cases that are hard to trigger for real (all rejected, 503, 429) are still covered.
2. `useBulkListingActions`: build every order (counter and block time read once, as today), sign once with the phase 2 helpers, verify locally, keep the signed batch **in memory**, then post. Progress: "Preparing orders", "Waiting for signature", "Publishing".
3. Results per name on the existing "N of M are live" screen. `DUPLICATE_ORDER` on a retry counts as listed. A failed post retries the **post only**, never a new signature. `CHEAPER_ORDER_STILL_VALID` shows per name (the cancel prompt comes in phase 8).
4. Replace the per name loop in `bulkSigning.ts` as the main path (keep it for phase 4's fallback).
5. Tests: batch rules (all listed, some rejected, duplicate on retry, post failure then retry without signing).
6. **Wallet proof when the drawer opens** (V8, agreed 19 Nov): run the `ensureWalletVerified` check as the drawer opens, so the List click asks for exactly one signature (acceptance criterion 1).
7. **All rejected:** `BATCH_ALL_REJECTED` is an error that still carries `results`; read them from the error body and show the per name reasons, never a generic error.
8. **Speed limit:** a 429 from the 10 a minute throttle shows a friendly "wait a moment and try again" (wording to approve), and the retry button can't fire again while a post is in flight.
9. **Several wallets** (V9, answered 20 Nov): not needed. The only second wallet an account can link is a Solana one, and its names aren't Polygon, so they can't be picked.
10. **Real test on uat:** list 2, then 10, low value names; they appear as listed on My Domains and the marketplace. Delist them afterwards with today's delist (still off chain until phase 8).
11. **Done 20 Nov: merged uat in** (`git pull origin uat`, merge commit 4da0b6c, no conflicts, tsc clean) to pick up Guru's Bulk Listing Testing page (`pages/bulk-listing-testing`, `src/bulk-listing-testing/`, `scripts/bulk-signing-check.ts`, PRs #238 to #240). From now on uat is merged in, not rebased: the phase 1 cleanup is done, so a rebase would only add a force push.
12. **Use his page as the reference, never import from it.** `src/bulk-listing-testing/bulkSigning.ts` is his ethers 5 port: same tree, same full type hash as ours. He sends the 65 byte signature, we send 64 (both accepted). His `actions.ts` (verify wallet, sign, check locally, post, retry the same body, re verify once on `WALLET_NOT_VERIFIED`) and `api.ts` `CODE_HINTS` are a good checklist for our batch logic and error wording. It is a test only folder and may be deleted, so nothing in our code depends on it. Open `/bulk-listing-testing` on localhost:3002 to compare a batch and read the raw answers.

**Done when:** on uat, listing 2 and 10 names asks for one signature and one post, the names show as listed, and a retry asks for no new signature. The batch rules pass in the tests.

**Status (20 Nov):** built and tested on uat with MetaMask (8 names, one signature, 5 listed, 3 refused with `CHEAPER_ORDER_STILL_VALID` because of old off chain delists, expected until phase 8). V8 done: List stays disabled until the wallet is verified. Still to try by hand: a cancelled signature, a real failed post and retry, Phantom, 50 names. Not committed.

### Phase 4 (F3, F9 smart wallet part): fallback and wallet matrix

1. When the bulk signature fails for a reason other than the seller rejecting it, offer **"Sign each name separately"**, which runs the existing per name path through today's single order endpoint.
2. Smart contract wallet (decision 10): if the connected address has code on chain, don't start; show a clear message (wording to approve). Code starting `0xef0100` is an EIP 7702 delegation on a normal wallet, which signs normally: treat it as a normal wallet, not a smart wallet.
3. Wallet test matrix in the progress doc: MetaMask, Rabby, Coinbase Wallet, Trust, Ledger through MetaMask, one WalletConnect phone wallet. Columns: 2 names, 50 names, fallback offered and works, notes. Fill what we can test (question V2). **We have MetaMask and Phantom (V2, 19 Nov).** Phantom is not on the requirements' list; Rabby, Coinbase Wallet, Trust, Ledger and a phone wallet are gaps. **This does not yet meet acceptance criterion 1 (MetaMask, Rabby and Coinbase Wallet).** Rabby and Coinbase Wallet are free browser extensions; installing both with a test wallet would close it.

**Done when:** a wallet that fails the bulk signature can still list through the fallback; the matrix exists with every wallet we have.

**Status (20 Nov):** built, not committed. Items 1 and 2 done (the fallback is also offered when the local check fails, i.e. the wallet hashed the message differently), plus a network check at List time (phase 3 Check 3 gap). Item 3: the matrix exists in the progress log; Phantom, Rabby and Coinbase marked **not tested** by the user (the domain owning account is not in them); Trust, Ledger, WalletConnect not set up. MetaMask checked 20 Nov (cancel, network switch caught by the banner, 2 names in one popup and both listed). The fallback is proven by tests only.

### Phase 5 (F4, F6 items 1 to 3, F8): drawer fixes and copy

**Status 23 Nov: built and tested on uat (bulk drawer, MetaMask), not committed.** Wording approved as `wording/phase5-wording.html` (A to G, E2: a working Cancel that throws a late signature away). Details: progress log, "v2 Phase 5".

1. **F4:** remove the "percentage of model estimate" option from `BulkPricingOptions` and the estimate column from `BulkNamesList`.
2. **F6:** fee label from the configured fee bps (not the text "2.5%"); the form and success screen show the **signed** `endTime` (block time based), not `Date.now()`, and name the names cut short by their expiry; the reject prompt's "remaining" count leaves out names that will be skipped.
3. **F8:** fix the design issues listed in the requirements (dates, fee math, success copy that talks about ownership transfer, "Approving" title on the signing screen and "Cancel in wallet" button, "Approve once, list forever", "cancelling is free" now that delist costs gas, auction copy, partial success state, selection styles). Every wording change shown to the user first; each fix listed in the progress doc.
4. CTA: "Approve, then list N" when any approval is missing, otherwise "List N".

**Done when:** the drawer's fee, "you receive" and expiry equal the signed values exactly (acceptance criterion).

### Phase 6 (F5): approvals per contract

**Status 23 Nov: built, part A (wrong network) tested on uat with MetaMask, not committed.** Built in full on the user's choice (multi chain will reuse it). Wording approved as `wording/phase6-wording.html` (A to F). New: `constants/nftContracts.ts`, `helpers/my-domains/nftApprovals.ts` (+ tests), `hooks/my-domains/useNftApprovals.ts`, `types/my-domains/approvals.ts`. Details: progress log, "v2 Phase 6".

> Noted 20 Nov (phase 4 test): with the site on Ethereum the bulk List button reads "Approve, then list N", because today's approval check reads through the wallet's current network. The new approval hook must read `isApprovedForAll` on the listing's chain (Polygon) directly.

1. New `src/hooks/my-domains/useNftApprovals.ts`: group the batch by (chainId, contract), read `isApprovedForAll(seller, Seaport)` for each, return only the missing ones with a real gas estimate (`estimateGas` on `setApprovalForAll`, priced with the current gas price).
2. The approval step lists each missing contract with its chain and estimated gas, and sends one `setApprovalForAll(Seaport, true)` per missing contract. Replace the `useListingFlowActions(domains[0])` reuse.
3. Today every name is UD on Polygon, so in practice this is one contract; the hook is written for many so multi chain can reuse it.
4. Tests for the grouping and "already approved" skipping.

**Done when:** an approved seller goes straight to signing; an unapproved one approves once.

### Phase 7 (F9): product rules, select mode, deep link

**Status 24 Nov: built, automated checks pass, manual test not reported, not committed.** Wording approved as `wording/phase7-wording.html` (A to F, D1; part C corrected to "pick the chain in the filter first" after checking the PDF). Expiry read on chain (V10 decided). Details: progress log, "v2 Phase 7".

1. **Decision 8:** orders end **7 days** before domain expiry (`bulkDurationSeconds`, was 1 day); names with under **14 days** left are not eligible: disabled Select with the reason on hover.
2. Ineligible reasons per row (requirements step 1): listed, sold, expired, expiring within the window, chain not enabled, no token id.
3. **Decision 2:** a batch holds names from one chain only. Select mode needs a single chain filter; Select All and the banner count only that chain. (Only Polygon is enabled today, so this mostly prepares for multi chain; coordinate with the other developer, §6.)
4. Esc exits select mode (check it already does).
5. `?bulk=1` on My Domains opens select mode, for webui's W2 entry.
6. Tests for the eligibility rules and the 7 and 14 day limits.

**Done when:** the rules above hold in tests and on 3002.

### Phase 8 (F7): on chain delist, single and bulk

1. Multi select delist using the same select mode, and move the single delist (`useDelistListing.ts`) onto the same path: fetch each order's `rawOrder`, send **one** Seaport `cancel(OrderComponents[])` transaction for every selected order, then call cancel (one) or cancel-bulk (many) with the transaction hash.
2. New `src/core/services/my-domains/cancelOrders.service.ts` for the real endpoints on uat (§5): `POST /marketplacev2/orders/cancel-bulk` with `{ orderHashes, cancelTxHash }`, and the single `POST /marketplacev2/orders/{hash}/cancel` with `{ cancelTxHash }`. Bulk cancel is all or nothing (403, 400 `CANCEL_MIXED_CHAIN`, 409 `ORDER_NOT_CANCELLABLE` with the hashes).
3. Three states on My Domains, from the my listings endpoint: **Cancelling** (`status: "cancel_pending"`), **Cancelled**, **Cancel not confirmed** (`cancelNotConfirmed: true`, set by the backend after 30 minutes on Polygon or when the cancel transaction failed; a warning that the listing can still be bought and a **Cancel again** button). The backend also emails the seller in that case.
4. **Cheaper order prompt (B7):** when a listing or bulk listing is rejected with `CHEAPER_ORDER_STILL_VALID`, each rejected name carries `olderOrderHashes`; offer to cancel those older orders on chain first, then list. A **price cut** skips the cancel (decision 1); the backend never checks price cuts.
5. Wording for every state shown to the user first; light and dark, phone and desktop.
6. **Marketplace home page too:** `pages/index.tsx` also uses `useDelistListing`, so it moves onto the on chain path with My Domains.
7. **Wallet states:** today a delist works with no wallet connected; an on chain cancel needs a connected wallet, on Polygon, with POL for gas. Handle no wallet, wrong network, not enough POL and a closed popup (wording to approve). Only the wallet that signed an order can cancel it (V9).
8. **Seaport ABI:** add `cancel` to `SEAPORT_MIN_ABI` in `seaport-order-builder-v5.ts`, adding only (shared with the multi chain developer, §6).
9. **Old off chain delists:** every delist before v2 left an order still fillable on chain, so relisting higher hits `CHEAPER_ORDER_STILL_VALID`. The prompt cancels those through their `rawOrder` (answered 20 Nov: `GET /marketplacev2/orders/{hash}` returns the full order for any status and only blanks the signature once it isn't active; Seaport's cancel doesn't need the signature). Guru's test page keeps signed orders in localStorage for its own cancels; we fetch from the backend instead, so it works on any device.
10. **Price cuts (V7): decided 23 Nov by the user, option B, built and tested.** Listed rows show **Edit price**: a lower price is one free signature, after which the old listing is hidden off chain (`hideListingOffChain`) and the new one posted; same or higher is refused (raise = delist on chain first). Delist moved into the edit drawer as a "Remove this listing" box under the free note. Details: progress log, "v2 Phase 8, part 2".

**Done when:** on uat, delisting one or many sends one cancel transaction and shows the three states.

**Status (23 Nov):** built, not committed; tested on uat with MetaMask: Cancel older listings, single Delist and bulk delist (one transaction for 2) all passed, about a cent of POL each. Labels cleared on their own, emails arrived, dark mode and phone width fine. Not tried by hand: a closed popup (covered by tests). Option A (decided 23 Nov): My Domains reads `my-listings` for the Cancelling / Cancel not confirmed labels, no separate page. Single and bulk both use `cancel-bulk`. The older listing prompt is on the bulk result screen (the single listing drawer still only toasts it). Wording approved on `wording/phase8-wording.html` (A to G), including the new "Bulk delist" Quick Action. V7 built as always on chain.

### Phase 8b: My Listings page (new, from the backend's integration guide, 20 Nov)

**Dropped 23 Nov (user decision):** a new page isn't necessary; option A shows the states on My Domains. Kept below for reference only.

Only if Guru confirms the page belongs on the marketplace (Q7); if `WEB_CLIENT_URL` is the main website, it belongs to the main website's team instead.

1. Route `/profile/my-listings` (or wherever Q7 says), from `GET /marketplacev2/orders/my-listings?page&limit` (`result.data`, `result.paginationInfo`).
2. Status per row: active, cancel pending ("Cancelling", refreshed every 15 to 30 seconds until it changes), cancelled, filled, expired, invalid.
3. `cancelNotConfirmed: true`: a clear warning (the listing is hidden but still buyable on chain) and **Cancel again**, which runs phase 8's on chain cancel for that listing.
4. Optional history timeline from `GET /marketplacev2/orders/listing-history` (LISTED, CANCELLED, SOLD, INVALIDATED, EXPIRED, REACTIVATED).
5. Ask Mohit sir for a design (none in Figma yet); otherwise build from existing table and row pieces, wording shown first.

### Phase 9: cross checks with the backend (small; was "switch from mocks" until 19 Nov)

The backend went live on uat on 19 Nov, so phases 3 and 8 already use the real endpoints and there is no mock to remove.

1. Type hash confirmed on 20 Nov: Guru's port (`src/bulk-listing-testing/bulkSigning.ts`) builds it from the full EIP712 type string, like ours. If he shares B2 test signatures (heights 1, 2 and 6), still run them against our helpers.
2. Compare every error code we handle with the backend's enums on uat (`BulkOrderCode`, `OrderRejectCode`, `CancelOrderCode`); add any we missed.
3. One more end to end run on uat: list 2 names in bulk, raise one's price (cheaper order prompt), delist both on chain.

### Phase 10: QA on uat and the acceptance criteria

The requirements' phase 1 checklist, each one logged:

1. Listing 50 UD Polygon names needs at most one approval and exactly one signature in MetaMask, Rabby and Coinbase Wallet (as many as we have).
2. Every order in the batch fills on chain directly **and through Trails**, and the poller records each sale (buy 2 of them: one with USDT, one with Any token).
3. A batch with one already listed name lists the rest and reports ALREADY_LISTED for that one.
4. Retrying after a network error asks for no new signature and creates no duplicate orders.
5. Fee, "you receive" and expiry in the drawer equal the signed values exactly.
6. Bulk delist removes every selected listing with one on chain cancel transaction.
7. Single listing and single delist still work; dark and light; phone and desktop.

Then: rebase onto uat once more if it moved, commit when the user says, PR.

## 5. Backend shapes (live on uat since 19 Nov)

> **20 Nov: the backend team's integration guide** (`FRONTEND_INTEGRATION_GUIDE 1.docx` (backend team, in dev-docs/bulk-listing, 20 Nov)) confirms every shape below and adds rules, folded in here:
> 1. **Every listing is real**, on stage and uat too (Polygon mainnet). Test with high prices and short expiry, and cancel on chain afterwards.
> 2. **Cancel is all or nothing on purpose** (Guru Q1 answered): on 409 `ORDER_NOT_CANCELLABLE` drop the hashes in `orderHashes` and resend `cancel-bulk` with the **same** `cancelTxHash`; resending is safe. The orders are already safe on chain; the backend marks them cancelled within about a minute.
> 3. **Always cancel on chain** (Guru Q2 answered): the body less single cancel stays on the backend but must not be used by new screens.
> 4. **Price change** (Flow C): lower = delist on chain then relist; higher = cancel on chain first, else `CHEAPER_ORDER_STILL_VALID` with `olderOrderHashes`; while a cancel is pending a higher relist is already allowed.
> 5. **My Listings page required** (guide section 7): the cancel not confirmed email links to `/profile/my-listings`. The link is `WEB_CLIENT_URL` + that path, and the backend's email preview uses `https://endlessdomains.io` (the main website), so **which site hosts the page is open (Guru Q7)**. See phase 8b.
> 6. Listable names: UD (not UDBASE), Polygon, with a tokenId, unlisted: our `deriveChain` already maps UDBASE to Base, so they're not selectable.
> 7. The guide says to copy code from the test page; we keep our own equivalent (matches it byte for byte; the test page won't stay after launch).

| Ticket | Shape (from the requirements) | Used in |
|---|---|---|
| B1 | `POST /api/v1/marketplacev2/orders/bulk`, body `{ chainId, orders: [{ parameters, signature, domainName }] }`, answer `{ batchId, results: [{ domainName, orderHash, status: "listed" \| "rejected", code, message, batchId }] }` (`code`, `message` null when listed; `orderHash` null when unparseable); max 50, one maker (the verified wallet), one chain; `DUPLICATE_ORDER` on retry counts as listed with the first batch's `batchId`. Batch errors are 400 `{ code, message }`: `CHAIN_NOT_SUPPORTED`, `BATCH_EMPTY`, `BATCH_TOO_LARGE`, `BATCH_MIXED_MAKER`, `BATCH_DUPLICATE_ITEM`; `CHAIN_UNAVAILABLE` is 503; `BATCH_ALL_REJECTED` is 400 **with `batchId` and `results` in the body**. Throttle 10 calls a minute per user (429). New per item code `BAD_BULK_PROOF`. Rejected items with `CHEAPER_ORDER_STILL_VALID` also carry `olderOrderHashes`. Source: backend uat (PR #1024, 19 Nov). Every bulk post returned 503 `CHAIN_UNAVAILABLE` on the evening of 19 Nov until PR #1025 (Multicall3 read as `staticCall`) fixed it | Phase 3 |
| B5 | `POST /marketplacev2/orders/cancel-bulk` with `{ orderHashes (1 to 50, unique), cancelTxHash }`, answer `{ results: [{ orderHash, status: "cancel_pending" }] }`; all or nothing: 403 (not your order), 400 `CANCEL_MIXED_CHAIN`, 409 `ORDER_NOT_CANCELLABLE` with `orderHashes`; 10 a minute. Single cancel: `POST /marketplacev2/orders/{hash}/cancel` with optional `{ cancelTxHash }` (without it, the old off chain cancel). Stored as `status: cancelled` plus `cancelMode`, `cancelTxHash`, `cancelConfirmedAt`, `cancelNotConfirmedAt`; the my listings endpoint shows `status: "cancel_pending"` and `cancelNotConfirmed`. A sweep confirms by `OrderCancelled` events, checks the transaction receipt, and flags not confirmed after 30 minutes on Polygon (configurable 5 to 1440), with a seller email. Orders cancelled off chain earlier can still be cancelled on chain | Phase 8 |
| B7 | single and bulk create: an item is rejected with `CHEAPER_ORDER_STILL_VALID` (message: "An older, cheaper listing for this name can still be bought. Cancel it on chain before listing at a higher price.") and `olderOrderHashes` when an older order of the same name, same counter, not filled, not confirmed cancelled, not ended and cheaper is still valid on chain. A pending on chain cancel lets the relist through; price cuts are never checked; a failed chain read is a 503 `CHAIN_UNAVAILABLE` | Phases 3, 8 |
| B2 | bulk signature check in `@endlessdomains/order-builder` (live); the backend also has a Polygon fork test of bulk signed fills and bulk cancel (BL-10). Test vectors for heights 1, 2, 6 not shared yet. Guru's frontend test page has an ethers 5 port with the same full type hash as ours (checked 20 Nov) | Phases 2, 9 |

No mocks: everything above is live on uat (checked 19 Nov: the bulk and cancel bulk routes answer 401 without login, an unknown route 404). Automated tests pass a fake post function into the batch logic instead.

No message to the backend developer is needed for the shapes. The questions still open for Guru (all or nothing bulk cancel, single cancel without a tx hash, owner wallet per name, expiry source, whether the test page stays on stage) are on the review page. Type hash and `rawOrder` were answered on 20 Nov. Each remaining question is explained (meaning, why, default, which phase) in the review page, section 5, "Questions for Guru, explained" (20 Nov); the owner wallet question was dropped after V9 was answered.

**Guru's Bulk Listing Testing page (on uat since 19 Nov):** `/bulk-listing-testing`, hidden only on `marketplace.endlessdomains.io`. It calls `orders/bulk`, `orders` (single), `my-domains`, `my-listings`, `listing-history`, `cancel-bulk`, `{hash}/cancel` and the estimator, and logs every request and answer with the token removed. Use it to see real answers; don't import from it. **It won't stay on stage after launch (answered 20 Nov)**, so nothing may depend on it.

## 6. Sharing files with the multi chain developer

| File | Bulk listing (us) | Multi chain (her) | Rule |
|---|---|---|---|
| `src/lib/seaport-order-builder-v5.ts` | used as is by the tree helpers | C3 adds chain, item type, currency, decimals | She changes signatures in a way that keeps today's Polygon defaults; we rebase |
| `listing-flow/listingOrder.ts` | fallback path (phase 4) | C3, C4 | Bulk merges first |
| `useMyDomainsData.ts`, My Domains rows and cards | select mode, cancel states | C5 decimals, C6 row ids | Bulk merges first; she leaves these to the end of her work |
| `useNftApprovals.ts` (new) | phase 6 | C4 reuses it per chain | Written for many contracts and chains from the start |

Also edited by `portfolio` and `promotions`: `useMyDomainsData.ts` (whoever merges later resolves it).

## 7. Files (planned)

New: `src/helpers/my-domains/bulkOrderTree.ts` (+ test), `src/core/services/my-domains/bulkOrders.service.ts`, `src/core/services/my-domains/cancelOrders.service.ts`, `src/hooks/my-domains/useNftApprovals.ts`, a bulk delist hook, test fixtures under `src/helpers/my-domains/__fixtures__/`.

Changed: `useBulkListingActions.ts`, `bulkSigning.ts`, `bulkListing.ts`, `useBulkSelection.ts`, `useDelistListing.ts`, `types/my-domains/bulk.ts`, the bulk listing composites (`BulkPricingOptions`, `BulkNamesList`, signing, approval and success steps, banner, select button), My Domains rows and cards (cancel states), `data/my-domains` copy, `pages/account/my-domains` (or wherever the deep link handler lives) for `?bulk=1`.

## 8. Open questions (default used until answered)

Reviewed 19 Nov against the requirements, the branch and the backend: see `bulk-listing-v2-review.html`. The phase 0 messages (the multi chain developer, Mohit for V7) are drafted there and **not sent yet**; V9 was answered in a team chat on 20 Nov. No message to Guru: the backend went live on uat on 19 Nov; his remaining questions are listed there.

| # | Question | Default |
|---|---|---|
| V1 | Add `@opensea/seaport-js` as a **dev dependency** only, to produce test fixtures? (Or a one off script that writes the fixtures as JSON, with no dependency kept.) | One off script; fixtures saved as JSON; no new dependency in package.json |
| V2 | Which wallets can we really test (Rabby, Coinbase, Trust, Ledger, WalletConnect phone)? | **Answered 19 Nov:** MetaMask and Phantom. The rest are gaps; acceptance criterion 1 is not met yet (phase 4) |
| V3 | Mock switch name | **Not needed (19 Nov):** the backend is live on uat, so no mock and no switch |
| V4 | Do designers fix the design issues in the requirements, or do we fix them in code? | We fix them in code (phase 5), each shown to the user first |
| V5 | Cancel transaction gas: show an estimate before the delist? | Yes, the same way as the approval step |
| V6 | Trails merging during the week | Resolved: Trails merged into uat 18 Nov (PR #237) |
| V7 | **Decided 23 Nov by the user: option B (Edit price), built and tested on uat.** Price cuts (20 Nov: the backend's integration guide, Flow C, says delist on chain even for a lower price, which backs option A; still Mohit's decision). Listing is always free (a signature); only the **delist** becomes a gas transaction (Seaport `cancel`) in phase 8. Lowering a price today means Delist, then List again at the new price (a name can't have two active listings), because there is no Edit price button. A price cut is safe off chain (the old, dearer order can't undercut the new one), which is why decision 1 says price cuts stay off chain and free. But with delist always on chain, a seller who only lowers a price pays the cancel gas for nothing. Keep delist always on chain in phase 1 (option A), or add a free Edit price that hides the old order off chain and lists lower (option B)? (`ListingFlowModal` has a dormant `'edit'` mode, unused by rows and cards, if Edit price is wanted.) | **Waiting on Mohit.** Default: always on chain (phase 8) |
| V8 | Wallet proof can add a second popup, breaking "exactly one signature" | **Agreed 19 Nov:** check the proof when the drawer opens (phase 3) |
| V9 | Names held in several linked wallets: the backend needs one maker per batch, and only the signer can cancel | **Answered 20 Nov (team chat):** an account links at most two wallets, one Solana and one EVM, and only EVM (Polygon) names can be listed. Solana names are already not selectable (`bulkIneligibleReason` → `not-polygon`), so every name in a batch belongs to the one EVM wallet. No extra work; a different EVM wallet connected in the browser is still caught by the wallet check (not linked) or per name `NOT_OWNER` |
| V10 | Expiry source: our 7 and 14 day rules use the database `renewalTimestamp`; the requirements read UD `expiryOf` on chain | **Decided 24 Nov by the user: on chain, per Mohit sir's PDF.** `expiryOf` confirmed on the UD Polygon contract (0 = never expires). Page uses the database date as an early check; the drawer reads `expiryOf` on open and at signing and that decides; falls back to the database date if the read fails. Guru no longer needs to answer |

## 9. Paste ready prompts, one per phase

Start a fresh Claude session per phase with the prompt below.

**Phase 1**
> Read `dev-docs/bulk-listing/bulk-listing-v2-plan.md` (§1 to §4) and CLAUDE.md. Do phase 1 (F1): rebase `bulk-list` onto current `origin/uat`, keeping the `listingOrder.ts` refactor; list every conflict and how you resolved it. Run tsc, vitest and eslint on changed files. Then guide me through the regression on 3002 (single list, single delist, bulk on 2 names, dark and light). Don't push until I say. Add the "v2: one signature (Nov 2026)" section to `bulk-listing-progress.html` and log the phase.

**Phase 2**
> Read the plan §3 and phase 2, and the requirements' F2 and B2. Build `src/helpers/my-domains/bulkOrderTree.ts` as pure helpers using `seaport-order-builder-v5.ts`'s types and domain: tree height, padding with an empty OrderComponents, the BulkOrder type per height built in code (port Seaport.js `Eip712MerkleTree`, no hand written type strings), the tree value, root, per order signature (compact 64 bytes, 3 byte index, proofs) and local verification. Tests for heights 1, 2 and 6 against Seaport.js fixtures (plan question V1: one off script, fixtures as JSON), plus tampered proof and wrong index cases. Nothing on screen changes. Log the phase.

**Phase 3**
> Read the plan phase 3 and §5. Add `src/core/services/my-domains/bulkOrders.service.ts` (B1, the real endpoint on uat; tests pass a fake post function), and switch `useBulkListingActions` to: build every order, sign once with `bulkOrderTree.ts`, verify locally, keep the signed batch in memory, post once. Progress steps Preparing, Waiting for signature, Publishing. Per name results on the existing success screen; DUPLICATE_ORDER counts as listed; a failed post retries without a new signature; CHEAPER_ORDER_STILL_VALID shown per name. Show me any new wording first. Tests for the batch rules. Then guide me through listing 2 and 10 low value names on uat. Log the phase.

**Phase 4**
> Read the plan phase 4. When the bulk signature fails (not a rejection), offer "Sign each name separately" using the existing per name path. Detect a smart contract wallet (code at the address) and show a clear message instead of starting. Show me both wordings first. Add the wallet test matrix to the progress doc and guide me through MetaMask with 2 and 10 names. Log the phase.

**Phase 5**
> Read the plan phase 5 and the requirements' F4, F6, F8 and "Errors and confusions in the attached designs". Remove the percentage mode and estimate column; fee label from fee bps; show the signed endTime and names cut short; fix the reject prompt's remaining count; fix each design issue listed. Show me every wording change first, as a before and after table. Light and dark, phone and desktop. Log the phase, listing each design issue and what we did.

**Phase 6**
> Read the plan phase 6. Add `src/hooks/my-domains/useNftApprovals.ts` (group by chain and contract, isApprovedForAll, real gas estimate), use it in the approval step instead of `useListingFlowActions(domains[0])`, one setApprovalForAll per missing contract, CTA "Approve, then list N" or "List N". Tests for grouping and skipping. Log the phase.

**Phase 7**
> Read the plan phase 7. 7 day expiry buffer and 14 day minimum in `bulkListing.ts`; disabled Select with the reason for every ineligible case; one chain per batch (chain filter required, Select All and banner count only that chain); Esc exits; `?bulk=1` opens select mode. Show me the hover reasons' wording first. Tests for the rules. Log the phase.

**Phase 8**
> Read the plan phase 8 and §5. On chain delist for one and many: fetch rawOrder, one Seaport cancel(OrderComponents[]) transaction, then cancel or cancel-bulk with the hash (`src/core/services/my-domains/cancelOrders.service.ts`, the real endpoints on uat). Move `useDelistListing.ts` onto this path. Three states on My Domains (Cancelling, Cancelled, Cancel not confirmed with Cancel again), and the cheaper order prompt for CHEAPER_ORDER_STILL_VALID (price cuts skip it). Show me all wording first. Light and dark, phone and desktop. Log the phase.

**Phase 9**
> Read the plan phase 9. Run the backend's B2 test vectors against our helpers if Guru has shared them, compare every error code we handle with the backend's enums on uat, then guide me through one end to end run on uat (bulk list 2 names, raise one price to hit the cheaper order prompt, delist both on chain). Log the phase.

**Phase 10**
> Read the plan phase 10. Guide me through each acceptance criterion one at a time on uat (including one buy with USDT and one through Trails of a bulk listed name), and log each result in the progress doc's testing log. Then rebase onto uat again if Trails merged, run all checks, and prepare the PR description (no Claude attribution).
