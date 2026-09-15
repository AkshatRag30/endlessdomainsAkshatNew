import React, { useState } from 'react'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import TrendIndicator from '@/marketplace-preview/design-system/primitives/badges/trend-indicator'
import primaryBtnStyles from '@/marketplace-preview/design-system/primitives/buttons/primary-button/Primarybutton.module.scss'
import styles from './PromotedDomainCard.module.scss'

export interface PromotedDomainCardProps {
  listing: MarketplaceListing
}

const formatEth = (value: number) => `${value.toFixed(2)} ETH`
const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

/** Figma node 1:1034 — measurements, colors, and fonts taken from get_design_context, not the screenshot alone. */
export const PromotedDomainCard = ({ listing }: PromotedDomainCardProps) => {
  const [favorited, setFavorited] = useState(!!listing.isFavorited)

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <img src="/assets/img/marketplace/domain-marker.svg" alt="" aria-hidden="true" className={styles.marker} />
        <span className={styles.domainLabel}>domain name</span>
        <div className={styles.domainRow}>
          <span className={styles.domainName}>{listing.domainName}</span>
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
            <span>buy now</span>
          </button>
          <button
            type="button"
            className={styles.favorite}
            aria-pressed={favorited}
            aria-label={favorited ? 'Remove from watchlist' : 'Add to watchlist'}
            onClick={() => setFavorited((prev) => !prev)}
          >
            <img
              src="/assets/img/marketplace/favorite.svg"
              alt=""
              aria-hidden="true"
              className={favorited ? styles.favoriteIconActive : styles.favoriteIcon}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromotedDomainCard
