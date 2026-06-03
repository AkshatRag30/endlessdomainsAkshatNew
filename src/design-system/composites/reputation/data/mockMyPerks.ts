// ─── Mock data: My Perks section ─────────────────────────────────────────────
// Mirrors:
//   GET /perks             — catalog (unlocked + locked)
//   GET /perks/my-claims   — what the user has already claimed
//   POST /perks/:id/claim  — claim response shape
// Replace with real API calls when integrating.

import type { PerkCatalogResponse, MyClaimsResponse } from './types'

// ── GET /perks/my-claims  (page=1, limit=10) ─────────────────────────────────
// These are the perks the user has already claimed and can use.
// Shown in the My Perks tab grid.

export const MOCK_MY_CLAIMS: MyClaimsResponse = {
  result: [
    {
      id: 'claim-001',
      perk: { id: 'perk-001', title: '20% Off Store', perkType: 'PROMO_CODE' },
      perkValue: 'SAVE20NOW',
      claimedAt: '2025-04-20T10:30:00.000Z',
    },
    {
      id: 'claim-002',
      perk: { id: 'perk-002', title: 'Early Access Beta', perkType: 'EARLY_ACCESS' },
      perkValue: 'https://beta.protocolxyz.io/early-access?token=abc123',
      claimedAt: '2025-04-20T11:15:00.000Z',
    },
    {
      id: 'claim-003',
      perk: { id: 'perk-003', title: 'Whitelist Spot', perkType: 'WHITELIST' },
      perkValue: 'WL-ENDLESS-2025-XYZ',
      claimedAt: '2025-04-18T09:00:00.000Z',
    },
    {
      id: 'claim-004',
      perk: { id: 'perk-004', title: 'Whitelist Spot', perkType: 'WHITELIST' },
      perkValue: 'WL-CHAIN-2025-ABC',
      claimedAt: '2025-04-15T14:20:00.000Z',
    },
    {
      id: 'claim-005',
      perk: { id: 'perk-005', title: '20% Off Store', perkType: 'PROMO_CODE' },
      perkValue: 'ENDLESS20',
      claimedAt: '2025-04-10T08:45:00.000Z',
    },
    {
      id: 'claim-006',
      perk: { id: 'perk-006', title: 'Early Access Beta', perkType: 'EARLY_ACCESS' },
      perkValue: 'https://beta.protocolxyz.io/early-access?token=def456',
      claimedAt: '2025-04-08T16:30:00.000Z',
    },
  ],
  paginationInfo: {
    total: 6,
    page: 1,
    nextPage: null,
    prevPage: null,
    lastPage: 1,
  },
}

// ── GET /perks  — full catalog (page=1, limit=12) ─────────────────────────────
// Mix of unlocked (user score is sufficient) and locked perks.
// isUnlocked drives whether the claim button is active.
// pointsNeeded > 0 shows how many more points are needed to unlock.

export const MOCK_PERKS_CATALOG: PerkCatalogResponse = {
  result: [
    // ── Unlocked perks (user score 312, SILVER tier) ──────────────────────────
    {
      id: 'perk-001',
      title: '20% Off Store',
      description: 'Get 20% off your next purchase at our partner store. Valid on all .og domain renewals and new registrations.',
      partnerName: 'PartnerCo',
      partnerLogo: '/perks/partner-co-logo.svg',
      perkType: 'PROMO_CODE',
      tierRequired: 'SILVER',
      minReputationScore: 250,
      totalSupply: 500,
      remainingSupply: 312,
      startDate: '2025-04-01',
      expiryDate: '2025-12-31',
      imageUrl: '/perks/perk-discount.svg',
      termsConditions: 'Valid for one use per account. Cannot be combined with other offers.',
      isUnlocked: true,
      pointsNeeded: 0,
      isClaimed: false,
    },
    {
      id: 'perk-002',
      title: 'Early Access Beta',
      description: 'Get early access to our new protocol before public launch. Limited spots available.',
      partnerName: 'ProtocolXYZ',
      partnerLogo: '/perks/protocol-xyz-logo.svg',
      perkType: 'EARLY_ACCESS',
      tierRequired: 'SILVER',
      minReputationScore: 250,
      totalSupply: 200,
      remainingSupply: 87,
      startDate: '2025-04-01',
      expiryDate: '2025-09-30',
      imageUrl: '/perks/perk-beta.svg',
      termsConditions: 'One access link per account. Non-transferable.',
      isUnlocked: true,
      pointsNeeded: 0,
      isClaimed: false,
    },
    {
      id: 'perk-003',
      title: 'Whitelist Spot',
      description: 'Secure your spot on the exclusive whitelist for the upcoming NFT drop by ChainDAO.',
      partnerName: 'ChainDAO',
      partnerLogo: '/perks/chain-dao-logo.svg',
      perkType: 'WHITELIST',
      tierRequired: 'SILVER',
      minReputationScore: 250,
      totalSupply: 1000,
      remainingSupply: 643,
      startDate: '2025-03-15',
      expiryDate: '2025-08-31',
      imageUrl: '/perks/perk-whitelist.svg',
      termsConditions: 'Whitelist spot reserves your mint access but does not guarantee a mint.',
      isUnlocked: true,
      pointsNeeded: 0,
      isClaimed: true,      // already claimed
    },
    {
      id: 'perk-007',
      title: '10 USDT Reward',
      description: 'Receive 10 USDT directly to your wallet as a reward for your reputation milestones.',
      partnerName: 'Endless Domains',
      partnerLogo: '/perks/endless-logo.svg',
      perkType: 'USDT',
      tierRequired: 'SILVER',
      minReputationScore: 300,
      totalSupply: 100,
      remainingSupply: 42,
      startDate: '2025-05-01',
      expiryDate: '2025-07-31',
      imageUrl: '/perks/perk-usdt.svg',
      termsConditions: 'Payout processed within 7 business days after claim. Requires wallet address.',
      isUnlocked: true,
      pointsNeeded: 0,
      isClaimed: false,
    },
    {
      id: 'perk-008',
      title: 'OG NFT Drop',
      description: 'Exclusive NFT airdrop for Silver and above holders. A commemorative on-chain collectible.',
      partnerName: 'Endless Domains',
      partnerLogo: '/perks/endless-logo.svg',
      perkType: 'NFT_TOKEN',
      tierRequired: 'SILVER',
      minReputationScore: 250,
      totalSupply: 2000,
      remainingSupply: 1204,
      startDate: '2025-06-01',
      expiryDate: '2025-12-31',
      imageUrl: '/perks/perk-nft.svg',
      termsConditions: 'NFT will be minted to your primary wallet address. One per account.',
      isUnlocked: true,
      pointsNeeded: 0,
      isClaimed: false,
    },
    // ── Locked perks (need more points) ──────────────────────────────────────
    {
      id: 'perk-004',
      title: 'Gold Partner Deal',
      description: 'Exclusive Gold-tier partner offer: 50% off premium tools for the next 6 months.',
      partnerName: 'DevTools Pro',
      partnerLogo: '/perks/dev-tools-logo.svg',
      perkType: 'COUPON',
      tierRequired: 'GOLD',
      minReputationScore: 500,
      totalSupply: 150,
      remainingSupply: 119,
      startDate: '2025-05-01',
      expiryDate: '2025-12-31',
      imageUrl: '/perks/perk-gold.svg',
      termsConditions: 'Valid for new subscriptions only.',
      isUnlocked: false,
      pointsNeeded: 188,    // user needs 312+188=500 to unlock
      isClaimed: false,
    },
    {
      id: 'perk-005',
      title: 'Platinum VIP Access',
      description: 'Exclusive VIP lounge access and priority support for Platinum holders.',
      partnerName: 'Endless Domains',
      partnerLogo: '/perks/endless-logo.svg',
      perkType: 'EXCLUSIVE_CONTENT',
      tierRequired: 'PLATINUM',
      minReputationScore: 750,
      totalSupply: 50,
      remainingSupply: 38,
      startDate: '2025-06-01',
      expiryDate: '2026-06-01',
      imageUrl: '/perks/perk-platinum.svg',
      termsConditions: 'For Platinum tier holders only. Non-transferable.',
      isUnlocked: false,
      pointsNeeded: 438,    // user needs 750-312=438 more
      isClaimed: false,
    },
    {
      id: 'perk-006',
      title: '100 USDT Jackpot',
      description: 'Top PLATINUM holders receive 100 USDT monthly rewards. Claim your spot.',
      partnerName: 'Endless Domains',
      partnerLogo: '/perks/endless-logo.svg',
      perkType: 'USDT',
      tierRequired: 'PLATINUM',
      minReputationScore: 750,
      totalSupply: 20,
      remainingSupply: 14,
      startDate: '2025-06-01',
      expiryDate: '2025-12-31',
      imageUrl: '/perks/perk-jackpot.svg',
      termsConditions: 'Monthly distribution. One claim per distribution cycle.',
      isUnlocked: false,
      pointsNeeded: 438,
      isClaimed: false,
    },
  ],
  paginationInfo: {
    total: 7,
    page: 1,
    nextPage: null,
    prevPage: null,
    lastPage: 1,
  },
}
