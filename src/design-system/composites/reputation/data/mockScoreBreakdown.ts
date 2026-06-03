// ─── Mock data: Score & Breakdown section ────────────────────────────────────
// Mirrors GET /reputation/score/me  and  GET /reputation/score/me/history
// Replace with real API calls when integrating.

import type { ReputationScore, ScoreHistoryResponse } from './types'

// ── GET /reputation/score/me ──────────────────────────────────────────────────

export const MOCK_REPUTATION_SCORE: ReputationScore = {
  primaryDomainName: 'myname.og',
  totalScore: 312,
  tier: 'SILVER',
  breakdown: {
    evmActivityScore:  120,   // max 250
    gmStreakScore:     80,    // max 200
    domainCountScore:  75,    // max 150
    domainTenureScore: 37,    // max 150
    solanaScore:       0,     // max 250 — always 0 at launch
  },
  connectedWalletCount: 3,
  lastCalculatedAt: '2025-06-01T08:00:00.000Z',
}

// ── GET /reputation/score/me/history  (page=1, limit=90) ─────────────────────
// 90 daily data points — used for the score history line chart.
// The two series shown in the Figma ("Impressions" = raw activity, "Click" = score)
// map here as activity (secondary) and totalScore (primary).

const BASE_DATE = new Date('2025-03-04')

function isoDate(daysAgo: number): string {
  const d = new Date(BASE_DATE)
  d.setDate(d.getDate() + daysAgo)
  return d.toISOString()
}

// 90 score data points — realistic upward trend with fluctuation
const SCORE_SERIES = [
  148, 152, 155, 151, 158, 163, 160, 168, 172, 175,
  171, 178, 183, 187, 184, 190, 195, 198, 194, 200,
  205, 208, 204, 210, 215, 218, 212, 220, 225, 228,
  224, 230, 235, 238, 234, 241, 246, 250, 255, 258,
  254, 260, 265, 268, 264, 270, 275, 278, 274, 280,
  285, 288, 285, 291, 296, 299, 295, 300, 305, 308,
  304, 310, 312, 308, 312, 312, 310, 312, 312, 312,
  312, 308, 310, 312, 310, 312, 310, 308, 310, 312,
  312, 310, 312, 312, 310, 312, 310, 312, 312, 312,
]

export const MOCK_SCORE_HISTORY: ScoreHistoryResponse = {
  result: SCORE_SERIES.map((score, i) => ({
    totalScore: score,
    tier: score >= 750 ? 'PLATINUM' : score >= 500 ? 'GOLD' : score >= 250 ? 'SILVER' : 'BRONZE',
    calculatedAt: isoDate(i),
  })),
  paginationInfo: {
    total: 90,
    page: 1,
    nextPage: null,
    prevPage: null,
    lastPage: 1,
  },
}
