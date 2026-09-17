import React from 'react'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import TrendIndicator from '@/marketplace-preview/design-system/primitives/badges/trend-indicator'
import Tooltip from '@/marketplace-preview/design-system/primitives/tooltip'
import primaryBtnStyles from '@/marketplace-preview/design-system/primitives/buttons/primary-button/Primarybutton.module.scss'
import styles from './ListingRow.module.scss'

const formatEth = (value: number) => `${value.toFixed(2)} ETH`
const formatUsd = (value: number) => `$${value.toLocaleString('en-US')}`

export interface ListingDomainCellProps {
  listing: MarketplaceListing
}

/**
 * Just the Domain Name cell. Reused as-is by both the desktop row below and
 * LiveListingsTable's mobile fixed pane (that table splits Domain from the
 * rest into two separately laid-out panes on mobile instead of one
 * scrolling grid with a stuck column — see that file for why).
 *
 * .domainNameScroll only does anything at mobile width (see the
 * stylesheet) — a long name scrolls inside its own space there instead of
 * truncating with an ellipsis, while the extension badge stays put on the
 * right regardless of how far the name is scrolled. Desktop is unaffected,
 * it still just truncates.
 */
export const ListingDomainCell = ({ listing }: ListingDomainCellProps) => (
  <div className={styles.cell} role="cell">
    <div className={styles.domain}>
      {listing.isPremium && (
        <img src="/assets/img/marketplace/domain-marker.svg" alt="" aria-hidden="true" className={styles.marker} />
      )}
      {/* Was a native title="" tooltip — unstyled OS chrome with a slow,
          browser-controlled delay. Themed Tooltip primitive instead, same
          reasoning applied across both marketplace and My Domains now. */}
      <Tooltip label={listing.domainName} portal className={styles.domainNameTooltip}>
        <span className={styles.domainNameScroll}>
          <span className={styles.domainName}>{listing.domainName}</span>
        </span>
      </Tooltip>
      <ExtensionBadge extension={listing.extension} />
    </div>
  </div>
)

export interface ListingRestCellsProps {
  listing: MarketplaceListing
  favorited: boolean
  onToggleFavorite: () => void
}

/**
 * Price / Appraised Value / Chain / Action cells — everything except
 * Domain Name. Reused by both the desktop row's single grid and
 * LiveListingsTable's mobile scrollable pane. favorited/onToggleFavorite
 * are owned by LiveListingsTable (not local state here) so both layouts
 * share one source of truth per listing regardless of which is visible.
 */
export const ListingRestCells = ({ listing, favorited, onToggleFavorite }: ListingRestCellsProps) => (
  <>
    <div className={styles.cell} role="cell">
      <span className={styles.value}>{formatEth(listing.priceEth)}</span>
      <span className={styles.usd}>{formatUsd(listing.priceUsd)}</span>
    </div>

    <div className={styles.cell} role="cell">
      <span className={styles.value}>{formatEth(listing.appraisedValueEth)}</span>
      <TrendIndicator
        direction={listing.appraisedTrend === 'high' ? 'up' : listing.appraisedTrend === 'low' ? 'down' : 'neutral'}
        label={listing.appraisedTrend}
      />
    </div>

    <div className={styles.cell} role="cell">
      <ChainBadge chain={listing.chain} />
    </div>

    <div className={`${styles.cell} ${styles.actionCell}`} role="cell">
      {/* Static mock data — visually real, not wired to BuyNowModal or any wallet call */}
      <button type="button" className={`${primaryBtnStyles.button} ${primaryBtnStyles.sm} ${styles.buyNow}`}>
        {/* PrimaryButton's ::before fill layer sits above unwrapped text — span required, not decorative */}
        <span>Buy Now</span>
      </button>
      <button
        type="button"
        className={styles.favorite}
        aria-pressed={favorited}
        aria-label={favorited ? 'Remove from watchlist' : 'Add to watchlist'}
        onClick={onToggleFavorite}
      >
        <img
          src="/assets/img/marketplace/favorite.svg"
          alt=""
          aria-hidden="true"
          className={favorited ? styles.favoriteIconActive : styles.favoriteIcon}
        />
      </button>
    </div>
  </>
)

export interface ListingRowProps {
  listing: MarketplaceListing
  favorited: boolean
  onToggleFavorite: () => void
}

/**
 * Figma node 1:1149 — the desktop row, Domain + the rest in one grid.
 * Desktop/tablet only (CSS-hidden below that, see .row) — mobile renders
 * ListingDomainCell/ListingRestCells directly instead, split across
 * LiveListingsTable's fixed and scrollable panes.
 */
export const ListingRow = ({ listing, favorited, onToggleFavorite }: ListingRowProps) => (
  <div className={styles.row} role="row">
    <ListingDomainCell listing={listing} />
    <ListingRestCells listing={listing} favorited={favorited} onToggleFavorite={onToggleFavorite} />
  </div>
)

export default ListingRow
