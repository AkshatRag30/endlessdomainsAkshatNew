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
│                                       modal triggers.
│
├── Perks.module.scss                ← Page-level styles only: root background,
│                                       filter bar, perks grid.
│
├── perks.data.ts                    ← All mock data, types (PerkItem, FilterTier,
│                                       PerkStatus, PerkTier), and NAV_LINKS.
│                                       Edit mock cards here.
│
├── PerksNavBar/
│   ├── PerksNavBar.tsx              ← Logo, nav links, gold button, menu, cart.
│   │                                   Gold button label/number live here.
│   ├── PerksNavBar.module.scss      ← All nav styles including the octagon gold
│   │                                   button gradient and dropdown hover logic.
│   └── index.ts
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

**File to edit:** `Perks.tsx` — line 20

```ts
// Line 20 — change true → false
const alreadyGmd = false   // ← false = user hasn't GM'd yet → GmModal opens
```

Then click the gold button in the top nav bar. The GmModal appears.

**To restore after previewing:**
```ts
const alreadyGmd = true
```

---

## 4. Modal 2 — GmStreakModal (Already GM'd today) — All 4 Tier Variants

**What it is:** Opens when a user clicks the gold button and HAS already GM'd today. Shows the user's streak, tier emblem, wallet address, and share/view TX actions.

**File to edit:** `Perks.tsx` — lines 20 and 103

### Step 1 — Make sure the streak modal is the one that opens (line 20)

```ts
// Line 20
const alreadyGmd = true   // ← true = user already GM'd → GmStreakModal opens
```

### Step 2 — Choose the tier variant (line 103)

```tsx
// Line 103 — change the tier prop
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

All props are optional — defaults are shown below. Edit them directly on line 103 in `Perks.tsx` to preview different data states:

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

## 5. Modal 3 — PerkClaimConfirmModal (Claim confirmation)

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

The gold button in the nav bar is the octagon button labelled "12 Gold" with the fire gif. It has two visual concerns: the number/label content, and which modal it triggers on click.

### Which modal it triggers

Controlled by `alreadyGmd` in `Perks.tsx` line 20:

```ts
const alreadyGmd = false   // → click opens GmModal
const alreadyGmd = true    // → click opens GmStreakModal
```

### The gold number displayed on the button

**File:** `PerksNavBar/PerksNavBar.tsx` — line 72

```tsx
// Line 72 — change "12" to any number to preview different gold counts
<span className={styles.perksNavGoldNum}>12</span>
```

### The hover dropdown (GoldStatsDropdown)

Hover over the gold button — the `GoldStatsDropdown` appears automatically via CSS `:hover` on `.goldHoverWrap`. No code change needed. Its data and layout live in:

```
src/design-system/primitives/perks/GoldStatsDropdown/
```

---

## 8. Quick-Reference Cheat Sheet

| What to preview | File | Line | Change |
|---|---|---|---|
| GmModal (first GM) | `Perks.tsx` | 20 | `alreadyGmd = false` |
| GmStreakModal (already GM'd) | `Perks.tsx` | 20 | `alreadyGmd = true` |
| GmStreakModal — bronze tier | `Perks.tsx` | 103 | `tier="bronze"` |
| GmStreakModal — silver tier | `Perks.tsx` | 103 | `tier="silver"` |
| GmStreakModal — gold tier | `Perks.tsx` | 103 | `tier="gold"` |
| GmStreakModal — platinum tier | `Perks.tsx` | 103 | `tier="platinum"` |
| PerkClaimConfirmModal (isolated) | `PerkCard/PerkCard.tsx` | 42 | `useState(true)` |
| PerkClaimSuccessModal (isolated) | `PerkCard/PerkCard.tsx` | 43 | `useState(true)` |
| Gold button number | `PerksNavBar/PerksNavBar.tsx` | 72 | Change `12` to any value |

---

## 9. Revert Checklist

After previewing, always revert these values before committing:

- [ ] `Perks.tsx` line 20 → `const alreadyGmd = true`
- [ ] `Perks.tsx` line 103 → remove any hardcoded `tier` prop (or set back to `"bronze"`)
- [ ] `PerkCard/PerkCard.tsx` line 42 → `useState(false)`
- [ ] `PerkCard/PerkCard.tsx` line 43 → `useState(false)`
