import React, { useState } from 'react'
import Image from 'next/image'
import { FiHeart } from 'react-icons/fi'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import TrendIndicator from '@/marketplace-preview/design-system/primitives/badges/trend-indicator'
import Tooltip from '@/marketplace-preview/design-system/primitives/tooltip'
import primaryBtnStyles from '@/marketplace-preview/design-system/primitives/buttons/primary-button/Primarybutton.module.scss'
import styles from './PromotedDomainCard.module.scss'

export interface PromotedDomainCardProps {
  listing: MarketplaceListing
  /** Controlled favorite state — LiveListingsTable's mobile card view passes this so a card agrees with the desktop row on which listings are favorited. Falls back to internal state (uncontrolled) for the promoted marquee's own usage below, which never passes it. */
  favorited?: boolean
  onToggleFavorite?: () => void
  /** LiveListingsTable's mobile card view — stretches to the list's full width instead of this card's own fixed 282px marquee width. */
  fullWidth?: boolean
}

const formatEth = (value: number) => `${value.toFixed(2)} ETH`
const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

/** Figma node 1:1034 — measurements, colors, and fonts taken from get_design_context, not the screenshot alone. */
export const PromotedDomainCard = ({ listing, favorited: favoritedProp, onToggleFavorite, fullWidth }: PromotedDomainCardProps) => {
  const [favoritedState, setFavoritedState] = useState(!!listing.isFavorited)
  const favorited = favoritedProp ?? favoritedState
  const toggleFavorite = onToggleFavorite ?? (() => setFavoritedState((prev) => !prev))

  return (
    <div className={[styles.card, fullWidth && styles.fullWidth].filter(Boolean).join(' ')}>
      <div className={styles.topRow}>
        <Image src="/assets/img/marketplace/domain-marker.svg" alt="" aria-hidden="true" width={19} height={14} className={styles.marker} />
        <span className={styles.domainLabel}>domain name</span>
        <div className={styles.domainRow}>
          <Tooltip label={listing.domainName} placement="bottom" portal className={styles.domainNameTooltip}>
            <span className={styles.domainName}>{listing.domainName}</span>
          </Tooltip>
          <ExtensionBadge extension={listing.extension} />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.cell}>
          <span className={styles.label}>appraised value</span>
          <span className={styles.value}>{formatEth(listing.appraisedValueEth)}</span>
          <TrendIndicator
            direction={listing.appraisedTrend === 'high' ? 'up' : listing.appraisedTrend === 'low' ? 'down' : 'neutral'}
            label={listing.appraisedTrend}
          />
        </div>
        <div className={styles.cell}>
          <span className={styles.label}>chain</span>
          <ChainBadge chain={listing.chain} />
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.cell}>
          <span className={styles.label}>price</span>
          <span className={styles.value}>{formatEth(listing.priceEth)}</span>
          <span className={styles.usd}>{formatUsd(listing.priceUsd)}</span>
        </div>

        <div className={styles.actions}>
          {/* Static mock data — this button is visually real but not wired to BuyNowModal or any wallet call */}
          <button type="button" className={`${primaryBtnStyles.button} ${primaryBtnStyles.sm} ${styles.buyNow}`}>
            {/* PrimaryButton's ::before fill layer sits above unwrapped text — span required, not decorative */}
            <span>Buy Now</span>
          </button>
          <button
            type="button"
            className={styles.favorite}
            aria-pressed={favorited}
            aria-label={favorited ? 'Remove from watchlist' : 'Add to watchlist'}
            onClick={toggleFavorite}
          >
            <FiHeart size={14} aria-hidden="true" className={favorited ? styles.favoriteIconActive : styles.favoriteIcon} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromotedDomainCard
