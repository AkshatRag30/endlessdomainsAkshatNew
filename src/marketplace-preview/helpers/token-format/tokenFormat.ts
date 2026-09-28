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

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * "12 Oct 2026" — the buying flow's "This listing expires {date}" line and
 * the receipt's "Placed 18 Sep 2026". Months are spelled out because newer
 * en-GB locale data abbreviates September as "Sept", breaking Figma's three
 * letter style.
 */
export const formatDate = (timestamp: number | string): string => {
  const date = new Date(timestamp)
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** "14:22" — 24 hour, local time (the receipt header and timeline). */
export const formatTime = (timestamp: number | string): string =>
  new Date(timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

/** "now" / "45s ago" / "9m ago" / "3h ago" / "2d ago" — same scale as LiveActivityTicker's own copy. */
export const formatRelativeTime = (iso: string): string => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 30) return 'now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/** "May 2024" / "Sep 2024" — the seller card's "Member since" line. */
export const formatMonthYear = (timestamp: number | string): string =>
  new Date(timestamp).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

/** "18 May" / "5 Sep" — chart axis ticks and comparable sale dates, where the year is implied. */
export const formatShortDate = (timestamp: number | string): string => {
  const date = new Date(timestamp)
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`
}

/**
 * "1248" / "25.3k" — the domain overview's stat figures. Figma prints small
 * counts with no separator ("1248 views"); anything from 10,000 up is
 * shortened so it still fits a 120px stat chip.
 */
export const formatStatNumber = (value: number): string => {
  if (Math.abs(value) < 10000) return String(Math.round(value))
  const thousands = value / 1000
  return `${thousands >= 100 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, '')}k`
}

/** "0x7f3a…456e8" — Figma 1:973's own truncation: 6 leading characters, 5 trailing. Shared by the buy flow and the receipt. */
export const truncateHash = (hash: string): string => `${hash.slice(0, 6)}…${hash.slice(-5)}`

// The source project reads this from its Seaport order client
// (DEFAULTS.feeBps / 10000) and splits in integer USDT minor units; this
// preview has no order client or ethers, so it keeps the same 2.5% as a
// plain float split.
export const PLATFORM_FEE_RATE = 0.025

export function computeFeeBreakdown(priceUsd: number) {
  const buyerPays = priceUsd
  const feeAmount = priceUsd * PLATFORM_FEE_RATE
  const youReceive = priceUsd - feeAmount
  return { buyerPays, feeAmount, youReceive }
}
