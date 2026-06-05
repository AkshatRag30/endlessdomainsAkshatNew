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

// ── Full heatmap check-in dates (89 total) ────────────────────────────────────
// Covers the heatmap range 2024-06-03 → 2025-06-04.
// Streaks are designed so streak-length drives cell colour:
//   days 1-2 → purple  |  days 3-5 → blue  |  days 6+ → gold

export const MOCK_ALL_CHECKIN_DATES: string[] = [
  // Jun 2024 — 2-day streak, then 6-day streak
  '2024-06-10', '2024-06-11',
  '2024-06-15', '2024-06-16', '2024-06-17', '2024-06-18', '2024-06-19', '2024-06-20',

  // Jul 2024 — 3-day streak
  '2024-07-02', '2024-07-03', '2024-07-04',

  // Aug 2024 — 2-day streak
  '2024-08-05', '2024-08-06',

  // Sep–Oct 2024 — longest streak: 34 consecutive days
  '2024-09-01', '2024-09-02', '2024-09-03', '2024-09-04', '2024-09-05',
  '2024-09-06', '2024-09-07', '2024-09-08', '2024-09-09', '2024-09-10',
  '2024-09-11', '2024-09-12', '2024-09-13', '2024-09-14', '2024-09-15',
  '2024-09-16', '2024-09-17', '2024-09-18', '2024-09-19', '2024-09-20',
  '2024-09-21', '2024-09-22', '2024-09-23', '2024-09-24', '2024-09-25',
  '2024-09-26', '2024-09-27', '2024-09-28', '2024-09-29', '2024-09-30',
  '2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04',

  // Oct 2024 — new 3-day streak after break
  '2024-10-12', '2024-10-13', '2024-10-14',

  // Nov 2024 — 7-day streak
  '2024-11-05', '2024-11-06', '2024-11-07', '2024-11-08',
  '2024-11-09', '2024-11-10', '2024-11-11',

  // Dec 2024 — 3-day streak, then 6-day streak
  '2024-12-02', '2024-12-03', '2024-12-04',
  '2024-12-15', '2024-12-16', '2024-12-17', '2024-12-18', '2024-12-19', '2024-12-20',

  // Jan 2025 — 4-day streak
  '2025-01-10', '2025-01-11', '2025-01-12', '2025-01-13',

  // Feb 2025 — 2-day streak
  '2025-02-01', '2025-02-02',

  // Mar 2025 — 3-day streak
  '2025-03-05', '2025-03-06', '2025-03-07',

  // Apr 2025 — 2-day streak
  '2025-04-14', '2025-04-15',

  // May–Jun 2025 — current streak: 12 consecutive days
  '2025-05-22', '2025-05-23', '2025-05-24', '2025-05-25', '2025-05-26', '2025-05-27',
  '2025-05-28', '2025-05-29', '2025-05-30', '2025-05-31',
  '2025-06-01', '2025-06-02',
]
