import React from 'react'
import Image from 'next/image'
import type { SellerSummary } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import KeyValueRows from '@/marketplace-preview/design-system/primitives/cards/key-value-rows'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatDate, formatMonthYear } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './SellerCard.module.scss'

export interface SellerCardProps {
  /** null when the domain isn't listed, so there's no seller to show. */
  seller: SellerSummary | null
  expiresAt: string | null
  /**
   * Opens the seller's portfolio. Listings don't carry the portfolio slug
   * yet (plan O5), so without it the button stays visually real but inert,
   * the same convention the buying flow uses for "View receipt".
   */
  onViewPortfolio?: () => void
}

/** Figma node 5:3889. */
export const SellerCard = ({ seller, expiresAt, onViewPortfolio }: SellerCardProps) => (
  <GlassCard title="Seller" titleId="domain-seller-title" className={styles.card}>
    {seller ? (
      <>
        <div className={styles.identity}>
          {/* Figma's placeholder avatar: a plain peach gradient square, no image. */}
          <span className={styles.avatar} aria-hidden="true" />
          <div className={styles.identityText}>
            <span className={styles.address}>{seller.displayAddress}</span>
            <span className={styles.meta}>
              Member since {formatMonthYear(seller.memberSince)} · {seller.activeListings} listings
            </span>
          </div>
        </div>

        <KeyValueRows
          variant="boxed"
          className={styles.rows}
          rows={[
            { label: 'Completed sales', value: seller.completedSales },
            {
              label: 'Listing expires',
              value: expiresAt ? (
                <span className={styles.expiry}>
                  <Image src="/assets/img/domain-overview/calendar.svg" alt="" aria-hidden="true" width={10.2} height={11.6} className={styles.calendar} />
                  {formatDate(expiresAt)}
                </span>
              ) : (
                '—'
              ),
            },
          ]}
        />

        <PrimaryButton variant="charcoal" onClick={onViewPortfolio} className={styles.portfolio}>
          View Portfolio
        </PrimaryButton>
      </>
    ) : (
      // Not in Figma (plan §7 item 3).
      <p className={styles.empty}>Not listed right now, so there&apos;s no seller to show.</p>
    )}
  </GlassCard>
)

export default SellerCard
