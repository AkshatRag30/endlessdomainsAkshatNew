import Image from 'next/image'
import React from 'react'
import { BsCartCheck } from 'react-icons/bs'
import { MdOutlineAddShoppingCart } from 'react-icons/md'

import PrimaryButton from '@/design-system/primitives/buttons/primary-button'
import { getProviderLabel, getProviderColor, DomainProviderKey } from '@helpers/chaincurrency/chaincurrency'
import { DomainResult } from './types'
import styles from './SearchSection.module.scss'
import { truncateMiddle } from '@/lib/string'

interface DomainCardProps extends React.Attributes {
  domain: DomainResult
  onAddToCart?: (domain: DomainResult, chain?: string) => void
}

export function DomainCardSkeleton() {
  return (
    <article className={styles.card} aria-label="Loading domain result" aria-busy="true">
      <div className={styles.cardTop}>
        <div className={styles.skeletonStack}>
          <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonLong}`} />
        </div>
      </div>

      <div className={styles.cardDivider} aria-hidden="true" />

      <div className={styles.cardMeta}>
        <div className={styles.cardMetaBlock}>
          <div className={styles.skeletonStack}>
            <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
          </div>
        </div>
        <div className={styles.cardMetaBlock}>
          <div className={styles.skeletonStack}>
            <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
            <div className={styles.skeletonProviderRow}>
              <div className={`${styles.skeletonCircle} ${styles.skeletonCircleMd}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardDivider} aria-hidden="true" />

      <div className={styles.cardBottom}>
        <div className={styles.skeletonStack}>
          <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonMedium}`} />
        </div>
        <div className={styles.skeletonBtn} />
      </div>
    </article>
  )
}

export function DomainCard({ domain, onAddToCart }: DomainCardProps) {
  const providerLabel = getProviderLabel(domain.provider as DomainProviderKey) ?? domain.provider
  const providerColor = getProviderColor(domain.provider as DomainProviderKey)

  return (
    <article className={styles.card} aria-label={`${domain.name}${domain.tld}`}>
      <div className={styles.cardTop}>
        <p className={styles.cardDomainLabel}>domain name</p>
        <div className={`${styles.cardDomainName} d-flex align-items-center gap-2`} title={`${domain.name}${domain.tld}`}>
          <span>{truncateMiddle(domain.name)}</span>
          <span
            className={styles.tldBadge}
            style={providerColor ? ({ '--tld-badge-color': providerColor } as React.CSSProperties) : undefined}
          >
            {domain.tld}
          </span>
        </div>

        {domain.status === 'available' && (
          <div className={styles.cardAvailableBadge} aria-label="Available">
            <span className={styles.cardAvailableDot} aria-hidden="true" />
            <span className={styles.cardAvailableLabel}>available</span>
          </div>
        )}
      </div>

      <div className={styles.cardDivider} aria-hidden="true" />

      <div className={styles.cardMeta}>
        <div className={styles.cardMetaBlock}>
          <p className={styles.cardMetaLabel}>Expiry</p>
          <p className={styles.cardMetaValue}>{domain.expiry ?? 'lifetime'}</p>
        </div>
        <div className={styles.cardMetaBlock}>
          <p className={styles.cardMetaLabel}>Chain / Provider</p>
          <div className={styles.cardProviderRow}>
            <div className={styles.cardProviderIcons} aria-hidden="true">
              {domain.providerIcons.map((icon, idx) => (
                <Image key={idx} src={icon} alt="" width={34} height={34} />
              ))}
            </div>
            <span className={styles.cardProviderName}>{providerLabel}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardDivider} aria-hidden="true" />

      <div className={styles.cardBottom}>
        <div>
          <p className={styles.cardPriceLabel}>price</p>
          <p className={styles.cardPriceValue}>{domain.price != null ? `$${domain.price.toLocaleString()}` : '—'}</p>
        </div>
        <PrimaryButton
          size="sm"
          icon={domain.isInCart ? <BsCartCheck /> : <MdOutlineAddShoppingCart />}
          variant={domain.isInCart ? 'transparent' : 'default'}
          iconPosition="right"
          onClick={() => onAddToCart?.(domain)}
        >
          {domain.isInCart ? 'Added' : 'Add To Cart'}
        </PrimaryButton>
      </div>
    </article>
  )
}
