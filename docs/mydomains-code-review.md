# My Domains Page — Code Review Document

> **Branch:** `new-design-ed`
> **Route:** `/profile/mydomains`
> **Purpose:** Displays all domains owned by the logged-in user with filtering, searching, grid/list toggling, and pagination.

---

## File Map

```
pages/
  profile/
    mydomains/
      index.tsx                  ← Page entry point. All state lives here.
      mydomains.module.scss      ← Page-level layout styles

src/design-system/composites/mydomains/
  types.ts                       ← All shared TypeScript types for this feature
  StatsBar.tsx                   ← 4-tile summary bar (total, expiring, listed, unconfigured)
  StatsBar.module.scss
  SyncBanner.tsx                 ← Dismissable banner shown after a sync is triggered
  SyncBanner.module.scss
  DomainSearchBar.tsx            ← Search input + grid/list toggle + Sync Now button
  DomainSearchBar.module.scss
  FilterSidebar.tsx              ← TLD filter panel (shown/hidden by toggle)
  FilterToggleSwitch.tsx         ← GSAP-animated toggle switch that opens the sidebar
  SearchSection.module.scss      ← Shared styles for FilterSidebar and FilterToggleSwitch
  DomainCollection.tsx           ← Router: renders grid or list based on viewMode
  DomainCollection.module.scss
  DomainCardGrid.tsx             ← Single card in grid view
  DomainCardGrid.module.scss
  DomainCardList.tsx             ← Single row in list view
  DomainCardList.module.scss
  DomainPagination.tsx           ← Prev/Next + numbered page buttons
  DomainPagination.module.scss
```

---

## Architecture — How Data Flows

```
index.tsx  (owns all state)
│
│  derives → filteredDomains (useMemo — search + TLD filter applied)
│  derives → pagedDomains    (useMemo — slice of filteredDomains for current page)
│
├── <StatsBar stats={stats} />
│
├── <SyncBanner />               (conditional — only when syncBannerVisible === true)
│
├── <FilterToggleSwitch />       (GSAP animation, controls filtersOpen state)
│
├── <DomainSearchBar
│     value={filters.search}
│     viewMode={viewMode}
│     onViewChange → sets viewMode
│     onChange    → updates filters.search, resets page to 1
│     onSearch    → resets page to 1
│     onSync      → sets syncBannerVisible = true />
│
├── <FilterSidebar               (conditional — only when filtersOpen === true)
│     endings={filters.tlds}
│     onAddEnding    → pushes TLD into filters.tlds
│     onRemoveEnding → removes TLD from filters.tlds />
│
├── <DomainCollection
│     domains={pagedDomains}     ← only the current page's items
│     viewMode={viewMode}
│     onManage={handleManage} />
│     │
│     ├── if viewMode === 'grid' → renders <DomainCardGrid /> per domain
│     └── if viewMode === 'list' → renders header row + <DomainCardList /> per domain
│
└── <DomainPagination
      current={currentPage}
      total={totalPages}
      onPageChange → updates currentPage, scrolls to top />
```

**Rule:** No child component holds domain data in local state. Every piece of data flows down as props from `index.tsx`. Every user interaction calls back up to a handler in `index.tsx` that updates state there.

---

## File-by-File Breakdown

---

### `pages/profile/mydomains/index.tsx`

The single source of truth for the entire page.

#### State

| State variable | Type | Purpose |
|---|---|---|
| `domains` | `DomainItem[]` | Full unfiltered list of domains (placeholder data now, API data later) |
| `stats` | `DomainStats` | 4 summary numbers shown in StatsBar |
| `filters` | `DomainFilter` | Active search text and selected TLD providers |
| `viewMode` | `'grid' \| 'list'` | Which layout DomainCollection renders |
| `currentPage` | `number` | Active pagination page (1-indexed) |
| `loading` | `boolean` | Shows a loading state while data is being fetched |
| `syncBannerVisible` | `boolean` | Controls whether SyncBanner is mounted |
| `filtersOpen` | `boolean` | Controls whether FilterSidebar is mounted |
| `tldFilterText` | `string` | Text typed inside the TLD search input within FilterSidebar |
| `lastSynced` | `string` | Human-readable timestamp shown in SyncBanner |

#### Derived values (useMemo)

```ts
// Applies TLD filter then search text filter on the full domain list
const filteredDomains = useMemo(() => {
  let result = domains
  if (filters.tlds.length > 0) {
    result = result.filter(d => filters.tlds.includes(d.status))
  }
  if (filters.search.trim()) {
    const query = filters.search.trim().toLowerCase()
    result = result.filter(d => `${d.name}${d.tld}`.toLowerCase().includes(query))
  }
  return result
}, [domains, filters])

// Slices filteredDomains for the active page
const pagedDomains = useMemo(
  () => filteredDomains.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
  [filteredDomains, currentPage],
)
```

#### Placeholder data (to be replaced with API calls)

```ts
// 3 demo domains cycling through CHAINS and STATUSES arrays
const PLACEHOLDER_DOMAINS: DomainItem[] = Array.from({ length: 3 }, (_, i) => ({
  id: `domain-${i + 1}`,
  name: 'theforceisunstoppcdzcasxassable',
  tld: '.ud',
  chain: CHAINS[i % CHAINS.length],
  status: STATUSES[i % STATUSES.length],
  expiryDate: i % 3 === 0 ? 'lifetime' : '12/12/2039',
  isListed: i % 4 === 0,
  isConfigured: i % 2 === 0,
}))
```

#### Responsive behaviour

A `useEffect` listens to `window.resize` and forces `viewMode` to `'grid'` on screens 768px and below, preventing users from getting stuck in list view on mobile.

#### Key handlers

| Handler | What it does |
|---|---|
| `handleSearchChange` | Updates `filters.search`, resets page to 1 |
| `handleAddTld` | Adds a TLD string to `filters.tlds` (deduplicates) |
| `handleRemoveTld` | Removes a TLD string from `filters.tlds` |
| `handleReset` | Clears both search and TLD filters, resets page |
| `handleViewChange` | Sets `viewMode` to grid or list |
| `handleSync` | Sets `syncBannerVisible = true`, placeholder for API re-fetch |
| `handleManage` | Placeholder — will route to domain detail page once the route exists |
| `handlePageChange` | Updates `currentPage`, scrolls window to top |

---

### `types.ts`

All TypeScript types for the feature. Any new type needed by a mydomains component must be added here.

```ts
type DomainChain   = 'polygon' | 'ethereum' | 'solana' | 'tezos' | 'aptos'
type DomainStatus  = 'unstoppable' | 'ens' | 'arbitrum' | 'bonfida' | 'tezos' | 'aptos'
type ViewMode      = 'grid' | 'list'

interface DomainItem {
  id: string
  name: string
  tld: string
  chain: DomainChain
  status: DomainStatus   // doubles as the "provider" key
  expiryDate: string     // 'lifetime' or a date string like '12/12/2039'
  isListed: boolean
  isConfigured: boolean
}

interface DomainStats {
  total: number
  expiringSoon: number
  listedOnMarketplace: number
  notConfigured: number
}

interface DomainFilter {
  search: string
  tlds: DomainStatus[]
}
```

---

### `StatsBar.tsx`

Purely presentational. Renders 4 stat tiles from a static `TILES` array mapped over the `stats` prop. No logic. No local state.

```ts
const TILES: { key: keyof DomainStats; label: string }[] = [
  { key: 'total',               label: 'Total Domains' },
  { key: 'expiringSoon',        label: 'Expiring Soon' },
  { key: 'listedOnMarketplace', label: 'Listed On Marketplace' },
  { key: 'notConfigured',       label: 'Not Configured' },
]
```

Each tile renders `stats[tile.key]` — so updating the `stats` object in the page automatically updates all four tiles.

---

### `SyncBanner.tsx`

Mounted only when the page sets `syncBannerVisible = true` (triggered by clicking Sync Now in `DomainSearchBar`).

Has one piece of internal state: `dismissed`. When the close button is clicked, `dismissed` becomes `true` and the component returns `null`. This is intentionally local because the banner dismissal does not affect any other part of the page.

The sync icon button inside the banner also calls `onSync`, allowing the user to re-trigger a sync directly from the banner.

---

### `DomainSearchBar.tsx`

Three responsibilities in one component:

**1. Search input**
Controlled by the page via `value` and `onChange`. Calls `onSearch` on Enter key press and on the search button click. Has a clear (×) button that appears only when `value` is non-empty, clears the input and refocuses it.

**2. Grid / List toggle**
Two icon buttons in a button group. Each calls `onViewChange('grid')` or `onViewChange('list')`. The active one gets the `.toggleActive` class. The page state `viewMode` is passed in so the correct button shows as active on initial render.

**3. Sync Now button**
Has local `isSyncing` state independent of the page. Clicking it calls `onSync` (which sets `syncBannerVisible = true` in the page) and starts a 45-second cooldown during which the button shows "Sync again in 45s" and a spinning icon. After the animation completes the icon is replaced with a gif. After 45 seconds `isSyncing` resets automatically via a `setTimeout` in `useEffect`.

---

### `FilterSidebar.tsx`

Mounted only when `filtersOpen === true` in the page.

Receives `tldPills` — a 2D array of provider strings grouped for layout — which it flattens into a single list for filtering and rendering. The internal `filterText` state (owned by the page and passed down as `tldFilterText`) narrows which TLD pills are visible by matching against both the key string and its human-readable label.

**Active selection flow:**
- User clicks a TLD pill → `onAddEnding(tld)` fires → page pushes it into `filters.tlds`
- Pill gets `.tldPillActive` class because `endings.includes(tld)` is now true
- Active selections also appear as removable tags at the top of the sidebar
- Clicking the tag's × calls `onRemoveEnding(tld)` → page removes it from `filters.tlds`

Clicking an already-active pill also calls `onRemoveEnding`, making each pill a toggle.

---

### `FilterToggleSwitch.tsx`

Loaded with `next/dynamic` and `ssr: false` because it uses GSAP which requires a browser environment. It is a purely visual animated switch that reflects the `isOpen` prop from the page. It does not own state — the page owns `filtersOpen` and passes the toggle handler.

---

### `DomainCollection.tsx`

The layout router. Receives `pagedDomains`, `viewMode`, and `onManage`. It has three render paths:

**Empty state** — if `domains.length === 0`, renders a "No domains found" message.

**Grid** — wraps each domain in a `DomainCardGrid` inside a CSS grid container.

**List** — renders a static header row with column labels (Domain Name, Chain, Provider, Expiry, Action), then maps each domain to a `DomainCardList` row.

This component is the only place where the decision between grid and list is made. Neither `DomainCardGrid` nor `DomainCardList` knows about `viewMode`.

---

### `DomainCardGrid.tsx`

Renders a single domain as a card in grid view.

#### Structure

```
div.cardOuter       ← holds filter: drop-shadow hover effect
  div.cardWrap      ← holds clip-path polygon (diagonal top corners)
    article.card
      div.cardTop   ← domain name + TLD badge
      div.cardDivider
      div.cardMeta  ← chain icon + label | provider icon + label (two columns)
      div.cardDivider
      div.cardBottom ← expiry dot + date | Manage button
```

#### Hover border technique

Regular `box-shadow` is clipped by `clip-path` on the same element because CSS applies `clip-path` after `filter` in the rendering pipeline. The solution splits them across two elements:

- `cardOuter` (no clip-path) holds `filter: drop-shadow(...)` on hover. The browser renders the clipped child first, then traces the resulting polygon shape with the drop-shadow.
- `cardWrap` holds the `clip-path: polygon(20px 0, calc(100% - 20px) 0, 100% 20px, ...)` that cuts the diagonal top-left and top-right corners.

Four directional `drop-shadow` calls (left, right, top, bottom at 2px each with 0 blur) combine to produce a clean 2px blue outline following the full polygon boundary including the diagonal edges.

#### Manage button animation

The button stacks two copies of the word "Manage" vertically inside a clipped `1em`-tall container:

```
div.labelWrapper  (height: 1em, overflow: hidden)
  span.labelUp   "Manage"   ← visible at rest
  span.labelUp   "Manage"   ← slides up into view on hover
```

On `.cardOuter:hover`, both spans translate upward by `-100%`, making the bottom copy scroll into view while the top copy scrolls out. This creates the sliding text animation with no JavaScript.

#### DomainIcon helper

A small internal component that renders an `<img>` for chain and provider logos. It has a local `broken` state — if the image fails to load (`onError`), it renders a grey fallback circle instead. This prevents broken image icons appearing on the card.

#### Expiry status logic

```ts
function getExpiryStatus(expiryDate: string): 'lifetime' | 'expiring' | 'active' {
  if (expiryDate === 'lifetime') return 'lifetime'
  const daysLeft = (new Date(expiryDate).getTime() - Date.now()) / 86_400_000
  return daysLeft <= 60 ? 'expiring' : 'active'
}
```

The returned string is used to apply one of three dot colour modifier classes: `.dot_active` (green), `.dot_expiring` (red), `.dot_lifetime` (blue).

---

### `DomainCardList.tsx`

Identical data and logic to `DomainCardGrid` — same `DomainIcon` helper, same `getExpiryStatus` function, same lookup objects for chain/provider labels and logos, same Manage button slide animation.

The only difference is the layout. Instead of a stacked card it renders a horizontal `article.row` with five cells aligned to the column headers rendered by `DomainCollection`:

| Cell | Content |
|---|---|
| `cellName` | Domain name (truncated with `text-overflow`) + TLD badge |
| `cell` | Chain logo + chain label |
| `cell` | Provider logo + provider label |
| `cellExpiry` | Coloured status dot + expiry date string |
| `cellAction` | Manage button with slide animation |

---

### `DomainPagination.tsx`

Only renders when `total > 1`. With 3 demo domains and `ITEMS_PER_PAGE = 12`, total pages is 1, so this component returns `null` and is invisible during development. It activates automatically once real data exceeds 12 items.

The `buildPages` function computes which page numbers to show. It always includes page 1 and the last page, then shows a window of pages around the current one, inserting `'...'` ellipsis where there are gaps:

```
Example with current=5, total=10:
[1, '...', 4, 5, 6, '...', 10]
```

`React.createElement(React.Fragment, { key }, ...)` is used instead of `<React.Fragment key={...}>` because TypeScript 5.2 does not allow the `key` prop on Fragment JSX shorthand syntax.

---

## What Needs to Be Connected to the API

When the API integration phase starts, these are the only things to change in `index.tsx`. The component tree below the page does not need to change at all.

| Placeholder | Replace with |
|---|---|
| `const [domains] = useState(PLACEHOLDER_DOMAINS)` | `useQuery` or `useEffect` + service call to fetch user's domains |
| `const [stats] = useState(PLACEHOLDER_STATS)` | Derive from the fetched domain list or a separate stats endpoint |
| `const [loading] = useState(false)` | Set to `true` while the fetch is in flight |
| `handleManage` console.info stub | `router.push()` to the domain detail route once it exists |
| `handleSync` console.info stub | Trigger a re-fetch of the domain list from the API |

---

## Design System Compliance Notes

- All styles use tokens from `src/design-system/styles/_tokens.scss`. No hardcoded hex values, pixel spacing, or font names anywhere in the SCSS files.
- No Bootstrap component classes used. Only utility classes (`d-flex`, `gap-*`) and the grid are allowed.
- No Reactstrap components.
- No inline `style={{}}` props (GSAP in `FilterToggleSwitch` is the only exception — animation libraries write inline styles as part of their engine).
- All interactive elements have `aria-label`, `aria-pressed`, or `aria-expanded` attributes as appropriate.
- All icon-only buttons have descriptive `aria-label` text.
- Decorative icons and dividers have `aria-hidden="true"`.
- The `FilterToggleSwitch` is loaded with `next/dynamic` + `ssr: false` to avoid GSAP running during server-side rendering.
