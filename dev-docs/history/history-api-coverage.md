# History page: API coverage

Oct 19, 2026 · @Akshat

With the new history API, about half of the History design can show real data: the Transactions and Listings tabs, most of All Activities and two Summary tiles. Bids, Offers, Transfers, Account, Withdrawals and most of the Summary card still have no backend and stay on demo data.

## Coverage at a glance

Eight parts of the design can be real today, eight only partly, and eight have no backend yet.

| Part of the design | Can it be real? | Source or reason |
| --- | --- | --- |
| Transactions tab: purchases and sales | Yes | New history API, types BUY and SOLD, prices included |
| Listings tab | Yes | New history API: LISTING (active listings) and DELIST (cancelled) |
| Row: name, Details, Amount, Date | Yes | domainName, priceUsdt, occurredAt, txHash on every row |
| Row chevron (receipt or explorer) | Yes | orderHash and txHash |
| Search | Yes | API `search` (domain name) |
| Sort newest or oldest | Yes | API `sort` ASC or DESC |
| Paging ("Show N more") | Yes | API `page`, `limit` (max 100), `hasNext` |
| Summary tiles: Purchases, Domains sold | Yes, all time only | API `totals.buyTotal`, `totals.soldTotal` |
| All Activities tab | Partly | Real for buy, sell and listings; renewals need a second source; other types stay demo |
| Renewals | Partly | Separate ETH and BNB/ARB renewal history endpoints, merged on the page |
| Status (Pending, Completed) | Partly | Real rows are always settled or active, so Pending never shows |
| Reference ID ("#ED 2026…") | Partly | Format doesn't exist; real rows show a short order or tx hash |
| Date range filter | Partly | No API parameter; works only on rows already loaded |
| Status filter | Partly | No API parameter, and real rows have no pending state |
| Asset type filter | Partly | API filters by TLD and NFT contract; "asset type" not defined yet |
| Sort by amount | Partly | API sorts by date only |
| Bids tab | No | No bids in the backend |
| Offers tab | No | No offers in the backend |
| Transfers tab | No | No transfer log |
| Account tab (sign ins, account events) | No | Not recorded anywhere |
| Withdrawals | No | No withdrawal records |
| Summary: spent and earned totals | No | No dollar totals per period |
| Summary: pending count, "this month" period | No | No per period counts |
| Summary tiles: Auctions won, Offers accepted, Transfers, Withdrawals | No | Features don't exist yet |

## What's present

The new history API is the main source; three older endpoints fill smaller gaps. The new API is confirmed live on staging.

| Endpoint | Gives | Auth |
| --- | --- | --- |
| `GET /api/v1/marketplacev2/history/get-all` (new, PR #985) | Purchases, sales, active listings and cancelled listings, merged, newest first, with prices, filters, paging and all time totals | Access token + verified wallet |
| `GET /eth-domain-renewal/history`, `GET /bnb-arb-domain-renewal/history` | Renewals, paginated | Access token only |
| `GET /marketplacev2/orders/transactions/:orderHash` | One sale's receipt | Public |
| `GET /marketplacev2/orders/listing-history` | Every listing event (listed, cancelled, sold, expired, invalidated, reactivated), no prices | Access token + verified wallet |

The new API's parameters, all optional: `type` (BUY, LISTING, SOLD or DELIST), `tld`, `network` (the NFT contract address), `search`, `sort` (ASC or DESC), `page`, `limit` (max 100). Each row returns type, orderHash, domainName, tld, tokenId, tokenContract, seller, buyer, priceUsdt, feeUsdt, sellerUsdt, txHash and occurredAt.

## What's good about the new API

It replaces the plan to merge three endpoints on the page with one call, and it's built carefully.

- **One merged list**: purchases, sales and listings in a single newest first feed, with server side paging that stays correct across types.
- **Prices on every row**: no extra receipt call per sale, which the old listing history needed.
- **Server side filters**: search, TLD and NFT contract, plus the lists of TLDs and contracts found, ready to fill filter dropdowns.
- **Predictable shape**: a missing value comes back as null, never as a missing field, so every row has the same columns.
- **Safe inputs**: types are validated, search wildcards are escaped, `limit` is capped at 100.
- **Same pagination shape** as the other marketplacev2 lists (`page`, `totalPages`, `hasNext`).

## Tested on staging (19 Oct)

A real call with a wallet signed session returned 200 and 39 rows, and confirmed the API's shape; it also showed five things the page has to handle.

| Check | Result |
| --- | --- |
| Status | 200, `total` 39, 4 pages of 10 |
| Totals | 3 buys + 4 active listings + 30 delists + 2 sales = 39 |
| Price units | USDT with 6 decimals: `"100000000"` = 100 USDT, `"100000"` = 0.10 USDT |
| `network` | One contract, `0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f`: the app's Polygon domain contract |
| Delist prices | Present, taken from the cancelled order |
| `txHash` | Set on BUY and SOLD; null on LISTING and DELIST (off chain) |

**What the page has to handle**

1. **Delists dominate**: 30 of 39 rows. The Listings and All Activities tabs would be mostly "Listing cancelled" unless delists are grouped, filtered or hidden by default.
2. **A price change is two rows**: thesoaltee.og was delisted at 07:24:11 (10 USDT) and listed again 19 seconds later at 100 USDT. Editing a price cancels the order and creates a new one.
3. **Delists without a listing**: LISTING returns only active listings, so a listing later cancelled shows only its delist, never when it was listed.
4. **No explorer link for listings**: no tx hash, so their chevron should open the domain page instead; purchases and sales link to the receipt.
5. **Small amounts**: 0.10 USDT must show as 0.10, not $0.

**Asks for the backend from this test**

- Mark a delist followed by a relist of the same token as one "price updated" event, or return a flag the page can group on.
- Include past LISTED events (they exist in the listing history table), so every delist has its listing.
- A way to exclude delists (for example `type` accepting several values, or `excludeType=DELIST`).

## What's missing and what's needed

To make the whole design real, the backend needs these, most valuable first.

1. **A summary endpoint**, e.g. `GET /marketplacev2/history/summary?period=`: spent and earned in USD, pending count, and counts for purchases, domains sold, auctions won, offers accepted, transfers and withdrawals, for a chosen period (7 days, 30 days, this month, 90 days, this year, all time). Today's `totals` are all time and cover only four counts.
2. **Renewals inside the history API**, as a fifth `type`, so All Activities is one call instead of three.
3. **Date range filter** (`from`, `to`) on the history API, so filtering by date works across all pages.
4. **Sort by amount** (`sort` by price, high or low), to match the design's sort options.
5. **Activity that doesn't exist yet**: offers, bids, transfers and withdrawals recorded as history events once those features are built.
6. **Account events**: sign ins, wallets linked, password changes, for the Account tab.
7. **A status per row** (pending, completed, failed), only if some activity can be in flight; today every row is settled.
8. ~~A user facing reference ID~~. Not needed: decided 26 Oct 2026 to keep the short order hash (copy gives the full hash).
9. **Decision on the wallet check** for read only history: keep "verified in the last hour", or allow a login only read. Today a signed in user who hasn't signed their wallet recently gets 403.

## Before we wire it

The page runs on demo data today; switching to the API changes only its data hook, plus these points.

- **Two auth checks, one header**: send `Authorization: Bearer <access token>`. The token must also carry a wallet verification from the last hour (a `walletVerifiedAt` claim inside it), or the API returns **403 WALLET\_NOT\_VERIFIED**. The app's existing "sign with your wallet" step (used for listing) refreshes the token; History will show a "verify your wallet" prompt and use it.
- **`network` is a contract address**, not a chain name. The all zeros address (`0x0000…`) always returns nothing.
- **LISTING means active listings now**, not every listing ever made; past listings show only once cancelled (DELIST).
- **Prices are in USDT's smallest unit**: divide `priceUsdt` by 1,000,000.
- **`type` accepts only** BUY, LISTING, SOLD or DELIST; anything else is a 400.
- **`tld`** accepts `bn`, `.bn` or `BN`.
- **Staging**: deployed and tested on 19 Oct with a real wallet session; it returned 200 with 39 rows (see Tested on staging).
