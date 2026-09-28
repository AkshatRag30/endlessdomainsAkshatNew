import type { DomainOverviewTab } from '@/marketplace-preview/types/marketplace'

// Every link into the domain overview and order receipt pages is built here
// (domain-overview plan §4.1), so no component concatenates these URLs
// itself. When the pages leave /design-preview, only this file changes.

export const MARKETPLACE_HREF = '/design-preview/marketplace'

/** Overview is the default tab, so it has no ?tab= of its own. */
export const domainOverviewHref = (fullName: string, tab?: DomainOverviewTab): string => {
  const base = `${MARKETPLACE_HREF}/${encodeURIComponent(fullName.toLowerCase())}`
  return tab && tab !== 'overview' ? `${base}?tab=${tab}` : base
}

/** orderId without the leading '#', e.g. 'ED-2026-0918-00123'. */
export const orderReceiptHref = (orderId: string): string => `${MARKETPLACE_HREF}/orders/${encodeURIComponent(orderId)}`

export const MY_DOMAINS_HREF = '/design-preview/account/my-domains'

/** My Domains with the listing drawer opened for one name (plan §4.3). */
export const myDomainsListHref = (fullName: string): string => `${MY_DOMAINS_HREF}?list=${encodeURIComponent(fullName.toLowerCase())}`

// Block explorers by Chain.id. The mock's transaction hashes aren't real, so
// these open the explorer's "not found" page until real orders exist.
const TX_EXPLORERS: Record<string, string> = {
  polygon: 'https://polygonscan.com/tx/',
  ethereum: 'https://etherscan.io/tx/',
  arbitrum: 'https://arbiscan.io/tx/',
  bsc: 'https://bscscan.com/tx/',
  base: 'https://basescan.org/tx/',
}

/** The transaction on its chain's block explorer, or null for a chain with none mapped. */
export const txExplorerHref = (chainId: string, txHash: string): string | null =>
  TX_EXPLORERS[chainId] ? `${TX_EXPLORERS[chainId]}${txHash}` : null
