# CLAUDE.md — Endless Domains Web UI (Design Overhaul Branch)

## 1. Overview

This is the `new-design-ed` branch of the Endless Domains web application — a multi-chain domain registrar built on Next.js 14. This branch implements a full design overhaul using a new token-based design system, replacing the legacy scattered SCSS approach with structured primitives, composites, and layouts. The current codebase on `main` has 90+ SCSS module files with no shared tokens — this branch fixes that with `src/design-system/` as the single source of truth.

**Important**: This branch coexists with `main` where maintenance/bug fixes continue. Do not port old patterns from `main` into this branch. All new code here uses the design system exclusively.

---

## 2. Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (Pages Router) | 14.2.31 |
| Language | TypeScript | 5.2.2 |
| React | react / react-dom | 18.3.1 |
| State | @reduxjs/toolkit + react-redux | 1.9.1 / 8.0.5 |
| Data Fetching | axios + @tanstack/react-query | 1.3.4 / 5.65.1 |
| EVM Wallets | wagmi + viem + @reown/appkit | 2.5.7 / 2.7.10 / 1.6.5 |
| Solana Wallets | @solana/wallet-adapter-react | 0.15.35 |
| Component Library | **Design system primitives** (replacing Reactstrap) | — |
| Styling | **SCSS Modules + _tokens.scss** (replacing scattered SCSS) | sass 1.56.1 |
| Bootstrap | **Utilities + grid only** (component classes being replaced) | 5.2.3 |
| Forms | react-hook-form | 7.66.0 |
| Icons | react-icons + @fortawesome/react-fontawesome | 4.7.1 / 0.2.0 |
| Auth | @react-oauth/google + jwt-decode | 0.12.2 / 4.0.0 |
| Payment | @stripe/react-stripe-js | 1.16.2 |

---

## 3. Directory Structure

```
/
├── pages/                       # Next.js Pages Router — routes
│   ├── _app.tsx                 # Global wrapper: Redux, Wagmi, Solana, OAuth, QueryClient
│   ├── index.tsx                # Home page (landing — reference design, already done)
│   ├── [slug].tsx               # Influencer landing pages
│   └── [feature]/               # Per-page directories
│
├── src/
│   ├── design-system/           # ★ NEW — The design system (source of truth)
│   │   ├── styles/
│   │   │   ├── _tokens.scss     # ALL design tokens: colors, typography, spacing, radii, shadows
│   │   │   ├── _reset.scss      # CSS reset / normalize
│   │   │   ├── _typography.scss # Global typography rules
│   │   │   ├── _utilities.scss  # Utility classes
│   │   │   └── design-system.scss # Master import file
│   │   │
│   │   ├── primitives/          # Atomic UI components
│   │   │   ├── Button/          # Button.tsx, Button.module.scss, index.ts
│   │   │   ├── Input/
│   │   │   ├── Badge/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Tabs/
│   │   │   ├── Dropdown/
│   │   │   ├── Skeleton/
│   │   │   ├── Toast/
│   │   │   ├── Avatar/
│   │   │   ├── Tag/
│   │   │   ├── Tooltip/
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── composites/          # Multi-primitive compositions
│   │   │   ├── SearchBar/       # Input + Button + Dropdown
│   │   │   ├── PriceTag/        # Badge + price formatting
│   │   │   ├── DomainCard/      # Card + Badge + Button
│   │   │   ├── CartItem/        # Card + quantity + price
│   │   │   ├── StatsCard/       # Card + number + label
│   │   │   ├── EmptyState/      # Icon + text + CTA
│   │   │   ├── PageHeader/      # Title + breadcrumb + actions
│   │   │   └── index.ts
│   │   │
│   │   ├── layouts/             # Page layout shells
│   │   │   ├── MainLayout/      # Header + content + footer
│   │   │   ├── AuthLayout/      # Centered card for login/register
│   │   │   ├── DashboardLayout/ # Sidebar + content for /profile/*
│   │   │   ├── ContentLayout/   # Blog/static pages
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts             # Master barrel export
│   │
│   ├── component/               # ⚠️ LEGACY — 89 old feature components (being replaced)
│   ├── template/                # ⚠️ LEGACY — 80 old layout/presentation components (being replaced)
│   ├── api/                     # Low-level fetch wrapper
│   ├── config/
│   │   └── wagmi.ts             # Wagmi + AppKit chain/wallet config
│   ├── constants/               # Provider groupings, static data
│   ├── core/
│   │   ├── enum/                # 9 enums: api-endpoint, cookie, domain-provider, etc.
│   │   ├── model/               # 17 TypeScript interfaces
│   │   ├── redux/
│   │   │   ├── store.ts
│   │   │   └── slices/          # 12 slices: user, cart, fav, info, etc.
│   │   └── services/            # 14 service modules — all API/business logic
│   │       ├── api.service.ts   # Core HTTP client (axios interceptor, session/refresh)
│   │       ├── auth.service.ts
│   │       ├── cart.service.ts
│   │       └── [...]
│   ├── data/
│   │   └── supportedTlds.ts     # 130+ supported TLDs
│   ├── helpers/                 # Per-chain helpers: ens/, arb/, bnb/, ud/, solana/, bonfida/
│   ├── hooks/
│   ├── lib/                     # AutoLogoutHandler, WalletInstance, provider-manager
│   └── types/                   # Ambient type declarations and DTOs
│
├── styles/                      # ⚠️ LEGACY — 100 old SCSS modules (deprecated as pages migrate, not deleted)
│   ├── globals.scss             # Being stripped down to reset + font-face + DS imports
│   └── variables.scss           # Being replaced by _tokens.scss
│
├── public/                      # Static assets
├── next.config.js               # PWA, webpack overrides, CSP headers, env vars
├── tsconfig.json                # @/* → src/* (design system at @/design-system/)
└── env.sample                   # All environment variable names
```

### Path Aliases (tsconfig.json)

```
@/*          → src/*
@component/* → src/component/*          (legacy — avoid in new code)
@template/*  → src/template/*           (legacy — avoid in new code)
@helpers/*   → src/helpers/*
@core/*      → src/core/*
@styles/*    → styles/*                 (legacy — avoid in new code)
@data/*      → src/data/*
```

The design system is accessed via the standard `@/*` alias:
```
import { Button } from '@/design-system/primitives'
import { DomainCard } from '@/design-system/composites'
import { MainLayout } from '@/design-system/layouts'
```

**In new code, always import from `@/design-system/`. Never import from `@component/*`, `@template/*`, or `@styles/*`.**

---

## 4. Commands

```bash
npm run dev           # Dev server (http://localhost:3000)
npm run build         # Production build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run prettier      # Check formatting
npm run prettier:fix  # Fix formatting
```

---

## 5. Design System — The Rules

### Token System

`src/design-system/styles/_tokens.scss` is the **single source of truth** for all design tokens. There are no TypeScript token files. All primitives, composites, layouts, and page-level SCSS modules consume variables from this file directly.

Token categories defined in `_tokens.scss`:
- **Colors**: Primary, secondary, neutrals, semantic (success, error, warning, info)
- **Typography**: Font families (heading + body), sizes, weights, line heights
- **Spacing**: Scale based on 4px base unit
- **Border radius**: sm, md, lg, xl, full
- **Shadows, breakpoints**: As needed

**Always check `_tokens.scss` for the current token values before using any color, spacing, font, or radius.** The tokens are being finalized as the design system is implemented — use whatever is defined in the file, don't hardcode alternatives.

### Implementation Rules — MUST FOLLOW

1. **No `!important`** — If you need it, the specificity is wrong. Fix the cascade.
2. **No inline styles** — Everything through SCSS modules consuming `_tokens.scss` variables.
3. **No new SCSS files outside `design-system/`** — Page-specific styles go in the page's own module file, but must only use token variables from `_tokens.scss`.
4. **Component composition over customization** — Build variants into the component props, don't override with external CSS.
5. **Mobile-first** — All new CSS written mobile-first with `min-width` breakpoints.
6. **Accessibility** — All interactive elements need focus states, aria labels, keyboard navigation.
7. **No Bootstrap component classes in new code** — No `.btn`, `.card`, `.navbar`, `.dropdown`. Use design system primitives. Bootstrap utility classes (`d-flex`, `gap-*`, `mt-*`) and grid (`row`, `col-*`) are fine.
8. **No Reactstrap components in new code** — Use design system primitives instead.
9. **All colors, spacing, typography, radii must come from `_tokens.scss`** — No hardcoded hex values, pixel values, or font names in component SCSS. Always check the current `_tokens.scss` for available tokens.

### Component Structure

Every new component follows this pattern:
```
ComponentName/
├── ComponentName.tsx          # Component with typed props, forwardRef
├── ComponentName.module.scss  # Styles using _tokens.scss variables
└── index.ts                   # Named + default export
```

Props must be typed with explicit interfaces. Include all states: default, hover, active, disabled, loading, error. Export from the barrel file in the parent directory.

### Bootstrap — What Stays, What Goes

**Keep using:**
- Utility classes: `position-fixed`, `d-flex`, `gap-*`, `mt-*`, `text-center`, etc.
- Grid system: `row`, `col-*`, `container`

**Stop using (replace with design system):**
- `.btn`, `.btn-primary`, `.btn-outline-*` → `<Button>` primitive
- `.card`, `.card-body` → `<Card>` primitive
- `.navbar`, `.nav`, `.nav-item` → `<MainLayout>` header
- `.dropdown`, `.dropdown-menu` → `<Dropdown>` primitive
- `.modal`, `.modal-dialog` → `<Modal>` primitive
- Any Reactstrap component import → design system equivalent

---

## 6. Migration Pattern — Strangler Fig

Each page redesign follows this exact sequence:

1. **Jay delivers Figma comp** using design system components
2. **Frontend dev builds the new page** using only `@/design-system/primitives` + `composites` + `layouts`
3. **New page file goes in the same route** (new implementation)
4. **Old page file gets deprecated/renamed** (e.g., `SearchPage.tsx` → `SearchPage.legacy.tsx`) — do NOT delete old files
5. **Old SCSS module file gets deprecated** — do NOT delete, rename with `.legacy` suffix or move to a `_deprecated/` directory
6. **Old `template/` and `component/` files get deprecated** — same treatment, rename/suffix, no deletion

**Important: No old files are deleted during migration.** They are deprecated and renamed so they can be referenced if needed and cleaned up in a dedicated cleanup phase later.

---

## 7. Code Conventions (Unchanged from main)

### TypeScript
- Strict mode enabled; `any` allowed (`@typescript-eslint/no-explicit-any: off`)
- Interfaces in `src/core/model/`, enums in `src/core/enum/`

### Naming
- **Files**: kebab-case directories, PascalCase component names
- **Components**: PascalCase function, default export from `index.tsx`
- **Services**: camelCase in `*.service.ts`
- **SCSS modules**: PascalCase matching component (`Button.module.scss`)

### Import Order (simple-import-sort)
1. react, next, packages
2. @scoped packages
3. ~scoped packages
4. ../ relative
5. ./ relative
6. .css / .scss
7. Side-effect imports

### Prettier
- No semicolons, single quotes, print width 140, tab width 2, no parens on single arrow args

---

## 8. Key Patterns

### Data Fetching
All API calls go through `src/core/services/api.service.ts`. Never call `fetch` or `axios` directly from a component.

```typescript
// Pattern: useEffect + service + Redux dispatch
const loadCart = useCallback(async () => {
  const cart = await getCart()
  dispatch(setCart(cart.data))
}, [dispatch])
```

### Auth
- JWT in cookies (`ACCESS_TOKEN`, `REFRESH_TOKEN`) via cookies-next/nookies
- Axios interceptor auto-injects token
- AutoLogoutHandler monitors expiry + 30-min idle timeout
- Google OAuth via `@react-oauth/google` in `_app.tsx`
- Wallet auth: connect → `getCheckSession()` → tokens in cookies

### State (Redux)
```typescript
const cartInfo = useSelector((state: RootState) => state.cart.cartInfo)
dispatch(setCart(data))
```
12 slices: user, cart, fav, info, event, allevent, subscriber, sync, banner, unverifiedlogin, cryptoCurrency, universalReducer.

### Web3 / Wallet
- EVM: Wagmi 2 + Reown AppKit (`src/config/wagmi.ts`)
- Solana: wallet-adapter-react with Phantom + Solflare
- Per-chain logic isolated in `src/helpers/ens/`, `arb/`, `bnb/`, `solana/`, `ud/`
- Provider constants from `src/core/enum/domain-provider.enum.ts`

---

## 9. Environment Variables

See `env.sample` for the full list. `NEXT_PUBLIC_*` vars are browser-accessible. Never commit `.env.local`.

---

## 10. Branch & PR Rules

### Branch naming
```
feature/ED-[ticket]-short-description
fix/ED-[ticket]-short-description
```

### Commits (Conventional)
```
feat(search): implement new search results with design system
fix(cart): fix price alignment in CartItem composite
refactor(header): migrate header to MainLayout
```

### PRs
- Target: `uat` branch (for review before merging to main)
- Frontend dev has direct push access to `new-design-ed` — no PR needed for commits to this branch
- PRs from `new-design-ed` → `uat` are reviewed by TPM for: SEO, production readiness, bugs, security, architecture, feature completion
- All new components must use design system — PRs using legacy patterns (`@component/*`, `@template/*`, Reactstrap, hardcoded values) will be rejected

### What TPM Checks on This Branch
1. **Design system compliance**: All tokens from `_tokens.scss`, no hardcoded values
2. **No legacy imports**: Nothing from `@component/*`, `@template/*`, `@styles/*` in new files
3. **No Bootstrap component classes**: Only utility + grid allowed
4. **No Reactstrap**: Design system primitives only
5. **No deletion of old files**: Legacy files are deprecated/renamed, not deleted
6. **Accessibility**: Focus states, aria labels, keyboard nav on all interactive elements
7. **Mobile-first**: Responsive at 375px / 768px / 1024px / 1440px
8. **SEO**: Semantic HTML, meta tags, heading hierarchy, alt text
9. **States covered**: Loading, error, empty for all async content

---

## 11. Code Change Checklist — What to Verify on Every Edit

Run through this list before considering any code change done. These are the recurring failure modes found on this branch.

---

### 11.1 No Inline Styles

**Rule**: Zero `style={{ ... }}` props on any JSX element in new or migrated code.

What to check:
- Search for `style={{` in any file you touch — every hit is a violation unless it falls under the narrow exception below
- Dynamic visual states (hover color, open/close transforms, transitions) must be expressed through SCSS class toggling or CSS custom properties, not inline styles
  - Toggle open/closed: add/remove a modifier class (e.g., `styles.collapse_open`)
  - Data-driven CSS: use a `data-*` attribute and target it with an attribute selector in SCSS
  - Rotation on toggle: use `aria-expanded` + `[aria-expanded='true'] { transform: rotate(...) }` in SCSS
- **Narrow exception**: GSAP and other animation libraries write inline styles directly as part of their animation engine — those are acceptable and cannot be avoided

Examples of violations to catch:
```tsx
// BAD
<div style={{ borderRadius: '50%' }}>
<button style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>

// GOOD
<div className={styles.avatar}>          // border-radius in .avatar SCSS rule
<button aria-expanded={isOpen} ...>      // [aria-expanded='true'] { transform: rotate(180deg) } in SCSS
```

---

### 11.2 No Hardcoded Values in SCSS

**Rule**: No literal hex colors, bare pixel spacing, font name strings, or pixel radii in any SCSS file. Every value must trace back to a `var(--*)` token from `_tokens.scss`.

What to check for each SCSS property you write or touch:

| Property type | Violation | Correct |
|---|---|---|
| Color | `#2639ED`, `rgba(0,0,0,0.5)` | `var(--color-blue-primary)`, `var(--color-black-alpha-55)` |
| Spacing | `gap: 16px`, `padding: 24px` | `var(--space-4)`, `var(--space-6)` |
| Font family | `font-family: 'Satoshi'` | `var(--font-satoshi)` |
| Font size | `font-size: 14px` | `var(--text-nav)` |
| Border radius | `border-radius: 8px` | `var(--radius-md)` |
| Shadow | `box-shadow: 0 4px 12px rgba(...)` | `var(--shadow-*)` if a token exists |

**When a Figma value has no exact token match** (e.g., Figma says `25px` but nearest token is `--btn-icon-size: 24px`):
- Use the nearest token
- Add a comment: `var(--btn-icon-size) // 24px ≈ 25px Figma value, nearest token`

**When a value is genuinely design-specific** (clip-path coordinates, decorative shape dimensions, trapezoid widths, barcode strip heights, bleed offsets):
- Keep the raw value
- Add a section comment explaining it is Figma-exact and intentional: `// design-specific: Figma-exact clip-path dimension — do not round`

Always run `grep -n '[0-9]px' YourFile.module.scss` after editing a SCSS file and justify every hit.

---

### 11.3 All Imports Must Come From Inside `design-system/` (for DS files)

**Rule**: Any file that lives under `src/design-system/` must not import from legacy paths. Any page file under `pages/` must not import from legacy paths for UI concerns.

Banned import prefixes in new/migrated code:
- `@component/*` — legacy feature components
- `@template/*` — legacy layout/presentation components
- `@styles/*` — legacy SCSS modules

Correct replacements:
| Legacy import | Design system replacement |
|---|---|
| `@component/toast-message` | `@/design-system/primitives/toast-message` |
| `@template/modal/modal-cart` | `@/design-system/composites/cart-page/modal/ModalCartRemove` |
| `@styles/Carts.module.scss` | Page-level `cart.module.scss` using only `_tokens.scss` variables |
| Reactstrap `Button`, `Modal`, `ModalHeader` | `PrimaryButton`, custom div overlay with `cart.module.scss` classes |

**Still allowed from anywhere** (these are non-UI infrastructure with no DS equivalent):
- `@/core/services/*`, `@/core/redux/*`, `@/core/enum/*`, `@/core/model/*`
- `@/helpers/*`
- `@/constants`
- `@/hooks/*`

After editing any file, scan all `import` lines and flag any `@component`, `@template`, or `@styles` path. Fix before committing.

---

### 11.4 Code-Level Optimizations

Apply these on every file touched — not just the lines changed.

**React performance**
- Wrap handlers passed as props in `useCallback` to prevent child re-renders
- Use `useMemo` only for genuinely expensive derivations (sorting/filtering large arrays, complex calculations) — not for simple string concatenation or boolean flags
- Avoid creating new objects/arrays/functions in JSX (`onClick={() => fn(id)}` in a list creates a new function per render — extract to a named `useCallback`)
- Prefer stable references: define handlers outside the return block

**TypeScript**
- TypeScript 5.2 + `@types/react` 18.3 does not allow `key` on `React.Fragment` via JSX syntax — use `React.createElement(React.Fragment, { key }, ...children)` instead
- Avoid `as any` casts — use proper type narrowing or explicit interface extension
- Keep interfaces in `src/core/model/` for shared data shapes; inline prop interfaces only for component-internal use

**Bundle hygiene**
- Remove all unused imports immediately — every unused import is dead bundle weight
- Import named exports from barrel files (`import { Button } from '@/design-system/primitives'`) rather than deep-pathing to the file (`import Button from '@/design-system/primitives/Button/Button'`) — barrel imports let the tree-shaker do its job
- Do not re-export types that are not consumed externally

**SCSS**
- Use `@include focus-ring` from `_mixins.scss` for all `:focus-visible` states on interactive elements — do not handwrite `outline: 2px solid var(--color-blue-primary)` each time
- Nest modifier classes (`&.active`, `&:disabled`, `&:hover`) inside the base rule — do not write separate top-level selectors for the same element
- Never use `!important` — fix specificity instead

---

### 11.5 Accessibility — Per-Element Checklist

Check every interactive element added or modified:

| Element | Required |
|---|---|
| `<button>` with text | Visible label is sufficient; add `aria-label` only if icon-only |
| `<button>` icon-only (close, remove, info) | `aria-label` describing the action (e.g., `aria-label="Close"`) |
| Toggle button (open/close accordion, panel) | `aria-expanded={boolean}` |
| Tooltip trigger | `onFocus` + `onBlur` handlers alongside `onMouseEnter` + `onMouseLeave` |
| Tooltip content element | `role="tooltip"` |
| Decorative dividers, icons, SVGs | `aria-hidden="true"` |
| `<img>` / `<Image>` decorative | `alt=""` |
| `<img>` / `<Image>` meaningful | Descriptive `alt` text |
| Any hover animation (scramble, color change) | Mirror in `onFocus`/`onBlur` so keyboard users trigger it |
| All interactive elements | `:focus-visible` style defined in SCSS — use `@include focus-ring` |

---

## 12. Next.js Tags, Images, SEO, and JSX Element Rules

### 12.1 Always Use Next.js Built-in Tags

**Rule**: Never use native HTML `<a>` or `<img>` tags in new or migrated code. Always use the Next.js equivalents.

```tsx
// BAD
import { someImage } from '/public/images/some-image.png'
<a href="/about">About</a>
<img src="/images/logo.png" alt="Logo" />

// GOOD
import Link from 'next/link'
import Image from 'next/image'
import logoImage from '@/public/images/logo.png'   // or a relative path to public/

<Link href="/about">About</Link>
<Image src={logoImage} alt="Logo" width={120} height={40} />
```

Always import image files as ES module imports at the top of the file and pass the imported reference as the `src` prop. Never pass raw string paths like `src="/images/logo.png"` — imported references let Next.js compute width/height automatically and enable static optimization.

---

### 12.2 SEO-Friendly Semantic HTML

**Rule**: Use the correct semantic element for the content. Do not reach for `<div>` or `<span>` when a more meaningful element exists.

| Content type | Correct element |
|---|---|
| Page title | `<h1>` — one per page |
| Section headings | `<h2>`, `<h3>`, `<h4>` in strict hierarchy |
| Standalone paragraph of text | `<p>` |
| Navigation links | `<nav>` wrapping `<ul>` + `<li>` + `<Link>` |
| Article / blog post body | `<article>` |
| Complementary sidebar content | `<aside>` |
| Page-level grouping with a heading | `<section>` |
| Footer content | `<footer>` |
| Header / site banner | `<header>` |
| Emphasized text (meaning) | `<strong>` or `<em>` |
| Generic block container | `<div>` — only when no semantic element fits |
| Generic inline container | `<span>` — only when no semantic element fits AND the content is truly inline |

Heading hierarchy must never skip levels (e.g., do not jump from `<h2>` to `<h4>`). Every page must have exactly one `<h1>`.

---

### 12.3 Use `<span>` Only When Necessary

**Rule**: `<span>` is for inline styling or inline grouping of text only. Do not use it as a substitute for block-level layout, and do not use it when a semantic inline element (`<strong>`, `<em>`, `<time>`, `<abbr>`, `<code>`) would be more appropriate.

```tsx
// BAD — span used for layout (should be a div or section)
<span className={styles.card}>...</span>

// BAD — span when semantic element exists
<span className={styles.bold}>Important</span>

// GOOD — span for inline text decoration only
<p>Price: <span className={styles.price_highlight}>$9.99</span></p>

// GOOD — semantic inline element
<p><strong>Important</strong> notice</p>
```

---

### 12.4 No React Fragment Tags When Mapping — Use `<div>` Instead

**Rule**: When rendering a list with `.map()`, do not use `<React.Fragment key={...}>` or `<>...</>` as the wrapper. Wrap each item in a `<div>` (or the semantically appropriate block element) with a `key` prop instead.

```tsx
// BAD — fragment wrapper in a map
items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.label}</dt>
    <dd>{item.value}</dd>
  </React.Fragment>
))

// GOOD — div wrapper in a map
items.map(item => (
  <div key={item.id} className={styles.item}>
    <dt>{item.label}</dt>
    <dd>{item.value}</dd>
  </div>
))
```

The only exception is a definition list (`<dl>`) where `<dt>` and `<dd>` must be direct children — in that specific case a fragment is structurally required. Document it with a comment when you use it.
