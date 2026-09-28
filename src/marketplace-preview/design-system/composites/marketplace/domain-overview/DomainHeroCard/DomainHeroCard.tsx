import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiHeart } from 'react-icons/fi'
import type { DomainOverview } from '@/marketplace-preview/types/marketplace'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatDate, formatToken, PLATFORM_FEE_RATE } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import { orderReceiptHref } from '@/marketplace-preview/helpers/marketplace/routes'
import { chainShortName } from '@/marketplace-preview/helpers/marketplace/chain'
import styles from './DomainHeroCard.module.scss'

export interface DomainHeroCardProps {
  overview: DomainOverview
  favorited: boolean
  onToggleFavorite: () => void
  /** Opens BuyFlowModal for overview.listing. Only called while the domain is listed. */
  onBuyNow: () => void
}

/**
 * Figma node 5:3587 (desktop) / 5:4199 (mobile). Everything comes from the
 * overview view model; nothing here is specific to the banking.ud fixture.
 *
 * Not in Figma (plan §7 items 3/4): with no active listing the price block
 * and Buy Now give way to a "Not listed for sale" / "Sold {date}" line. The
 * heart stays, so a visitor can still watch the name.
 */
export const DomainHeroCard = ({ overview, favorited, onToggleFavorite, onBuyNow }: DomainHeroCardProps) => {
  const { facts, listing, status, soldAt, viewerOrderId } = overview
  const feePercent = `${(PLATFORM_FEE_RATE * 100).toFixed(1).replace(/\.0$/, '')}%`

  const heart = (
    <button
      type="button"
      className={styles.favorite}
      aria-pressed={favorited}
      aria-label={favorited ? 'Remove from watchlist' : 'Add to watchlist'}
      onClick={onToggleFavorite}
    >
      {/* Same FiHeart as every listing row/card's watchlist toggle (Figma's own glyph has no filled state). */}
      <FiHeart size={14} aria-hidden="true" className={favorited ? styles.favoriteIconActive : styles.favoriteIcon} />
    </button>
  )

  return (
    <section className={styles.card} aria-label={`${facts.fullName} overview`}>
      <div className={styles.identity}>
        <div className={styles.domainHeader}>
          <DomainAvatar extension={facts.extension} className={styles.avatar} />
          <div className={styles.domainText}>
            <div className={styles.nameRow}>
              <h1 className={styles.domainName}>{facts.label}</h1>
              <ExtensionBadge extension={facts.extension} className={styles.extension} />
            </div>
            <div className={styles.metaRow}>
              <Image src={facts.chain.iconSrc} alt="" aria-hidden="true" width={12} height={12} className={styles.chainIcon} />
              {/* Figma quirk (plan §2.7 Q1/Q2): this line reads "bnb · 7 chars"
                  while the frame's "What this name is" card says polygon and
                  10 characters. Both read facts here, so they always agree. */}
              <span className={styles.meta}>
                {chainShortName(facts)} · {facts.characterCount} chars
                {facts.renewal === 'one-time' && ' · one time · no renewal'}
              </span>
            </div>
          </div>
        </div>

        {status === 'listed' && (
          <div className={styles.note}>
            <Image src="/assets/img/domain-overview/shield.svg" alt="" aria-hidden="true" width={14} height={14} className={styles.noteIcon} />
            <p className={styles.noteText}>
              Payment and transfer happen in one transaction. Nobody holds your funds in between, and the {feePercent} fee comes out of the
              seller&apos;s proceeds.
            </p>
          </div>
        )}
      </div>

      <div className={styles.purchase}>
        {listing && status === 'listed' ? (
          <>
            <div className={styles.priceBlock}>
              <span className={styles.priceLabel}>Price</span>
              <div className={styles.priceStack}>
                <span className={styles.priceAmount}>{formatToken(listing.priceUsd)}</span>
                <TokenSuffix iconSize={15} iconFirst className={styles.priceSymbol} />
              </div>
            </div>
            <div className={styles.actions}>
              <PrimaryButton onClick={onBuyNow} className={styles.buyNow}>
                Buy Now
              </PrimaryButton>
              {heart}
            </div>
          </>
        ) : (
          <div className={styles.unavailable}>
            <span className={styles.unavailableText}>
              {status === 'sold' && soldAt ? `Sold ${formatDate(soldAt)}` : 'Not listed for sale'}
              {/* The viewer bought it themselves (plan §7 item 4). */}
              {viewerOrderId && (
                <Link href={orderReceiptHref(viewerOrderId)} className={styles.receiptLink}>
                  View receipt
                </Link>
              )}
            </span>
            {heart}
          </div>
        )}
      </div>
    </section>
  )
}

export default DomainHeroCard
