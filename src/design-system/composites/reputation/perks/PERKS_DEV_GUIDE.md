# Perks Page — Developer Preview Guide

Quick reference for previewing every modal, every gold button variant, and navigating the folder structure during local development.

---

## 1. Folder Structure

```
src/design-system/composites/reputation/perks/
│
├── Perks.tsx                        ← Page orchestrator. Holds all state and
│                                       renders the top-level layout. This is
│                                       the only file you touch to switch between
│                                       modal triggers and gold button variants.
│
├── Perks.module.scss                ← Page-level styles only: root background,
│                                       filter bar, perks grid.
│
├── perks.data.ts                    ← All mock data, types (PerkItem, FilterTier,
│                                       PerkStatus, PerkTier), and NAV_LINKS.
│                                       Edit mock cards here.
│
├── PerksNavBar/
│   ├── PerksNavBar.tsx              ← Logo, nav links, gold button (all 3 variants),
│   │                                   menu, cart. Exports GoldButtonVariant type.
│   ├── PerksNavBar.module.scss      ← All nav styles: octagon gold gradient,
│   │                                   enable-rep dashed orange, connect-wallet grey,
│   │                                   and GoldStatsDropdown hover logic.
│   └── index.ts                     ← Re-exports PerksNavBar + GoldButtonVariant type.
│
├── TierProgressHeader/
│   ├── TierProgressHeader.tsx       ← The 79px stripe bar (silver → gold progress).
│   │                                   Hardcoded mock segments and diamond position.
│   ├── TierProgressHeader.module.scss
│   └── index.ts
│
└── PerkCard/
    ├── PerkCard.tsx                 ← Single perk card. Also owns PerkClaimConfirmModal
    │                                   and PerkClaimSuccessModal — they open from here.
    ├── PerkCard.module.scss         ← Card shell, header gradients, status badges,
    │                                   CTA button, locked progress segments.
    └── index.ts
```

The four modals live in a separate tree and are imported by the files above:

```
src/design-system/primitives/perks/
│
├── GmModal/                         ← "First GM of the day" modal.
│   ├── GmModal.tsx
│   ├── GmModal.module.scss
│   └── index.ts
│
├── GmStreakModal/                   ← "Already GM'd today" modal with tier emblem.
│   ├── GmStreakModal.tsx            ← tier prop controls emblem + badge variant.
│   ├── GmStreakModal.module.scss
│   └── index.ts
│
├── PerkClaimConfirmModal/           ← Confirmation step when claiming a perk.
│   ├── PerkClaimConfirmModal.tsx
│   ├── PerkClaimConfirmModal.module.scss
│   └── index.ts
│
└── PerkClaimSuccessModal/           ← Success screen after a perk is claimed.
    ├── PerkClaimSuccessModal.tsx
    ├── PerkClaimSuccessModal.module.scss
    └── index.ts
```

---

## 2. How to Preview — Start the Dev Server

```bash
npm run dev
```

Open `http://localhost:3000` and navigate to the Perks page.

---

## 3. Modal 1 — GmModal (First GM of the day)

**What it is:** Opens when a user clicks the gold button and has NOT yet GM'd today.

**Prerequisites:** The gold button variant must be `'gold'` (line 24) — GmModal only opens when reputation is enabled and a wallet is connected. Then set `alreadyGmd` to `false`.

**File to edit:** `Perks.tsx` — lines 24 and 27

```ts
// Line 24 — must be 'gold' for any modal to open
const goldButtonVariant: GoldButtonVariant = 'gold'

// Line 27 — change true → false
const alreadyGmd = false   // ← false = user hasn't GM'd yet → GmModal opens
```

Then click the gold button in the top nav bar. The GmModal appears.

**To restore after previewing:**
```ts
const goldButtonVariant: GoldButtonVariant = 'gold'
const alreadyGmd = true
```

---

## 4. Modal 2 — GmStreakModal (Already GM'd today) — All 4 Tier Variants

**What it is:** Opens when a user clicks the gold button and HAS already GM'd today. Shows the user's streak, tier emblem, wallet address, and share/view TX actions.

**File to edit:** `Perks.tsx` — lines 24, 27, and 111

### Step 1 — Make sure the streak modal is the one that opens (lines 24 + 27)

```ts
// Line 24
const goldButtonVariant: GoldButtonVariant = 'gold'   // ← must be 'gold'

// Line 27
const alreadyGmd = true   // ← true = user already GM'd → GmStreakModal opens
```

### Step 2 — Choose the tier variant (line 111)

```tsx
// Line 111 — change the tier prop
<GmStreakModal isOpen={showStreakModal} onClose={handleStreakModalClose} tier="bronze" />
```

| Value | What you see |
|---|---|
| `tier="bronze"` | Bronze emblem SVG, Bronze badge |
| `tier="silver"` | Silver emblem SVG, Silver badge |
| `tier="gold"` | Gold emblem SVG, Gold badge |
| `tier="platinum"` | Platinum emblem SVG, Platinum badge |

Each value swaps the emblem illustration and the tier badge simultaneously. No other changes needed.

### Full prop reference for GmStreakModal

All props are optional — defaults are shown below. Edit them directly on line 111 in `Perks.tsx` to preview different data states:

```tsx
<GmStreakModal
  isOpen={showStreakModal}
  onClose={handleStreakModalClose}
  tier="gold"                          // 'bronze' | 'silver' | 'gold' | 'platinum'
  username="myname.ud"                 // displayed next to avatar
  streakDays={13}                      // large number shown in streak section
  ptsToNextTier={340}                  // "340 pts to Gold"
  nextTierLabel="Gold"                 // the tier name shown in orange gradient
  chain="Polygon"                      // chain name in the wallet row
  walletAddress="0x723FE05c...DfEdD"   // truncated address shown + copyable
/>
```

---

## 5. Modal — GmPendingModal + GmTransactionFailedModal

These two modals live inside `GmModal` and are controlled by its internal `gmStatus` state. There is no UI path that sets `gmStatus` to `'failed'` yet. To force-preview either screen you need **two changes** — one to open the modal, one to set the status.

**Important:** GmModal has `if (!isOpen) return null` at the top. Changing `gmStatus` alone does nothing if the modal is not open. Always set `showGmModal` to `true` first.

### Step 1 — Force GmModal open on page load

**File:** `Perks.tsx` — line 17

```ts
// Line 17 — change false → true
const [showGmModal, setShowGmModal] = useState(true)
```

### Step 2 — Choose which inner screen to show

**File:** `src/design-system/primitives/perks/GmModal/GmModal.tsx` — line 91

#### GmPendingModal (transaction in progress)

```ts
// GmModal.tsx line 91 — change 'idle' → 'pending'
const [gmStatus, setGmStatus] = useState<'idle' | 'pending' | 'failed'>('pending')
```

#### GmTransactionFailedModal (transaction failed)

```ts
// GmModal.tsx line 91 — change 'idle' → 'failed'
const [gmStatus, setGmStatus] = useState<'idle' | 'pending' | 'failed'>('failed')
```

The modal appears immediately on page load with no button click needed.

**Revert both after reviewing:**
```ts
// Perks.tsx line 17
const [showGmModal, setShowGmModal] = useState(false)

// GmModal.tsx line 91
const [gmStatus, setGmStatus] = useState<'idle' | 'pending' | 'failed'>('idle')
```

---

## 6. Modal 3 — PerkClaimConfirmModal (Claim confirmation)

**What it is:** Opens when a user clicks the "Claim" CTA on an available perk card.

**How to trigger:** No code change needed. The mock data already has cards with `status: 'claimable'` and `status: 'available'`. Click any card whose button reads **Claim** — the confirmation modal opens immediately.

**File that owns it:** `PerkCard/PerkCard.tsx` — lines 42–43

```ts
// Lines 42–43 — these states drive the modal
const [showConfirm, setShowConfirm] = useState(false)
const [showSuccess, setShowSuccess] = useState(false)
```

**To force it open without clicking a card** (useful for isolated UI review), temporarily set the initial state to `true`:

```ts
// PerkCard/PerkCard.tsx — line 42
const [showConfirm, setShowConfirm] = useState(true)   // ← opens on mount
```

Remember to revert to `false` after reviewing.

---

## 6. Modal 4 — PerkClaimSuccessModal (Claim success)

**What it is:** Opens automatically after the user confirms a claim (i.e. after PerkClaimConfirmModal's confirm button is clicked).

**How to trigger normally:** Click Claim on a card → confirm in the confirm modal → success modal appears.

**To force it open directly** (isolated UI review):

```ts
// PerkCard/PerkCard.tsx — line 43
const [showSuccess, setShowSuccess] = useState(true)   // ← opens on mount
```

Remember to revert to `false` after reviewing.

---

## 7. Gold Button Variants

There are three distinct gold button states, each rendering a completely different visual. All three are controlled by a single variable in `Perks.tsx`.

**File to edit:** `Perks.tsx` — line 24

```ts
const goldButtonVariant: GoldButtonVariant = 'gold'
```

| Value | When it shows | Visual |
|---|---|---|
| `'gold'` | Wallet connected + reputation enabled | Warm gold octagon with fire gif, number, "Gold" label. Hover shows GoldStatsDropdown. Click opens GmModal or GmStreakModal. |
| `'enable-rep'` | Wallet connected, reputation NOT enabled | Light peach rounded rect, dashed orange border, orange donut icon, "Enable Rep." in orange. Click does nothing until wired to enable-rep flow. |
| `'connect-wallet'` | Wallet NOT connected | Light grey rounded rect, thin grey border, fire gif icon, "Connect Wallet" in dark. Click does nothing until wired to wallet connect flow. |

### The gold number displayed on the button (gold variant only)

**File:** `PerksNavBar/PerksNavBar.tsx` — line 83

```tsx
// Line 83 — change "12" to any number to preview different gold counts
<span className={styles.perksNavGoldNum}>12</span>
```

### Which modal the gold button triggers (gold variant only)

Controlled by `alreadyGmd` in `Perks.tsx` line 27:

```ts
const alreadyGmd = false   // → click opens GmModal (first GM of the day)
const alreadyGmd = true    // → click opens GmStreakModal (already GM'd today)
```

Note: when `goldButtonVariant` is `'enable-rep'` or `'connect-wallet'`, clicking the button does nothing regardless of `alreadyGmd`. The guard lives in `handleGoldClick` (line 33–37).

### The hover dropdown (GoldStatsDropdown) — gold variant only

Hover over the gold button — the `GoldStatsDropdown` appears automatically via CSS `:hover` on `.goldHoverWrap`. No code change needed. Its data and layout live in:

```
src/design-system/primitives/perks/GoldStatsDropdown/
```

The dropdown does NOT appear for `'enable-rep'` or `'connect-wallet'` — those variants do not wrap in `.goldHoverWrap`.

---

## 8. Quick-Reference Cheat Sheet

| What to preview | File | Line | Change |
|---|---|---|---|
| Gold button — normal state | `Perks.tsx` | 24 | `goldButtonVariant = 'gold'` |
| Gold button — Enable Rep. state | `Perks.tsx` | 24 | `goldButtonVariant = 'enable-rep'` |
| Gold button — Connect Wallet state | `Perks.tsx` | 24 | `goldButtonVariant = 'connect-wallet'` |
| GmModal (first GM) | `Perks.tsx` | 27 | `alreadyGmd = false` (+ variant must be `'gold'`) |
| GmStreakModal (already GM'd) | `Perks.tsx` | 27 | `alreadyGmd = true` (+ variant must be `'gold'`) |
| GmStreakModal — bronze tier | `Perks.tsx` | 111 | `tier="bronze"` |
| GmStreakModal — silver tier | `Perks.tsx` | 111 | `tier="silver"` |
| GmStreakModal — gold tier | `Perks.tsx` | 111 | `tier="gold"` |
| GmStreakModal — platinum tier | `Perks.tsx` | 111 | `tier="platinum"` |
| GmPendingModal (isolated) | `Perks.tsx` + `GmModal/GmModal.tsx` | 17 + 91 | `useState(true)` then `useState<...>('pending')` |
| GmTransactionFailedModal (isolated) | `Perks.tsx` + `GmModal/GmModal.tsx` | 17 + 91 | `useState(true)` then `useState<...>('failed')` |
| PerkClaimConfirmModal (isolated) | `PerkCard/PerkCard.tsx` | 42 | `useState(true)` |
| PerkClaimSuccessModal (isolated) | `PerkCard/PerkCard.tsx` | 43 | `useState(true)` |
| Gold button number | `PerksNavBar/PerksNavBar.tsx` | 83 | Change `12` to any value |

---

## 9. Revert Checklist

After previewing, always revert these values before committing:

- [ ] `Perks.tsx` line 24 → `const goldButtonVariant: GoldButtonVariant = 'gold'`
- [ ] `Perks.tsx` line 27 → `const alreadyGmd = true`
- [ ] `Perks.tsx` line 111 → remove any hardcoded `tier` prop (or set back to `"bronze"`)
- [ ] `Perks.tsx` line 17 → `useState(false)`
- [ ] `GmModal/GmModal.tsx` line 91 → `useState<'idle' | 'pending' | 'failed'>('idle')`
- [ ] `PerkCard/PerkCard.tsx` line 42 → `useState(false)`
- [ ] `PerkCard/PerkCard.tsx` line 43 → `useState(false)`
