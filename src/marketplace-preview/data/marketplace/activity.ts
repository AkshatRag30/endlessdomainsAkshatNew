import { ActivityFeedItem, TickerItem } from '@/marketplace-preview/types/marketplace'

/** STATIC MOCK DATA — no market-wide activity endpoint exists yet, see src/types/marketplace/activity.ts. */

export const mockActivity: ActivityFeedItem[] = [
  { id: 'act-1', actorAddress: '0xdead...beef', action: 'bought', itemLabel: 'cryptowave.ud', priceUsd: 1850, occurredAt: new Date().toISOString() },
  { id: 'act-2', actorAddress: '0x7a3f...c19d', action: 'listed', itemLabel: 'novacore.ud', priceUsd: 2400, occurredAt: new Date(Date.now() - 45_000).toISOString() },
  { id: 'act-3', actorAddress: '0x4b2e...91aa', action: 'bought', itemLabel: 'aetherlink.ud', priceUsd: 3120, occurredAt: new Date(Date.now() - 90_000).toISOString() },
  { id: 'act-4', actorAddress: '0x9f10...e422', action: 'dropped', itemLabel: 'obsidian.ud', priceUsd: 980, occurredAt: new Date(Date.now() - 150_000).toISOString() },
  { id: 'act-5', actorAddress: '0xc65a...0187', action: 'bought', itemLabel: 'quantumleap.ud', priceUsd: 1850, occurredAt: new Date(Date.now() - 210_000).toISOString() },
  { id: 'act-6', actorAddress: '0x2d88...ff3c', action: 'listed', itemLabel: 'stellarhash.ud', priceUsd: 2760, occurredAt: new Date(Date.now() - 300_000).toISOString() },
  { id: 'act-7', actorAddress: '0xdead...beef', action: 'bought', itemLabel: 'echobyte.ud', priceUsd: 1850, occurredAt: new Date(Date.now() - 360_000).toISOString() },
  { id: 'act-8', actorAddress: '0x115c...7be9', action: 'bought', itemLabel: 'lunarforge.ud', priceUsd: 2100, occurredAt: new Date(Date.now() - 420_000).toISOString() },
]

/** Figma-exact values from node 34:2031 (domain, price, change%, age). */
const MINUTE = 60_000
const HOUR = 60 * MINUTE
// action isn't in the Figma export (it only shows price movement) — spread
// across bought/listed/dropped so the All/Sale/Listing/Drop dropdown has
// something real to filter, same three values LiveActivityPanel uses.
export const mockTickerItems: TickerItem[] = [
  { id: 'tick-1', domain: 'swap.crypto', priceUsd: 8200, changePercent: -5, action: 'bought', occurredAt: new Date(Date.now() - 6 * MINUTE).toISOString() },
  { id: 'tick-2', domain: 'zero.eth', priceUsd: 14500, changePercent: -9, action: 'listed', occurredAt: new Date(Date.now() - 18 * MINUTE).toISOString() },
  { id: 'tick-3', domain: '444.bnb', priceUsd: 5100, changePercent: 14, action: 'bought', occurredAt: new Date(Date.now() - 41 * MINUTE).toISOString() },
  { id: 'tick-4', domain: 'ape.nft', priceUsd: 11200, changePercent: 16, action: 'dropped', occurredAt: new Date(Date.now() - 2 * HOUR).toISOString() },
  { id: 'tick-5', domain: 'one.polygon', priceUsd: 23000, changePercent: -5, action: 'bought', occurredAt: new Date(Date.now() - 3 * HOUR).toISOString() },
  { id: 'tick-6', domain: 'hodl.crypto', priceUsd: 4300, changePercent: 1, action: 'listed', occurredAt: new Date(Date.now() - 4 * HOUR).toISOString() },
  { id: 'tick-7', domain: 'chain.blockchain', priceUsd: 3100, changePercent: 0, action: 'bought', occurredAt: new Date(Date.now() - 5 * HOUR).toISOString() },
  { id: 'tick-8', domain: 'dex.wallet', priceUsd: 6600, changePercent: 6, action: 'dropped', occurredAt: new Date(Date.now() - 7 * HOUR).toISOString() },
  { id: 'tick-9', domain: 'stake.dao', priceUsd: 2750, changePercent: -8, action: 'listed', occurredAt: new Date(Date.now() - 9 * HOUR).toISOString() },
  { id: 'tick-10', domain: 'ape.x', priceUsd: 9400, changePercent: -4, action: 'bought', occurredAt: new Date(Date.now() - 11 * HOUR).toISOString() },
]
