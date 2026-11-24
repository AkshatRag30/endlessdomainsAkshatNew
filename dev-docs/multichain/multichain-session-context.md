# Multi chain marketplace: context for the planning session

Written 24 Nov 2026 at the end of the bulk listing v2 session, so a fresh Claude session can start **planning** multi chain without rereading everything. Planning only: no code until the user approves the plan.

## 0. How to use this file

1. Read this file fully.
2. Read Mohit sir's requirements, multi chain part: `dev-docs/multichain/mohit-requirements-10nov.txt` (text of the PDF, pages 8 to 21; the original PDF is `C:\Users\ACER\Downloads\Bulk Listing and Multi Chain Marketplace Backend and WebUI Requirements (1).pdf`).
3. Skim how bulk listing v2 was planned, because the user wants the same workflow: `dev-docs/bulk-listing/bulk-listing-v2-review.html` (review of the PDF, gaps, questions), `dev-docs/bulk-listing/bulk-listing-v2-plan.md` (phases with prompts), `dev-docs/bulk-listing/bulk-listing-v2-tickets-explained.html` (tickets in simple words).
4. Then check the live state (section 4 says how) before writing anything, since branches move daily.

## 1. What the PDF asks for (multi chain only)

Mohit sir's order of work: (1) bulk listing for UD on Polygon (**done**, branch `bulk-list`, see section 3), (2) **multi chain foundation**: one Polygon config becomes a per chain and per collection registry across backend, poller and frontend, nothing user visible changes, (3) **all providers in one release**: UD Base, Freename (Polygon, Base, BNB), SPACE ID .arb and .bnb, and ENS (unwrapped, wrapped and ENSv2).

No new smart contract: Seaport 1.6 is at `0x0000000000000068F116a894984e2DB1123eB395` on Ethereum, Base, Arbitrum, BNB and Polygon. Each chain has its own EIP712 domain, so a signature only works on its chain.

### 1.1 Provider and chain matrix (checked on chain by Mohit sir, 10 Nov)

| Provider | Chain (id) | Contract | Standard | Token id | Expiry | Stable (decimals) |
|---|---|---|---|---|---|---|
| UD (live) | Polygon 137 | `0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f` | ERC721 | namehash | `expiryOf`, 0 = never | USDT0 `0xc2132D05…8e8F` (6) |
| UD Base | Base 8453 | `0xF6c1b83977DE3dEffC476f5048A0a84d3375d498` | ERC721 | namehash | `expiryOf`, 0 = never | USDC `0x833589fC…2913` (6) |
| Freename | Polygon, Base, BNB | `0x465ea4967479A96D4490d575b5a6cC2B4A4BEE65` on all three | ERC721 | not derivable, read from chain; name from `metadata.freename.io/metadata/<tokenId>` | none | the chain's stable |
| SPACE ID .arb | Arbitrum 42161 | `0x5d482D501b369F5bA034DEC5c5fb7A50d2D6Ca20` | ERC721 | labelhash | yes, 90 day grace | USD₮0 `0xFd086bC7…bb9` (6) |
| SPACE ID .bnb | BNB 56 | `0xE3b1D32e43Ce8d658368e2CBFF95D57Ef39Be8a6` | ERC721 | labelhash | yes, 90 day grace | USDT `0x55d39832…7955` (**18**) |
| ENS v1 unwrapped | Ethereum 1 | BaseRegistrar `0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85` | ERC721 | labelhash | yes | USDC `0xA0b86991…eB48` (6) |
| ENS v1 wrapped | Ethereum 1 | NameWrapper `0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401` | **ERC1155** | namehash | yes, plus fuses | USDC |
| ENSv2 | Ethereum 1 | ETHRegistry `0xF60aBa43e1f7F3DAB1186Ff03B561401C9DF85e2` | **ERC1155** | mutable (low 32 bits = version) | yes, 28 day grace | USDC |

Truncated addresses are as printed in the PDF; take full ones from the backend config endpoint (section 4.2), never guess.

### 1.2 Traps the PDF calls out

BNB stables have **18 decimals** (everything else 6). Expiring names must end listings before expiry (7 day buffer, 14 day minimum, decision 8). ENS v1 and SPACE ID transfers don't reset records, so buyers need a **claim control** step (C9, W5); UD and Freename reset records. NameWrapper names with `CANNOT_TRANSFER` burned can never be sold. ENSv2 token ids change on regeneration, which invalidates orders. Freename discovery is reseller only today, token ids null. **Approval is per contract per chain** (a few dollars of gas on Ethereum).

### 1.3 Marketplace frontend tickets (this repo)

| Ticket | Work | PDF phase | Backend dependency |
|---|---|---|---|
| C1 | Config from `GET /marketplacev2/config`; remove `DEFAULTS` in `src/lib/marketplace-order-client.ts` | 2 | M1 (mock first) |
| C2 | `getReadProvider(chainId)` instead of `getPolygonReadProvider`, same retry and fallback; fold the six `createAppKit` calls into one | 2 | none |
| C3 | `seaport-order-builder-v5.ts` takes chainId, item type (ERC721 or ERC1155), currency and decimals; drop `ItemType.ERC721` and the 6 decimal constant | 2 | none |
| C5 | Decimals sweep: every `1e6` / `USDT_DECIMALS` uses the order's decimals; 18 decimal tests | 2 | M2 field names |
| C6 | `chainId` and `tokenContract` on `MyDomainsOrderRow`, `MarketplaceOrderRow`; row id `chainId:contract:tokenId`; stop forcing Polygon | 2 | M2, M5 shapes |
| QA | Polygon regression: list, bulk, buy, Trails, delist, history, watchlist | 2 gate | M1, M2 on uat |
| C4 | List and buy on the name's chain (switch network before approval and signing); buy fills on that chain's Seaport; Trails destination per chain | 3 | M3 |
| ENS | ERC1155 orders, fuse and token id messages, mainnet gas copy | 3 | M3, M4 |
| C7 | SPACE ID and Freename in `chaincurrency.ts` provider maps; Freename is a provider, not a chain (`data/marketplace/domains.ts`); chain filters from config | 3 | M1 shape |
| C8 | One chain per batch in select mode | 3 | none (**already built in bulk-list**, see 3.2) |
| C9 | Buyer claim control copy and links (ENS v1, SPACE ID) | 3 | links to webui W5 |
| Rigs | Fork scripts and one low value name per collection | 3 | none |
| QA | Every flow on all 8 collections, one real Trails buy per chain | 3 gate | M3 to M6 on uat |

PDF's split: Dev A = signing and chain plumbing (C1, C2, C3, C4, ENS); Dev B = drawer, delist and data mapping (C5, C6, C7, C8, C9, rigs). Webui tickets W1 to W5 are in the separate webui repo and need a webui dev (W2 `?bulk=1` is already supported on our side).

### 1.4 Backend tickets the frontend depends on

M1 registries (chain, collection, currency), M2 order schema (provider, itemType, currencyToken, currencyDecimals; `priceAmount`/`feeAmount`/`sellerAmount` in token units plus `priceUsd`; unique index with chainId), M3 create order validation per collection (chainId in the DTO, ERC1155 balance check, fuses, ENSv2 id), M4 poller per chain, M5 reads and stats (chainId and provider filters, my-domains join by chain, per currency summary, emails), M5b discovery (ENS NameWrapper, Freename on chain, a refresh endpoint before the bulk drawer), M6 fees per chain (decision 7: 2.5%, same recipient everywhere).

### 1.5 Decisions already taken by Mohit sir (10 Nov)

2 one chain per batch · 3 USDT0 on Polygon and Arbitrum, USDC on Base and Ethereum, USDT on BNB, prices shown as USD · 4 **all of ENS in the first multi chain release** · 6 any Freename NFT in the wallet, discovered on chain · 7 fee 2.5%, same EOA on every chain · 8 end 7 days before expiry, 14 day minimum · 9 cap 50 · 10 no smart contract wallets in phase 1 · 11 webui search shows no marketplace price on taken names.

### 1.6 Acceptance criteria

Phase 2: every existing order backfilled with chainId 137, currency and decimals, browse, buy and receipts unchanged; **no reference to `MARKETPLACEV2_CHAIN_ID` or `DEFAULTS` outside the registry loaders**; poller one cursor per chain with lag per chain.
Phase 3: for UD Base, Freename (Polygon, Base, BNB), SPACE ID .arb and .bnb: list, buy directly, buy through Trails, delist, invalidation on transfer, on a fork then once with a real low value name; a BNB listing round trips with 18 decimals; a SPACE ID name inside the expiry buffer can't be listed; the webui List action opens the right name on the right chain. ENS: unwrapped, wrapped and ENSv2 list and fill; burned `CANNOT_TRANSFER` refused; an ENSv2 id change invalidates the order.

## 2. Who and when

The user (frontend dev, Akshat) is now planning multi chain. Earlier (19 Nov plan, `bulk-listing-v2-plan.md` §6) multi chain frontend was assigned to **another developer**; whether the user now does all of it, or splits with that developer as the PDF's Dev A and Dev B, is **not confirmed: ask the user first**. Mohit sir is away; decisions the PDF doesn't cover go to him as drafted questions (the user prefers decisions recorded with a reason and confirmed later).

## 3. State of the frontend (24 Nov)

### 3.1 Branches

`uat` has Trails merged (PR #237, 18 Nov), so the PDF's "C4 and C5 must start after Trails merges" blocker is cleared. `origin/multichain-frontend` exists, cut from uat at `abad68e` (18 Nov), **no commits of its own yet**. `bulk-list` (latest `a59939a`, pushed) is **not merged into uat yet**; its PR comes after final QA. Multi chain should build on top of bulk listing, so the plan must decide the base (wait for the bulk-list merge, or branch from bulk-list and rebase later). `bulk-list`, `portfolio` and `promotions` all edit `useMyDomainsData.ts`.

### 3.2 What bulk listing already made multi chain ready

`src/constants/nftContracts.ts` `APPROVAL_CONTRACTS` (one row today, UD Polygon, built from `DEFAULTS`; multi chain adds rows), `src/hooks/my-domains/useNftApprovals.ts` (approval read per contract on its own chain, one transaction per missing contract, no duplicate in flight), `src/helpers/my-domains/nftApprovals.ts` and `types/my-domains/approvals.ts`. C8 is built: `bulkBatchChain` and `bulkReasonInBatch` in `src/helpers/my-domains/bulkListing.ts`, the "pick a chain" banner (`BulkSelectBanner` `needsChain`), the chain filter saved and restored in `pages/seller-hub/my-domains/index.tsx`. Expiry on chain: `useBulkListingActions.readChainExpiries` reads UD `expiryOf` on Polygon through one Multicall3 `aggregate3` (`0xcA11bde05977b3631167028862bE2a173976CA11`); it must become per chain and per provider. On chain cancel (`cancel` in `SEAPORT_MIN_ABI`, `cancelOrders.service.ts`, `onChainCancel.ts`, `useOnChainCancel.ts`) uses Polygon Seaport today. Wrong network banner and network check at List exist in the bulk and single drawers.

### 3.3 Single chain hotspots found (grep, 24 Nov; recheck)

`DEFAULTS` imported in: `src/lib/marketplace-order-client.ts` (definition), `constants/nftContracts.ts`, `useBuyFlowActions.ts`, `listing-flow/format.ts`, `listing-flow/listingOrder.ts`, `data/marketplace/watchlistItems.ts`, `core/services/trails/browserCheckoutSource.ts`, and Guru's internal `src/bulk-listing-testing/*`. Chain id 137, `getPolygonReadProvider` or `createAppKit` in about 20 files including `component/wallet-connect`, `component/wallet-signup`, `hooks/profile/useLinkWallet.ts`, `hooks/history/useHistoryActivities.ts`, the buy, list and bulk flows, Trails services. `1e6` or `USDT_DECIMALS` in: `useMyDomainsData.ts`, `useLiveListings.ts`, `orderDetails.ts`, `watchlist.ts`, `mapApiActivity.ts`, `summarizeHistory.ts`, `watchlistItems.ts`, `bulkListing.ts`, `PriceInput.tsx`, `useBuyFlowActions.ts`, `trails/usdtAmount.ts`, `TrailsWidget.tsx` (the PDF's C5 list misses some of these and names `profile-settings.service.ts`, which needs checking).

## 4. State of the backend (24 Nov; read only, never edit: `D:\Akshat Endless\backend\backend`)

### 4.1 Multi chain sprints

Guru's branch `origin/feature/multichain_sprints` has these merged (none on uat yet; `git fetch` then `git log origin/feature/multichain_sprints`):

| Ticket | What |
|---|---|
| MC-02 | Chain, collection and currency registries with boot validation and a legacy Polygon fallback |
| MC-03 | Provider factory per chain with fallback RPCs and a Multicall3 check |
| MC-04 | `@endlessdomains/order-builder` 0.3.0 with chainId, itemType and currency parameters |
| MC-05 | Public `GET /marketplacev2/config` (shape below) |
| MC-06 | Additive amount columns (`priceAmount`, `feeAmount`, `sellerAmount`, numeric strings), `priceUsd`, chain aware active listing index, backfill. JSON keeps the old `priceUsdt`/`feeUsdt`/`sellerUsdt` aliases until MC-23 |
| MC-07 | chainId on listing status, listing history, watchlist, poller anomalies; a request without chainId is treated as Polygon (137) |
| MC-08 | Order path cutover to the registry; commit says "WIP, agent output, not yet reviewed" |
| MC-09 | Registry driven emails, Trails Polygon guard, priceUsd admin filters, chain and currency in bulk and cancel emails |
| MC-10 | Poller cursor and advisory lock per chain |

Ticket numbers go up to at least MC-23. Ask the user whether Guru has a written sprint list (none found in the repo) and when MC-02 to MC-10 reach uat. The 24 Nov stage outage (two 500s on bulk and cancel-bulk, `dev-docs/bulk-listing/incident-24nov-backend-500.html`) most likely came from MC-06 and MC-07 landing on stage, so stage may run this branch.

### 4.2 Config endpoint response (MC-05, `src/components/marketplacev2/config/registry/dto/marketplace-config.response.ts`)

```ts
interface MarketplaceConfigChain { chainId: number; name: string; seaportAddress: string; conduitKey: string; feeBps: number; feeRecipient: string; explorerUrl: string; currency: { token: string; symbol: string; decimals: number } }
interface MarketplaceConfigCollection { chainId: number; contract: string; provider: string; standard: 'ERC721' | 'ERC1155'; itemType: 2 | 3; tlds: string[]; expires: boolean; graceDays: number; needsClaimControl: boolean }
interface MarketplaceConfigListing { minDaysBeforeExpiry: number; endBufferDays: number; durationsDays: number[]; maxBulkOrders: number }
interface MarketplaceConfigResponse { version: string; chains: MarketplaceConfigChain[]; collections: MarketplaceConfigCollection[]; listing: MarketplaceConfigListing }
```

Wrapped in the usual `Response` envelope; public and cacheable. Listing rules today: 14, 7, [7, 30, 90], 50 (`listing-rules.constants.ts`); the frontend hardcodes the same numbers in `bulkListing.ts` and should read them from here.

## 5. How the user works (memory and CLAUDE.md load automatically; the points that matter for planning)

Plan first, explain in simple words, get approval before building. Plans go in `dev-docs/<feature>/` as a review page (HTML), a plan (`.md`) with a paste ready prompt per phase, and a simple tickets explainer. Every phase later gets a detailed progress log entry with a testing log (automated vs manual), a file changes page and a flow page. New UI wording is shown as a drawn mockup page in `dev-docs/<feature>/wording/` for approval. Follow Figma (dark designs in file `hq6HmB04UFUlFiJp9f9eGv`); never drop something Figma draws. Layering rules (CLAUDE.md §8) and dark mode rules (§7) apply to all new code. Never run `next build`, `next start` or `next dev`; the user tests on `localhost:3002`. Never edit the backend repo. Never add a Claude co-author line. `CLAUDE.md` is local only, never committed. Organisation rule: write in natural prose, no hyphens, no hyphen bullets.

## 6. What the planning session should produce

1. A review of the PDF's multi chain part against today's frontend and backend (like `bulk-listing-v2-review.html`): what exists, gaps, risks, questions (numbered), and what can start now.
2. A phased plan (`dev-docs/multichain/multichain-plan.md`) with phases, files, backend dependency per phase (mock first vs blocked), the base branch decision, how it shares files with bulk listing, testing per phase, and a paste ready prompt per phase.
3. A tickets explainer in simple words (C1 to C9, ENS, rigs).
4. Drafted messages: to Guru (MC list, uat timing, config endpoint on stage), to Mohit sir (anything the PDF leaves open), to the other frontend developer if the work is split.

Open questions to raise early: who does what; base branch; Figma for chain badges, chain filter, claim control, ENS gas notes (check the Figma file before assuming there is none); which wallets and test names exist per chain (fork rigs and one low value name per collection); AppKit networks to add (Ethereum, Base, Arbitrum, BNB); Trails destination per chain; how prices show when currencies differ (decision 3 says as USD).

## 7. Starting prompt for the new session

> Read `dev-docs/multichain/multichain-session-context.md` fully, then the multi chain part of Mohit sir's requirements in `dev-docs/multichain/mohit-requirements-10nov.txt`. We are starting the **planning phase** of the multi chain marketplace (no code yet). First recheck the live state it describes (frontend branches, backend `feature/multichain_sprints`), tell me what changed since 24 Nov, then ask me the open questions in section 6 that block the plan, starting with who does which part.
