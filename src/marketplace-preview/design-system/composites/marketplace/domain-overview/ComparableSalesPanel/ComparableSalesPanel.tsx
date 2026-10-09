import React from 'react'
import { CalendarIcon } from '@/marketplace-preview/design-system/primitives/icons/overview-icons'
import Link from 'next/link'
import type { ComparableSale } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import FadeScrollList from '@/marketplace-preview/design-system/primitives/lists/fade-scroll-list'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import { formatShortDate, formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import { domainOverviewHref } from '@/marketplace-preview/helpers/marketplace/routes'
import styles from './ComparableSalesPanel.module.scss'

export interface ComparableSalesPanelProps {
  sales?: ComparableSale[]
  isLoading: boolean
  isError?: boolean
  onRetry?: () => void
  /** Where a row links to. Defaults to that name's own overview page (plan §4.3). */
  getSaleHref?: (sale: ComparableSale) => string
}

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5]

const defaultSaleHref = (sale: ComparableSale) => domainOverviewHref(sale.fullName)

/**
 * Figma node 5:6128 (desktop) / 5:7043 (mobile): a frosted card (the plain
 * white card on mobile) listing recent sales of similar names. Figma repeats
 * one "stellarhash.ud · 8,460.00 · 18 May" row eleven times, clipped and
 * fading; here each row is a real sale, the list scrolls with the same
 * bottom fade, and a row opens that name's own overview page. The whole row
 * is the link since it holds nothing else interactive.
 */
export const ComparableSalesPanel = ({ sales, isLoading, isError, onRetry, getSaleHref = defaultSaleHref }: ComparableSalesPanelProps) => {
  let body: React.ReactNode
  if (isLoading && !sales) {
    body = (
      <ul className={`${styles.well} ${styles.list}`} aria-busy="true" aria-label="Loading comparable sales">
        {SKELETON_ROWS.map((row) => (
          <li key={row} className={styles.skeletonRow} />
        ))}
      </ul>
    )
  } else if (isError || !sales) {
    // Not in Figma (plan §7 item 6).
    body = (
      <p className={styles.message}>
        Couldn&apos;t load this.{' '}
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      </p>
    )
  } else if (sales.length === 0) {
    // Not in Figma (plan §7 item 5).
    body = <p className={styles.message}>No comparable sales yet.</p>
  } else {
    body = (
      <FadeScrollList className={styles.well} ariaLabel="Comparable sales">
        <ul className={styles.list}>
          {sales.map((sale) => (
            <li key={sale.id}>
              <Link href={getSaleHref(sale)} className={styles.row}>
                <span className={styles.domain}>
                  <DomainAvatar extension={sale.extension} className={styles.avatar} />
                  <span className={styles.name}>{sale.fullName}</span>
                </span>
                <span className={styles.meta}>
                  <span className={styles.price}>
                    {formatToken(sale.priceUsd)}
                    <TokenSuffix iconSize={15} className={styles.token} />
                  </span>
                  <span className={styles.date}>
                    <span className={styles.calendarBox}>
                      <CalendarIcon width={13.3} height={15.2} className={styles.calendar} />
                    </span>
                    <time dateTime={sale.soldAt}>{formatShortDate(sale.soldAt)}</time>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </FadeScrollList>
    )
  }

  return (
    <GlassCard variant="glass" title="Comparable sales" titleId="domain-comparables-title" className={styles.card}>
      {body}
    </GlassCard>
  )
}

export default ComparableSalesPanel
