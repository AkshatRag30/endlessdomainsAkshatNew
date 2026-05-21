# Waitlist Page — Code Guide

This document explains every file, component, and data flow in the waitlist feature so you can read, extend, or hand off the work without digging through the source.

---

## Table of Contents

1. [What the page does](#1-what-the-page-does)
2. [File map](#2-file-map)
3. [Page entry point](#3-page-entry-point)
4. [Component breakdown](#4-component-breakdown)
   - [WaitlistNav](#waitlistnav)
   - [WaitlistHero](#waitlisthero)
   - [WaitlistStatRow](#waitliststatrow)
   - [WaitlistEmailCard (multi-step form)](#waitlistemailcard-multi-step-form)
   - [WaitlistLeaderboard](#waitlistleaderboard)
5. [State flow and data passing](#5-state-flow-and-data-passing)
6. [Multi-step form — step by step](#6-multi-step-form-step-by-step)
7. [Styling rules](#7-styling-rules)
8. [How to wire up real APIs](#8-how-to-wire-up-real-apis)

---

## 1. What the page does

The waitlist page lives at `/waitlist`. It shows a landing hero with a 4-step registration form on the right and a teaser leaderboard below. The leaderboard is blurred until the user completes all 4 steps. After registration the blur lifts and the full leaderboard is visible.

Everything is currently **static with demo data** — no API calls, no backend. The team integrates real endpoints by replacing the handlers described in section 8.

---

## 2. File map

```
pages/
└── waitlist/
    ├── index.tsx                    ← Route entry point, owns isRegistered state
    └── waitlist.module.scss         ← Page shell (min-height, flex column)

src/design-system/composites/waitlist/
    ├── index.ts                     ← Barrel exports for all waitlist components
    ├── WaitlistNav.tsx              ← Sticky top nav bar
    ├── WaitlistNav.module.scss
    ├── WaitlistHero.tsx             ← Two-column hero section
    ├── WaitlistHero.module.scss
    ├── WaitlistStatRow.tsx          ← 3-stat row with corner bracket decoration
    ├── WaitlistStatRow.module.scss
    ├── WaitlistEmailCard.tsx        ← 4-step registration form (the main interactive piece)
    ├── WaitlistEmailCard.module.scss
    ├── WaitlistLeaderboard.tsx      ← Blurred/revealed leaderboard table
    └── WaitlistLeaderboard.module.scss
```

---

## 3. Page entry point

**File:** [pages/waitlist/index.tsx](../pages/waitlist/index.tsx)

This is the only file that holds shared state. It owns one boolean — `isRegistered` — that controls whether the leaderboard blur is on or off.

```tsx
const [isRegistered, setIsRegistered] = useState(false)

const handleComplete = useCallback(() => {
  setIsRegistered(true)
}, [])
```

It passes `onComplete` down to `WaitlistHero` and `isJoined` down to `WaitlistLeaderboard`. These two siblings cannot talk to each other directly, so the page acts as the coordinator.

```tsx
<WaitlistHero onComplete={handleComplete} />
<WaitlistLeaderboard isJoined={isRegistered} />
```

The page also holds all SEO meta tags (title, description, og:title, og:description, robots).

---

## 4. Component breakdown

### WaitlistNav

**File:** [WaitlistNav.tsx](../src/design-system/composites/waitlist/WaitlistNav.tsx)

A sticky navigation bar at the top of the page. Contains the Endless Domains logo on the left and an "Already Registered?" button on the right. Both are currently static with no handlers.

Props: none.

To wire up: pass an `onAlreadyRegistered` prop and call your auth/login flow from the button's `onClick`.

---

### WaitlistHero

**File:** [WaitlistHero.tsx](../src/design-system/composites/waitlist/WaitlistHero.tsx)

A two-column section (grid on desktop, stacked on mobile).

Left column contains:
- A phase tag (`PHASE 1 · IDENTITY OS · JUNE 2026`) with CSS corner bracket decoration
- The main H1 with `<mark>` elements for the blue highlighted words
- A description paragraph
- `WaitlistStatRow`

Right column contains a blue panel (`visualWrap`) with `WaitlistEmailCard` centered inside it.

Props:

| Prop | Type | Purpose |
|---|---|---|
| `onComplete` | `() => void` (optional) | Called by the form when step 4 is submitted. Bubbles up to the page to trigger leaderboard reveal. |

The hero simply threads `onComplete` straight through to `WaitlistEmailCard` — it does not hold any state itself.

Note: `visualWrap` intentionally has no `overflow: hidden` so the chain dropdown in step 2 can extend below the panel without being clipped.

---

### WaitlistStatRow

**File:** [WaitlistStatRow.tsx](../src/design-system/composites/waitlist/WaitlistStatRow.tsx)

Renders a horizontal row of 3 stat boxes below the hero description. The current values are hardcoded demo data:

- 50 pts on sign-up
- 100 pts per referral
- Top 500 gets early access

Each box uses a CSS `background-image` gradient trick to draw 8 thin lines at the corners, creating the L-bracket decoration without any extra DOM elements. The same technique is used on the phase tag in the hero.

Props: none.

---

### WaitlistEmailCard (multi-step form)

**File:** [WaitlistEmailCard.tsx](../src/design-system/composites/waitlist/WaitlistEmailCard.tsx)

This is the main interactive piece. It manages a 4-step registration flow entirely with local `useState`. No external state management is involved.

**Internal state:**

| State | Type | What it holds |
|---|---|---|
| `step` | `1 | 2 | 3 | 4` | Which step is currently showing |
| `submitted` | `boolean` | True after "Enter The OS" is clicked |
| `email` | `string` | User's email (step 1) |
| `selectedChain` | `ChainOption` | Selected blockchain (step 2) |
| `chainOpen` | `boolean` | Whether the chain dropdown is open |
| `walletAddress` | `string` | Manually pasted wallet address (step 2) |
| `referralCode` | `string` | Referral code entered (step 3) |

**Props:**

| Prop | Type | Purpose |
|---|---|---|
| `onComplete` | `() => void` (optional) | Called when step 4 is submitted. Triggers leaderboard reveal. |

**Internal structure:**

The component renders two sub-components defined in the same file:

`StepBar` — renders the four step pills (Step 1 / Step 2 / Step 3 / Step 4) connected by horizontal lines. The pill turns blue when `currentStep >= stepNumber`. The connector line turns blue when `currentStep > stepNumber` (i.e., the step to its left is already done).

`ConnectorTicks` — renders three thin vertical lines between the step bar and the card, purely decorative.

Below those sits the `.card` div that swaps its content based on `step`:

```
submitted=true  →  Success state (green check icon)
step === 1      →  Email input + Continue
step === 2      →  Chain dropdown + Connect wallet + Address input + Continue + Back
step === 3      →  Skip link + Referral code input + (success banner if valid) + Continue + Back
step === 4      →  Review table + Points banner + Legal text + Enter The OS + Back
```

**Chain dropdown (step 2):**

The dropdown is a custom implementation — not a native `<select>`. It is toggled purely via a CSS class on the parent div (`.chainDropdownOpen`). No inline styles are used. The four chains and their brand colors are:

| Chain | Icon | Color in SCSS |
|---|---|---|
| Bitcoin | `SiBitcoin` | `#F7931A` (design-specific) |
| Ethereum | `SiEthereum` | `#627EEA` (design-specific) |
| Solana | `SiSolana` | `#9945FF` (design-specific) |
| BNB Chain | `SiBinance` | `#F3BA2F` (design-specific) |

Colors are applied via `data-chain` attribute selectors in SCSS, not inline styles.

**Referral validation (step 3):**

Currently validates against a single hardcoded demo code:

```ts
const DEMO_REFERRAL = 'ED-A7K2-X9PQ'
const isValidReferral = referralCode === DEMO_REFERRAL
```

When the code matches, the input border turns green and a success banner appears. The total points shown in step 4 also update: `50 (base) + 100 (referral) = 150`.

**Edit buttons (step 4):**

Each row in the review table has an "Edit ↗" button that calls `goTo(stepNumber)`, jumping directly to that step so the user can change their input.

---

### WaitlistLeaderboard

**File:** [WaitlistLeaderboard.tsx](../src/design-system/composites/waitlist/WaitlistLeaderboard.tsx)

Renders a dark gradient section with a table of 8 demo leaderboard entries.

Props:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `isJoined` | `boolean` | `false` | When false, blurs the table and shows the join CTA overlay. When true, removes all overlays and shows the full table. |

**When `isJoined` is false (default):**
- Table wrapper gets the `.tableBlur` class (`filter: blur(5px)`, `pointer-events: none`, `user-select: none`)
- A gradient fade overlay sits on top of the table
- A centered CTA card appears over the blurred content with a "Join The Waitlist" button

**When `isJoined` is true (after registration):**
- `.tableBlur` class is not applied
- The fade overlay and CTA card are not rendered
- The full table is readable

The table columns are: Rank, User, Actions Taken, Domains Owned, Chain Activity, Score. Rank 1 renders a gold trophy icon (`FiAward`) instead of the number.

---

## 5. State flow and data passing

```
WaitlistPage (index.tsx)
├── isRegistered: boolean           ← shared state lives here
│
├── WaitlistHero
│   └── onComplete={() => setIsRegistered(true)}
│       └── WaitlistEmailCard
│           └── onComplete (called on step 4 submit)
│               └── sets submitted=true (local)
│               └── calls onComplete prop (bubbles up)
│
└── WaitlistLeaderboard
    └── isJoined={isRegistered}     ← receives the result
        └── removes blur when true
```

The `WaitlistHero` is just a pass-through. It accepts `onComplete` and forwards it. All real logic happens in `WaitlistEmailCard` (form state) and `WaitlistPage` (shared flag).

---

## 6. Multi-step form — step by step

### Step 1: Email

The user enters their email address. Clicking "Continue" calls `goNext()` which increments `step` to 2. No validation is enforced in the demo — the button always advances.

### Step 2: Wallet Connection

Two ways to connect:

1. Pick a chain from the custom dropdown, then click "Connect With Wallet" (currently a static button with no handler)
2. Paste a wallet address manually into the dark monospace input field

The `displayWallet` value falls back to a demo address (`0x5CE1F1093FD5...`) if the input is empty, so step 4 always shows a wallet address in the review.

"Continue" advances to step 3. "Back" returns to step 1.

### Step 3: Referral Code (Optional)

The user can skip this step entirely via "Skip This Step →" (calls `goNext()`).

If they type a code, the component uppercases it on every keystroke (`toUpperCase()`). When the code matches `ED-A7K2-X9PQ`, the input turns green-bordered and a success banner appears with `aria-live="polite"` so screen readers announce it.

The referral code adds 100 points to the total shown in step 4.

"Continue" advances to step 4. "Back" returns to step 2.

### Step 4: Confirmation

Displays a review table with three rows — Email, Wallet, and Ref Code. Each row has an "Edit ↗" button that jumps directly back to the relevant step. The wallet address in the review is shortened to `0x1A2B...5678` format.

The points banner below the table shows the running total:
- Without referral code: `+50 Pts`
- With valid referral code: `+150 Pts`

Clicking "Enter The OS" calls `handleSubmit`, which sets `submitted = true` and fires `onComplete`. "Back" returns to step 3.

### After Submit (Success State)

Once `submitted` is true, the card replaces the step 4 content with a centred success message:
- Green circle with a check icon
- "You're In The OS." heading
- Hint text prompting the user to scroll down

Simultaneously, `onComplete` has already fired which set `isRegistered = true` at the page level, causing the leaderboard to reveal itself below.

---

## 7. Styling rules

All styles use `_tokens.scss` CSS custom properties — no hardcoded hex values or pixel values except in two categories:

**Design-specific values (kept raw with a comment):**
- Chain brand colors (`#F7931A`, `#627EEA`, etc.) — no token equivalents
- `filter: blur(5px)` on the leaderboard — Figma-exact, no token
- `height: 48px` on inputs — Figma-exact input height
- `width: 80px` on review label column — Figma-exact layout column
- `height: 1px` on connector lines and ticks — stroke thickness, no spacing token
- Amber glow `box-shadow` on points banner — `var(--color-amber)` is used, which is a token, but the glow style is Figma-exact
- Green success background `rgba(34, 197, 94, 0.12)` — no light-green-alpha token exists
- Inactive step pill background `rgba(0, 0, 0, 0.36)` — no dark-gray-alpha token exists
- Blue glow shadow `rgba(38, 57, 237, 0.1)` on the visual panel — no exact blue-alpha-10 shadow token

**Corner dot decoration:**

Both the step bar and form card use a `%cornerDots` SCSS placeholder (extend pattern) that places four 5px radial-gradient circles at the corners of each panel. The outer wrapper also has its own set of four larger 7px corner dots at the extreme boundaries of the entire form area. No extra DOM nodes are needed for any of these — all are pure CSS background-image gradients.

Important: panel rules that use `@extend %cornerDots` must set their background color with `background-color:` (not the `background:` shorthand). The shorthand resets `background-image`, which would silently wipe the corner dots from the compiled CSS.

**Dropdown open/close:**

The chain dropdown uses a CSS class toggle (`.chainDropdownOpen` on the parent div) to show/hide the options list. There are no inline styles anywhere — all state-dependent CSS is handled via class names.

---

## 9. Form visual design — Figma pass (2026-05-21)

This section documents a targeted visual pass applied to match the Figma design more precisely. No HTML structure or component logic was changed — only SCSS rules were updated.

### What was changed and where

#### `WaitlistHero.module.scss` — `.visualWrap`

**Before:** background was `var(--color-blue-light)` (`#e9ebfd`), no shadow.

**After:**

```scss
.visualWrap {
  background: var(--color-gray-light-bg); // #f8f8f8 — near-white, matching Figma #f8f6f6
  box-shadow: -35px -11px 62px 0 rgba(38, 57, 237, 0.1); // Figma-exact blue glow from top-left
}
```

Why: the outer panel that wraps the entire form area should be a near-white off-white, not a visibly blue tint. The Figma applies the blue color treatment as a directional glow shadow from the top-left, not as a background color.

---

#### `WaitlistEmailCard.module.scss` — `.wrapper`

**Before:** simple flex column, no decoration.

**After:** the wrapper now renders the outer frame decoration from the Figma design — a top and bottom 1px horizontal border line (via `::before` and `::after` pseudo-elements) and four 7px corner dot markers at the extreme corners of the entire form area (via `background-image` radial gradients).

```scss
.wrapper {
  position: relative;

  // top and bottom horizontal lines
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: var(--color-gray-300);
    pointer-events: none;
  }
  &::before { top: 0; }
  &::after  { bottom: 0; }

  // 4 outer corner dots (7px each, at the extreme boundary of the form)
  background-image:
    radial-gradient(circle, var(--color-gray-300) 3px, transparent 3px),
    radial-gradient(circle, var(--color-gray-300) 3px, transparent 3px),
    radial-gradient(circle, var(--color-gray-300) 3px, transparent 3px),
    radial-gradient(circle, var(--color-gray-300) 3px, transparent 3px);
  background-position: 0 0, 100% 0, 0 100%, 100% 100%;
  background-size: 7px 7px;
  background-repeat: no-repeat;
}
```

---

#### `WaitlistEmailCard.module.scss` — `%cornerDots`

**Before:** 4px dots using `var(--color-gray-300)` positioned `4px` from each corner.

**After:** 5px dots using `var(--color-gray-medium)` positioned `8px` from each corner. This more closely matches the Figma panel inner corner markers (Group 2085666142 in the Figma file, ~5.2px).

---

#### `WaitlistEmailCard.module.scss` — `.stepBar`

**Before:** `border: 1px solid var(--color-gray-200)`, no background, no shadow.

**After:**

```scss
.stepBar {
  background-color: var(--color-gray-light-bg); // #f8f8f8 panel bg
  border: 0.5px solid var(--color-black-alpha-10); // ultra-thin Figma-exact border
  box-shadow:
    0 4px 12px var(--color-black-alpha-05),       // subtle drop shadow
    inset 0 0 0 1px var(--color-border-black-subtle); // inset border overlay
}
```

Note: `background-color` is used here (not `background`) so the corner dots from `@extend %cornerDots` are not overridden. The `background` shorthand would silently reset `background-image`.

---

#### `WaitlistEmailCard.module.scss` — `.card`

**Before:** `border: 1px solid var(--color-gray-200)`, `background: var(--color-white-primary)` (shorthand — was silently killing the corner dots), `background-blend-mode: normal`.

**After:**

```scss
.card {
  background-color: var(--color-white-primary); // shorthand replaced with background-color
  border: 0.5px solid var(--color-black-alpha-10);
  box-shadow:
    0 4px 12px var(--color-black-alpha-05),
    inset 0 0 0 1px var(--color-border-black-subtle);
}
```

The `background-blend-mode: normal` comment was removed — it was never doing anything useful and was misleading.

---

#### `WaitlistEmailCard.module.scss` — `.stepPill` and `.stepPillActive`

**Before:** inactive pill was light gray (`var(--color-gray-200)`) with dark gray text. Active pill had no inner glow.

**After:** both states now match the Figma pill treatment.

```scss
// Inactive pill — dark semi-transparent, white text, inset white glow
.stepPill {
  background: rgba(0, 0, 0, 0.36);
  color: var(--color-white-primary);
  border-radius: var(--radius-sm); // changed from --radius-full (pill) to sm (rounded rect)
  padding: var(--space-1) var(--space-3); // reduced vertical padding to match Figma height
  box-shadow: inset 0 0 8px var(--color-white-primary); // Figma inner white glow
}

// Active pill — blue bg, same inset white glow
.stepPillActive {
  background: var(--color-blue-primary);
  box-shadow: inset 0 0 8px var(--color-white-primary);
}
```

The inset white glow (`inset 0 0 8px white`) is applied to both active and inactive pills. It creates a subtle inner bloom effect that the Figma applies to all four step pills regardless of state.

---

## 8. How to wire up real APIs

Below is what each static piece needs to become functional:

### Step 1: Submit email to backend

In `WaitlistEmailCard.tsx`, locate `goNext` called from the Continue button in step 1. Replace with:

```tsx
const handleEmailSubmit = useCallback(async () => {
  await yourApiService.submitEmail({ email })
  goNext()
}, [email, goNext])
```

Pass `onClick={handleEmailSubmit}` to the PrimaryButton.

### Step 2: Wallet connection

The "Connect With Wallet" button should trigger your wallet connect flow (Wagmi `useConnect` or Reown AppKit). Once connected, populate `walletAddress` via `setWalletAddress(connectedAddress)`.

```tsx
const { connect } = useConnect()

const handleConnectWallet = useCallback(async () => {
  const address = await connect({ chain: selectedChain })
  setWalletAddress(address)
}, [connect, selectedChain])
```

### Step 3: Validate referral code server-side

Replace the hardcoded check with an API call:

```tsx
const [isValidReferral, setIsValidReferral] = useState(false)

useEffect(() => {
  if (referralCode.length < 10) return
  yourApiService.validateReferral(referralCode).then(valid => {
    setIsValidReferral(valid)
  })
}, [referralCode])
```

Remove the `DEMO_REFERRAL` constant once real validation is in place.

### Step 4: Final registration submit

Replace `handleSubmit` with a real API call:

```tsx
const handleSubmit = useCallback(async () => {
  await yourApiService.registerWaitlist({
    email,
    walletAddress: displayWallet,
    chain: selectedChain.id,
    referralCode: isValidReferral ? referralCode : undefined,
  })
  setSubmitted(true)
  onComplete?.()
}, [email, displayWallet, selectedChain, referralCode, isValidReferral, onComplete])
```

Add loading and error states as needed — `PrimaryButton` accepts a `loading` prop that shows a spinner.

### Leaderboard: real data

Replace `DEMO_DATA` in `WaitlistLeaderboard.tsx` with a `useEffect` + service call. Pass the `isJoined` prop from the page as before — that logic stays the same regardless of where the data comes from.

### "Already Registered?" nav button

In `WaitlistNav.tsx`, add an `onAlreadyRegistered` prop and wire it to your auth flow from the page level.
