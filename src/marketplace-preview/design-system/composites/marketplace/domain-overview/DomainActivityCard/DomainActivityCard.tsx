import React from 'react'
import Image from 'next/image'
import type { DomainActivityEvent } from '@/marketplace-preview/types/marketplace'
import GlassCard from '@/marketplace-preview/design-system/primitives/cards/glass-card'
import FadeScrollList from '@/marketplace-preview/design-system/primitives/lists/fade-scroll-list'
import { formatRelativeTime, formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './DomainActivityCard.module.scss'

export interface DomainActivityCardProps {
  /** Needed for the sold row's "{buyer} bought {name} for …" sentence. */
  fullName: string
  events?: DomainActivityEvent[]
  isLoading: boolean
  isError?: boolean
  onRetry?: () => void
}

const SENTENCE: Record<Exclude<DomainActivityEvent['kind'], 'sold'>, (event: DomainActivityEvent) => string> = {
  listed: (event) => `Listed by ${event.actorAddress}`,
  'price-changed': (event) => `Price changed by ${event.actorAddress}`,
  delisted: (event) => `Delisted by ${event.actorAddress}`,
  transferred: (event) => `Transferred to ${event.counterpartyAddress ?? event.actorAddress}`,
}

const SKELETON_ROWS = [0, 1, 2, 3, 4]

/**
 * Figma node 5:3792. Figma draws two row styles: a peach avatar row
 * ("Listed by 0x8A7F…3c9D · 8,460.00 9m ago") and, below the clip, a sale row
 * ("0xdead…beef bought 101.nft for $1,850 · now") with its own icon, green
 * amount and mono timestamp. Sales use the second style, everything else
 * the first. The frame repeats one identical listed row (plan §2.7 Q5);
 * here rows come from the domain's own history and the list scrolls.
 *
 * Amounts are USDT like every other price on the page, where Figma's sale
 * row shows a dollar figure.
 */
export const DomainActivityCard = ({ fullName, events, isLoading, isError, onRetry }: DomainActivityCardProps) => {
  let body: React.ReactNode
  if (isLoading && !events) {
    body = (
      <ul className={styles.list} aria-busy="true" aria-label="Loading activity">
        {SKELETON_ROWS.map((row) => (
          <li key={row} className={styles.row}>
            <span className={styles.skeleton} />
          </li>
        ))}
      </ul>
    )
  } else if (isError) {
    // Not in Figma (plan §7 item 6).
    body = (
      <p className={styles.message}>
        Couldn&apos;t load this.{' '}
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      </p>
    )
  } else if (!events || events.length === 0) {
    // Not in Figma (plan §7 item 5).
    body = <p className={styles.message}>No activity yet.</p>
  } else {
    body = (
      <FadeScrollList className={styles.scroll} ariaLabel={`${fullName} activity`}>
        <ul className={styles.list}>
          {events.map((event) =>
            event.kind === 'sold' ? (
              <li key={event.id} className={`${styles.row} ${styles.saleRow}`}>
                <span className={styles.subject}>
                  <Image src="/assets/img/domain-overview/activity-bought.svg" alt="" aria-hidden="true" width={14.3} height={14.3} className={styles.boughtIcon} />
                  {/* The sentence truncates; the amount after it never does. */}
                  <span className={styles.saleText}>
                    {event.actorAddress} bought {fullName} for
                  </span>
                  {event.priceUsd !== undefined && <span className={styles.saleAmount}>{formatToken(event.priceUsd)}</span>}
                </span>
                <time className={styles.saleTime} dateTime={event.occurredAt}>
                  {formatRelativeTime(event.occurredAt)}
                </time>
              </li>
            ) : (
              <li key={event.id} className={styles.row}>
                <span className={styles.subject}>
                  {/* Peach gradient disc with a person glyph, head and body drawn as Figma's two layers. */}
                  <span className={styles.avatar} aria-hidden="true">
                    <Image src="/assets/img/domain-overview/activity-avatar-head.svg" alt="" width={5.27} height={5.27} className={styles.avatarHead} />
                    <Image src="/assets/img/domain-overview/activity-avatar-body.svg" alt="" width={8.79} height={4.14} className={styles.avatarBody} />
                  </span>
                  <span className={styles.text}>{SENTENCE[event.kind](event)}</span>
                </span>
                <span className={styles.trailing}>
                  {event.priceUsd !== undefined && <span className={styles.price}>{formatToken(event.priceUsd)}</span>}{' '}
                  <time dateTime={event.occurredAt}>{formatRelativeTime(event.occurredAt)}</time>
                </span>
              </li>
            )
          )}
        </ul>
      </FadeScrollList>
    )
  }

  return (
    <GlassCard title="Activity" titleId="domain-activity-title" className={styles.card}>
      <div className={styles.well}>{body}</div>
    </GlassCard>
  )
}

export default DomainActivityCard
