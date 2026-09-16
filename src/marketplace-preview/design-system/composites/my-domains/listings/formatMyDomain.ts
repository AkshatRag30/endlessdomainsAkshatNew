import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'

// Shared between MyDomainRow (list view) and MyDomainCard (grid view) —
// both render the exact same fields, just laid out differently.

export const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

export const formatRenewal = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

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
