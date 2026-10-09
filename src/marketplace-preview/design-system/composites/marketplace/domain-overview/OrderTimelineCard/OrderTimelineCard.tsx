import React from 'react'
import { CalendarSmallIcon } from '@/marketplace-preview/design-system/primitives/icons/overview-icons'
import type { OrderStatus, OrderTimelineEntry, OrderTimelineStep } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import TransactionChecklist from '@/marketplace-preview/design-system/primitives/progress/transaction-checklist'
import InfoNote from '@/marketplace-preview/design-system/primitives/banners/info-note'
import { formatDate, formatTime } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './OrderTimelineCard.module.scss'

export interface OrderTimelineCardProps {
  timeline: OrderTimelineEntry[]
  status: OrderStatus
}

const STEP_LABEL: Record<OrderTimelineStep, string> = {
  signed: 'Order signed',
  'payment-sent': 'Payment sent',
  transferred: 'Domain transferred to your wallet',
  indexed: 'Indexed to your account',
}

/**
 * Figma node 5:7590 ("What happened"): the order's steps as a checklist,
 * each with when it happened. Uses TransactionChecklist's 'plain' variant,
 * the same component (and done icon) as the buy flow's progress card.
 * Figma checks off all four once the order completes, including indexing,
 * which it describes as "within 10 to 15 minutes"; followed as drawn.
 */
export const OrderTimelineCard = ({ timeline, status }: OrderTimelineCardProps) => (
  <GlassCard variant="glass" title="What happened" titleId="order-timeline-title" className={styles.card}>
    <TransactionChecklist
      variant="plain"
      className={styles.list}
      items={timeline.map((entry) => ({
        label: STEP_LABEL[entry.step],
        status: status === 'completed' || entry.at ? 'done' : 'pending',
        detail: entry.at ? (
          <>
            <CalendarSmallIcon width={11.65} height={11.65} className={styles.calendarIcon} />
            <time dateTime={entry.at}>
              {formatDate(entry.at)} at {formatTime(entry.at)}
            </time>
          </>
        ) : (
          entry.note
        ),
      }))}
    />
    <InfoNote className={styles.note}>
      Payment and transfer settled in the same transaction, so there was never a moment where your money had left and the domain had not arrived.
    </InfoNote>
  </GlassCard>
)

export default OrderTimelineCard
