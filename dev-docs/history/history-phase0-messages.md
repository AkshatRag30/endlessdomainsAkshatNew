# History page: phase 0 messages (19 Oct 2026)

## Backend

Hi team, we're starting the new History page: the signed in user's activity log (Figma section 140:16047). We're building it on demo data first, so none of this blocks us. Here's what would let us switch sections to real data, most valuable first.

**Quick wins on existing endpoints**

1. Allow `GET /marketplacev2/orders/transactions/mine` and `GET /marketplacev2/orders/listing-history` with login only (`AccessTokenGuard`), without `RequireVerifiedWalletGuard`. Both are read only and scoped to the caller, and History is already a login protected page. Today a user who hasn't verified a wallet in the last hour gets an error instead of their history. Since `transactions/mine` looks up by the verified wallet address, a login only version would need to use the user's linked wallets. A separate login based variant works for us too. (Renewal history is already login only, thank you.)
2. Add `priceUsdt` and `chainId` to each `listing-history` row. Right now we need one receipt call per sold row just to show its price.
3. Add a seller side to `transactions/mine`, for example `?side=buyer|seller|all`, so purchases and sales come from one place.

**New endpoints, when there's room**

4. `GET /history/activities?tab&type&status&assetType&from&to&search&sort&page&limit` returning `{ data: HistoryActivity[], total, hasNext }`, merging purchases, sales, listing events and renewals now, and offers, bids, transfers, withdrawals and account events if those get built.
5. `GET /history/summary?period=` returning `HistorySummary`, the totals for the Summary card.
6. Optional: `GET /history/export.csv` with the same filters as point 4.

```ts
type HistoryActivityType = 'purchase' | 'sale' | 'listing' | 'delisting' | 'renewal' | 'offer' | 'bid' | 'transfer' | 'withdrawal' | 'account'
type HistoryStatus = 'pending' | 'completed' | 'failed'

interface HistoryActivity {
  id: string
  type: HistoryActivityType
  status: HistoryStatus
  occurredAt: string            // ISO
  reference: string             // user facing reference, copyable
  domain?: { name: string; tld: string; chain: string }
  amount?: { value: number; token: string; usd: number }
  orderId?: string              // order hash, links to the receipt page
  txHash?: string
  chainId?: string
  description?: string          // account events, e.g. "Signed in with Google"
}

interface HistorySummary {
  period: 'all' | '7d' | '30d' | 'this-month' | '90d' | 'this-year'
  spentUsd: number
  earnedUsd: number
  pendingCount: number
  purchases: number
  domainsSold: number
  auctionsWon: number
  offersAccepted: number
  transfers: number
  withdrawals: number
}
```

**Questions**

a. Can the wallet guard be relaxed as in point 1, or should we plan around it?
b. Do renewal history rows include an amount and a pending or failed status?
c. Are offers, bids, transfers, withdrawals or account events (sign ins) planned anywhere? Until they exist, those tabs stay on demo data.
d. Is there a user facing reference ID like the "#ED 2026 1013 00148" style in Figma? If not, we'll show a short order or tx hash.

## Designer

Hi, I'm building the History page from section 140:16047. A few things to confirm. None of them block me, so I'll go with the proposal unless you say otherwise.

1. In the light Summary card, the Withdrawals tile is hidden behind Transfers, while the dark frame shows all six tiles in a 2 × 3 grid. I'll build all six.
2. Every row's Details says "Domain purchased", whatever its type. I'll take the label from the type: Domain listed, Domain renewed, Domain sold, Listing cancelled, and so on.
3. The tab says "Account" but the pill says "Accounts", and the "Bids" pill sits on a single bid. I'd use singular pills: Account, Bid.
4. The Activity type filter repeats the tabs. I'll keep them in sync, so picking one updates the other.
5. The mobile filter frame has no sheet chrome (no handle, close button or backdrop). I'll use our existing slide in drawer unless you'd like a bottom sheet.
6. What should the Asset type options be? I've assumed All assets, Domains, Tokens.
7. Should the Withdrawals tile stay, given there's no payouts page yet? I'll keep it with sample numbers.
8. With real data: the reference will be a short order or tx hash, since the ED style ID doesn't exist in the backend. Pending and the orange strip will rarely appear, because sales are recorded after confirmation. Listing events have no amount, so that cell shows a dash. Does that work for you?
9. These states aren't in Figma: empty tab, no results after filtering, loading, error, and "Verify your wallet to see your history". I'll follow the My Domains and Watchlist patterns unless you'd like to design them.
10. Where should "Go to Help Center" link to?
