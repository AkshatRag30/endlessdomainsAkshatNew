import React from 'react'
import Image from 'next/image'
import { Input } from '@/design-system/primitives/input/Input'
import { DomainProviders } from '../DomainProviders'

import styles from './DomainHero.module.scss'

const STATS = ['Instant Availability', 'Minted to your Wallet', '10+ Integrations', 'No Renewals ever']

// design-specific: every TLD supported across all providers, grouped only for authoring —
// rendered as a single flat marquee, doubled at render time for the seamless scroll loop
const ALL_TLDS = [
  // Unstoppable Domains — 55 TLDs
  '.og', '.crypto', '.nft', '.wallet', '.blockchain', '.bitcoin', '.dao', '.zil', '.x', '.polygon',
  '.binanceus', '.bitget', '.anime', '.manga', '.clay', '.witg', '.wrkx', '.austin', '.mumu', '.bald',
  '.chomp', '.tball', '.dfz', '.secret', '.raiin', '.stepn', '.ubu', '.pudgy', '.go', '.smobler',
  '.lfg', '.pog', '.dream', '.propykeys', '.unstoppable', '.hi', '.u', '.wifi', '.metropolis', '.xmr',
  '.boomer', '.npc', '.quantum', '.emir', '.bay', '.tribe', '.doga', '.podcast', '.caw', '.onchain',
  '.donut', '.miku', '.bitscrunch', '.hub', '.brave', '.888',
  // Freename — 8 TLDs
  '.metaverse', '.hodl', '.satoshi', '.genesis', '.token', '.sat', '.airdrop', '.rwa',
  // ENS — 1 TLD
  '.eth',
  // Bonfida (Solana) — 1 TLD
  '.sol',
  // Arbitrum — 1 TLD
  '.arb',
  // Binance Smart Chain — 1 TLD
  '.bnb',
  // Tezos — 1 TLD
  '.tez',
  // Aptos — 1 TLD
  '.apt',
  // Ton — 1 TLD
  '.ton',
  // Starknet — 1 TLD
  '.stark',
  // Box — 1 TLD
  '.box',
]

// design-specific: scoped to the domain hub's own cross-TLD examples, rather than any single
// TLD's placeholder list, since this hero searches across every supported extension
const HUB_PLACEHOLDER_DOMAINS = ['explorer.og', 'metaverse.eth', 'digital.sol', 'crypto.wallet', 'identity.nft', 'onchain.dao'] as const

export function DomainHero() {
  return (
    <section className={styles.hero} aria-labelledby="domain-heading">

      {/* ── Main content ── */}
      <div className={styles.content}>

        <div className={styles.textStack}>

          {/* Background grid texture — sits only behind the label/heading/description */}
          <div className={styles.bg} aria-hidden="true">
            <div className={styles.gridLayer} />
          </div>

          {/* Top label */}
          <div className={styles.labelWrap}>
            <span className={styles.labelBracketTL} aria-hidden="true" />
            <span className={styles.labelBracketTR} aria-hidden="true" />
            <span className={styles.labelBracketBL} aria-hidden="true" />
            <span className={styles.labelBracketBR} aria-hidden="true" />
            <p className={styles.labelText}>The OS for On-Chain Identity.</p>
          </div>

          {/* Heading */}
          <h1 id="domain-heading" className={styles.heading}>
            <span className={styles.headingLine1}>Search your</span>
            <span className={styles.headingLine2}>On-Chain Identity.</span>
          </h1>

          {/* Description */}
          <p className={styles.description}>
            Find, register, and own your permanent on-chain identity across every chain that matters. One Identity. No renewals. No expiry.
          </p>
        </div>

        {/* Search bar */}
        <div className={styles.searchFrame}>
          <Input variant="hero" placeholderDomains={HUB_PLACEHOLDER_DOMAINS} />
        </div>

        {/* Stats row */}
        <div className={styles.statsFrame}>
          <Image src="/og-tld/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImgDesktop} ${styles.topLeft}`}     unoptimized />
          <Image src="/og-tld/bottomright.svg" alt="" aria-hidden="true" width={53} height={91} className={`${styles.cornerImgDesktop} ${styles.bottomRight}`} unoptimized />
          <div className={styles.statsRow} role="list">
            {STATS.map((stat, index) => (
              <div key={stat} className={styles.statItem} role="listitem">
                <span className={styles.statText}>{stat}</span>
                {index < STATS.length - 1 && <span className={styles.statDivider} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        {/* Corner marks — mobile only, below the stats row, one on each edge */}
        <div className={styles.cornerRow} aria-hidden="true">
          <Image src="/og-tld/bottomright.svg" alt="" width={24} height={41} className={`${styles.cornerImgMobile} ${styles.cornerImgMobileLeft}`}  unoptimized />
          <Image src="/og-tld/bottomright.svg" alt="" width={24} height={41} className={`${styles.cornerImgMobile} ${styles.cornerImgMobileRight}`} unoptimized />
        </div>

        {/* TLD marquee — provider marquee sits directly below it in place of the removed
            "+60 MORE" link, consolidating both into one wrap instead of two stacked sections */}
        <div className={styles.tldWrap}>
          <div className={styles.tldMarquee}>
            <ul className={styles.tldTrack}>
              {ALL_TLDS.map(chip => (
                <li key={chip} className={styles.tldChip}>{chip}</li>
              ))}
              {ALL_TLDS.map(chip => (
                <li key={`${chip}-dup`} className={styles.tldChip} aria-hidden="true">{chip}</li>
              ))}
            </ul>
            <span className={styles.tldFadeLeft} aria-hidden="true" />
            <span className={styles.tldFadeRight} aria-hidden="true" />
          </div>
          <DomainProviders />
        </div>

      </div>
    </section>
  )
}

export default DomainHero
