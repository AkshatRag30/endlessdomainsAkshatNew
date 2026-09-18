import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'

// Shared between MyDomainRow (list view) and MyDomainCard (grid view) —
// both render the exact same fields, just laid out differently.

export const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

// Figma node 72:9039 — the visible domain name is capped at 25 characters;
// the full name (plus extension) still shows in the Tooltip on hover.
export const DOMAIN_NAME_MAX_CHARS = 25

export const truncateDomainName = (name: string, max = DOMAIN_NAME_MAX_CHARS) =>
  name.length > max ? `${name.slice(0, max)}…` : name

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
