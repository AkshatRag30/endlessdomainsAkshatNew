# Animations added on request (not in Figma)

Added 3 Nov 2026 at the user's request, pushed on branch `portfolio` (origin/portfolio). None of these are in Figma; they are waiting for design approval. Each one is its own commit, so any of them can be removed on its own with `git revert <commit>`.

Every effect is CSS only (the banner adds one SVG for the light paths), runs only on devices with a mouse where it is a hover effect, and switches off for anyone with "reduce motion" turned on.

| # | Animation | Where you see it | Commit | Files |
|---|---|---|---|---|
| 0 | `dock-hover` mixin (no visual change on its own) | nowhere by itself | `8451eb5` | `src/design-system/styles/_mixins.scss` |
| 1 | Dock hover on Recently Added cards: hovered card 1.05, neighbours shrink to 0.97 | Marketplace, Recently Added strip | `4edfb88` | `composites/marketplace/promoted/PromotedDomainsSection/PromotedDomainsSection.module.scss` |
| 2 | Dock hover on listing rows: hovered row 1.015, neighbours 1.006 | Marketplace listings table (desktop and tablet) | `2bbdcde` | `composites/marketplace/listings/LiveListingsTable/LiveListingsTable.module.scss` |
| 3 | Dock hover on sidebar tabs: hovered tab 1.05, neighbours 1.02, "soon" tabs still | Sidebar on every page | `a09b484` | `layouts/sidebar/SidebarSection/SidebarSection.module.scss` |
| 4 | Lights along the banner lines into the logo, logo glow (4.5s loop) | Marketplace banner | `33da21c` | `composites/marketplace/hero/MarketplaceHero/MarketplaceHero.tsx` and `.module.scss` |
| 5 | Lights on the selected sidebar tab: dash along the line into the lens, lens glow (3.6s), shine every 7s, dark bracket glow breathing | Selected sidebar tab on every page | `1997a89` | `layouts/sidebar/SidebarNavItem/SidebarNavItem.module.scss` |

## How to revert

1. One animation: `git revert <commit>` from the table, for example `git revert 33da21c` for the banner lights.
2. All of them: `git revert 1997a89 33da21c a09b484 2bbdcde 4edfb88 8451eb5` (newest first).
3. The mixin (0) is used by 1, 2 and 3. Revert it only after all three are reverted, or the SCSS stops compiling. Leaving it in place is harmless.
4. If the commits were squashed or rebased and the hashes changed, search for the markers instead: every block carries the comment "Not in Figma" or "user request 3 Nov 2026", and the keyframes are named `hero-line-pulse`, `hero-logo-glow`, `sidebar-line-light`, `sidebar-lens-glow`, `sidebar-bracket-breathe` and `sidebar-active-shine`.

## How to tune instead of reverting

1. Dock hover strength: the two numbers in each `@include dock-hover(...)` call (hovered scale, neighbour scale; below 1 shrinks the neighbours).
2. Banner speed: `$lights-cycle` in `MarketplaceHero.module.scss`; brightness in `.pulse` (`stroke-width`, `filter`) and `.logoGlow` (`background`).
3. Sidebar tab speed: `$active-cycle` and the shine's `7s` in `SidebarNavItem.module.scss`; strength in the `--active-*` variables on `.active`.

## History

1. Sidebar tabs with shrinking neighbours (0.97) were tried and the user reverted it to 1.02 the same day; the Recently Added cards kept the shrinking neighbours (0.97) at the user's request.
