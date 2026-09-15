# Analytics Page — Dev Reference

## Route

The live page is at `/profile/analytics` (matches the `DashboardTabBar` routing in `src/components/userprofile/DashboardTabBar.tsx`).  
The OLD broken page at `pages/profile/user-analytics/index.tsx` is left untouched — its template imports no longer exist and it is effectively dead code.

---

## File Map

| File | Purpose |
|---|---|
| `pages/profile/analytics/index.tsx` | The page entry point |
| `pages/profile/analytics/analytics.module.scss` | Page-level shell styles |
| `src/components/user-analytic/analyticsData.ts` | All TypeScript types + mock data |
| `src/components/user-analytic/Analytics.module.scss` | All component-level styles |
| `src/components/user-analytic/AnalyticsStatCards.tsx` | 6-stat overview row |
| `src/components/user-analytic/AnalyticsDomainCharts.tsx` | Dual donut pie charts |
| `src/components/user-analytic/AnalyticsPortfolioBar.tsx` | Portfolio value bar chart |
| `src/components/user-analytic/AnalyticsOrdersTable.tsx` | Order history table |

---

## Page Shell Pattern

Matches `pages/profile/mydomains/index.tsx` exactly:

```
TopNavBar  (src/components/userprofile/TopNavBar.tsx)
DashboardTabBar  (src/components/userprofile/DashboardTabBar.tsx)
<main className={styles.mainArea}>
  <div className={styles.page}>
    ... analytics content ...
  </div>
</main>
SiteFooter  (src/components/userprofile/SiteFooter.tsx)
```

---

## Styling Rules In Force

- All SCSS values use `var(--*)` tokens from `src/design-system/styles/tokens.scss`
- Responsive mixins via `@import '@newstyles/_mixins.scss'` (`@newstyles/` resolves to `src/design-system/styles/` via `next.config.mjs` SASS importer)
- Zero `style={{ }}` props on any DOM element
- Recharts SVG config props (`tick`, `fill`, `stroke`) use literal color strings mapped to token values — this is unavoidable with SVG attributes

---

## Data Shapes (from API)

### Domain Analytics API (`/user-domain-analytics` or similar)
Key fields on `result`:
- `totalDomains: number`
- `domainsByTLD: { tld, count, domains[] }[]`
- `renewalStatus: { type: 'Renewal' | 'Non-Renewal', count, domains[] }[]`
- `portfolioValueByChain: { blockchain, totalValue }[]`
- `allDomains: DomainSummary[]`
- `uniqueTLDs: string[]`
- `uniqueProviders: string[]`
- `evmDomains: { total, domains[] }`
- `nonEvmDomains: { total, domains[] }`
- `listedDomains: { total, domains[] }`

### Order History API (`/user-domain-orders` or similar)
Returns an array of:
- `id, orderNumber, orderStatus ('Completed' | 'Cancelled' | 'Pending')`
- `domainName, domainProvider, mintStatus ('Completed' | 'Failed' | 'Pending')`
- `price, promoValue, promoApplied, lastChangedDateTime`

All types are exported from `analyticsData.ts`.

---

## Mock Data Summary

- **13 domains** across `.og` (4), `.brave` (2), `.u` (3), `.eth` (2), `.bnb` (2)
- **4 providers**: UD (6), UDBASE (3), ENS (2), BinanceSmartChain (2)
- **Portfolio value**: UD $62, UDBASE $15, ENS $45, BinanceSmartChain $10 — total $132
- **Listed**: 3 domains
- **EVM**: 13, Non-EVM: 0
- **10 orders** — mix of Completed, Cancelled, Pending

---

## Chart Library

`recharts` — was missing from `package.json`, installed during this session.  
Import pattern used: named imports from `'recharts'` (PieChart, BarChart, Cell, etc.)

---

## What Still Needs Wiring (TODO)

- [ ] Replace `mockDomainAnalytics` with real API call (`fetchUserDomainAnalytics`)
- [ ] Replace `mockOrderHistory` with real API call (`fetchUserDomainPieChart`)
- [ ] Add loading skeleton states for each section
- [ ] Add error/empty states beyond the basic "No data available" placeholder
- [ ] Filters: TLD, Provider, Expiry, EVM/Non-EVM, Date range (from old `UserDomainAnalyticsChart.tsx` — can be re-introduced as filter state in the page)
- [ ] Click-through on pie slices / bar chart bars to drill into domain lists

---

## Color Reference (token → hex used in Recharts SVG)

| Token | Hex used in chart config |
|---|---|
| `--color-gray-dark` | `#6B7280` (tick text) |
| `--color-gray-200` | `#EBEBEB` (grid lines) |
| `--color-blue-primary` | `#2639ED` (UD, fallback bar) |
| `--color-purple-primary` | `#9457f6` (UDBASE) |
| `--color-status-available` | `#16A163` (ENS, Completed badge bg) |
| `--color-amber` | `#fdc651` (BinanceSmartChain) |
| `--color-toast-warning` | `#ef8d32` (Pending badge) |
| `--color-error` | approx `#e25265` (Failed/Cancelled badge) |

---

## Key Design Decisions

1. **Stat cards use top-border accents** via modifier CSS classes (`statCard_blue`, `statCard_green`, etc.) — no inline styles.
2. **Pie charts are donuts** (`innerRadius={42}`) with white % labels inside slices, hiding slices under 8%.
3. **Orders table uses `min-width: 680px`** on the table element with horizontal scroll on the wrapper — never collapses columns on mobile.
4. **`domainCountFormatter` and portfolio tooltip formatter use `any`** — required because Recharts' `Formatter` generic type is complex and the project has `no-explicit-any: off`.
