import React, { useCallback, useState } from 'react'

import { DomainItem } from './types'
import styles from './DomainCardList.module.scss'

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

interface DomainCardListProps {
  domain: DomainItem
  onManage: (id: string) => void
}

export function DomainCardList({ domain, onManage }: DomainCardListProps) {
  const expiryStatus = getExpiryStatus(domain.expiryDate)
  const chainLabel = CHAIN_LABELS[domain.chain] ?? domain.chain
  const providerLabel = PROVIDER_LABELS[domain.status] ?? domain.status

  const handleManage = useCallback(() => onManage(domain.id), [onManage, domain.id])

  return (
    <article className={styles.row} aria-label={`${domain.name}${domain.tld}`}>
      <div className={styles.cellName}>
        <span className={styles.name} title={`${domain.name}${domain.tld}`}>
          {domain.name}
        </span>
        <span className={styles.tldBadge}>{domain.tld}</span>
      </div>

      <div className={styles.cell}>
        <DomainIcon src={CHAIN_LOGOS[domain.chain]} alt="" className={styles.iconImg} />
        <span className={styles.cellText}>{chainLabel}</span>
      </div>

      <div className={styles.cell}>
        <DomainIcon src={PROVIDER_LOGOS[domain.status]} alt="" className={styles.iconImg} />
        <span className={styles.cellText}>{providerLabel}</span>
      </div>

      <div className={styles.cellExpiry}>
        <span
          className={[styles.expiryDot, styles[`dot_${expiryStatus}`]].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
        <span className={styles.cellText}>{domain.expiryDate}</span>
      </div>

      <div className={styles.cellAction}>
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
  )
}
