import type { Tier } from './types'

// ── Tier thresholds (from API Reference p.4) ──────────────────────────────────

export const TIER_THRESHOLDS: Record<Tier, { min: number; max: number; label: string; next: Tier | null }> = {
  BRONZE:   { min: 0,   max: 249,  label: 'Bronze',   next: 'SILVER'   },
  SILVER:   { min: 250, max: 499,  label: 'Silver',   next: 'GOLD'     },
  GOLD:     { min: 500, max: 749,  label: 'Gold',     next: 'PLATINUM' },
  PLATINUM: { min: 750, max: 1000, label: 'Platinum', next: null        },
}

export function getTier(score: number): Tier {
  if (score >= 750) return 'PLATINUM'
  if (score >= 500) return 'GOLD'
  if (score >= 250) return 'SILVER'
  return 'BRONZE'
}

export function getPtsToNextTier(score: number): number {
  const tier = getTier(score)
  const threshold = TIER_THRESHOLDS[tier]
  return threshold.next ? threshold.max + 1 - score : 0
}

// ── Score breakdown maximums ───────────────────────────────────────────────────

export const SCORE_MAXES = {
  evmActivityScore:  250,
  gmStreakScore:     200,
  domainCountScore:  150,
  domainTenureScore: 150,
  solanaScore:       250,
  total:            1000,
}

export const SCORE_BREAKDOWN_LABELS: Record<keyof typeof SCORE_MAXES, string> = {
  evmActivityScore:  'EVM Activity',
  gmStreakScore:     'GM Streak',
  domainCountScore:  'Domain Count',
  domainTenureScore: 'Domain Tenure',
  solanaScore:       'Solana Activity',
  total:             'Total',
}

// design-specific: bar colours for each breakdown category, matching Figma
export const SCORE_BREAKDOWN_COLORS: Record<string, string> = {
  evmActivityScore:  '#5b8ef0',
  gmStreakScore:     '#fa7217',
  domainCountScore:  '#00d97e',
  domainTenureScore: '#b366ff',
  solanaScore:       '#9457f6',
}

// ── Supported chains (from API Reference p.5–6) ───────────────────────────────

export const SUPPORTED_CHAINS = [
  { chainId: '1',     name: 'Ethereum', contractAddress: '0x0000000000000000000000000000000000000001', gasEstimate: '21000' },
  { chainId: '137',   name: 'Polygon',  contractAddress: '0x0000000000000000000000000000000000000002', gasEstimate: '21000' },
  { chainId: '42161', name: 'Arbitrum', contractAddress: '0x0000000000000000000000000000000000000003', gasEstimate: '21000' },
  { chainId: '8453',  name: 'Base',     contractAddress: '0x0000000000000000000000000000000000000004', gasEstimate: '21000' },
]

// ── Perk type labels ───────────────────────────────────────────────────────────

export const PERK_TYPE_LABELS: Record<string, string> = {
  COUPON:            'Coupon',
  PROMO_CODE:        'Promo Code',
  USDT:              'USDT',
  NFT_TOKEN:         'NFT Drop',
  WHITELIST:         'Whitelist',
  EARLY_ACCESS:      'Early Access',
  EXCLUSIVE_CONTENT: 'Exclusive Content',
}
