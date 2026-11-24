# CLAUDE.md — Design System & Design Preview (Marketplace / My Domains Redesign)

## 1. Scope

This file documents the design system as it actually exists under `src/design-system/` and the preview routes under `pages/design-preview/`, built for the marketplace and my-domains redesign. It supplements the root `CLAUDE.md`. Where the root file describes a target folder layout that doesn't match what's on disk yet (for example `_tokens.scss`, `_reset.scss`, `design-system.scss`, flat `Button/`/`Input/`/`Badge/` primitive folders, or `AuthLayout`/`DashboardLayout`), this file describes what is actually there. Follow this file for anything inside `src/design-system/` and `pages/design-preview/`; follow the root file for everything else (rules 1, 2, 4, 7 to 12 of the root file still apply here unless this file says otherwise).

Everything under `pages/design-preview/` is a temporary, unlinked preview route used to review new composites before they're wired into a real page. Preview status does not relax any rule below — these pages and every composite/primitive they render are held to the same bar as production code, since the whole point is to catch problems before the page gets adopted for real.

---

## 2. Actual Directory Structure

```
src/design-system/
├── styles/
│   ├── tokens.scss      # All CSS custom properties (colors, type, spacing, radii...). No leading underscore.
│   ├── fonts.scss       # @font-face declarations
│   ├── _mixins.scss     # Breakpoint variables + media query mixins (mobile, mobile-up, tablet, tablet-up, desktop, wide)
│   └── main.scss        # Master import: fonts.scss then tokens.scss
│
├── primitives/           # Grouped by kind, not one folder per component
│   ├── avatars/domain-avatar/
│   ├── badges/{badge,chain-badge,extension-badge,trend-indicator}/
│   ├── buttons/{primary-button,secondary-button,cart-button,tab-button,default-buttons}/
│   ├── cards/{stat-card,info-list-card}/
│   ├── charts/sparkline/
│   ├── inputs/{search-input,filter-dropdown}/
│   ├── toggles/view-toggle/
│   └── tooltip/
│
├── composites/           # Grouped by page domain, not one flat folder
│   ├── marketplace/
│   │   ├── activity/{ActivityItem,LiveActivityPanel,LiveActivityTicker}/
│   │   ├── analytics/{MarketActivityPanel,MarketMetricCard}/
│   │   ├── hero/MarketplaceHero/
│   │   ├── listings/{ListingCategoryTabs,ListingFilterBar,ListingRow,ListingsHeading,LiveListingsTable}/
│   │   ├── promoted/{PromotedDomainCard,PromotedDomainsSection}/
│   │   ├── shared/{MarketplacePageShell,MobileBottomNav}/
│   │   └── index.ts     # curated barrel — re-exports the components other pages should import
│   │
│   └── my-domains/
│       ├── hero/MyDomainsHeroBanner/
│       ├── listings/{MyDomainCard,MyDomainRow,MyDomainsCategoryTabs,MyDomainsFilterBar,MyDomainsTable}/
│       ├── right-rail/{MostViewedPanel,NeedsAttentionPanel,QuickActionsPanel}/
│       ├── summary/PortfolioStatsRow/
│       └── index.ts     # curated barrel
│
└── layouts/
    ├── header/           # index.tsx + Header.module.scss + menuItems.ts
    ├── main-layout/      # site wide shell: header, sidebar, bottom nav, footer stripe
    ├── sidebar/{MarketplaceSidebar,MobileDrawerMenu,SidebarNavItem,SidebarPromoCard,SidebarSection}/  # moved here from composites/marketplace/sidebar
    └── footer-stripe/
```

There is no top-level `src/design-system/index.ts`, no `primitives/index.ts`, and no per-category barrel (e.g. no `buttons/index.ts`). Import primitives with a full path to the component folder:

```ts
import PrimaryButton from '@/design-system/primitives/buttons/primary-button'
import type { ViewMode } from '@/design-system/primitives/toggles/view-toggle'
```

Composites under `marketplace/` and `my-domains/` do have a curated barrel one level up — prefer it over deep-pathing when the component is exported there:

```ts
import { MyDomainsHeroBanner, PortfolioStatsRow } from '@/design-system/composites/my-domains'
```

If a composite isn't in the barrel yet, import it directly from its own folder and consider adding it to the barrel in the same change.

`pages/design-preview/` currently has two routes: `marketplace.tsx` and `account/my-domains.tsx`, each assembling composites into a full page with local mock data from `src/data/marketplace/` and `src/data/my-domains/`.

---

## 3. Tokens

`src/design-system/styles/tokens.scss` is the single source of truth, loaded once through `main.scss`. It is a flat file (no underscore prefix), organized into these blocks — check it directly before adding any new value, don't guess a name:

- Color scales: blue, purple, black, white, gray, plus dark-surface tokens and alpha/rgba variants per color (`--color-blue-primary-alpha-18`, `--color-white-alpha-55`, etc.)
- Font families: `--font-satoshi`, `--font-space-grotesk`
- Border radius: `--radius-sm` through `--radius-2xl`, `--radius-full`
- Font sizes: `--text-display-lg` down to `--text-small-10`
- Font weights, line heights (`--leading-*`), letter spacing (`--tracking-*`)
- Spacing scale: `--space-1` (4px) through `--space-15` (160px), including half-steps like `--space-1-5`, `--space-2-5`, `--space-4-5`
- Layout tokens: `--section-spacing`, `--container-padding-x`, `--container-max-width`, `--gap-card`, `--gap-section`, `--gap-inline*`
- Component-specific tokens: `--button-height*`, `--header-*`, `--footer-*`

Breakpoints are **not** in `tokens.scss`. They're SCSS variables and mixins in `_mixins.scss` (`$breakpoint-mobile`, `$breakpoint-tablet`, `$breakpoint-desktop`, `$breakpoint-wide`, plus `@include mobile`, `mobile-up`, `tablet`, `tablet-up`, `desktop`, `wide`). Use the mixins for media queries instead of writing raw `@media` breakpoints.

When a Figma value has no exact token, use the nearest token and comment the gap (see root `CLAUDE.md` §11.2). `_mixins.scss` itself documents one such judgment call already — read the comment above `$breakpoint-tablet` before changing it, since it explains real device widths that motivated the current cutoff.

---

## 4. Rules Specific to This Subtree

These are on top of the root `CLAUDE.md` §11–12 checklist, called out because they're the recurring misses on this branch:

1. **No native `<img>`.** Use `next/image`'s `Image` with a plain string `src` (this repo's own convention — see `src/component/auth-headline/index.tsx` — no `@/public/*` alias exists for ES module image imports) plus explicit `width`/`height` taken from the icon's SCSS class, or `fill` inside a positioned container when the size is genuinely runtime-only. This applies equally to a fixed local path and a data-driven one (`provider.image`, `item.icon`, `row.iconSrc`). A raw `<img src="/assets/...">` is a violation even for decorative, `aria-hidden` icons.
2. **No native `<a>`.** Use `next/link`'s `Link`. This subtree is currently clean on this point — keep it that way.
3. **No `!important` in any `.module.scss` file.** If a nested state (e.g. a mobile override inside `@include mobile { ... }`) isn't winning, raise the selector's specificity or reorder the rule instead of forcing it.
4. **No fragment wrapper (`<>` or `React.Fragment`) inside `.map()`.** Wrap each mapped item in a `<div>` (or the semantically correct element) carrying the `key`, per root `CLAUDE.md` §12.4. This applies even when the fragment is only grouping a divider `<span>` next to a `<Link>` — restructure the CSS (e.g. render the divider from the container via `:not(:last-child)::after`, or make the divider part of the link's own wrapper) rather than reaching for a fragment to hold the `key`.
5. **Inline `style={{ }}` is only acceptable for values that are inherently runtime-computed and have no finite variant set** — a measured tooltip position, a dropdown's computed `top`/`left`/`minWidth`, or a sparkline's dynamic pixel height. Anything with a fixed set of states (open/closed, active/inactive, hover) must be a class toggle or `data-*`/`aria-*` attribute selector in SCSS, never inline.

---

## 5. Mobile Behavior That Diverges From Desktop Structurally (Not Just CSS)

Most responsive work in this subtree is pure CSS via `_mixins.scss`'s breakpoint mixins. A few spots need the actual rendered component to differ below the mobile breakpoint, not just its styling, because Figma's dedicated mobile frame (node 77:3743, the "responsive" frame for My Domains) genuinely swaps content rather than reflowing it:

- `MyDomainsTable` forces `viewMode` to `'grid'` below mobile regardless of the caller's last-selected mode, using `useIsMobile()` from `@/utils/UseIsMobile` (already used the same way in `layouts/header/index.tsx`). The mobile frame has no row/table layout at all, every domain is a `MyDomainCard`, so `MyDomainRow`'s own mobile fallback (a generic `flex-wrap` — see that file's comment) is legacy, not the real target.
- `MyDomainsFilterBar` hides `ViewToggle` below mobile (CSS only, `styles.viewToggle`) since a toggle with no effect there would be misleading.
- `MyDomainsTable`'s "Status" legend row is CSS-hidden below mobile — not present in the Figma mobile frame, and redundant there since each `MyDomainCard` already shows its own status badge.

`useIsMobile()` defaults to `false` and only resolves in a `useEffect` (see the hook itself), so the very first paint — both the server-rendered HTML and the first client frame before hydration's effect runs — still shows the desktop-shaped branch even on an actual mobile device, then swaps once the effect fires. This is an accepted, pre-existing tradeoff (same hook, same limitation, already in `Header`), not something to "fix" locally by inventing a different mobile-detection approach for just one component — that would just make the two inconsistent with each other.

### Tablet (768–1039px) — the shell gives you this for free, content usually doesn't

`$breakpoint-tablet`/`$breakpoint-desktop` in `_mixins.scss` are both `1040px` (see that file's own comment on the iPad Pro 13" M4 fix — its 1032px portrait width used to fall through a dead zone into the unmodified desktop grid). `@include tablet` covers `768–1039px` as one continuous width-driven range with no separate orientation query — a portrait iPad (~768–1032px) and a standard iPad's landscape width (1024px) both land in it and get the same layout; only a wide-landscape iPad Pro (11"/13", ≥1194px) is wide enough to cross into the desktop grid. There's no `orientation: landscape` media feature anywhere in this codebase — "tablet landscape vs. portrait" is handled entirely by which width the device happens to report, not by checking orientation directly.

`MarketplacePageShell`, `MarketplaceSidebar`, `Header`, and `MobileDrawerMenu` are shared by both pages, so My Domains automatically inherits the core tablet-down shell behavior for free: the 3-column desktop grid (`sidebar hero rail` / `sidebar main rail`) collapses to one full-width column (`hero` / `rail` / `main` stacked), the sidebar becomes a fixed off-canvas drawer opened from Header's hamburger, and both `.sidebar`/`.rightRail` switch from sticky-in-a-3-column-grid to normal document flow. None of that needed touching for My Domains.

What each page's own right-rail *content* does with the width it's newly handed at tablet is not shared, and defaults to "nothing" until someone adds it — the rail content just keeps stacking full-width vertically unless a component explicitly opts into using the extra room. Marketplace's `MarketplacePageShell.module.scss` `.railGroup` is the existing precedent: `LiveActivityPanel` + `MarketActivityPanel` stay stacked in the narrow desktop sidebar rail and stacked again full-width at mobile, but go side-by-side specifically `@include tablet` "where there's room for both." My Domains' right rail (`pages/design-preview/account/my-domains.module.scss`) follows the same reasoning for its own three `InfoListCard` panels: `.panelGroup` wraps Needs Attention + Most Viewed + Quick Actions and goes 2-column at tablet with Quick Actions spanning both columns underneath, and `PortfolioStatsRow`'s own `.grid` widens from its permanent-elsewhere 2 columns to 4 at tablet specifically, since 2 columns across a now-full-width rail stretches each 103px-tall tile far wider than it needs. Applying an equivalent "does this rail/list content still make sense once the shell hands it way more width at tablet" check is the thing to repeat for any *new* right-rail composite — the shell won't do it automatically.

## 6. Known Outstanding Items (as of this file's creation)

Recorded here so they're tracked as real follow-up work, not rediscovered from scratch:

- **One `!important`**: `composites/my-domains/listings/MyDomainRow/MyDomainRow.module.scss:83`, inside the `@include mobile` block on `.cell`, overriding the `:not(:first-child)` border rule.

Fix this opportunistically when touching the surrounding file, or as a dedicated cleanup pass — don't introduce a new instance while it's still outstanding.

**Resolved**: the `layouts/header/index.tsx` desktop nav used to wrap each nav link and its divider in `<React.Fragment key={item.label}>` inside `HEADER_NAV_ITEMS.map(...)`. Fixed by wrapping in a `<div key={item.label} className={styles.navItem}>` instead, with a new `.navItem { display: flex; align-items: center; gap: var(--space-6); }` rule in `Header.module.scss` reproducing the spacing `.nav`'s own flex gap used to provide directly.

**Resolved**: every native `<img>` across `layouts/header/index.tsx`, `composites/my-domains/hero/MyDomainsHeroBanner`, `composites/my-domains/listings/{MyDomainRow,MyDomainCard}`, `composites/marketplace/{activity/ActivityItem,activity/LiveActivityTicker,sidebar/SidebarNavItem,sidebar/MobileDrawerMenu,shared/MobileBottomNav,promoted/PromotedDomainsSection,promoted/PromotedDomainCard,listings/ListingRow}`, and primitives `badges/trend-indicator`, `badges/chain-badge`, `avatars/domain-avatar`, `inputs/search-input`, `inputs/filter-dropdown`, `cards/info-list-card` has been converted to `next/image`'s `Image`. Every instance uses a plain string `src` (matching this repo's own existing convention, see `src/component/auth-headline/index.tsx`) plus explicit `width`/`height` props taken from the icon's own SCSS class, rather than an ES module import — none of these assets are remote URLs and several have a data-driven `src` (`provider.image`, `item.icon`, `row.iconSrc`) that can't be statically imported anyway, so string `src` was used uniformly for consistency. Verified with `next build` (clean) and `eslint` (zero warnings, including the six `@next/next/no-img-element` warnings that used to fire on the header file).

---

## 7. Dark Mode

Every page in this subtree has a dark theme. The full history and every decision is in `dev-docs/dark-mode/darkmodeprogress.html`; the plan and Figma map are in `dev-docs/dark-mode/darkmodeplan.html` (dark designs live in Figma file `hq6HmB04UFUlFiJp9f9eGv`, next to each light frame). These rules keep new work from breaking it.

**How it works.** `data-theme="dark"` on `<html>` is the only switch. An inline script in `pages/_document.tsx` sets it before first paint, so there is no flash: a saved `localStorage.theme` of `light` or `dark` wins, while `system` or nothing saved follows the device (`prefers-color-scheme`). `src/context/ThemeContext.tsx` (`ThemeProvider`, `useTheme`) syncs React state, saves the choice (`preference`: `system` | `light` | `dark`, and the resolved `theme`) and, while System is chosen, follows live OS changes. Dark mode is on by default with no env line (changed 28 Oct 2026, so stage and prod need no env edit); `NEXT_PUBLIC_DARK_MODE=false` is the kill switch, which makes the site always light and hides the toggle (`primitives/toggles/theme-toggle`, in the header). The default for a first visit is the device's theme (decided 14 Oct 2026); the header toggle and the Profile page's Preferences tab (System / Light / Dark) set a fixed choice.

1. **Colours come from the semantic role tokens**, defined at the end of `:root` in `tokens.scss` with their dark values in the `:root[data-theme='dark']` block below it: `--color-bg-page`, `--color-bg-surface`, `--color-bg-surface-active`, `--color-text-primary/secondary/tertiary/disabled/mono-muted/on-dark`, `--color-border-subtle/strong/emphasis`, `--color-control-*`, `--color-accent`, `--color-status-*`, `--color-data-*`. Pick the role by what the colour *does* (card fill, label, divider, link), not by its light hex. Don't use raw hex/rgba or the palette tokens (`--color-white-*`, `--color-black-*`, `--color-gray-*`) for surfaces, text or borders in a module SCSS file. Brand fills that look the same in both themes (the blue gradient cards, status icon circles) may keep their values, with a comment saying so. `PrimaryButton`'s blue and red (`error`) variants don't: in dark they're a see‑through tint with a thin border (Figma 128:19203 / 128:19191, decided 16 Oct), from the `--color-button-primary-*` and `--color-button-danger-*` dark tokens.
2. **One surface.** In dark the page is `#000`, every card, table, panel, drawer and input is `--color-bg-surface` (`#141415`), and hover/active/nested tiles are `--color-bg-surface-active`. Rows and cards that sit *inside* a surface panel are `--color-bg-page` (black). Don't invent a per page or per component dark surface.
3. **When a light value can't be a role**, keep it and add `@include dark { ... }` (from `_mixins.scss`, so the file needs `@import '@newstyles/_mixins.scss';`) as the **last** thing inside the rule. It compiles to `:root[data-theme='dark'] .rule`, which outranks the component's own `:hover`/mobile rules, so repeat any hover/state inside the dark block, and scope with `mobile-up`/`tablet-up` when the override should not reach mobile. New dark values go in a dark block or the tokens dark block, never in light rules.
4. **Images never switch in JS.** Render both versions and let CSS pick: `.forDark { display: none; }` plus a dark block that hides `.forLight` and shows `.forDark` (see `AuthHeader`, `AuthShell`, `pages/404`). Dark assets sit next to the light ones with a `-dark` suffix, exported from the dark Figma frame. Check new PNGs for a baked-in white/black background before using them on both themes. Single colour icons are `currentColor` components or CSS masks, so they follow the text colour.
5. **Contrast.** Text must reach 4.5:1 on both `--color-bg-page` and `--color-bg-surface` (disabled text excepted). `#2639ED` and `#5b3df5` are below that on dark, which is why `--color-accent` and `--color-data-primary` have lighter dark values; use those roles for blue/purple text, and keep `--color-blue-primary` for fills.
6. **Check both themes.** Every new or changed component is checked with `localStorage.theme` set to `dark` and to `light`, at mobile, tablet and desktop widths, before it's done. Light mode must look the same as before the change.
