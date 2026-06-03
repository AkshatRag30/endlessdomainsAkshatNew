// ─── Mock data: Account Settings section ─────────────────────────────────────
// Mirrors:
//   GET /users                       — user profile
//   GET /users/user-multiple-wallet  — profile + all wallet addresses
//   GET /reputation/primary-domain   — active primary .og domain
//   POST /reputation/opt-in          — { isReputationOptedIn: true }
//   POST /reputation/opt-out         — { isReputationOptedIn: false }
// Replace with real API calls when integrating.

import type {
  UserProfile,
  UserWithWallets,
  PrimaryDomain,
  ReputationOptInStatus,
} from './types'

// ── GET /users ────────────────────────────────────────────────────────────────

export const MOCK_USER_PROFILE: UserProfile = {
  id:                       'usr-00000000-0000-0000-0000-000000000001',
  name:                     'Akshat',
  email:                    'frontend.dev1@endlessdomains.io',
  phoneNumber:              null,
  walletAddress:            '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  isEmailVerified:          true,
  isPhoneNumberVerified:    false,
  isRegisteredWithGoogle:   false,
  isRegisteredWithWallet:   true,
  user_hash:                null,
  telegram:                 null,
  isAffiliateUser:          false,
  role:                     'user',
  isBlocked:                false,
  createdDateTime:          '2024-01-15T10:00:00.000Z',
}

// ── GET /users/user-multiple-wallet ──────────────────────────────────────────

export const MOCK_USER_WITH_WALLETS: UserWithWallets = {
  ...MOCK_USER_PROFILE,
  walletAddresses: [
    {
      id:            'wallet-001',
      walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      network:       'EVM',
    },
    {
      id:            'wallet-002',
      walletAddress: '0x9f8e7d6c5b4a3928170f1e2d3c4b5a6970f8e7d6',
      network:       'EVM',
    },
    {
      id:            'wallet-003',
      walletAddress: 'GpMZbSjrcDsXFtCPnGvJWGvMFn3zb3mJrBpzBxTxnSsP',
      network:       'Solana',
    },
  ],
}

// ── GET /reputation/primary-domain ───────────────────────────────────────────

export const MOCK_PRIMARY_DOMAIN: PrimaryDomain = {
  primaryDomainId: 'dom-00000000-0000-0000-0000-000000000001',
  domainName:      'myname.og',
  stale:           false,
  // stale: true  →  domain was transferred away; prompt user to set a new primary domain
}

// ── Reputation opt-in status ──────────────────────────────────────────────────
// Derived from the user's session / GET /users response.
// The component uses isReputationOptedIn to show the toggle in ON or OFF state.

export const MOCK_OPT_IN_STATUS: ReputationOptInStatus = {
  isReputationOptedIn: true,
}

// ── Stale domain scenario (for testing the warning state) ─────────────────────
// Use this variant to test the "domain transferred away" warning UI.

export const MOCK_PRIMARY_DOMAIN_STALE: PrimaryDomain = {
  primaryDomainId: 'dom-00000000-0000-0000-0000-000000000001',
  domainName:      'myname.og',
  stale:           true,
}
