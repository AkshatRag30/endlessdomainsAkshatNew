# Portfolio Page: Implementation Plan

Figma: file `hq6HmB04UFUlFiJp9f9eGv` (marketplace akshat), section **"portfolio"** `193:16444`.
Branch: a new `portfolio` branch off `dark-mode` (decided 30 Oct, Q12), created when phase 1 starts.
Written 30 Oct 2026. Code comments cite this file as "portfolio plan §N.N".

---

## 1. Context

**Portfolio** is a seller's public shop window: who they are, how they trade, and every name they hold, with the ones for sale ready to open. The Profile page already points at it in three places: the Public Preview card ("Exactly what visitors see at your portfolio link"), the profile link `endless.domains/u/<username>` (`portfolioPath()` in `ProfileInformationForm`), and the rail's "View portfolio" link that sends people to My Domains as a stand in (profile plan §9, §15.12 item 7).

Figma draws the page with **Portfolio** active in the sidebar's Seller Hub section, but the hero carries visitor actions (Message, Share) and the rows carry buyer actions (View Details, Make Offer, watchlist heart, alert bell). So one page serves two audiences:

| Mode | Route (proposal, Q1) | Who | Data |
|---|---|---|---|
| **Own** | `/portfolio` | The signed in seller, from the sidebar | Their own account, mostly real today (§8.3) |
| **Public** | `/u/[username]` | Anyone with the link | Needs a public backend endpoint that does not exist yet (§8.2) |

Both render the same components; only the data source and a few actions differ (§7.8).

The page has:

| Area | What it does |
|---|---|
| **Hero banner** | Avatar, display name (shortened wallet in Figma), Verified seller pill, `vision.eth · Joined May 2024 · Active 3 days ago`, bio, **Message** and **Share** buttons |
| **Stat tiles** (5) | Total domains 112 (Across 7 TLDs), Active listings 37 (Currently for sale), Domains sold 58 (+6 this month), Total volume 126.4 ETH (≈ $315,680), Avg Endless Score 4.7 (Top 8% of sellers) |
| **Tabs** | All, Listing 9, Sold History 9, Offer Receive 9, Collection 9, Activity |
| **Count line** | "Showing 12 of 112 domains" |
| **Toolbar** | Search (clear X, dark search button), All TLDS, All Type, All Status, "Sort by: For sale", "Price: low to high", grid/list toggle |
| **Status legend** | "Status: Not for sale (dark), For sale (green)" |
| **List view** (desktop) | Domain Name, Price, AI Appraisal, Action; left accent strip green (for sale) or dark (not for sale) |
| **Grid view** | 4 cards per row: status chip, chain tag, heart, bell, identity, Price + change chip, AI appraisal, action button |
| **Pagination** | « Previous, 1 2 3 … 10, Next » |

### 1.1 Scope: live where an endpoint returns it, sample everywhere else

Same rule as Profile and History: a section is **live** only when an existing endpoint returns exactly that information; otherwise it is **sample** data behind the same hook, marked with the **Sample data** chip (`primitives/badges/sample-data-chip`), and switches to live later without touching components. Full mapping in §8.3. Short version: in **own** mode the hero (name, username, avatar, bio, member since), Total domains, Active listings, Domains sold, Total volume and the All / Listing domain list can be real today; Endless Score, AI appraisal, Offer Receive, Collection, Message, alerts and the whole **public** mode are sample until the backend adds them.

### 1.2 Dark mode from the first line

Every desktop and mobile frame has a dark twin (§2.1). Follow `CLAUDE.md` §7: role tokens for surfaces, text and borders, `@include dark` only where a role can't express it, both themes checked at mobile, tablet and desktop. Where the dark frame changes more than colours, follow the dark frame (§2.8).

---

## 2. Screen inventory

### 2.1 Frame map

| Frame | Light | Dark |
|---|---|---|
| Desktop list view (1512) | `193:21954` | `193:18873` |
| Desktop grid view (1512) | `193:16445` | `193:17643` |
| Mobile (390, grid only) | `193:19995` | `193:20973` |
| Loose grid card panel (1114 × 436, light card set on a grey board) | `193:23034` | none |

Big frames return metadata only from `get_design_context`; query the children. Useful light list children: hero `193:21955`, stat tiles `193:21989`, tabs `193:22030`, count line + toolbar `193:22126` (search `193:22130`, filter pills `193:22141`, view toggle `193:22176`), legend + table `193:22186` (header `193:22196`, rows `193:22207`, `193:22300`, `193:22392`, `193:22485`, `193:22577`, `193:22670`), pagination `193:22762`. Light grid: tabs/toolbar `193:16520`, cards under `193:16686` (one card: `193:16942`). Mobile light: header `193:19997`, hero `193:20033` + `193:20048`, stats `193:20065`, tabs to cards `193:20104`, bottom nav `193:20944`.

The light list frame `193:21954` and the light grid frame `193:16445` are otherwise identical; the section has no other screens (no empty, loading, other tab, share, message or offer frames, Q4).

### 2.2 Hero banner (`193:21955`, 1157 × 125)

1. Card radius 4px, 1px border `rgba(38,57,237,0.08)`, fill `linear-gradient(97deg, #2639ED 4%, #272626 76%)` with the noise texture at 40% plus lighter, and two diagonal light shapes on the right (same family as `MyDomainsHeroBanner` and `WatchlistHeroBanner`; reuse their background, §3).
2. Avatar 83px circle with a thin ring, photo inside (`ProfileAvatar` with initials fallback).
3. Name "0x8A7F…3c9D" Satoshi Bold 20px `#EFECFF`, tracking −0.457px. Next to it the **Verified seller** pill: 82 × 21, fill `rgba(124,77,255,0.2)`, green `#04B947` tick circle, 9.4px Bold white text.
4. Meta line 12px Regular white: `vision.eth · Joined May 2024 · Active 3 days ago`.
5. Bio 14px Regular white, line height 1.2, max width 705px.
6. Right: **Message** (84 × 35) and **Share** (65 × 35) white buttons, radius 4px, 14px icon, 13px Regular text at 56% black, 3.6px gap.

### 2.3 Stat tiles (`193:21989`, 1160 × 94)

Five equal tiles in one row: label 14px, value 22px Bold blue `#2639ED`, sub line 14px (green for "+6 this month" and "Top 8% of sellers", dark otherwise). Total volume has an ETH coin icon before the value. Tile style matches the existing `SummaryTile` (grey gradient tile with a white 3px border and a light ring), not `StatCard` (§3.2). Dark: tiles on `--color-bg-surface`, value white, green sub lines stay green.

### 2.4 Tabs (`193:22030`)

1. 36px pills, 10px gap. Active pill blue `#2639ED`, white Bold 14px, inner white glow; inactive Satoshi Medium 14px at 36% black.
2. Count chip after the label: Inter SemiBold 11px at 41% black on `rgba(0,0,0,0.1)`, radius 99px, padding 2 × 7. **Activity** has no chip.
3. Same look as `ProfileTabs` (used by Profile and History), not `ListingCategoryTabs`, which sits in a glass bar (§3.3).

### 2.5 Count line, toolbar and legend (`193:22126`, `193:22186`)

1. "Showing 12 of 112 domains" 14px, tinted blue grey (light), white (dark).
2. Search 243 × 48 with a clear X and a dark square search button (`SearchInput`).
3. Five dark pills, 33px tall: **All TLDS** (78), **All Type** (78), **All Status** (78), **Sort by: For sale** (117, "Sort by:" muted), **Price: low to high** (123). Then the grid/list toggle 76 × 31 (`ViewToggle`).
4. Legend: "Status" then a **Not for sale** chip (dark gradient `#333 → rgba(51,51,51,0.6)`) and a **For sale** chip (green).

### 2.6 List view (`193:22207`)

1. Column header row 29px: Domain Name, Price, AI Appraisal, Action, vertical rules between.
2. Row 1140 × 55, white, 1px border `rgba(210,207,207,0.67)`, radius 3px, 5 × 48 accent strip on the left edge (green for sale, dark not for sale).
3. **Domain Name**: 31px domain avatar, name 15px Satoshi Bold, `.ud` extension badge (yellow outline), then a separate `.sol` tag (1px blue border, 9px Medium, 44 × 16). Meta line JetBrains Mono 11px `#A6A1BB`: chain icon, "bnb · 7 chars ·", crown, verified icon. Same identity block as `WatchlistDomainIdentity layout="row"`.
4. **Price** "$23,000" and **AI Appraisal** "$520", 14px Medium blue `#2639ED` (white in dark).
5. **Action**: **View Details** (blue gradient primary, 119 × 39) for a name for sale, **Make Offer** (dark) for one not for sale; then the heart (red outline) and the bell (yellow outline), 22px gap.

### 2.7 Grid card (`193:16942`, 265 × 193)

1. White card, 0.15px border at 22% black, radius 2.4px; a divider at 106px splits top and bottom.
2. Top: status chip (For sale green / Not for sale dark, 57 × 16) and the `.sol` tag; heart and bell top right.
3. Identity: 31px avatar, name 12px Bold, `.ud` badge, meta "pol · 7 chars · 2,329 views" + crown, JetBrains Mono 10px.
4. Bottom left: "Price" 10px at 69% black, "2,041.50" 14.5px Bold `#171429`, optional change chip "−14%" (11px Bold `#12A05C` on `#E7F6EE`, radius 5), "AI appraisal $520" 11px `#ABA7BC`.
5. Bottom right: **View Details** (blue gradient) or **Make offer** (dark, Space Grotesk Medium 13.6px), 119 × 39 with the cut corner shape the other primary buttons use.
6. Desktop grid: 4 columns, 12px gaps (`193:16686`).

### 2.8 Mobile (`193:19995`, `193:20973`)

1. Hero stacks and centres: 106px avatar, name + Verified pill, meta, bio, Message and Share centred under it.
2. Stat tiles become **one full width tile per row** (five rows), not a 2 column grid.
3. Tabs scroll horizontally (All, Listing, Sold History… cut off).
4. Toolbar: full width search, then the five pills wrap onto two rows; **no view toggle** and **no status legend** (each card has its chip), same reasoning as My Domains (`CLAUDE.md` §5).
5. Grid cards only, full width, one per row. No pagination drawn (the frame is cut off); proposal: keep the numbered pagination, compact (Previous, current of total, Next) on mobile (Q8).
6. The bottom nav is drawn halfway down the frame because it is a fixed overlay; it is the existing `MobileBottomNav`.

### 2.9 Dark specifics (follow the dark frame)

1. Active tab: **white chip with black text** on desktop and on mobile (unlike History, where mobile dark kept blue). Build it as drawn.
2. Hero gradient, Verified pill, status chips, accent strips and the change chip keep their brand colours (comment them as brand fills, `CLAUDE.md` §7.1).
3. **View Details** becomes the dark see through primary (`--color-button-primary-*` dark tokens); **Make Offer** becomes an outlined white button on black.
4. Table rows and grid cards sit inside the surface panel, so they are `--color-bg-page` (black) per `CLAUDE.md` §7.2; the panel and stat tiles are `--color-bg-surface`.
5. Price and appraisal text go white in dark (the blue fails contrast; if blue is wanted, use `--color-accent`).

### 2.10 Figma quirks to flag in comments (do not silently fix)

1. **Name shown is a shortened wallet** ("0x8A7F…3c9D") while `vision.eth` sits in the meta line. Proposal: show `fullName`, else `@username`, else the shortened wallet; the meta line shows `@username` (or the primary name) when the title is not already it (Q5).
2. **"Verified seller"** has no backend meaning. Proposal: show it when the account's email is verified and a wallet is linked, until the backend defines it (Q6).
3. **Not for sale names show a price** ("2,041.50") in the grid. The only number an unlisted name has is the appraisal. Proposal: unlisted cards show "Not listed" (or the last sale price once the backend has it) instead of a made up price (Q7).
4. **List and grid disagree on prices**: list "$23,000" in blue, grid "2,041.50" with no currency in black. Proposal: one formatter for both, with the token or `$` (USDT, 2 decimals), like History.
5. **"−14%" is green**. Green normally means up. **Decided 30 Oct**: use the existing `TrendDelta` (arrow and colour by sign, red for a drop). What the percentage is measured against is still Q7.
6. **Two extension tags per row**: the `.ud` badge after the name and a separate `.sol` tag. The `.sol` tag reads like a chain/network tag but the meta line already shows the chain ("bnb" in list, "pol" in grid). Proposal: drop the extra tag or make it the network tag and drop the chain text (Q7).
7. **"Sort by: For sale"** is not a sort; it duplicates **All Status**. Proposal: one sort pill with Price low to high, Price high to low, Newest, Most viewed; status lives in All Status only (Q9).
8. **"All Type"** options are undefined (Q9).
9. The dark **Activity** tab label is near invisible (contrast). Use `--color-text-tertiary` like the other inactive tabs.
10. Dark desktop sidebar shows a **Notification** item and different icons; the light one shows **Settings**. The sidebar is shared and out of scope; we only add the Portfolio item (§4.3).
11. Mobile hero: Message and Share are centred; desktop: right aligned. Build both.
12. Only the **All** tab is designed (Q4).

---

## 3. What already exists to reuse

Rechecked against the code on 30 Oct (props and markup read, not just names). Per the standing rule, extend additively before building anything new. Verdicts: **as is** (use it unchanged), **additive** (small backwards compatible prop), **pattern** (copy the structure; the component itself doesn't fit), **no** (looks similar, doesn't fit).

### 3.1 Page level

| Need | Reuse | Verdict | Why |
|---|---|---|---|
| Page shell | `MainLayout` + `MarketplacePageShell` | additive | `rightRail` is required today; make it optional (§5.3) |
| Hero background | `MyDomainsHeroBanner` / `WatchlistHeroBanner` SCSS (same `bannerbg.jpg`: blue to charcoal gradient, noise, accents) | pattern | Both hardcode their heading and buttons; `PortfolioHeroBanner` reuses the background class, not the component |
| Avatar | `primitives/avatars/avatar-upload` `ProfileAvatar { src, name }` + `getInitials` | as is | Already the read only avatar in `PublicPreviewCard`; size it from the hero's class |
| Verified tick | `/assets/img/profile/verified-badge.svg` (used by `PublicPreviewCard`) | as is | The pill around it ("Verified seller") is new markup |
| Message, Share buttons | `primitives/buttons/default-buttons` `DefaultButton` (`variant="default"`, `icon`) | as is | White 35px buttons with an icon; confirm height in phase 2 |
| Share action | Copy link pattern in `pages/watchlist/index.tsx:93` (Share List), `pages/details/[orderId].tsx:95`, `ProfileTabPanel.tsx:111` + `ToastMessage` | pattern | No shared helper exists; three pages copy it inline. `usePortfolioShare` adds `navigator.share` on mobile |

### 3.2 Stat tiles

| Need | Reuse | Verdict | Why |
|---|---|---|---|
| Tile surface | `primitives/cards/summary-tile` `SummaryTile { label, children }` | additive | Same grey gradient tile, white 3px border and light ring as Figma, already on role tokens for dark. Missing: the sub line ("Across 7 TLDs") and the blue value. Add optional `sublabel?: ReactNode` and `tone?: 'default' \| 'accent'` (value in `--color-accent`) |
| ~~`StatCard`~~ | `primitives/cards/stat-card` | **no** | Coloured gradient fills (blue, dark, purple) with white text; Portfolio tiles are light with blue numbers |
| ~~`PortfolioStatsRow`~~ | `composites/my-domains/summary/PortfolioStatsRow` | **no** | Fixed 4 tile My Domains rail built on `StatCard`; also a name clash, so ours is `PortfolioStatTiles` |
| Token icon | `primitives/token-chain-icon`, `primitives/token-suffix` | as is | For the Total volume value (USDT on v2, Q7) |
| Coming soon tile | `primitives/badges/coming-soon-badge` | as is | Avg Endless Score until a backend exists (History did the same for its tiles) |

### 3.3 Tabs, toolbar, legend

| Need | Reuse | Verdict | Why |
|---|---|---|---|
| Tabs | `composites/profile/shared/ProfileTabs<T>` (`tabs`, `ariaLabel`, `tabId`, `panelId`, `mobileDarkActive`) | additive | Already the Figma look: solid blue active pill, plain inactive text, **white chip in dark**, and `mobileDarkActive="selected"` gives the white chip on mobile dark too (§2.9 item 1). Roving tablist, already used by History. Its badge only shows for `wallets`; add optional `count?: number` on `PillTab` and render the grey count chip (Activity has none) |
| ~~`ListingCategoryTabs`~~ | `composites/marketplace/listings/ListingCategoryTabs` | **no** | Has counts, but draws a glass bar container and a gradient active pill; Portfolio tabs have no bar |
| Toolbar | `composites/marketplace/watchlist/WatchlistFilterBar` | pattern | Same row: `SearchInput`, `FilterDropdown` pills, `ViewToggle` hidden on mobile. Props are tied to `WatchlistFilters`, so `PortfolioToolbar` copies its layout and SCSS with five pills |
| Search | `primitives/inputs/search-input` `SearchInput` | as is | Clear X, dark search button, `onSubmit`; sanitises to domain characters, which is right here |
| Pills | `primitives/inputs/filter-dropdown` `FilterDropdown` (`variant="pill"`, `label`, `value`, `options`) | as is | Caller builds the label, so "Sort by: For sale" is just a label string |
| View toggle | `primitives/toggles/view-toggle` `ViewToggle` | as is | |
| Status legend | `StatusChip` `neutral` + `for-sale` | as is | `neutral` is the dark `#333` gradient and `for-sale` the green one, exactly Figma's "Not for sale" / "For sale". The legend row is inline in `WatchlistTable` and `MyDomainsTable`; copy that markup (a shared legend primitive is optional) |

### 3.4 Rows, cards, actions

| Need | Reuse | Verdict | Why |
|---|---|---|---|
| Grid card anatomy | `composites/marketplace/watchlist/WatchlistCard` | pattern (very close) | Same Figma family (Watchlist 20:12390): status chip, heart and bell on top, identity, divider, Price block beside a primary button. Portfolio adds the `.sol` tag, the AI appraisal line and Make Offer. Its props are `WatchlistItem` plus Watchlist handlers, so `PortfolioDomainCard` copies the SCSS and composes the same pieces |
| List row anatomy | `WatchlistRow` | pattern | Same 5 × 48 status edge and Domain / Price / Action grid; Portfolio adds the AI Appraisal column |
| List/grid switch and states | `WatchlistTable` | pattern | Already has the header row, skeleton rows and cards, empty and filtered empty, `useIsMobile` forcing grid and the narrow laptop switch to cards. Replace its "show N more" with `Pagination` |
| Domain identity | `WatchlistDomainIdentity { item, href, layout, metaText, showCrown }` | as is | `metaText` gives "pol · 7 chars · 2,329 views", `layout="card"` the grid size, `showCrown` the crown. `item` only needs `facts` and `addedAt` |
| Extension, chain | `ExtensionBadge`, `ChainBadge` | as is | `ExtensionBadge` is already inside the identity |
| Price cell | `WatchlistPriceCell` | pattern | Takes a `WatchlistItem` and has no change chip or appraisal; copy its USDT formatting and Tether icon so both pages show prices the same way |
| Change chip | `primitives/badges/trend-delta` `TrendDelta { changePct }` | as is (**decided 30 Oct**) | Draws "▼ 14.0%" coloured by sign, so a drop reads red, not Figma's green "−14%" pill. Consistent with the domain overview. Shown only when `changePct` is not null |
| View Details | `primitives/buttons/primary-button` `PrimaryButton size="sm"` | as is | Same button Watchlist uses for Buy Now; the dark tint comes for free |
| Make Offer | `PrimaryButton variant="charcoal"` | as is | The dark button Watchlist kept (commented) for Notify. Disabled with a Coming soon tooltip (Q11) |
| Heart and bell | `WatchlistIconActions { item, isRemoving, onRemove, onAlert }` | additive | Heart is always filled and only removes. Add `isSaved?` and `onToggle?` so it shows an outline when not saved (`aria-pressed`). The bell is already a grey placeholder |
| Tooltip | `primitives/tooltip` `Tooltip { label, portal }` | as is | For the Coming soon hovers |

### 3.5 Data and helpers

| Need | Reuse | Verdict |
|---|---|---|
| Own profile | `hooks/profile/useProfileDetails`, `useAccountSummary` | as is |
| Own domains | `hooks/my-domains/useMyDomainsData` | as is (mapped to `PortfolioDomain`) |
| Watchlist add/remove | `hooks/marketplace/useWatchlist` | as is |
| Details link | `orderDetailsHref(orderHash)` in `routes.ts` | as is |
| Sample data | `useMockQuery`, `src/data/marketplace/seededRandom.ts`, `SampleDataChip` | as is |
| Errors | `getUserFriendlyToastMessage`, `ToastMessage` | as is |

### 3.6 Genuinely new

1. **Pagination** primitive (nothing in `src` does Previous / 1 2 3 … 10 / Next).
2. `PortfolioHeroBanner` content, on the shared background.
3. `PortfolioStatTiles` (five `SummaryTile`s).
4. `PortfolioToolbar`, `PortfolioDomainRow`, `PortfolioDomainCard`, `PortfolioDomainList`, built from the pieces above and copying Watchlist's layout.
5. The "Verified seller" pill and the `.sol` tag (tiny, local to the composites).
6. `usePortfolioShare`, the first shared share helper (Watchlist, details and receipt could move to it later, not in this work).

Additive changes to existing components, each checked on its other pages: `MarketplacePageShell` (optional rail), `SummaryTile` (`sublabel`, `tone`), `ProfileTabs` (`count`), `WatchlistIconActions` (heart toggle).

**Old code to leave alone**: `src/_archive/seller-portfolio/[slug].tsx` (legacy v1, `user_hash`, POST `/marketplace/get-seller-domain`). It is the only "public seller" page that ever existed; read it for ideas, don't revive it.

---

## 4. Routing and navigation

1. **Own**: `pages/portfolio/index.tsx` + `portfolio.module.scss`, protected by the global `ProtectedRoute` (Q1).
2. **Public**: `pages/u/[username].tsx`, not protected, rendering the same page component in public mode. Until a public API exists (§8.2) it shows sample data for any username, or a "This portfolio isn't public yet" state (Q2). Short wallet links (`/u/0x…`) only if the backend supports lookup by address (Q3).
3. `PORTFOLIO_HREF = '/portfolio'` and `portfolioHref(username)` → `/u/${encodeURIComponent(username)}` in `src/helpers/marketplace/routes.ts`. Tab, page, filters and view in the query string (`?tab=listing&page=2&view=grid`), `router.replace` shallow, validated like Profile and History.
4. Sidebar: add `{ id: 'portfolio', label: 'Portfolio', href: '/portfolio', icon: …, requiresAuth: true }` to Seller Hub in `src/data/marketplace/navigation.ts`, after My domains (Figma draws it last in Seller Hub; confirm order, Q10). Drawer picks it up automatically.
5. Header: `menuItems.ts` has `{ label: 'Portfolio', href: '/', isPlaceholder: true }`. Point it at `/portfolio` and drop `isPlaceholder` (signed out visitors land on login via `ProtectedRoute`) (Q10).
6. Mobile bottom nav: map `/portfolio` and `/u/[username]` to `account` in `BOTTOM_NAV_ROUTE_TO_ID` (`src/design-system/layouts/main-layout/index.tsx`).
7. Profile links (phase 8): `AccountSummaryCard` "View portfolio" → `PORTFOLIO_HREF` (today `MY_DOMAINS_HREF`); the profile URL copy keeps `endless.domains/u/<username>` and becomes a real link once `/u/[username]` serves real data; `SellerCard` "View Portfolio" on `/details` → `portfolioHref(seller.username)` when the order carries a username (backend, §8.2 item 6).

---

## 5. New components

### 5.1 Primitives

1. **`primitives/navigation/pagination/Pagination`** `{ page, pageCount, onChange, siblingCount?, compact?, ariaLabel? }`. « Previous, numbers with ellipsis (1 2 3 … 10), Next ». 38px cells, 1px dividers, active cell grey fill. `<nav aria-label>`, buttons with `aria-current="page"`. `compact` (mobile): Previous, "2 of 10", Next. Pure helper `getPageItems(page, pageCount, siblingCount)` in the same folder, unit checked in Node.
2. **Heart toggle**: additive `isSaved?` and `onToggle?` on `WatchlistIconActions` (existing callers keep the filled remove only heart). Outline heart when not saved, filled when saved, `aria-pressed`.
3. **Additive props on existing primitives** (§3): `SummaryTile` gets `sublabel?` and `tone?`; `ProfileTabs`' `PillTab` gets `count?`.
4. The status legend stays inline markup with two `StatusChip`s, copied from `WatchlistTable` (no new primitive).

### 5.2 Composites: `src/design-system/composites/portfolio/`

Exported through a curated `index.ts` barrel like `my-domains` and `history`.

| Folder | Component | Figma |
|---|---|---|
| `hero/PortfolioHeroBanner` | Avatar, name, Verified pill, meta, bio, Message, Share; centred stack on mobile | `193:21955`, `193:20033` |
| `summary/PortfolioStatTiles` | Five `SummaryTile`s; 5 across desktop, 3 + 2 at tablet, 1 per row on mobile | `193:21989`, `193:20065` |
| (no wrapper) | Tabs are `ProfileTabs` with a `PORTFOLIO_TABS` list, used directly in the page | `193:22030` |
| `listings/PortfolioToolbar` | Count line, search, five pills, view toggle | `193:22126` |
| `listings/PortfolioDomainRow` | One list row (accent strip, identity, price, appraisal, actions) | `193:22207` |
| `listings/PortfolioDomainCard` | One grid card | `193:16942` |
| `listings/PortfolioDomainList` | Header row + rows, or the card grid (`useIsMobile` forces grid), legend, empty/loading/error, pagination | `193:22186` |
| `shared/PortfolioDomainActions` | View Details / Make Offer + heart + bell, used by row and card | inside rows |

**Naming note**: `composites/my-domains/summary/PortfolioStatsRow` already exists (it's My Domains' rail). The new tiles are `PortfolioStatTiles` to avoid a clash; don't rename the old one.

### 5.3 Shell change (additive)

`MarketplacePageShell`: make `rightRail` optional; with no rail the grid becomes `sidebar hero` / `sidebar main` with main spanning the rail column. Every existing caller keeps passing a rail, so nothing else changes. Check Home, Profile, History, Watchlist and My Domains at the three widths after the change.

### 5.4 Assets

Download from the Figma nodes (never temporary URLs) into `public/assets/img/portfolio/`: Message icon, Share icon, Verified seller tick (or reuse `/assets/img/profile/verified-badge.svg` if it matches), ETH coin for Total volume (check `TokenChainIcon` first), bell outline. Hero light shapes and texture come from the existing hero banners. Single colour icons as `currentColor` components or the `react-icons` already in the repo. Accent strips and chip gradients are CSS.

---

## 6. Data model

Folders follow My Domains, Watchlist and History: types in `src/types/portfolio/`, sample data in `src/data/portfolio/`, mappers in `src/helpers/portfolio/`, one hook per file in `src/hooks/portfolio/`, RTK endpoints in `src/core/redux/` only when a source goes real.

### 6.1 View model: `src/types/portfolio/index.ts`

```ts
export type PortfolioMode = 'own' | 'public'
export type PortfolioTab = 'all' | 'listing' | 'sold' | 'offers' | 'collection' | 'activity'
export type PortfolioListingStatus = 'for-sale' | 'not-for-sale' | 'sold'
export type PortfolioSort = 'price-asc' | 'price-desc' | 'newest' | 'most-viewed'   // Q9

export interface PortfolioOwner {
  username: string | null
  displayName: string               // §2.10 item 1 fallback chain
  walletShort: string | null        // "0x8A7F…3c9D"
  primaryName: string | null        // "vision.eth"
  avatarUrl: string | null
  bio: string | null
  memberSince: string | null        // ISO date
  lastActiveAt: string | null       // ISO
  isVerifiedSeller: boolean         // Q6
  isMock: boolean
}

export interface PortfolioStats {
  totalDomains: number; tldCount: number
  activeListings: number
  domainsSold: number; soldThisMonth: number | null
  totalVolume: { amount: number; token: string; usd: number | null }
  endlessScore: { value: number; percentile: number } | null   // null → tile shows Coming soon
  isMock: boolean
}

export interface PortfolioDomain {
  id: string
  facts: DomainNameFacts            // same shape as Watchlist and History
  status: PortfolioListingStatus
  price: { value: number; token: string } | null   // listed or sold price; null when not listed (§2.10 item 3)
  changePct: number | null          // Q7
  appraisalUsd: number | null       // null → "AI appraisal coming soon" or hidden
  views: number | null
  orderHash: string | null          // → orderDetailsHref for View Details
  watchlistId: string | null        // saved by the viewer
  isMock: boolean
}

export interface PortfolioFilters {
  tab: PortfolioTab
  search: string
  tld: string | 'all'
  type: string | 'all'              // Q9
  status: 'all' | PortfolioListingStatus
  sort: PortfolioSort
  page: number
  view: 'list' | 'grid'
}
```

Tab → content: All = every name; Listing = `status === 'for-sale'`; Sold History = sold names (needs its own columns, Q4); Offer Receive, Collection = coming soon state until a backend exists (§8.3); Activity = the seller's public activity (could reuse History's row in a read only form once a public feed exists, Q4).

### 6.2 Hooks: `src/hooks/portfolio/` (one per file, no barrel)

1. `usePortfolioFilters()` keeps everything in the URL (§4.3), resets `page` to 1 when anything but `page` changes; search applies on submit or Enter.
2. `usePortfolioOwner(mode, username?)` → `QueryResult<PortfolioOwner>`. Own: `useProfileDetails` + `useAccountSummary` (memberSince). Public: `useMockQuery` until §8.2 item 1.
3. `usePortfolioStats(mode, username?)` → `QueryResult<PortfolioStats>`. Own: `useAccountSummary` (domainsOwned, listed, completedSales, volumeSold) + TLD count from the domain list; score sample. Public: sample.
4. `usePortfolioDomains(mode, filters, username?)` → `QueryResult<{ items, total, pageCount }>`. Own: `useMyDomainsData` (LISTED + UNLISTED), mapped, then filtered, sorted and paged client side by a pure `filterPortfolio()`. Public: sample.
5. `usePortfolioShare(owner)` → `{ share() }`: `navigator.share` when available (mobile), else copy `portfolioHref` as an absolute URL with the "Link copied" toast.

### 6.3 Sample data: `src/data/portfolio/`

`owner.ts`, `stats.ts` (Figma's numbers), `domains.ts` with ~40 names across `.ud`, `.eth`, `.sol` and both statuses (so pagination shows 4 pages at 12 per page), built with `seededRandom.ts` like Watchlist so renders are stable. The whole folder must be deletable once public mode is live (profile plan §1.1 rule).

---

## 7. Page states and behaviour

1. **Loading**: hero skeleton, tile skeletons, 6 skeleton rows / 8 skeleton cards.
2. **Empty**: per tab ("No names listed yet"); filtered empty with a Clear filters button; own mode empty All tab with "List your first domain" → My Domains.
3. **Error**: friendly message with Retry; toast through `getUserFriendlyToastMessage`.
4. **Not found / private** (public mode): "This portfolio doesn't exist or isn't public" with a link home. Depends on the privacy setting (§8.2 item 2).
5. **Pagination**: 12 per page (Figma shows 6 rows in list and 8 cards in grid; use 12 for both, Q8); scroll to the top of the list panel on change; "Showing X of Y domains" uses the filtered total.
6. **Make Offer**: no offer system. Proposal: disabled button with a Coming soon tooltip (Q11).
7. **Message**: no messaging. Proposal: disabled with Coming soon tooltip (Q11).
8. **Own mode differences**: none for the buttons (decided 30 Oct): your own portfolio shows exactly what Figma draws, the same as a visitor's. Only the empty state wording differs.
9. **View Details**: `orderDetailsHref(orderHash)` for listed names; not for sale names show Make Offer instead (§7.6).
10. **Heart**: signed out → login redirect with `returnTo`; signed in → POST/DELETE watchlist, optimistic, toast on failure.
11. **Bell**: price alerts are mock everywhere. Proposal: Coming soon tooltip (Q11).
12. **Share**: §6.2 item 5.
13. **SEO** (public mode): `<title>` "{name} on Endless Domains", meta description from the bio, Open Graph image later (Q3).

---

## 8. Real API

### 8.1 What exists (backend checked 30 Oct on `origin/uat` 543b2937, `D:\Akshat Endless\backend\backend`; fetch first, never edit)

1. **No public portfolio or profile endpoint** by username or wallet. `/users/*` is all JWT, caller only. The `User` entity does have `username`, `bio`, `avatarUrl`, `lastActiveAt`, but nothing exposes them publicly. `publicPortfolio` and `showSalesHistory` don't exist in the backend (our Privacy card is still sample).
2. `GET /marketplacev2/orders/summary` (JWT, caller): `{ memberSince, domainsOwned, listed, volumeSold { amount (USDT, 6 decimals), token }, completedSales }`. Volume is **USDT**, Figma says ETH (Q7).
3. `GET /marketplacev2/orders/my-domains?status=LISTED|UNLISTED` (JWT, caller): the own domain list we already use on My Domains.
4. `GET /marketplacev2/orders` (public browse): no `maker` filter, so it can't list one seller's names; cursor paginated (no totals, no page numbers).
5. `GET /marketplacev2/history/get-all` (JWT + verified wallet, caller): own activity only.
6. Watchlist GET/POST/DELETE (JWT).
7. Legacy v1, public, keyed by `user_hash`: POST `/marketplace/get-seller-domain`, GET `/marketplace/seller-domains-summary`. Old tables, not v2 orders; don't build on them.
8. Nothing for offers, messaging, price alerts, AI appraisal, Endless Score, collections, or "verified seller".

### 8.1.1 Update 30 Oct 2026 (origin/uat c7b60c49)

1. `GET /marketplacev2/orders/my-domains` accepts `status=SOLD` and `ALL`; SOLD rows carry the filled order (`priceUsdt`, `filledAt`). Own mode's Sold History uses it, falling back to a "not available yet" panel if stage rejects it.
2. Commit 7e86bbeb: PUT /users only resets email verification when the address actually changes (profile plan bug from 29 Oct, backend half fixed). Same commit disables .sol in domain search.
3. Own mode is live from phase 7 (progress log). Public mode still waits on §8.2.

### 8.2 What the backend should add (for the phase 0 message)

1. `GET /users/public/:username` (no auth): `{ username, fullName, avatarUrl, bio, memberSince, lastActiveAt, primaryName, walletShort, isVerifiedSeller }`; 404 when the user doesn't exist **or** the portfolio is private (unless the caller is the owner). Never email, phone or Telegram.
2. Privacy: GET/PATCH `/users/privacy` `{ publicPortfolio, showSalesHistory }` (already asked 27 Oct, profile plan §15.12 item 7), enforced inside items 1, 3, 4.
3. `GET /users/public/:username/stats`: `{ totalDomains, tldCount, activeListings, domainsSold, soldThisMonth, totalVolume { amount, token, usd } }`.
4. `GET /users/public/:username/domains?status=&tld=&q=&sort=&page=&limit=`: page based with `total` (the design has numbered pages), items with `domainName, tld, chain, status, priceUsdt, orderHash, views?`. Alternatively a `maker` filter plus `total` on `GET /marketplacev2/orders` for the Listing tab.
5. `GET /users/public/:username/sales` (only when `showSalesHistory`) for Sold History.
6. `username` (or a portfolio slug) on order responses, so `/details` "View Portfolio" can link to the seller.
7. Later, once product decides: offers, messaging, alerts, AI appraisal, Endless Score, collections.

### 8.3 Live vs sample per area (until §8.2 exists)

| Area | Own mode | Public mode |
|---|---|---|
| Hero name, username, avatar, bio | **Live** (`useProfileDetails`) | Sample |
| Joined | **Live** (`orders/summary.memberSince`) | Sample |
| Active N ago | Sample (`lastActiveAt` not exposed) | Sample |
| Verified seller | **Live** by the Q6 rule | Sample |
| Total domains, Active listings, Domains sold, Total volume | **Live** (`orders/summary`; TLD count from the list; "this month" sample until the API has it) | Sample |
| Avg Endless Score | Coming soon | Coming soon |
| All / Listing tabs | **Live** (`my-domains` LISTED + UNLISTED, paged client side) | Sample |
| Sold History | Sample, or **live** from `my-domains?status=SOLD` once confirmed on stage (profile plan §14.6) | Sample |
| Offer Receive, Collection | Coming soon | Coming soon |
| Activity | **Live** possible via `history/get-all` (verified wallet gate, as History) or link to `/history` (Q4) | Sample |
| AI appraisal, change %, views | Hidden or Coming soon (Q7) | Same |
| Heart | **Live** (watchlist API) | **Live** |
| Message, Make Offer, Bell | Coming soon | Coming soon |

---

## 9. Out of scope / follow ups

1. Offer flow, messaging, price alerts (no backend, no design).
2. Collections as a concept.
3. Editing the profile from this page (that's `/profile`).
4. Open Graph images for shared links.
5. Fix `domainOverviewHref` building `//name` (History plan §9.1 B1) if any portfolio link needs it; prefer `orderDetailsHref`.

---

## 10. File map (planned)

```
pages/portfolio/index.tsx                         (route, own)
pages/u/[username].tsx                            (route, public)
src/design-system/composites/portfolio/shared/PortfolioPageView   (page body; calls the data hooks, see §14)
src/helpers/marketplace/routes.ts                 (+ PORTFOLIO_HREF, portfolioHref)
src/data/marketplace/navigation.ts                (+ Portfolio item)
src/design-system/layouts/header/menuItems.ts     (Portfolio → /portfolio)
src/design-system/layouts/main-layout/index.tsx   (+ /portfolio, /u → account)
src/design-system/composites/marketplace/shared/MarketplacePageShell (optional rail, additive)
src/design-system/composites/portfolio/           (§5.2 + index.ts)
src/design-system/primitives/navigation/pagination/
src/design-system/primitives/cards/summary-tile             (sublabel, tone, additive)
src/design-system/composites/profile/shared/ProfileTabs     (count, additive)
src/design-system/composites/marketplace/watchlist/WatchlistActions (heart toggle, additive)
src/types/portfolio/index.ts
src/data/portfolio/{owner,stats,domains}.ts
src/helpers/portfolio/{mapOwner,mapDomain,filterPortfolio,formatPrice}.ts
src/hooks/portfolio/{usePortfolioFilters,usePortfolioOwner,usePortfolioStats,usePortfolioDomains,usePortfolioShare}.ts
src/core/redux/portfolio.ts                       (only when §8.2 lands)
public/assets/img/portfolio/                      (downloaded icons)
dev-docs/portfolio/portfolio-progress.html        (log, created in phase 1)
```

---

## 11. Verification (every phase)

1. Layering: Portfolio's two known items (§14) stay as they are until the layering plan fixes them; add nothing new.
2. `npx tsc --noEmit -p .` clean; `eslint` on changed files with no new warnings; no `!important`, no native `<img>` or `<a>`, no fragments in `.map()`, inline style only for runtime values (`CLAUDE.md` §4).
3. No raw colours for surfaces, text or borders (`CLAUDE.md` §7.1); brand fills commented.
4. Screenshots through the running dev server on port **3002** (never `next build`, `next start` or `next dev`) at 390, 834, 1024 and 1440, in **light and dark**, compared with §2.1.
5. Keyboard: tab order, focus rings, arrow keys in tabs and pills, pagination reachable and announced.
6. Pages that share a changed component (shell on Home, Profile, History, Watchlist, My Domains; `SummaryTile` on the domain overview and receipt; `ProfileTabs` on Profile and History; `WatchlistIconActions` on Watchlist) checked for no visual change.
7. Update `dev-docs/portfolio/portfolio-progress.html` (local only, `dev-docs` is gitignored).
8. Don't commit unless asked.

---

## 12. Open questions (answers change the build)

| # | Question | Proposal |
|---|---|---|
| Q1 | One page, two routes: own `/portfolio` (Seller Hub) and public `/u/[username]`? In own mode hide Message, Make Offer and heart? | **Decided 30 Oct**: both routes, public at `/u/[username]` (changeable later: one helper + page folder + a redirect, free until public mode is live). Own mode hiding: **no, decided 30 Oct**: own portfolio shows every button exactly as Figma (View Details / Make Offer, heart, bell, Message) |
| Q2 | Public mode before the backend exists: sample data for any username, or a "not public yet" state? | **Decided 30 Oct**: sample data with the Sample data chip until §8.2 item 1 exists |
| Q3 | Public link by username only, or also by wallet address? | Username only; wallet when the backend supports it |
| Q4 | Designs for Listing, Sold History, Offer Receive, Collection, Activity, and for empty/loading states? | Listing = All filtered; Sold History = same row with sold price + date; Offer Receive and Collection = Coming soon; Activity = read only History rows. Ask the designer |
| Q5 | Hero title: name, username or wallet? | **Decided 2 Nov 2026**: exactly like Figma 193:21955. Title = short wallet (fallback @username, then name, if no wallet); meta line = primary name · joined · last active, no username |
| Q6 | What makes a "Verified seller"? | Email verified + wallet linked, until backend defines it |
| Q7 | Price for not for sale names, meaning of the green −14%, the `.sol` tag, ETH vs USDT volume, AI appraisal source? | §2.10 items 3 to 6; USDT like the rest of v2; appraisal hidden until a model exists |
| Q8 | Page size and mobile pagination? | 12 per page for both views; compact pager on mobile |
| Q9 | Options for All Type and the sort pill? **Built 30 Oct as four pills** (TLDs, Type, Status, one "Sort by:" pill: Price low/high, Newest, Most viewed; Type: Premium/Standard) until answered. | Drop "Sort by: For sale"; sorts: Price low/high, Newest, Most viewed; Type = Premium, Standard? Ask the designer |
| Q10 | Sidebar position of Portfolio, and header "Portfolio ↗" target? | **Decided 30 Oct**: after My domains in Seller Hub; header "Portfolio" → `/portfolio` |
| Q11 | Message, Make Offer, Bell with no backend: hide or Coming soon? | Disabled with Coming soon tooltip |
| Q12 | Branch? | **Decided 30 Oct**: a new `portfolio` branch off `dark-mode` |

---

## 13. Build order and per phase prompts

Each phase is reviewable on its own and leaves the page working. Paste a prompt as is to start it.

| Phase | Scope |
|---|---|
| 0 | Backend and designer message (no code) |
| 1 | Routes, navigation, shell no rail mode, page skeleton, types, sample data, hook scaffold |
| 2 | Hero banner and stat tiles |
| 3 | Tabs, toolbar, status legend, pagination primitive |
| 4 | Desktop list rows and grid cards, shared actions |
| 5 | Mobile and tablet |
| 6 | Behaviour: filters, sort, search, pages, tabs, share, heart, coming soon actions |
| 7 | Live data for own mode (§8.3), then public mode when §8.2 lands |
| 8 | Links from Profile, Public Preview and `/details` SellerCard |
| 9 | Final QA, states, accessibility, polish |

### Phase 0: Backend and designer message (no code)

```
Read dev-docs/portfolio/portfolio-implementation-plan.md §2.10, §8 and §12.
Write a short plain message for the backend team (the endpoints in §8.2
with request and response shapes matching the TypeScript in §6.1, and Q3,
Q6, Q7 where they decide it) and one for the designer (the quirks in §2.10
and Q4, Q5, Q7, Q8, Q9, Q11). Frame it as "what to build, in which order",
not a blocker, since we start on sample data. No code changes.
```

### Phase 1: Foundations

```
Start portfolio phase 1 from dev-docs/portfolio/portfolio-implementation-plan.md
(§1, §2.1, §3, §4, §5.3, §6, §10). Follow CLAUDE.md including §4, §5 and §7.

Build:
1. Make rightRail optional in MarketplacePageShell (§5.3), additive; check
   Home, Profile, History, Watchlist, My Domains look unchanged.
2. pages/portfolio/index.tsx + portfolio.module.scss (own mode) and
   pages/u/[username].tsx (public mode) rendering one shared page
   component with MainLayout and the shell without a rail: hero, stats
   and list panel as placeholders.
3. PORTFOLIO_HREF and portfolioHref(username) in routes.ts; tab, page,
   filters and view in the query string, router.replace shallow, validated.
4. The Portfolio item in Seller Hub (navigation.ts), the header menu link,
   and the bottom nav mapping (§4.4 to §4.6).
5. Types (§6.1), sample data (§6.3), filterPortfolio.ts, and hook stubs
   (§6.2) returning sample data through useMockQuery with the Sample data chip.
6. Create dev-docs/portfolio/portfolio-progress.html.

Verify per §11. Don't commit.
```

### Phase 2: Hero and stat tiles

```
Start portfolio phase 2 from the plan (§2.2, §2.3, §2.8 items 1 and 2,
§2.9, §2.10 items 1, 2, 11, §5.2, §5.4).

Build PortfolioHeroBanner (reuse the My Domains / Watchlist hero background,
ProfileAvatar, Verified seller pill, meta line from memberSince and
lastActiveAt with relative time, bio, Message and Share buttons; centred
stack on mobile) and PortfolioStatTiles (five SummaryTiles after adding
sublabel and tone to SummaryTile additively, §3.2; 5 across desktop, 3 + 2
tablet, 1 per row mobile; Endless Score shows ComingSoonBadge when null).
Check the domain overview and receipt tiles look unchanged.
Download the icons from Figma into public/assets/img/portfolio/.

Use get_design_context on 193:21955, 193:21989, 193:20033 and 193:20065,
plus the dark frames 193:18873 and 193:20973. Verify per §11. Don't commit.
```

### Phase 3: Tabs, toolbar, legend, pagination

```
Start portfolio phase 3 from the plan (§2.4, §2.5, §2.9 item 1, §2.10 items
7 to 9, §5.1 items 1 and 3, §5.2).

Build:
1. Tabs with ProfileTabs (§3.3): add optional count on PillTab with the
   grey count chip (Activity has none), mobileDarkActive="selected" for the
   white chip on mobile dark. Check Profile and History tabs look unchanged.
2. PortfolioToolbar copying WatchlistFilterBar's layout: count line,
   SearchInput, five FilterDropdown pills (labels per Q9 answer; until then
   as drawn), ViewToggle hidden on mobile.
3. Status legend: inline "Status" + StatusChip neutral "Not for sale" +
   StatusChip for-sale "For sale", copied from WatchlistTable.
4. primitives/navigation/pagination with getPageItems() (Node checked for
   1, 2, 7, 10 and 50 pages) and the compact mobile form.

Use get_design_context on 193:22030, 193:22126, 193:22762. Verify per §11.
Don't commit.
```

### Phase 4: Rows, cards and actions

```
Start portfolio phase 4 from the plan (§2.6, §2.7, §2.9 items 2 to 5,
§2.10 items 3 to 6, §5.1 item 2, §5.2).

Build PortfolioDomainRow, PortfolioDomainCard, PortfolioDomainActions and
PortfolioDomainList (header row + rows, or 4 column card grid; legend;
loading, empty and error states; pagination at the bottom), copying the
structure and SCSS of WatchlistCard, WatchlistRow and WatchlistTable (§3.4).
Use WatchlistDomainIdentity (metaText for "pol · 7 chars · 2,329 views",
showCrown), StatusChip, PrimaryButton size="sm" for View Details,
PrimaryButton variant="charcoal" for Make Offer, WatchlistPriceCell's USDT
formatting, and the heart toggle added to WatchlistIconActions additively.
The change chip is TrendDelta as is (decided 30 Oct, §3.4), rendered only
when changePct is not null. One price formatter
for both views (§2.10 item 4).

Use get_design_context on 193:22207 and 193:16942 (and the dark frames).
Verify per §11, including the Watchlist page after the WatchlistIconActions
change. Don't commit.
```

### Phase 5: Mobile and tablet

```
Start portfolio phase 5 from the plan (§2.8, CLAUDE.md §5 tablet notes).

1. Mobile: useIsMobile forces grid (like MyDomainsTable); one card per
   row; pills wrap to two rows; no view toggle, no legend; tabs scroll;
   compact pagination.
2. Tablet 768 to 1039: stats 3 + 2, cards 2 per row, list view switches to
   cards where the four columns no longer fit (find the width, like
   History did).
3. Make sure the fixed bottom nav never covers the last card or the pager.

Use get_design_context on 193:19995 and 193:20973. Verify at 390, 768, 834,
1024, 1280 and 1440 in both themes. Don't commit.
```

### Phase 6: Behaviour

```
Start portfolio phase 6 from the plan (§6.2, §7).

1. usePortfolioFilters wired to search, TLD, Type, Status, Sort, view and
   page, all in the URL; page resets on any other change; scroll to the
   list top on page change.
2. Tabs: All and Listing filter the list; Sold History per the Q4 answer;
   Offer Receive and Collection show a Coming soon empty state.
3. Share (usePortfolioShare), heart (watchlist add/remove with login
   redirect when signed out, optimistic, toast on failure), and Coming
   soon tooltips for Message, Make Offer and Bell (Q11).
4. Own mode differences (§7.8).

Still sample data. Verify per §11. Don't commit.
```

### Phase 7: Real data

```
Start portfolio phase 7 from the plan (§8). Fetch and pull the backend clone
first (never edit it) and recheck §8.1.

Own mode: hero from useProfileDetails + useAccountSummary; stats from
orders/summary (USDT, 6 decimals) and the TLD count from the list; All and
Listing from useMyDomainsData (LISTED + UNLISTED), mapped by
helpers/portfolio/mapDomain.ts and paged client side. Sold History from
my-domains?status=SOLD only if confirmed on stage. Remove the Sample data
chip from every live section.

Public mode: only if §8.2 items 1 to 4 exist on stage; otherwise leave it on
sample (or the "not public yet" state, Q2) and record what's missing in the
progress log. Verify per §11. Don't commit.
```

### Phase 8: Links into the page

```
Start portfolio phase 8 from the plan (§4.7).

1. AccountSummaryCard "View portfolio" → PORTFOLIO_HREF.
2. Profile tab: the portfolio URL becomes a link to portfolioHref(username)
   once public mode is real; until then keep it as copy only.
3. SellerCard "View Portfolio" on /details → portfolioHref when the order
   carries a username (§8.2 item 6); stays inert otherwise.

Verify per §11. Don't commit.
```

### Phase 9: Final QA

```
Run the portfolio final QA from the plan (§7, §11, §2.10).

Every state (loading, empty per tab, filtered empty, error, not found or
private, own vs public), keyboard and screen reader pass over tabs, pills,
toggle, rows, cards and pagination, both themes at 390, 834, 1024 and 1440,
every changed shared component on its other pages, tsc and eslint clean,
and the progress log updated with what is still sample and why.
Don't commit.
```

---

## 14. Structure note (30 Oct 2026)

Portfolio keeps the structure it was built with:

1. `src/design-system/composites/portfolio/shared/PortfolioPageView` is the page body. It calls the data hooks (`usePortfolioFilters`, `usePortfolioOwner`, `usePortfolioStats`, `usePortfolioDomains`, `usePortfolioWatch`, `usePortfolioShare`) and renders the drawing composites. Both routes (`pages/portfolio`, `pages/u/[username]`) render it.
2. `src/helpers/portfolio/mapOwnPortfolio.ts` imports `deriveChain` from `src/hooks/my-domains/useMyDomainsData.ts` (exported there in phase 7).

A layering cleanup on 30 Oct moved these (wiring to `src/component/portfolio-page`, `deriveChain` to `helpers/marketplace/chain.ts`). The user had it **reverted the same day**: `src/component` is no longer used in this project, so it can't hold page code. Both items are tracked as Portfolio findings PF1 and PF2 in `dev-docs/layering/layering-cleanup-plan.md` §3.0 and get fixed with the rest of the codebase once that plan decides where shared page wiring lives (its Q6).

**Decided later the same day (layering plan §2.1):** data is called at the feature level through hooks: the page file or one connected wrapper per page. `PortfolioPageView` already is Portfolio's connected wrapper (it only calls hooks, never raw services); what's left is moving it out of `design-system/composites` once Q6 says where connected wrappers live.

