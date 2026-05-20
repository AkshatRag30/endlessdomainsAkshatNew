import React, { useCallback, useState } from 'react'

import { DomainItem } from './types'
import styles from './DomainCardGrid.module.scss'

const CHAIN_LOGOS: Record<string, string> = {
  polygon:  '/domain/ethereum.svg',
  ethereum: '/domain/ethereum.svg',
  solana:   '/domain/sol.png',
  tezos:    '/domain/tezos.svg',
  aptos:    '/domain/apt.svg',
}

const PROVIDER_LOGOS: Record<string, string> = {
  unstoppable: '/domain/ud.svg',
  ens:         '/domain/ethereum.svg',
  arbitrum:    '/domain/arb.svg',
  bonfida:     '/domain/bonnfida.svg',
  tezos:       '/domain/tezos.svg',
  aptos:       '/domain/apt.svg',
}

const CHAIN_LABELS: Record<string, string> = {
  polygon:  'Polygon',
  ethereum: 'Ethereum',
  solana:   'Solana',
  tezos:    'Tezos',
  aptos:    'Aptos',
}

const PROVIDER_LABELS: Record<string, string> = {
  unstoppable: 'Unstoppable',
  ens:         'ENS',
  arbitrum:    'Arbitrum',
  bonfida:     'Bonfida',
  tezos:       'Tezos',
  aptos:       'Aptos',
}

function DomainIcon({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) return <span className={`${styles.iconFallback} ${className}`} aria-hidden="true" />
  return <img src={src} alt={alt} className={className} onError={() => setBroken(true)} aria-hidden="true" />
}

function getExpiryStatus(expiryDate: string): 'lifetime' | 'expiring' | 'active' {
  if (expiryDate === 'lifetime') return 'lifetime'
  const daysLeft = (new Date(expiryDate).getTime() - Date.now()) / 86_400_000
  return daysLeft <= 60 ? 'expiring' : 'active'
}

interface DomainCardGridProps {
  domain: DomainItem
  onManage: (id: string) => void
}

export function DomainCardGrid({ domain, onManage }: DomainCardGridProps) {
  const expiryStatus = getExpiryStatus(domain.expiryDate)
  const chainLabel = CHAIN_LABELS[domain.chain] ?? domain.chain
  const providerLabel = PROVIDER_LABELS[domain.status] ?? domain.status

  const handleManage = useCallback(() => onManage(domain.id), [onManage, domain.id])

  const displayName = domain.name.length > 22 ? `${domain.name.slice(0, 20)}…` : domain.name

  return (
    <div className={styles.cardOuter}>
    <div className={styles.cardWrap}>
    <article className={styles.card} aria-label={`${domain.name}${domain.tld}`}>
      <div className={styles.cardTop}>
        <div className={styles.cardDomainName} title={`${domain.name}${domain.tld}`}>
          <span className={styles.nameText}>{displayName}</span>
          <span className={styles.tldBadge}>{domain.tld}</span>
        </div>
      </div>

      <div className={styles.cardDivider} aria-hidden="true" />

      <div className={styles.cardMeta}>
        <div className={styles.cardMetaBlock}>
          <DomainIcon src={CHAIN_LOGOS[domain.chain]} alt="" className={styles.chainImg} />
          <span className={styles.cardMetaText}>{chainLabel}</span>
        </div>
        <div className={styles.cardMetaBlock}>
          <DomainIcon src={PROVIDER_LOGOS[domain.status]} alt="" className={styles.providerImg} />
          <span className={styles.cardMetaText}>{providerLabel}</span>
        </div>
      </div>

      <div className={styles.cardDivider} aria-hidden="true" />

      <div className={styles.cardBottom}>
        <div className={styles.expiryRow}>
          <span
            className={[styles.expiryDot, styles[`dot_${expiryStatus}`]].filter(Boolean).join(' ')}
            aria-hidden="true"
          />
          <span className={styles.cardBottomText}>{domain.expiryDate}</span>
        </div>
        <button
          className={styles.manageBtn}
          type="button"
          onClick={handleManage}
          aria-label={`Manage ${domain.name}${domain.tld}`}
        >
          <span className={styles.labelWrapper}>
            <span className={styles.labelUp}>Manage</span>
            <span className={styles.labelUp}>Manage</span>
          </span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </article>
    </div>
    </div>
  )
}
