import React from 'react'
import Image from 'next/image'
import type { MarketplaceOrder, OrderStatus } from '@/marketplace-preview/types/marketplace'
import StatusChip, { type StatusChipVariant } from '@/marketplace-preview/design-system/primitives/badges/status-chip'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatDate, formatTime } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './OrderHeaderCard.module.scss'

export interface OrderHeaderCardProps {
  order: MarketplaceOrder
  onDownload: () => void
  onShare: () => void
}

const STATUS_CHIP: Record<OrderStatus, { variant: StatusChipVariant; label: string }> = {
  completed: { variant: 'completed', label: 'Completed' },
  // Not in Figma, which only draws a completed order.
  pending: { variant: 'neutral', label: 'Pending' },
  failed: { variant: 'expired', label: 'Failed' },
}

/**
 * Figma node 5:7454 (desktop) / 5:7980 (mobile): order number with its
 * status chip, when it was placed, and Download receipt + Share. Figma's
 * mobile frame drops the two actions, so they're hidden there.
 */
export const OrderHeaderCard = ({ order, onDownload, onShare }: OrderHeaderCardProps) => {
  const chip = STATUS_CHIP[order.status]

  return (
    <section className={styles.card} aria-label="Order summary">
      <div className={styles.summary}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Order #{order.id}</h1>
          <StatusChip variant={chip.variant}>{chip.label}</StatusChip>
        </div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.calendarBox}>
              <Image src="/assets/img/domain-overview/calendar.svg" alt="" aria-hidden="true" width={13.3} height={15.2} />
            </span>
            Placed {formatDate(order.placedAt)}
          </span>
          <span className={`${styles.metaItem} ${styles.time}`}>
            {/* Figma's clock is two layers: the face, and the hands inset over it. */}
            <span className={styles.clock} aria-hidden="true">
              <Image src="/assets/img/domain-overview/clock-face.svg" alt="" width={17} height={17} />
              <Image src="/assets/img/domain-overview/clock-hands.svg" alt="" width={3.95} height={7.24} className={styles.clockHands} />
            </span>
            <time dateTime={order.placedAt}>{formatTime(order.placedAt)}</time>
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        {/* "Download receipt" in the layer, capitalised in the render (plan §2.7 Q11); the render wins. */}
        <PrimaryButton variant="charcoal" onClick={onDownload} className={styles.download}>
          Download Receipt
        </PrimaryButton>
        <button type="button" className={styles.share} onClick={onShare}>
          <Image src="/assets/img/domain-overview/share.svg" alt="" aria-hidden="true" width={12.4} height={13.5} />
          Share
        </button>
      </div>
    </section>
  )
}

export default OrderHeaderCard
