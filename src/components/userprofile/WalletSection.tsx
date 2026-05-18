import React from 'react'
import { SectionCard } from '@/design-system/primitives/display/SectionCard'
import { WalletAddressInput } from '@/design-system/primitives/input/WalletAddressInput'
import styles from './WalletSection.module.scss'

// EVM wallet icon — Ethereum diamond SVG
const EvmWalletIcon: React.FC = () => (
  <div className={styles.walletIconWrapper} aria-hidden="true">
    {/* Replace with actual ETH icon asset at /icons/eth-diamond.svg */}
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="11" fill="#f0f0f0"/>
      <path d="M11 4l-4 7 4 2.5L15 11 11 4z" fill="#8A92B2"/>
      <path d="M11 4l4 7-4-2.5L7 11l4-7z" fill="#454A75"/>
      <path d="M11 13.5L7 11l4 7 4-7-4 2.5z" fill="#8A92B2"/>
      <path d="M11 13.5l4-2.5-4 7v-4.5z" fill="#454A75"/>
      <path d="M11 10.7L7 11l4-2.5 4 2.5-4-.3z" fill="#8A92B2"/>
    </svg>
  </div>
)

// Solana icon
const SolanaIcon: React.FC = () => (
  <div className={styles.walletIconWrapper} aria-hidden="true">
    {/* Replace with actual Solana icon asset at /icons/solana.svg */}
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="11" fill="#f0f0f0"/>
      <rect x="5" y="7" width="12" height="2" rx="1" fill="#9945FF"/>
      <rect x="5" y="10" width="12" height="2" rx="1" fill="#14F195"/>
      <rect x="5" y="13" width="12" height="2" rx="1" fill="#9945FF"/>
    </svg>
  </div>
)

export const WalletSection: React.FC = () => (
  <SectionCard title="Wallet">
    <div className={styles.wallets}>
      <div className={styles.walletCol}>
        <div className={styles.walletHeader}>
          <EvmWalletIcon />
          <span className={styles.walletLabel}>Connect With EVM Wallet</span>
        </div>
        <WalletAddressInput
          placeholder="Wallet address"
          buttonLabel="Add EVM Wallet"
          onAdd={() => {}}
        />
      </div>

      <div className={styles.walletCol}>
        <div className={styles.walletHeader}>
          <SolanaIcon />
          <span className={styles.walletLabel}>Connect With Solana</span>
        </div>
        <WalletAddressInput
          placeholder="Wallet address"
          buttonLabel="Add Solana Wallet"
          onAdd={() => {}}
        />
      </div>
    </div>
  </SectionCard>
)

export default WalletSection
