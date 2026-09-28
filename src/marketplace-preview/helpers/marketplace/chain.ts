import type { Chain } from '@/marketplace-preview/types/marketplace'

/**
 * Figma writes the chain in lowercase short form inside meta lines ("bnb ·
 * 7 chars", "Balance … USDT on polygon"). The first word of the chain's own
 * label gives exactly that for every chain in the mock set ("BNB Chain" →
 * "bnb", "Polygon" → "polygon"). Takes anything with a chain: a listing,
 * name facts, an order's domain snapshot.
 */
export const chainShortName = (item: { chain: Chain }): string => item.chain.label.split(' ')[0].toLowerCase()
