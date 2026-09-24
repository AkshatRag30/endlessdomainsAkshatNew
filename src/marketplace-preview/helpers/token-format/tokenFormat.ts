// Shared formatting for the listing and buying flow drawers — every screen
// in both flows shows raw token amounts with 2 decimals (e.g. "8,000.00")
// rather than formatMyDomain.ts's rounded "$1,234" table convention, since
// the token symbol is always shown separately as its own chip/suffix here.
// Moved out of composites/my-domains/listing-flow/ (buying-flow plan §3) so
// the marketplace-scoped buying flow doesn't import across page domains.

export const formatToken = (value: number): string =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatExpiry = (timestamp: number): string =>
  new Date(timestamp)
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', ',')

/** "12 Oct 2026" — the buying flow's "This listing expires {date}" line, which drops formatExpiry's time. */
export const formatDate = (timestamp: number | string): string =>
  new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const PLATFORM_FEE_RATE = 0.025

export function computeFeeBreakdown(priceUsd: number) {
  const buyerPays = priceUsd
  const feeAmount = priceUsd * PLATFORM_FEE_RATE
  const youReceive = priceUsd - feeAmount
  return { buyerPays, feeAmount, youReceive }
}
