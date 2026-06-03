// ─── Reputation, GM & Perks — TypeScript interfaces matching the API Reference ──
// Base URL: /api/v1   Envelope: { success, statusCode, message, result }

// ── Shared ────────────────────────────────────────────────────────────────────

export interface PaginationInfo {
  total: number
  page: number
  nextPage: number | null
  prevPage: number | null
  lastPage: number
}

export type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'

export type PerkType =
  | 'COUPON'
  | 'PROMO_CODE'
  | 'USDT'
  | 'NFT_TOKEN'
  | 'WHITELIST'
  | 'EARLY_ACCESS'
  | 'EXCLUSIVE_CONTENT'

// ── Account Settings ──────────────────────────────────────────────────────────
// GET /users

export interface UserProfile {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  walletAddress: string | null
  isEmailVerified: boolean
  isPhoneNumberVerified: boolean
  isRegisteredWithGoogle: boolean
  isRegisteredWithWallet: boolean
  user_hash: string | null
  telegram: string | null
  isAffiliateUser: boolean
  role: string
  isBlocked: boolean
  createdDateTime: string
}

// GET /users/user-multiple-wallet — UserProfile plus:
export interface WalletEntry {
  id: string
  walletAddress: string
  network: string
}

export interface UserWithWallets extends UserProfile {
  walletAddresses: WalletEntry[]
}

// PUT /users — request body (all optional)
export interface UpdateUserBody {
  name?: string
  email?: string
  phoneNumber?: string
  telegram?: string
  user_hash?: string
  isEmailVerified?: boolean
}

// GET /reputation/primary-domain  /  POST /reputation/primary-domain
export interface PrimaryDomain {
  primaryDomainId: string
  domainName: string
  stale?: boolean          // true = domain transferred away; prompt user to set new one
}

// POST /reputation/opt-in | opt-out
export interface ReputationOptInStatus {
  isReputationOptedIn: boolean
}

// ── Score & Breakdown ─────────────────────────────────────────────────────────
// GET /reputation/score/me

export interface ScoreBreakdownDetail {
  evmActivityScore: number       // 0–250
  gmStreakScore: number           // 0–200
  domainCountScore: number        // 0–150
  domainTenureScore: number       // 0–150
  solanaScore: number             // 0–250 (always 0 at launch)
}

export interface ReputationScore {
  primaryDomainName: string
  totalScore: number              // 0–1000
  tier: Tier
  breakdown: ScoreBreakdownDetail
  connectedWalletCount: number
  lastCalculatedAt: string        // ISO date
}

// GET /reputation/score/me/history — paginated
export interface ScoreHistoryItem {
  totalScore: number
  tier: Tier
  calculatedAt: string            // ISO date
}

export interface ScoreHistoryResponse {
  result: ScoreHistoryItem[]
  paginationInfo: PaginationInfo
}

// GET /reputation/leaderboard
export interface LeaderboardEntry {
  rank: number
  primaryDomainName: string
  totalScore: number
  tier: Tier
}

// GET /reputation/top500/verify
export interface Top500Status {
  isTop_500: boolean
}

// ── GM Check-ins ──────────────────────────────────────────────────────────────
// GET /gm/supported-chains

export interface SupportedChain {
  chainId: string
  name: string
  contractAddress: string
  gasEstimate: string
}

// GET /gm/today-status
export interface GmTodayStatus {
  checkedInToday: boolean
  currentStreak: number
  lastCheckinDate: string         // YYYY-MM-DD
}

// GET /gm/streak
export interface GmStreak {
  currentStreak: number
  longestStreak: number
  totalCheckins: number
  lastCheckinDate: string         // YYYY-MM-DD
}

// POST /gm/checkin — response
export interface GmCheckinResponse {
  checkinId: string
  currentStreak: number
  longestStreak: number
  totalCheckins: number
}

// GET /gm/history — paginated
export interface GmCheckinRecord {
  id: string
  walletAddress: string
  chainId: string
  txHash: string
  checkinDate: string             // YYYY-MM-DD
  createdDateTime: string         // ISO date
}

export interface GmHistoryResponse {
  result: GmCheckinRecord[]
  paginationInfo: PaginationInfo
}

// ── Perks ─────────────────────────────────────────────────────────────────────
// GET /perks — catalog item

export interface PerkCatalogItem {
  id: string
  title: string
  description: string
  partnerName: string
  partnerLogo: string             // URL
  perkType: PerkType
  tierRequired: Tier
  minReputationScore: number
  totalSupply: number
  remainingSupply: number
  startDate: string               // YYYY-MM-DD
  expiryDate: string              // YYYY-MM-DD
  imageUrl: string                // URL
  termsConditions: string
  isUnlocked: boolean             // false when unauthenticated
  pointsNeeded: number            // 0 if already unlocked
  isClaimed: boolean
}

export interface PerkCatalogResponse {
  result: PerkCatalogItem[]
  paginationInfo: PaginationInfo
}

// GET /perks/my-claims
export interface PerkClaimRecord {
  id: string
  perk: {
    id: string
    title: string
    perkType: PerkType
  }
  perkValue: string               // code / URL revealed on claim
  claimedAt: string               // ISO date
}

export interface MyClaimsResponse {
  result: PerkClaimRecord[]
  paginationInfo: PaginationInfo
}

// POST /perks/:id/claim — response
export interface ClaimPerkResponse {
  claimId: string
  perkValue: string
  claimedAt: string
}

// POST /perks/:id/claim — request body
export interface ClaimPerkBody {
  perkValueSnapshot?: string      // optional for non-PROMO_CODE/COUPON/USDT
  walletAddress?: string          // required for USDT
  network?: 'ERC20' | 'TRC20' | 'BEP20'  // required for USDT
}
