# Phase 2 implementation plan: rewrite both transaction handlers

This is the working plan for phase 2 of the build order, "Rewrite both transaction handlers together," about 1 to 1.5 weeks on the human estimate, roughly half a day of session time if handed to Claude Code directly. Same purpose as the phase 1 plan document, so a future Claude Code session can pick this up cold without re-deriving anything.

Keep these sources open while working through this plan:

- `Endless-Domains-Buy-Flow-Items-08-21.pdf`, section **"08 The transaction handler."** The buy side findings, the eight step walkthrough, and the corrected order it recommends.
- `Endless-Domains-Listing-Transaction-Review.pdf`, in full. The listing side findings, the buy vs listing comparison table, and the four fixes it recommends.
- The **Settlement Gap** artifact, sections `08` and `L`: https://claude.ai/code/artifact/9b020c36-8814-49ee-82d4-6ad810729dc1. Same findings, checked line by line against the live code, plus the delist file's matching premature backend call, which neither PDF caught on its own.
- The **Phase 1 Paper Trail**: https://claude.ai/code/artifact/4893fcfb-9221-4341-89ff-c07c5c16dbc1. Its Testing section documents a real on chain revert hit while testing phase 1, `call revert exception ... method="getRequiredNativeAmount(uint256)"`, thrown from exactly the code this phase rewrites. That's not a hypothetical bug from a document, it's a failure that actually happened in this app, caught by the single generic catch block this phase replaces.

## A safety note before starting

Phase 1 was UI state and modal consolidation, nothing it touched could move money or sign a transaction. This phase edits code that sends real transactions to a real wallet and a real smart contract. Test changes here with a test wallet on a network where the funds involved don't matter, never against a real listing with real value, and never assume a fix is correct just because the code compiles, this is exactly the kind of change where "it typechecks" and "it works" are two different claims. The manual test section at the end of this document is not optional the way some of phase 1's checklist items were.

## What "done" looks like

Nothing is told to the user, and nothing is told to the backend, until the chain has actually confirmed it. Every transaction's receipt is checked for `status === 1`, not just that it was mined. Every submit button is disabled for the whole duration of a submission, not just cosmetically covered by a loading spinner. Wrong network switches automatically, in one click, on both buy and listing. A cancelled wallet prompt is treated as a cancellation, with its own honest message, never folded into the same generic error as an on chain revert or a network timeout. The 2% buyer buffer is either refunded on chain or disclosed to the buyer, not silently kept. A listing that succeeds on chain but fails to save to the backend is retried, not lost.

## The corrected order, pulled from the Settlement Gap artifact's own code panels

**Buying:**
```
1. Guard the entry: if a submission is already in flight, do nothing.
2. If on the wrong chain, switch it inline, then continue automatically,
   no second click required.
3. Quote the price and check the balance against the exact number that
   will actually be sent, gas included.
4. Send the transaction, show a block explorer link immediately.
5. Wait for the receipt, then check receipt.status === 1. A mined but
   reverted transaction is a failure, not a success.
6. Only now tell the backend, and let that call throw on failure rather
   than being swallowed.
7. Only now show success.
8. If the wallet prompt was cancelled, that's not an error, show its
   own message and stop, don't fall into the generic catch.
```

**Listing:**
```
1. Approval either succeeds or throws, no third silent outcome. A
   cancelled approval gets its own honest message.
2. After the listing transaction, check receipt.status === 1, the same
   way the delist flow already does correctly.
3. Read the listing id from the transaction's own event log rather than
   a second call that can race the node. Treat a missing or zero id as
   "still syncing," never as success.
4. Check the backend save for every listing, not premium ones only, and
   if it fails, queue it for retry instead of dropping it, holding the
   payload plus the transaction hash so a closed tab doesn't lose it.
```

## The three files, as verified directly against the current code

| File | What's already right | What's actually broken |
|---|---|---|
| `src/component/modals/BuyNowModal.tsx`, `domainBuyHandler` (lines 81 to 228) | Nothing structurally, this is the file the review is most critical of. | Wrong network just bails, no switch attempted at all, lines 138 to 144. Balance check at lines 162 to 167 compares against `priceInWei`, but the transaction at line 184 sends `safeEthAmount`, two different numbers, gas not counted either. Hardcoded 2% buffer, `requiredNativeAmount.mul(102).div(100)`, line 160, never disclosed, refund status unconfirmed. Backend told at line 199, before `tx.wait(1)` at line 212, and no `receipt` is ever captured there, so `receipt.status` can't be checked, not now, not anywhere in the function. Submit button has no `disabled` prop at all, lines 281 to 288. Every failure, cancelled prompt, revert, timeout, insufficient funds, lands in one `catch` at lines 222 to 227 with the single message "Something went wrong. Please try again." |
| `src/component/modals/DomainListingModal.tsx` | **Correction to the original review:** the wrong network check here is not a plain bail, it already calls `wallet_switchEthereumChain` inline, lines 456 to 459. The bug is narrower than documented, even on a *successful* switch it still `return`s at line 462 with a comment saying the user must click submit again, instead of continuing the flow. Persisting only after `tx.wait(1)`, line 571, is correct and already matches the target pattern. | `approval()`, lines 137 to 169, returns `false` on a cancelled prompt (161 to 163) instead of throwing, while throwing normally on any other failure (167). The caller at line 536 never captures that return value, so the flow falls straight into creating the listing anyway; the honest "NFT approval rejected by user" message at line 539 is dead code, unreachable through this path. `receipt` is captured at line 571 but `receipt.status` is never read. Listing id is read back with a second call at line 574 that can return null or race the node. Backend save at line 595 only has its response checked for premium listings (599); the normal path at line 607 closes unconditionally regardless of whether the save actually worked. |
| `src/component/domain-self-item/index.tsx`, `delistHandler` (lines 152 to 317) | **This is the reference pattern.** `receipt.status === 1` is checked correctly at line 289, right after `txResponse.wait()` at line 286, and throws a real error otherwise. Copy this exact shape into the other two files rather than inventing a new one. | Same premature backend call as buying: `setCancelDomainListing(payload)` fires at line 274, before the chain confirmation at line 286. The receipt check is already fixed here, the ordering bug is not. |

## Step by step Claude Code prompts

Run in order. Step 0 first even though this plan was just verified, by the time this phase is actually picked up, re-check it, code moves.

### Step 0 — Re-verify before touching anything

```
Before making any changes, open src/component/modals/BuyNowModal.tsx,
src/component/modals/DomainListingModal.tsx, and
src/component/domain-self-item/index.tsx. Confirm each still matches
this description:

- BuyNowModal.tsx: domainBuyHandler still spans roughly lines 81-228.
  Wrong network still just sets isWrongNetwork and returns, around
  lines 138-144, no switch attempted. Balance check around lines
  162-167 still compares against priceInWei while the actual send at
  line 184 uses safeEthAmount. The 2% buffer is still hardcoded around
  line 160. setBuyDomain is still called around line 199, before
  tx.wait(1) around line 212, and no receipt variable is captured
  there. The Buy button around lines 281-288 still has no disabled
  prop. The single outer catch around lines 222-227 still produces one
  generic message for every failure type.
- DomainListingModal.tsx: confirm the wrong-network handler around
  lines 447-470 still attempts wallet_switchEthereumChain inline but
  still returns even after a successful switch. Confirm approval()
  around lines 137-169 still returns false on a 4001 rather than
  throwing, and that the caller around line 536 still discards that
  return value, with the honest rejection message around line 539
  still unreachable. Confirm the receipt captured around line 571 is
  still never checked for .status. Confirm the backend save around
  line 595 still only has its response checked when isPremium is true.
- domain-self-item/index.tsx: confirm delistHandler still checks
  receipt.status === 1 correctly around line 289, and still calls
  setCancelDomainListing around line 274, before txResponse.wait()
  around line 286.

Report back file by file with current line numbers, flag anything
that's changed since this plan was written. Do not edit anything yet.
```

### Step 1 — Rewrite BuyNowModal.tsx

```
Rewrite domainBuyHandler in src/component/modals/BuyNowModal.tsx to
follow this order: guard against a submission already in flight,
switch chains inline and continue automatically rather than requiring
a second click, quote the price and check the wallet's balance against
the exact same amount that will actually be sent (safeEthAmount, not
priceInWei) with gas included in that check, send the transaction and
show a block explorer link immediately using the returned tx.hash,
capture the receipt from tx.wait(1) and check receipt.status === 1
before treating it as a success, only tell the backend once that check
passes and let a failure in that call throw rather than being caught
and ignored, and only show a success message after the backend call
succeeds.

Copy the receipt status check from the working pattern already in this
codebase at src/component/domain-self-item/index.tsx around line 289,
don't invent a new way to do it.

Give the Buy button a real disabled attribute driven by the submission
state, not just a Loader rendered alongside it, so it's actually
impossible to double click during a submission, not just visually
covered.

Replace the single generic catch with error classification: a wallet
rejection (error.code === 4001) gets its own message and is not
treated as a failure state, an on chain revert gets a message that
says the transaction reverted rather than "something went wrong", and
genuinely unexpected errors keep a fallback message. Reference the
real revert this app hit during phase 1 testing,
"call revert exception ... method=getRequiredNativeAmount", as a
concrete case this classification needs to handle honestly rather than
hiding behind one flat string.

Leave the 2% buffer calculation itself alone for now, but add a
comment flagging that whether this amount is refunded on chain if
unused is still an open question from the original review, don't
resolve it by guessing.
```

### Step 2 — Rewrite DomainListingModal.tsx

```
In src/component/modals/DomainListingModal.tsx, fix three things.

First, inside approval() around lines 137-169, throw on a cancelled
wallet prompt (error.code === 4001) instead of returning false, using
a clear message like "You cancelled the approval." Remove the
handleClose() call at the top of this function, line 148, so the
listing form stays mounted and visible while the approval transaction
is in flight rather than disappearing before the wallet prompt even
appears. At the call site around line 536, the try/catch is already
there, confirm it now actually receives the thrown error since
approval() no longer swallows it, and that the dead message at line
539 is now reachable.

Second, the wrong-network handler around lines 447-470 already
attempts wallet_switchEthereumChain inline, correctly. Remove the
return at line 462 that stops the flow even after a successful switch,
and let it continue into the rest of the submission instead of making
the user click submit a second time.

Third, after the receipt is captured around line 571, check
receipt.status === 1 before proceeding, same pattern as
domain-self-item/index.tsx line 289. Read the listing id from the
transaction receipt's own event log if that data is available there,
falling back to the existing getListingId() call only if it isn't,
rather than always making a second call that can race the node. Treat
a missing or zero listing id as "still syncing", not as success. Check
the backend save's response for every listing, not just when
isPremium is true, and if that save fails, don't just close the modal
at line 607, queue the payload plus the transaction hash for a retry
and show an honest "listed on chain, finishing sync" state instead of
silently treating it as done.

Also give the submit button a real disabled attribute for the whole
duration of a submission, matching what BuyNowModal.tsx now does in
step 1, it currently only checks form validity.
```

### Step 3 — Fix the delist file's ordering, not its correctness check

```
In src/component/domain-self-item/index.tsx, delistHandler currently
calls setCancelDomainListing(payload) around line 274, before
txResponse.wait() around line 286. Move that backend call to after the
receipt is confirmed and its status checked, the same ordering
principle used in BuyNowModal.tsx and DomainListingModal.tsx in steps
1 and 2. Do not change the receipt.status === 1 check itself around
line 289, it's already correct and was the reference pattern the other
two files just copied from.
```

### Step 4 — Verify

```
Run this project's type checker and linter across all three edited
files and fix whatever they surface. Do not touch anything in the five
files phase 1 already migrated, src/component/domain-item/page.tsx,
src/component/slider/slider.tsx, src/component/watchlist/page.tsx,
pages/index.tsx, or pages/seller-portfolio/[slug].tsx, they call into
BuyNowModal and DomainListingModal as-is and don't need changes for
anything done in this phase.
```

## How to test this phase

This is the part that can't be shortcut. Phase 1's testing showed that even reaching the actual purchase attempt requires a logged in account, a saved wallet address, a connected wallet, and a domain whose listing genuinely exists on the connected chain, that last one failed during phase 1 testing and may still fail here for the same backend/on-chain data mismatch reason, unrelated to this phase's code.

**What can be tested without a valid on chain listing**, since these all fail before the transaction is ever sent:

- Reject the wallet prompt on purpose, on both buying and listing. Confirm each shows its own honest "you cancelled" message, not the generic one, and confirm the app doesn't proceed into a second doomed transaction the way listing used to on a cancelled approval.
- Start a submission while on the wrong network. Confirm it switches automatically and continues, on both buying and listing, without needing a second click.
- Double click the Buy and Submit Listing buttons. Confirm the second click is actually blocked, not just visually obscured by a loader.
- Force insufficient funds in the connected wallet. Confirm the balance check catches it before anything is sent, and that the amount it checks against matches the amount that would actually be sent.

**What needs a domain that's genuinely listed on the connected chain right now**, since these all depend on the transaction actually being accepted before failing or succeeding downstream:

- A full successful purchase, confirming the success message only appears after `receipt.status === 1`, not before.
- Forcing a backend save failure after a successful on chain transaction (e.g. by disconnecting from the network briefly right after the transaction confirms), confirming the retry queue actually recovers it instead of losing it silently.
- A full successful listing, confirming the same receipt check, and confirming the listing id gets read correctly from the event log.
- Delisting, confirming the backend is now told only after the chain confirms, not before.

If no such listing is available in the current environment, that's the same blocker phase 1 hit, not a new one, and it's worth resolving with whoever manages the backend and on chain test data before this phase can be called fully verified rather than just fully built.
