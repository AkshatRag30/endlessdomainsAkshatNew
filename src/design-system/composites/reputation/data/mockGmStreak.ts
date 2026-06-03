// ─── Mock data: GM Streak & History section ───────────────────────────────────
// Mirrors:
//   GET /gm/streak
//   GET /gm/today-status
//   GET /gm/history  (paginated check-in records)
//   GET /gm/supported-chains
// Replace with real API calls when integrating.

import type {
  GmStreak,
  GmTodayStatus,
  GmHistoryResponse,
  SupportedChain,
} from './types'
import { SUPPORTED_CHAINS } from './constants'

// ── GET /gm/streak ────────────────────────────────────────────────────────────

export const MOCK_GM_STREAK: GmStreak = {
  currentStreak:   12,
  longestStreak:   34,
  totalCheckins:   89,
  lastCheckinDate: '2025-06-02',
}

// ── GET /gm/today-status ──────────────────────────────────────────────────────

export const MOCK_GM_TODAY_STATUS: GmTodayStatus = {
  checkedInToday:  false,       // banner shows when false
  currentStreak:   12,
  lastCheckinDate: '2025-06-02',
}

// ── GET /gm/supported-chains ──────────────────────────────────────────────────

export const MOCK_SUPPORTED_CHAINS: SupportedChain[] = SUPPORTED_CHAINS

// ── GET /gm/history  (page=1, limit=10) ──────────────────────────────────────
// 42 total check-ins across 5 pages.
// The heatmap (GmStreak component) is derived client-side from this history
// by mapping checkinDate values onto the 52-week calendar grid.

export const MOCK_GM_HISTORY: GmHistoryResponse = {
  result: [
    {
      id: 'cki-001',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '137',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      checkinDate: '2025-06-02',
      createdDateTime: '2025-06-02T06:14:33.000Z',
    },
    {
      id: 'cki-002',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '137',
      txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      checkinDate: '2025-06-01',
      createdDateTime: '2025-06-01T07:02:11.000Z',
    },
    {
      id: 'cki-003',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '8453',
      txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      checkinDate: '2025-05-31',
      createdDateTime: '2025-05-31T08:45:50.000Z',
    },
    {
      id: 'cki-004',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '137',
      txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
      checkinDate: '2025-05-30',
      createdDateTime: '2025-05-30T09:18:22.000Z',
    },
    {
      id: 'cki-005',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '1',
      txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      checkinDate: '2025-05-29',
      createdDateTime: '2025-05-29T06:55:08.000Z',
    },
    {
      id: 'cki-006',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '42161',
      txHash: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      checkinDate: '2025-05-28',
      createdDateTime: '2025-05-28T07:30:15.000Z',
    },
    {
      id: 'cki-007',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '137',
      txHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      checkinDate: '2025-05-27',
      createdDateTime: '2025-05-27T08:12:44.000Z',
    },
    {
      id: 'cki-008',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '8453',
      txHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
      checkinDate: '2025-05-26',
      createdDateTime: '2025-05-26T10:05:33.000Z',
    },
    {
      id: 'cki-009',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '137',
      txHash: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      checkinDate: '2025-05-25',
      createdDateTime: '2025-05-25T07:44:19.000Z',
    },
    {
      id: 'cki-010',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: '1',
      txHash: '0xad0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
      checkinDate: '2025-05-21',
      createdDateTime: '2025-05-21T06:30:55.000Z',
    },
  ],
  paginationInfo: {
    total: 89,
    page: 1,
    nextPage: 2,
    prevPage: null,
    lastPage: 9,
  },
}

// ── Heatmap data helper ───────────────────────────────────────────────────────
// Converts the paginated check-in records into a Set of date strings for O(1)
// lookups when rendering the 52-week calendar grid.
// Usage:  const checkedInDates = buildCheckinDateSet(allHistoryRecords)

export function buildCheckinDateSet(records: GmHistoryResponse['result']): Set<string> {
  return new Set(records.map(r => r.checkinDate))
}
