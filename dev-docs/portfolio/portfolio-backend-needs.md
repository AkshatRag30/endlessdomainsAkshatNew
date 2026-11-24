# Portfolio page: what we need from the backend

Oct 30, 2026 · @Akshat · Doc: https://claude.ai/artifact/8LkF8CnVzYboLkywzPGB1Q (local copy, the doc is the source)

## Summary

The Portfolio page (Figma section 193:16444) shows a seller's profile, stats and names to anyone at `/u/<username>`, and to the seller at `/portfolio`. Today only the signed in seller's own data exists, so the public page runs on sample data. Everything below comes from what the design draws, nothing more.

1. **A public seller endpoint by username:** profile (with primary name, last active and a verified seller flag), stats (with TLD count, sold this month and volume), and a paged list of the seller's names with totals and sold history. This is the main need; without it the public page stays on sample data.
2. **Per name data:** view count, premium flag, price change and AI appraisal.
3. **Endless Score** for sellers (score and percentile).
4. **Features the design shows that have no backend yet:** offers (Make Offer button and Offer Receive tab), messaging (Message button), price alerts (bell), collections (Collection tab) and a seller activity feed (Activity tab).

Share needs nothing from the backend, and the heart (watchlist) already works.

## Hero banner

The banner needs the seller's public profile by username; today these fields exist only for the signed in user.

| In the design | Backend needs to send | Exists today? |
| --- | --- | --- |
| Avatar, name, bio | `avatarUrl`, `fullName`, `bio` for any username | Only for yourself (`GET /users/user-multiple-wallet`) |
| "vision.eth" | The seller's primary name | No |
| "Joined May 2024" | `memberSince` | Only for yourself (`GET /marketplacev2/orders/summary`) |
| "Active 3 days ago" | `lastActiveAt` | In the user table, not returned (admin panel only) |
| "Verified seller" pill | `isVerifiedSeller` flag | No; needs a rule for who counts as verified |
| Message button | A messaging API | No |

## Stat tiles

Four of the five tiles exist only for the signed in user; the TLD count, monthly sales and Endless Score don't exist at all.

| In the design | Backend needs to send | Exists today? |
| --- | --- | --- |
| Total domains, "Across 7 TLDs" | `totalDomains`, `tldCount` | Count only for yourself; no TLD count |
| Active listings | `activeListings` | Only for yourself |
| Domains sold, "+6 this month" | `domainsSold`, `soldThisMonth` | Total only for yourself; no monthly figure |
| Total volume, "≈ $315,680" | `totalVolume` (amount, token, USD value) | Only for yourself (USDT) |
| Avg Endless Score, "Top 8% of sellers" | `endlessScore`, `topPercent` | No |

## Tabs and count chips

All, Listing and Sold History can come from one names list; Offer Receive, Collection and Activity each need a feature that doesn't exist yet.

| Tab | Backend needs to send | Exists today? |
| --- | --- | --- |
| All, Listing | The seller's names, filterable by status | Only for yourself (`GET /marketplacev2/orders/my-domains`) |
| Sold History | Sold names with sale price and sale date | Only for yourself (`my-domains?status=SOLD`, on uat, not yet confirmed on stage) |
| Offer Receive | Offers received on the seller's names | No |
| Collection | The seller's collections | No |
| Activity | The seller's activity feed | No |
| Count chips on each tab | A count per tab | Only listed and sold, only for yourself |

## Rows and cards

Name, status, price and the details link already come from `my-domains`; views, premium, price change and AI appraisal are new, and three of the buttons need new features.

| In the design | Backend needs to send | Exists today? |
| --- | --- | --- |
| Name, extension, chain | `domainName`, `tld`, provider / chain | Yes (`my-domains`) |
| "2,329 views" | View count per name | No |
| Crown (premium) | Premium flag per name | No |
| For sale / Not for sale chip | Listing status | Yes |
| Price | Listing price | Yes |
| "−14%" | Price change per name | No |
| "AI appraisal $520" | AI appraisal value per name | No |
| View Details button | The listing's order hash | Yes |
| Make Offer button | An offers API | No |
| Heart | Watchlist add / remove | Yes |
| Bell | A price alerts API | No |

## Toolbar and pagination

The design uses numbered pages, so the names list needs a total; filters and sorting run on the page today and should move to the API for public sellers with many names.

| In the design | Backend needs to send | Exists today? |
| --- | --- | --- |
| Search, All TLDs, All Status, price sort | Filtering and sorting on the names list (`q`, `tld`, `status`, `sort`) | Done in the browser for now |
| All Type | A type per name (premium or standard?) | No; the design doesn't say what types exist |
| "Showing 12 of 112", pages 1 2 3 … 10 | A total with paged results (`page`, `limit`) | `my-domains` returns a total, only for yourself |

## Suggested endpoints (proposal)

Three public calls by username would cover the hero, the tiles and the names list; names and shapes are a starting point for the backend to adjust. None should need a login, since visitors open the page from a shared link.

**1. Seller profile:** `GET /users/public/:username`

```json
{ "username": "vision", "fullName": "Akshat Rag", "avatarUrl": "…", "bio": "…",
  "primaryName": "vision.eth", "memberSince": "2024-05-14",
  "lastActiveAt": "2026-10-27T10:00:00Z", "isVerifiedSeller": true }
```

Never include email, phone or Telegram. Answer 404 when the username doesn't exist.

**2. Seller stats:** `GET /users/public/:username/stats`

```json
{ "totalDomains": 112, "tldCount": 7, "activeListings": 37,
  "domainsSold": 58, "soldThisMonth": 6,
  "totalVolume": { "amount": "437542930000", "token": "USDT" },
  "endlessScore": 4.7, "topPercent": 8 }
```

The same maths as today's `GET /marketplacev2/orders/summary`, for any username. Amounts in 6 decimal minor units, like the rest of v2.

**3. Seller's names:** `GET /users/public/:username/domains?status=&tld=&q=&sort=&page=&limit=`

Rows shaped like `my-domains` returns them (`domainName`, `tld`, `tokenId`, `domainProvider`, `status` LISTED / UNLISTED / SOLD, `order` with `priceUsdt`, `orderHash`, `filledAt`), plus `views`, `isPremium`, `priceChangePct`, `appraisalUsd` where available, and a `total` for the page numbers. Tab counts (listed, sold) can come with it or from the stats call.

Offers, messaging, price alerts, collections and the activity feed are separate features and need their own design first.

## Already available

The signed in seller's own portfolio (`/portfolio`) already runs on these, checked against backend `origin/uat` c7b60c49 on 30 Oct 2026.

| Endpoint | Used for |
| --- | --- |
| `GET /users/user-multiple-wallet` | Own avatar, name, username, bio |
| `GET /marketplacev2/orders/summary` | Own member since, domains owned, listed, domains sold, volume (USDT) |
| `GET /marketplacev2/orders/my-domains?status=LISTED / UNLISTED / SOLD` | Own names; SOLD is on uat, please confirm it's deployed to stage |
| `GET / POST / DELETE /marketplacev2/orders/watchlist` | The heart |

Share builds the link on the page and needs nothing from the backend.
