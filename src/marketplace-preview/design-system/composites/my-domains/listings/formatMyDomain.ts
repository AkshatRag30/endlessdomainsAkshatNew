import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'

// Shared between MyDomainRow (list view) and MyDomainCard (grid view) —
// both render the exact same fields, just laid out differently.

export const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

// null means the domain never expires (the API returns `expiryDate: null`
// for those) — shown as "Lifetime" rather than a bogus epoch date.
export const formatRenewal = (timestamp: number | null) => {
  if (timestamp === null) return 'Lifetime'
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

export const TREND_DIRECTION: Record<MyDomainListing['appraisedTrend'], 'up' | 'down' | 'neutral'> = {
  high: 'up',
  low: 'down',
  neutral: 'neutral',
}

export const TREND_LABEL: Record<MyDomainListing['appraisedTrend'], string> = {
  high: 'High',
  low: 'Low',
  neutral: 'Steady',
}

export const STATUS_BADGE_LABEL: Record<MyDomainListing['status'], string> = {
  'for-sale': 'For sale',
  'not-listed': 'Not Listed',
  sold: 'Sold',
  'expiring-soon': 'Expiring soon',
  expired: 'Expired',
}
