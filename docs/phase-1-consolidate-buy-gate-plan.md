# Phase 1 implementation plan: consolidate the buy gate

This is the working plan for phase 1 of the build order, "Consolidate the buy gate," about 4 days on the human estimate, roughly 1 to 2 hours of focused editing if handed to Claude Code directly. It exists so a future Claude Code session can pick this up cold and know exactly what to check, what to build, and in what order, without re-deriving any of it from scratch.

Keep these two sources open while working through this plan, every step below points back to them:

- The original review PDF, `Endless-Domains-Buy-Flow-Items-08-21.pdf`, section **"21 The duplicated buy gate."** That section has the table of five files, the three findings (data loss, drift, performance), and the two-piece fix it recommends (a shared hook, a single modal host).
- The **Settlement Gap** artifact built from that review, section **"21 — The buy gate, copied five times over."** Link: https://claude.ai/code/artifact/9b020c36-8814-49ee-82d4-6ad810729dc1. That section has the same findings after being checked line by line against the live code, plus a fourth finding the PDF never caught, the homepage buy button skips the wallet check entirely. The build order section of that same artifact is where phase 1's time estimate and test plan live.

## What "done" looks like

One hook owns the entire decision of what happens when someone clicks Buy. One modal host, mounted once, renders the buy window and the wallet connect window. All five files below call the hook and render nothing else. All five surfaces fire the same tracking event, not just the grid card like today. The five old copies of this logic are deleted, not just left in place next to the new one.

## The exact gate logic being consolidated

This was pulled directly from the one file that already does it correctly, `src/component/domain-item/page.tsx`, lines 144 to 170. This is the canonical version, every other file's copy is a variation on this same ladder and should end up matching it:

```
1. Read the access token (getCookieValue(Cookie_Key.ACCESS_TOKEN)).
   Missing → toast "Please log in to purchase the domain." and stop.
2. Read evmWalletAddress from Redux (state.userProfile.evmWalletAddress).
   Missing → toast "Please add your Wallet Address in Profile to buy domains.",
   redirect to /profile/userProfile, and stop.
3. Read walletProvider and walletProviderType from useAppKitProvider("eip155").
   Missing either one → open the WalletConect modal instead of the buy modal.
4. Otherwise → open BuyNowModal and fire setAnalytics({ domainId, clicks: "clicks", views: "views" }).
```

## The five files, as last checked directly against the code

| File | Analytics today | Modal today | Notable drift |
|---|---|---|---|
| `src/component/domain-item/page.tsx` (`MultiCurrencyCard`) | Yes, fires the click event above, plus a view event at 50% visibility (line 85) and save/unsave events on the watchlist heart (lines 76, 78) | Mounts its own `BuyNowModal` and `WalletConect` per card (lines 176 to 197), rendered inside a list by `pages/web3-domain-item/index.tsx:107` | Uses `ROUTER` (uppercase, line 27). This is the reference implementation, treat it as the source of truth for the hook's logic. |
| `src/component/slider/slider.tsx` (`CustomSlider`) | None | Mounts its own `BuyNowModal` and `WalletConect` per card too, rendered by `promoted-domain/index.tsx:29` and again by `premium-domain/index.tsx` | Uses `ROUTER` (uppercase, line 40). Has the full token, wallet address, and provider gate ladder duplicated at lines 158 to 182, same as domain-item/page.tsx, it just never calls setAnalytics at the end, `handleShow()` at line 46 is a bare `setShowModal(true)` with nothing else. |
| `src/component/watchlist/page.tsx` | None | Hoists a single shared `BuyNowModal` (lines 197 to 211) above its list, **but `WalletConect` (lines 181 to 186) was actually rendered once per row inside the `.map()`, not shared like this table originally claimed** — corrected during migration, see the implementation log. | Uses `ROUTER` (uppercase, line 28). |
| `pages/index.tsx` | None | Already hoists a single shared `BuyNowModal` (lines 377 to 389) | **Missing the wallet provider check entirely.** No `WalletConect` import anywhere in the file (lines 319 to 346). Migrating this file to the shared hook fixes that bug as a side effect, call this out explicitly when it's done. |
| `pages/seller-portfolio/[slug].tsx` | None | Already hoists a single shared `BuyNowModal` (lines 345 to 360) and `WalletConect` (lines 361 to 366) | Correctly checks `walletProvider`/`walletProviderType` (lines 292 to 298). Uses lowercase `router` (line 48), the one file that doesn't match the other four. |

Supporting pieces already in the codebase, confirmed by direct read, that the new code should follow rather than reinvent:

- `src/lib/provider-manager.ts`, a singleton set up once in `pages/initProvider.tsx`. This is the "provider-manager singleton" the PDF references as an existing pattern for something that should exist once, not once per card.
- `src/hooks/useOnScreen.tsx`, a small custom hook that returns `[ref, isIntersecting] as const`. This is the "existing `useOnScreen` hook" the PDF points to as the style to match for a new hook, simple, typed, no unnecessary abstraction.
- The app already runs Redux Toolkit and RTK Query (`src/core/redux/store.ts`, slices under `src/core/redux/slice/`, `useSetAnalyticsMutation` and `useGetUserProfileQuery` from `src/core/redux/userProfile`). Whatever holds "which domain is being bought right now, and which modal is open" as shared state across five unrelated files should probably be a small Redux slice, to match how `evmWalletAddress` is already read, rather than introducing Context or a new state library. Confirm this assumption in step 1 before building on it.
- `src/component/wallet-connect/index.tsx` is the actual `WalletConect` component. Its props are `isOpen`, `toggle`, `onConfirm(id?)`, `walletAddress?`, `closeModel`, `domainId?`. It currently calls `createAppKit(...)` inside its own component body, line 46, this is the performance bug the review flags, it reruns on every render of every card that mounts this component. Moving to a single host fixes it by construction, but confirm no other file also depends on it being remounted for some side effect before assuming that's safe.

## Step by step Claude Code prompts

Run these in order. Each one is meant to be pasted as-is into a fresh or continuing Claude Code session. Do not skip step 0 even if this plan looks current, code moves.

### Step 0 — Re-verify before touching anything

```
Before making any changes, open these five files and confirm each one still
matches this description:

- src/component/domain-item/page.tsx (MultiCurrencyCard): should still have
  the four-step gate ladder around lines 144-170 (token check, evmWalletAddress
  check, walletProvider/walletProviderType check, then handleShow which sets
  showModal and fires setAnalytics), and its own BuyNowModal + WalletConect
  mounted per card around lines 176-197.
- src/component/slider/slider.tsx (CustomSlider): should still mount its own
  BuyNowModal + WalletConect per card, with no analytics call anywhere in the
  file, and a zero-arg handleShow() around line 46.
- src/component/watchlist/page.tsx: should still hoist a single shared
  BuyNowModal and WalletConect above its list rather than one per row.
- pages/index.tsx: should still be missing any WalletConect import or
  walletProvider check in its buy handler around lines 319-346.
- pages/seller-portfolio/[slug].tsx: should still correctly check
  walletProvider/walletProviderType around lines 292-298, and use lowercase
  `router` instead of the `ROUTER` the other four files use.

Also confirm these three supporting pieces still exist and still look like
this:
- src/lib/provider-manager.ts, a singleton, set up once from
  pages/initProvider.tsx.
- src/hooks/useOnScreen.tsx, returning [ref, isIntersecting] as const.
- The Redux store at src/core/redux/store.ts and the userProfile slice/API
  that exposes evmWalletAddress and useSetAnalyticsMutation.

Report back file by file with current line numbers. Flag anything that has
changed since this description was written. Do not edit anything yet, this
is a verification pass only.
```

### Step 1 — Decide where the shared modal state lives

```
I'm about to build a useBuyIntent() hook and a single modal host that five
different files (src/component/domain-item/page.tsx, src/component/slider/slider.tsx,
src/component/watchlist/page.tsx, pages/index.tsx, pages/seller-portfolio/[slug].tsx)
will all call into. That means "which domain is currently being bought" and
"which modal, if any, is open" has to live somewhere those five files and one
modal host at the app root can all read and write.

Look at how this app already shares state across unrelated components,
specifically how evmWalletAddress is read via useSelector from
src/core/redux/store.ts and the userProfile slice. Recommend whether this new
piece of state should be a small Redux slice following that same pattern, or
whether there's a simpler existing pattern in this codebase for exactly this
kind of "one thing open at a time, driven from anywhere" UI state that I
should use instead. Don't build anything yet, just tell me which approach
fits this codebase and why, referencing the actual files you looked at.
```

### Step 2 — Build the hook

```
Build a new hook, useBuyIntent(), following whatever state approach we settled
on in the previous step. Put it wherever this project's other hooks live,
that's src/hooks/useOnScreen.tsx today, so probably src/hooks/useBuyIntent.ts,
confirm the convention first.

It should reproduce, exactly, the four-step gate ladder currently duplicated
in src/component/domain-item/page.tsx lines 144-170:
read the access token via getCookieValue(Cookie_Key.ACCESS_TOKEN), read
evmWalletAddress from Redux, read walletProvider/walletProviderType from
useAppKitProvider("eip155"), and depending on what's missing, resolve to one
of {action:'login'}, {action:'add-wallet'}, {action:'connect'}, {action:'buy'}.

On the 'buy' path, it should fire the same setAnalytics({ domainId,
clicks:"clicks", views:"views" }) call that domain-item/page.tsx fires today,
so analytics coverage is guaranteed by the hook itself rather than left to
whoever calls it. Do not touch save/unsave or view-on-scroll tracking, those
stay local to domain-item/page.tsx, this hook is scoped to the buy click only.

Export a single function from the hook, something like buy(domain), that
runs this whole ladder and updates the shared modal state accordingly. Don't
wire it into any of the five files yet. Show me the hook's logic side by
side with the original ladder in domain-item/page.tsx so I can confirm
nothing was dropped or changed in behavior.
```

### Step 3 — Build the single modal host

```
Build one modal host component that renders exactly one BuyNowModal and one
WalletConect, driven entirely by the shared state useBuyIntent() reads and
writes. Mount it once at the app root, check pages/_app.tsx first to see
whether something like this is already mounted there for anything else, and
follow that convention.

BuyNowModal's current props, confirmed from src/component/domain-item/page.tsx
lines 176-188, are domainId, show, handleClose, domain, network, tokenId,
pricePerToken, description, keywords, endTime, usdAmount. WalletConect's props,
confirmed from src/component/wallet-connect/index.tsx lines 28-35, are isOpen,
toggle, onConfirm(id?), walletAddress?, closeModel, domainId?. The host needs
enough domain data available in the shared state to fill in BuyNowModal's
props for whichever domain is currently selected, work out what that data
shape needs to look like and where it should come from when buy(domain) is
called with a full domain object today.

Confirm that mounting WalletConect exactly once, instead of once per card,
doesn't break anything else that currently depends on it remounting, it calls
createAppKit(...) in its own component body at line 46, moving to a single
mount is the actual fix for the performance finding in the review, but check
for hidden side effects first.
```

### Step 4 — Migrate `domain-item/page.tsx`

```
Migrate src/component/domain-item/page.tsx to use useBuyIntent() instead of
its own inline gate ladder and its own BuyNowModal/WalletConect instances.
This file is the reference implementation the hook was built from, so this
migration should be closest to a straight swap: replace the button's onClick
logic (lines 144-170) with onClick={() => buy(domain)}, and delete the
BuyNowModal and WalletConect JSX (lines 176-197) along with the now-unused
showModal/isModalOpen/selectedDomainId state and the toggleModal/handleShow/
handleClose functions that only existed to drive them.

Do not touch the watchlist heart button, the save/unsave analytics, or the
view-on-scroll tracking in this same file, those are unrelated to the buy
gate and stay exactly as they are.
```

### Step 5 — Migrate `slider/slider.tsx`

```
Migrate src/component/slider/slider.tsx (CustomSlider) to use useBuyIntent()
the same way. This file already has the full token/wallet/provider gate
ladder duplicated at lines 158-182, it just never calls setAnalytics at the
end the way domain-item/page.tsx does. Replace that whole onClick block with
onClick={() => buy(domain)}, and delete its own BuyNowModal and WalletConect
instances, plus the now-unused handleShow/toggleModal/closeModel functions
that only existed to drive them.

This component is rendered inside a list by two different parents,
src/component/promoted-domain/index.tsx and src/component/premium-domain/index.tsx.
Check both call sites still pass whatever data buy(domain) actually needs
after this change.
```

### Step 6 — Migrate `watchlist/page.tsx`

```
Migrate src/component/watchlist/page.tsx to use useBuyIntent(). This file
already hoists a single shared BuyNowModal and WalletConect above its list
rather than one per row, so the modal-per-card cleanup doesn't apply here,
but its own gate logic (handleShow, setSelectedDomain, toggleModal) should
still be replaced with a call to buy(domain), and its own hoisted modal
instances should be deleted since the app-root host now covers this.
```

### Step 7 — Migrate `pages/index.tsx`

```
Migrate pages/index.tsx to use useBuyIntent(). This file's buy handler
(lines 319-346) currently only checks the access token and evmWalletAddress,
it never checks walletProvider/walletProviderType, and there is no
WalletConect anywhere in this file. Replace the handler with a call to
buy(domain) so this surface picks up the missing wallet-connect check for
free as part of this migration, then delete the now-unused hoisted
BuyNowModal instance and its supporting state.

Explicitly confirm, after this change, that a logged-in user with a saved
wallet address but no connected wallet now gets prompted to connect instead
of hitting a silent failure, that's the actual bug this migration is fixing
here, not just a cleanup.
```

### Step 8 — Migrate `pages/seller-portfolio/[slug].tsx`

```
Migrate pages/seller-portfolio/[slug].tsx to use useBuyIntent(). This file
already checks walletProvider/walletProviderType correctly and already hoists
a single shared BuyNowModal and WalletConect, so functionally this one is
closest to a no-op, replace its gate logic and buy handler with buy(domain),
delete its own hoisted modal instances, and along the way switch its
lowercase `router` import to whatever this codebase's shared convention is
after this cleanup, confirm what that convention is before renaming it.
```

### Step 9 — Delete dead code and verify

```
Now that all five files call useBuyIntent(), search the whole src and pages
tree for any leftover BuyNowModal or WalletConect import outside the new
single modal host, and for any now-unused state or handler functions left
behind in the five migrated files. Delete anything dead. Run this project's
type checker, linter, and build, and fix whatever they surface. Do not touch
BuyNowModal.tsx or DomainListingModal.tsx themselves in this pass, their
internals are phase 2's work, not this one.
```

## Execution status

Steps 0 through 9 above have actually been carried out, not just planned. Every finding got a corresponding code change, every file was typechecked and linted immediately after editing, and a full log of what changed and why lives in `docs/phase-1-implementation-log.html`, the companion to this document. Nothing has been committed to git yet.

## Local environment notes, found while trying to actually test this

Two things unrelated to the buy gate code were blocking the app from showing anything at all locally, worth recording here since they'll confuse the next person too if they hit the same blank screen:

- `NEXT_PUBLIC_API_URL` in the local `.env` was missing a `/v1` segment (`https://apistage.endlessdomains.io/api` instead of `.../api/v1`), so every single API call, not just domain listings, returned 404. Fixed locally.
- `MAIN_SITE_URL` was missing from `.env` entirely, which made three of the five top nav links (Domains, Parked Domains, Domain Appraisal) resolve to `undefined/...`. Fixed locally, value confirmed against the working staging deployment: `https://stage.endlessdomains.io`.

Both are local-only, untracked `.env` values, neither is caused by anything in this phase, and neither needed a code change. `NEXT_PUBLIC_` and `next.config.ts`-exposed values are read once at server start, so **the dev server needs a restart** after either of these changes before they take effect.

## How to test this phase, step by step

Some of this has already been verified automatically and doesn't need repeating; the rest needs a real account and a real or test wallet, and is written out exactly so nothing gets skipped.

### Already verified, no action needed

- The dev server serves the homepage with real domains rendering (`mohitagarwal.lfg`, `lucknowsupergiants.og`, and others), confirming the env fixes above are live.
- Every API call lands on `/api/v1/...` and returns 200 (or a normal 401 for endpoints that require login), confirming no leftover `404`s.
- Nav links resolve to `https://stage.endlessdomains.io/...` for Domains, Parked Domains, and Domain Appraisal.
- Clicking **Buy Now** on a grid card while logged out shows "Please log in to purchase the domain." and nothing else happens, no JavaScript errors anywhere on the page. This confirms the migrated hook's login check works end to end in a real browser, not just in the type checker.

### 1. Restart the dev server

If you haven't already since the two `.env` edits, stop it and run the dev command again. Confirm the homepage shows real domain cards before doing anything below, if it doesn't, stop here, this phase's test pass can't proceed on a blank grid.

### 2. Pick or create one test account in each of these three states

You'll cycle the same account through these states for every surface below, rather than needing four separate accounts:

- **State A, logged out.** Just don't log in.
- **State B, logged in, no wallet address saved.** Log in, but don't add a wallet address under Profile.
- **State C, logged in, wallet address saved, wallet not connected.** Add a wallet address in Profile, but don't connect a wallet in this browser session (or disconnect it if it auto-reconnects).
- **State D, logged in, wallet connected.** Connect the wallet through the normal flow.

### 3. Run this same four-state check on all five surfaces

For each surface below, click **Buy Now** once in each state and confirm the listed result before moving to the next state.

| Surface | Where to find it |
|---|---|
| Grid card | The main domain grid, e.g. `/web3-domain-item` or wherever the full listing grid lives |
| Homepage carousel | Homepage, "Premium Domains" and "Promoted Domains" sections |
| Watchlist | `/profile/watchlist`, needs at least one domain already saved there |
| Homepage inline | Homepage, "Trending Domains" section |
| Seller portfolio | `/seller-portfolio/<any seller's slug>`, "Listed" tab |

Expected result, same for every surface:

- **State A:** toast reads "Please log in to purchase the domain." Nothing else opens.
- **State B:** toast reads "Please add your Wallet Address in Profile to buy domains." and the page redirects to `/profile/userProfile`.
- **State C:** the wallet connect popup opens, not the buy popup. Connect the wallet inside it, confirm the buy popup then opens automatically for the *same domain you clicked*, not a blank one or the wrong one.
- **State D:** the buy popup opens directly, with the correct domain name, price, and network already filled in.

**Give the homepage inline surface extra attention in State C specifically.** Before this phase, this was the one surface that skipped the wallet check entirely, clicking Buy with a saved-but-unconnected wallet used to go straight to a broken buy attempt instead of prompting to connect. Confirming the wallet popup actually appears here is the one check in this whole list that catches a real regression if it fails.

### 4. Confirm tracking fires from all five, not just the grid

With the browser's network tab open, filter for the analytics call and repeat State D's click on each of the five surfaces. Before this phase only the grid card fired this; after it, all five should, watchlist and seller portfolio included.

### 5. Confirm it's really one shared popup, not five

Open a page with several domain cards visible (the grid or a carousel). Trigger the buy popup from one card, close it, then trigger it from a different card. Nothing should stack, and there should be exactly one buy popup and one wallet-connect popup existing at a time regardless of how many cards are on screen, check this with the browser's element inspector if it's not obvious from the UI alone.

### 6. Confirm the two untouched features on the grid card still work

Save/unsave a domain from the watchlist heart icon, and scroll a card into view to trigger its view-tracking. Neither of these is part of the buy gate, and neither should have changed, but they live in the same file that got edited, worth a quick look.

### 7. Confirm the seller portfolio dropped side effect didn't break anything

On the seller portfolio page specifically, run State C. The extra profile refetch that used to fire before opening the wallet popup was removed, since `WalletConect` already refetches the profile itself. Confirm the wallet popup still shows the right thing, "Connect Wallet" if nothing's connected, "Confirm Wallet Connection" if a wallet address already exists, same as it did before this file was touched.
