# History page: status report

Oct 21, 2026 · @Akshat

The History page (`/history`) is built and runs entirely on the real history API: the activity table, its tabs, search, sort, paging and export, plus the Summary and Filters cards in the right rail. No demo data is left. Bids, Offers and Transfers have no backend yet, and the work is uncommitted on the dark-mode branch.

## What works now

Everything below runs on `GET /marketplacev2/history/get-all`, except the static Need help card.

| Part of the page | State | How it works |
| --- | --- | --- |
| Tabs: All Activities | Real | One API call; the backend merges purchases, sales, listings and cancellations |
| Tabs: Transactions | Real | Two calls (BUY, SOLD) merged by date on the page |
| Tabs: Listings | Real | Two calls (LISTING, DELIST) merged by date on the page |
| Tabs: Bids, Offers, Transfers | Empty state | No backend yet; no request is made |
| Table rows and mobile cards | Real | Domain, action, short order hash (copy gives the full hash), USDT price and $ line, date |
| Row chevron | Real | Purchase or sale opens the receipt; listing or cancellation opens the order details page |
| Search | Real | Sent to the API (matches the domain name) on Enter or the search button |
| Sort | Real | Newest First or Oldest First, sent to the API |
| "Show N more" | Real | Loads 100 rows per call, shows 8 at a time, fetches more when needed |
| Export | Real | CSV of the loaded rows that match, with full order hashes |
| Verify wallet | Built | No fresh wallet signature: a "Verify your wallet" message; the button opens Connect Wallet if needed, then signs |
| Summary card | Real | Spent, earned, purchases and domains sold for the chosen period, worked out from all purchases and sales |
| Summary tiles: Auctions won, Offers accepted, Transfers, Withdrawals | Coming Soon | Those features don't exist yet |
| Filters card and mobile sheet | Real | Date range (applied to loaded rows) and Activity type (switches the tab) |
| Need help card | Static | Links to the support site |
| Sidebar, route, bottom nav | Done | History in Seller Hub; `/history` is login protected; Account tab highlighted on mobile |
| Light and dark, all widths | Done | Table from 1366px, two card columns from 768px, one on mobile |

## What changed from the design, and why

Most changes follow the data the API actually has; the rest fix Figma placeholders or fill states Figma doesn't draw.

**Because of the API**

| Figma | Built | Why |
| --- | --- | --- |
| Account tab | Removed | No backend records account events (your decision, 21 Oct) |
| Bids, Offers, Transfers tabs with rows | Tabs kept, empty state | No backend for these yet |
| Filters: Status, Asset type | Removed | Every real row is completed and is a domain, so they filtered nothing |
| Reference "#ED-2026-1013-00148" | Short order hash, e.g. 0x220a…45b1 | That ID format doesn't exist in the backend; decided 26 Oct to keep the hash |
| Pending rows and orange strip | Never appear with real data (legend kept) | Sales are recorded only after on chain confirmation |
| Summary: 9 pending (a link) | "0 pending", plain text | Nothing is ever pending |
| Summary tiles: Auctions won, Offers accepted, Transfers, Withdrawals | Coming Soon badge | Those features don't exist yet |
| Sort: Newest First only | Newest or Oldest First | The API sorts by time only |
| No wallet step | "Verify your wallet" state | The API needs a wallet signature from the last hour |

**Fixing Figma placeholders**

| Figma | Built | Why |
| --- | --- | --- |
| Every row says "Domain purchased" | Label from the activity type (Domain listed, Listing cancelled…) | The placeholder was copied down every row |
| Light Summary hides Withdrawals | All six tiles shown | The dark frame shows six |
| Pills "Accounts", "Bids" | Singular, "Bid" | One activity per row |
| Purple badge after the crown | Left out | No stated meaning (same call as Watchlist) |
| Help Center link | The support site the footer uses | No Help Center URL given |

**Layout and states Figma doesn't cover**

- **Table becomes cards below 1366px.** The table needs about 712px; beside the sidebar and rail it doesn't fit at 1280.
- **Tablet**: the rail moves under the list, Summary and Need help sit side by side, and Filters move into a Filter button and drawer.
- **Mobile filter sheet** uses the app's existing slide in drawer; Figma's frame has no close button or backdrop.
- **Loading, empty, error and verify states** follow the My Domains and Watchlist patterns.
- **Dark mode**: the black Listing pill is a lifted grey, or it vanishes on the black rows.
- **Small fixes from real data**: Amount column widened for "10,000.00"; prices under $1 keep cents.

## How it was checked

The code and the screens are checked; a full run with a real login and wallet is the one thing left.

| Check | Result |
| --- | --- |
| Type check (`tsc`) and lint (`eslint`) on every changed file | Clean |
| Logic tests in Node, using rows from the real staging response | 49 passed (mapping, links, merging, filters, Summary sums per period) |
| CSV export tests | 14 passed (quoting, formula guard, file name) |
| Screens with the real staging rows served locally | 1280, 1440, 390 wide, light and dark: table, cards, Summary, filter sheet, verify state |
| Verify wallet with no wallet connected | Opens the Connect Wallet window |
| API called by hand on staging (by you, 19 Oct) | 200, 39 rows, matches what the page expects |
| Profile page after the shared tab change | Unchanged |

**Not checked yet**

- The page calling staging with a real login, end to end.
- Verify wallet with a real wallet (connect, sign, list loads).
- Keyboard and screen reader pass.
- The exported CSV opened in Excel or Google Sheets.
- The Watchlist page after the shared name block change (type checked only).

## Open questions

The first one matters most: it decides whether users must sign with their wallet every time they open History.

| # | Question | Who | Until answered |
| --- | --- | --- | --- |
| 1 | Should read only history need a wallet signature from the last hour, or work with just the login (finding wallets linked to the account)? | Backend, senior | Users verify their wallet first |
| 2 | A price change shows as two rows (cancelled, then listed again seconds later). Merge into one "price updated" event, or add a flag? | Backend | Shown as two rows |
| 3 | Can we exclude cancellations (30 of 39 test rows), e.g. `type` accepting several values? | Backend | Shown with everything else |
| 4 | Can there be a summary endpoint with totals per period? | Backend | Page loads all purchases and sales and adds them up |
| 5 | Should renewals appear in History? They have their own two endpoints and aren't in the history API. | Product, backend | Not shown |
| 6 | Keep the Bids, Offers and Transfers tabs (empty) until those features exist, or hide them? | Product, design | Kept, empty |
| 7 | Is a short order hash fine as the reference, or is a user facing ID planned? | Product | **Answered 26 Oct: keep the short hash** |
| 8 | What's the Help Center link? | Product | Support site |
| 9 | Sign off on the design changes in the section above (cards below 1366px, Coming Soon tiles, removed filters, verify state, pill wording) | Design | As built |
| 10 | Keep the Pending legend when real rows are never pending? | Design | Kept, as drawn |
| 11 | Which branch should this ship from? It's uncommitted on dark-mode. | Senior | Not committed |

## Better approaches

What's built works for today's data sizes; these are the changes that would make it faster, simpler or sturdier as usage grows. The first five need the backend.

| Area | Now | Better | Why |
| --- | --- | --- | --- |
| Summary card | Loads every purchase and sale, adds them up on the page | A backend summary endpoint with a `period` parameter | One small request instead of many; stays fast for heavy traders; can include fees, pending and future types |
| Transactions and Listings tabs | Two API calls each, merged on the page | `type` accepting several values (`BUY,SOLD`) | One call, server side paging, less page code |
| Date range filter | Applied to rows already loaded | `from` and `to` on the API | Correct across all pages, not just what's loaded |
| Wallet signature | Required within the last hour | Login only read through the account's linked wallets | No signing step just to view history |
| Price changes | Two rows (cancel, relist) | One "price updated" event from the backend | Matches what the user did |
| Data fetching | `useEffect` + `callBackend`, like Watchlist and My Domains | RTK Query endpoints | Caching, and History refreshes itself after a buy or listing elsewhere |
| Wallet connection | AppKit set up inside the History hook, copied from the listing modal | One shared wallet hook or app level setup used by every flow | One place to change, no duplicated config |
| Table or cards switch | JS (`useIsMobile`), like My Domains | CSS container queries | No brief desktop flash on phones before the switch |
| Tests | Node scripts run by hand outside the repo | A test runner in the repo (Vitest or Jest) for the helpers | Runs in CI; protects the mapping and sums |
| Screen checks | Screenshots taken by hand | Playwright or Storybook visual tests | Catches layout regressions automatically |

## Future work

In order: confirm it works for a real user, ship it, then the backend asks and the clean ups.

**Now**

1. Open `/history` signed in with a wallet on staging: check the list, the Summary for a few periods ("All time" should show 3 purchases and 2 sold for the test account), and Verify wallet end to end.
2. Get answers to open questions 1 and 11 (wallet signature, branch), then commit.
3. Design sign off on the changes listed above.

**With the backend**

1. Summary endpoint with periods (replaces the page's own sums).
2. Several types in one call, and a way to exclude cancellations.
3. Date range parameters.
4. Price change as one event.
5. A login only read without the wallet signature, if agreed.
6. Renewals in the history API, if product wants them.
7. Bids, offers, transfers and withdrawals as history events when those features ship, then fill the empty tabs and the Coming Soon tiles.

**Clean ups**

1. Fix two link helpers in `routes.ts` (`orderReceiptHref`, `domainOverviewHref`) that build `//` links, which browsers read as another website. History doesn't use them.
2. Stop the watchlist count from throwing an unhandled "Failed to fetch" when the backend is unreachable.
3. Keyboard and screen reader pass; open an exported CSV in Excel.
4. Check the Watchlist page after the shared name block change.
5. Update the hand build course (`dev-docs/history/history-course.html`), written before the API work.

Details behind every item: `dev-docs/history/history-implementation-plan.md` (sections 8.1.1, 9.1, 12.2, 12.3) and the History API coverage doc.

## Backend at a glance (26 Oct 2026)

The full list of what exists and what doesn't, for History and Profile together, is in `dev-docs/profile/profile-api-guide-analysis.html` section 11 and `dev-docs/profile/profile-settings-implementation-plan.md` §15.9. For History: `GET /marketplacev2/history/get-all` and the wallet verification pair exist and are wired; still missing are a summary endpoint with a period, several types per request, `from`/`to` dates, renewals, offers, bids, transfers, withdrawals, and account events. The reference stays the short order hash (decided 26 Oct), so no reference ID is needed.
