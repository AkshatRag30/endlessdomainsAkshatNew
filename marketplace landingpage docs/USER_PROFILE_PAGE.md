# User Profile Page — Code Review Guide

For the senior developer reviewing and integrating the User Profile page from `new-design-ed` into main.

---

## Table of Contents

1. [Page Entry Point](#1-page-entry-point)
2. [Directory Map](#2-directory-map)
3. [Design Tokens (Key)](#3-design-tokens-key)
4. [Page-Level Composites](#4-page-level-composites)
5. [Section Components](#5-section-components)
6. [Primitives](#6-primitives)
7. [SCSS Mixins](#7-scss-mixins)
8. [Responsive Summary](#8-responsive-summary)
9. [Integration Checklist](#9-integration-checklist)

---

## 1. Page Entry Point

**`src/design-system/composites/userprofile/UserProfilePage.tsx`** — root component, no props.

```
TopNavBar → DashboardTabBar → main.content
  └─ ProfileHeader
  └─ .sections (gap 20px)
       ├─ AccountSection
       ├─ WalletSection
       ├─ ChangePasswordSection
       └─ .saveActions → PrimaryButton "Save Changes"
SiteFooter
```

The Save Changes button is **outside all section cards** in its own white `.saveActions` wrapper.

---

## 2. Directory Map

```
src/
├── design-system/
│   ├── composites/userprofile/
│   │   ├── UserProfilePage.tsx
│   │   └── UserProfilePage.module.scss
│   ├── primitives/
│   │   ├── button/
│   │   │   ├── PrimaryButton.tsx / .module.scss
│   │   │   ├── TabButton.tsx / .module.scss
│   │   │   └── NavLink.tsx / .module.scss
│   │   ├── display/
│   │   │   ├── Avatar.tsx / .module.scss
│   │   │   └── SectionCard.tsx / .module.scss
│   │   └── input/
│   │       ├── TextInput.tsx / .module.scss
│   │       ├── PhoneInputField.tsx / .module.scss
│   │       ├── PasswordInput.tsx / .module.scss
│   │       ├── PasswordStrengthMeter.tsx / .module.scss
│   │       ├── WalletAddressInput.tsx / .module.scss
│   │       └── VerifyBadge.tsx / .module.scss
│   └── styles/
│       ├── _tokens.scss         ← single source of truth
│       └── _mixins.scss
└── components/userprofile/
    ├── TopNavBar.tsx / .module.scss
    ├── DashboardTabBar.tsx / .module.scss
    ├── ProfileHeader.tsx / .module.scss
    ├── AccountSection.tsx / .module.scss
    ├── WalletSection.tsx / .module.scss
    ├── ChangePasswordSection.tsx / .module.scss
    └── SiteFooter.tsx / .module.scss
```

---

## 3. Design Tokens (Key)

All values come from `_tokens.scss` — no hardcoded hex or px values anywhere.

| Token | Value | Used for |
|---|---|---|
| `--color-blue-primary` | #2639ED | Active tab, buttons, focus, underline |
| `--color-black-primary` | #000 | Wallet add button bg, text |
| `--color-white-primary` | #fff | Card/nav backgrounds, button text |
| `--color-gray-light` | #f5f5f5 | Page bg, tab strip |
| `--color-gray-300` | #DADADA | Input borders |
| `--color-gray-medium` | #aeaeae | Placeholders |
| `--color-surface-dark` | #090909 | Footer bg |
| `--color-error` | #dc3545 | Password strength (weak) |
| `--color-status-available` | #22c55e | Password strength (strong), verified badge |
| `--space-1/2/3/4/5/6/8` | 4/8/12/16/20/24/40px | Spacing scale |
| `--font-satoshi` | Satoshi | Labels, nav, footer |
| `--font-space-grotesk` | Space Grotesk | Input text, headings |
| `--text-nav` | 14px | Labels |
| `--text-small-13` | 13px | Input values |
| `--text-body-small` | 17px | Tab/section titles |

---

## 4. Page-Level Composites

### TopNavBar — `src/components/userprofile/TopNavBar.tsx`

```typescript
interface TopNavBarProps {
  logoSrc?: string
  avatarSrc?: string
  avatarAlt?: string
}
```

Sticky, 72px tall. Uses `Avatar` (md) and `NavLink` primitives. Four nav links (Shop, Docs, Blog, About) are hardcoded — convert to props if needed. Menu button is 91×50px with asymmetric octagon `clip-path` and blue gradient. On mobile: nav links + avatar hidden, button shrinks to 36×36px icon-only.

---

### DashboardTabBar — `src/components/userprofile/DashboardTabBar.tsx`

```typescript
interface DashboardTabBarProps {
  activeTab?: string          // default: 'profile'
  onTabChange?: (id: string) => void
}
```

Five tabs: `profile` (FiUser), `domains` (PiGlobeSimple), `orders` (PiShoppingCart), `analytics` (PiChartBar), `reputation` (PiUsers). The `.tabs` strip uses a diagonal stripe pattern (`repeating-linear-gradient(135deg, ...)`). On mobile: horizontally scrollable with a 3px blue scrollbar.

---

### ProfileHeader — `src/components/userprofile/ProfileHeader.tsx`

```typescript
interface ProfileHeaderProps {
  avatarSrc?: string
  avatarAlt?: string
}
```

Banner with Avatar (lg, 62px) and "Claim Your Identity" heading. Double-arrow uses `RiArrowRightDoubleFill` (react-icons/ri). Blue underline is a separate `div.underline` with inset white glow.

---

### SiteFooter — `src/components/userprofile/SiteFooter.tsx`

No props. All content hardcoded. Structure: `.watermark` (decorative) → `.topRow` (logo + 3 link columns + social icons) → `.newsletter` (email input + subscribe button) → `.bottomStrip` (copyright + legal links). Newsletter state managed internally — wire to subscriber slice during integration.

---

## 5. Section Components

All three wrap themselves in `SectionCard`. All field state is local `useState` — wire to Redux/react-hook-form during integration.

### AccountSection — `src/components/userprofile/AccountSection.tsx`

| Field | Component | Icon |
|---|---|---|
| Full Name | `TextInput` | `FaUserCircle` (react-icons/fa) |
| Email | Custom row + `VerifyBadge` | — |
| Mobile Number | `PhoneInputField` | — |
| Telegram | `TextInput` | `FaTelegram` (react-icons/fa) |

The email field is a custom layout (not `TextInput`) to embed `VerifyBadge` inside the input row. `.fieldPhone` overrides `max-width: none` so the 90px selector + 291px input aren't clamped.

---

### WalletSection — `src/components/userprofile/WalletSection.tsx`

Two columns (EVM + Solana), each with a header icon + label + `WalletAddressInput`. SVG icons in the headers are placeholders — replace with `/icons/eth-diamond.svg` and `/icons/solana.svg` during integration. Wire `onAdd` to wagmi (EVM) and wallet-adapter (Solana).

---

### ChangePasswordSection — `src/components/userprofile/ChangePasswordSection.tsx`

Three `PasswordInput` fields, each with `PiLockKeyFill` icon on the label. `PasswordStrengthMeter` renders below the Confirm Password field only. Save Changes button is **not here** — it lives in `UserProfilePage`.

---

## 6. Primitives

### PrimaryButton

```typescript
interface PrimaryButtonProps {
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'default' | 'transparent' | 'dark' | 'error'
  size?: 'sm' | 'md'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}
```

Asymmetric octagon `clip-path` — Figma-exact, do not round to a rectangle. Blue fill via `::before` pseudo-element. Loading state shows CSS spinner + `aria-busy`. Save Changes uses `className={styles.saveBtn}` to inject `min-width: 381px` from the page module.

---

### TabButton

```typescript
interface TabButtonProps {
  label: string
  icon: ReactNode
  isActive: boolean
  onClick: () => void
}
```

`aria-pressed={isActive}`. Active: blue bg + inset white glow. Inactive: gradient gray + drop shadow. 162×47px desktop, auto-width 32px height mobile.

---

### NavLink

```typescript
interface NavLinkProps {
  label: string
  href: string
  isActive?: boolean
}
```

Renders IBM Plex Mono bracket decorations (`[ label ]`) — intentional Figma design. Active = blue, inactive = #6e6e6e.

---

### Avatar

```typescript
interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'   // 28px / 36px / 62px
}
```

Blue alpha border + blue drop shadow. Used in TopNavBar (md) and ProfileHeader (lg).

---

### SectionCard

```typescript
interface SectionCardProps {
  title: string
  children: ReactNode
}
```

White card. Title has 2px solid blue `border-bottom`. Padding: 20px 24px desktop, 20px 16px mobile.

---

### TextInput

```typescript
interface TextInputProps {
  label?: string
  icon?: React.ReactNode
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  id?: string
  name?: string
  readOnly?: boolean
}
```

40px height, Space Grotesk Bold 13px blue input text.

---

### PhoneInputField

```typescript
interface PhoneInputFieldProps {
  label?: string
  icon?: React.ReactNode
  countryCode?: string    // default: '+91'
  phoneNumber?: string
  flagSrc?: string
  onChange?: (value: string) => void
  id?: string
}
```

90px country selector button + 291px tel input. Country selector is a `<button>` — wire a dropdown when country switching is needed.

---

### PasswordInput

```typescript
interface PasswordInputProps {
  label?: string
  icon?: React.ReactNode   // renders inside label before text
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  name?: string
}
```

Manages show/hide state internally. `inputRow` gets blue `border-color` on `:focus-within`.

---

### PasswordStrengthMeter

```typescript
interface PasswordStrengthMeterProps {
  password: string
}
```

Levels 0–4: empty → very weak (red) → weak (orange) → fair (yellow) → strong (green). Simple heuristic — swap for zxcvbn if needed.

---

### WalletAddressInput

```typescript
interface WalletAddressInputProps {
  placeholder?: string
  value?: string
  buttonLabel: string
  walletIconSrc?: string
  onAdd: () => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
```

Text input + inset dark button. Button uses `align-self: center`, `height: auto`, `padding: var(--space-1) var(--space-3)`, `margin-right: var(--space-2)` — it does not fill the full 40px input height.

---

### VerifyBadge

```typescript
interface VerifyBadgeProps {
  onVerify: () => void
  verified?: boolean
}
```

Unverified: blue "verify" button. Verified: green checkmark span (not clickable). Sits inside the email input row via absolute positioning in `AccountSection`.

---

## 7. SCSS Mixins

All modules import via `@use '../../design-system/styles/mixins' as *`.

| Mixin | Breakpoint |
|---|---|
| `@include mobile` | max-width 767px |
| `@include mobile-up` | min-width 768px |
| `@include tablet` | 768px – 991px |
| `@include tablet-down` | max-width 991px |
| `@include small-mobile` | max-width 499px |
| `@include focus-ring` | All interactive elements — never hand-write outline |

---

## 8. Responsive Summary

| Component | Mobile change |
|---|---|
| TopNavBar | Nav links + avatar hidden; menu button → 36×36px icon-only |
| DashboardTabBar | Horizontally scrollable with 3px blue scrollbar |
| ProfileHeader | Reduced height (82px), tighter padding |
| SectionCard | Padding → 20px 16px |
| AccountSection / WalletSection / ChangePasswordSection | Fields stack vertically, full-width |
| Save Changes | `min-width: 100%` |
| SiteFooter | Columns wrap, full-width newsletter + bottom strip |

Tested at: 375px, 768px, 1024px, 1440px.

---

## 9. Integration Checklist

- **Fonts** — ensure Satoshi, Space Grotesk, IBM Plex Mono, and Geist Mono are loaded in `_app.tsx` or `globals.scss`
- **Token file** — copy `_tokens.scss` into main or merge with existing variables; all CSS custom properties must be on `:root`
- **Mixin file** — copy `_mixins.scss`; every SCSS module references it by relative path
- **AccountSection** — wire fields to Redux user slice or react-hook-form; wire `onVerify` to email verification API
- **WalletSection** — wire `onAdd` to wagmi `connect()` (EVM) and `useWallet().connect()` (Solana); replace SVG icon placeholders with `/icons/eth-diamond.svg` and `/icons/solana.svg`
- **ChangePasswordSection** — wire to `src/core/services/auth.service.ts` change-password endpoint
- **SiteFooter newsletter** — wire to `src/core/redux/slices/subscriber.slice.ts`
- **Save Changes button** — wire `onClick` to a page-level submit handler dispatching all dirty fields
- **Country selector** — `PhoneInputField` selector button is a stub; wire dropdown when needed
- **NavLink hrefs** — four links in `TopNavBar` are hardcoded; convert to props if route-aware links are needed
- **Password strength** — swap simple heuristic in `PasswordStrengthMeter` for zxcvbn if stricter policy needed
- **Imports** — all new files must import from `@/design-system/...`; never `@component/*`, `@template/*`, or `@styles/*`
- **Legacy files** — do not delete old files; rename with `.legacy` suffix or move to `_deprecated/`
