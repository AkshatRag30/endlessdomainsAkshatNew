# Promotions page: phase 0 messages (3 Nov 2026)

Checked against backend `origin/uat` 10caf039 (no promotion changes since 7fb3e55f, which the plan used).

## Product

Hi, I'm starting the Promotions page from Figma section 212:16535: a seller picks one of their listed names, chooses a plan, pays, and the name gets pushed in the marketplace. The design and what the backend has today describe two different products, so I need a few decisions. I'll build the screens on sample data in the meantime, so nothing is blocked yet. Only the answer to question 1 decides how the payment step ends up working.

1. **How does a seller pay?** Figma has the seller pay on chain in ETH, USDC or WETH from their wallet, with a wallet signature and a transaction hash. The backend today creates a Cryptomus USD invoice (a hosted payment page), and a webhook turns the promotion on once it's paid. That's also what the old Promote popup and the sidebar card ("$1 for 24 hours, $5 for 7 days") use. Which one are we going with?
2. **Plans and prices.** Figma has three plans (Boost, Featured, Premium), all 7 days, with different reach. The backend has two (24 hours for $1, 7 days for $5). In Figma all three show the same price, 0.15 ETH / $363, which looks like a placeholder. What are the real plans, durations, prices and placements (for example "Search + Category" vs "Homepage + Category + Search")?
3. **Which chain?** If we go on chain: Figma says Ethereum, but buying and listing run on Polygon with USDT today. Which network and which tokens should we accept?
4. **A name that's already promoted.** What can the seller do: extend it, upgrade to a bigger plan, or nothing until it ends? Until I hear back, I'll show "Promoted until …" and disable the plans.
5. **Where people start.** Figma only draws the page itself. Should there also be a Promote button on My Domains rows and cards and on the domain page, opening Promotions with that name already picked?
6. **Numbers on the page.** The hero shows views, unique visitors, watchers and offers, and the rail shows "Est. views ~906" and "+120% vs organic". Today we only track views, clicks and saves. Are the estimate and the "vs organic" figure needed at launch, or can they wait?

## Backend

Hi team, we're starting the new Promotions page (Figma section 212:16535). We're building it on sample data first, so none of this blocks us. Product still has to choose between the current Cryptomus invoice and an on chain payment (question 1 above), so part A works either way and part B only applies if we go on chain.

**What we already use**

1. `GET /marketplace/promoted-domains-list` for the marketplace Promoted strip.
2. `POST /marketplace/payment/create/invoices` with `{ domain_id, selectedPlan: '24h' | '7d' }` returning the Cryptomus invoice URL.
3. `isPromoted` on listings, and the history type `PROMOTION`.

**A. Needed in either case, most valuable first**

1. `GET /marketplace/promotions/plans` returning the plan list, so prices and durations stop being hardcoded on both sides (today they're `PROMOTION_PLAN_PRICES` in `promotion-plans.constant.ts`).
2. `GET /marketplace/promotions/domain/:listingId` for one of the caller's own listings: the name, its listed price and stats, plus the active promotion and its end date if there is one. The end date is the main gap: `isPromoted` tells us a name is promoted but not until when, and the page needs "Promoted until Nov 13".
3. Per domain stats for that response: views in the last 7 days (analytics has views), unique visitors, watchers (watchlist count) and open offers. If any of these can't be computed, return `null` and we'll show a dash.
4. `GET /marketplace/promotions/estimate?listingId&planId` returning estimated views and the uplift vs organic, only if product keeps those tiles.
5. `GET /marketplace/promotions/mine` listing the caller's active and past promotions (status, plan, start, end, amount). Not needed for the first release, but useful for the receipt and a later history view.

**B. Only if product picks on chain payment**

6. `POST /marketplace/promotions/quote` with `{ listingId, planId, token }` returning what the wallet should sign: contract address, chain id, amount in the token's units, and calldata or a signed quote with an expiry.
7. A way to confirm it afterwards: either `POST /marketplace/promotions/confirm` with `{ quoteId, txHash }`, or an indexer that picks up the contract event. Then `GET /marketplace/promotions/receipt/:txHash` returning the receipt below.

```ts
type PromotionPlanId = string            // e.g. 'boost' | 'featured' | 'premium', or '24h' | '7d'
type PayTokenSymbol = 'ETH' | 'USDC' | 'WETH' | 'USD'

interface PromotionPlan {
  id: PromotionPlanId
  name: string
  description: string
  durationHours: number
  placement: string                      // 'Search + Category'
  reachLevel: number                     // 1 to 6, for the reach meter
  priceUsd: number
  prices?: { token: PayTokenSymbol; amount: string }[]   // only for on chain
  recommended?: boolean
}

interface PromotionDomain {
  listingId: string
  name: string
  extension: string
  listedPrice: { amount: string; token: string; usd: number }
  stats: { views7d: number; uniqueVisitors: number | null; watchers: number | null; offers: number | null }
  activePromotion: { planId: PromotionPlanId; startedAt: string; endsAt: string } | null
}

interface PromotionEstimate { estViews: number; vsOrganicPct: number }

interface PromotionReceipt {
  txHash: string | null                  // null for a Cryptomus payment
  planId: PromotionPlanId
  paid: { amount: string; token: PayTokenSymbol; usd: number }
  startedAt: string
  endsAt: string
}
```

**Questions**

a. Can the response that says a name is promoted also return when it started and when it ends?
b. Can the Cryptomus invoice tell us which plan it was for and when that promotion ends, so we can show a success screen when the seller comes back from the payment page?
c. Is there a watchers count per listing anywhere (watchlist entries for that listing)?
d. Does promotion change the order of search and category results, or only the Promoted strip? Figma's plans promise different placements.

## Designer

Hi, I'm building Promotions from section 212:16535. A few things to check. None of them block me, so I'll go with my suggestion unless you tell me otherwise.

1. All three plans show the same price, 0.15 ETH / $363. I'll use sample prices for now; product is confirming the real ones.
2. The Checkout drawer shows `banking .ud` and "bnb · 7 chars · one time · no renewal", which look copied from the buy flow. I'll show the domain being promoted and its plan ("7 days · Medium boost").
3. Checkout's balance box says "Balance 1.25 ETH" but "You need 0.40 WETH more" while WETH is selected, and USDC is marked Low even though 520 USDC covers $363. I'll calculate both from the token that's selected.
4. The schedule for a 7 day plan going live today shows the midway check on Nov 3 and the end on Nov 6. I'll work the dates out from the plan's length.
5. The sign step says Featured 0.30 ETH while the page selected Boost 0.15 ETH, and the success screen says "running for 14 days" while every plan is 7 days. I'll use the chosen plan everywhere.
6. The progress step's heading says "future.xyz is live" while it's still broadcasting, and its footer still shows Confirm and Reject. I'll use a "Processing your promotion" heading there, and either no footer or one that's disabled.
7. The token is chosen twice, once in step 2 on the page and again in Checkout. I'll treat them as one choice, so changing it in Checkout updates the page too.
8. In dark mode the two unselected token tiles look dimmed, but in light they look normal. Does dimmed mean "not enough balance"? If not, I'll follow light.
9. In light mode the summary card repeats the "Live preview" heading, and dark has no heading. I'll follow dark.
10. On mobile the live preview, the two estimate tiles and Our Tip aren't drawn. Is that on purpose? I'll leave them out on mobile unless you say otherwise.
11. Frames I couldn't find: the page with no domain chosen, a name that's already promoted, wallet not connected, wrong network, payment rejected or failed, and loading. My plan for "no domain" is a simple list of your listed names, each opening the page with that name picked. Can you draw any of these, or should I follow the My Domains patterns?
12. Where should "How promotion works ↗", "Add Funds" and "View analytics" go? Until there's a target, they'll show a "coming soon" message.
