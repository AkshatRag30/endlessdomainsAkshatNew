import React from 'react'
import type { ActivityFeedItem } from '@/marketplace-preview/types/marketplace'
import Tooltip from '@/marketplace-preview/design-system/primitives/tooltip'
import styles from './ActivityItem.module.scss'

export interface ActivityItemProps {
  item: ActivityFeedItem
}

const VERB: Record<ActivityFeedItem['action'], string> = {
  bought: 'bought',
  listed: 'listed',
  dropped: 'dropped',
}

function formatRelativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 30) return 'now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

/** Figma node 1:1543. Price color is keyed by action — bought is the only one the real design shows (green); listed/dropped are a reasonable extrapolation, not from Figma. */
export const ActivityItem = ({ item }: ActivityItemProps) => {
  // Built once, reused for both the visible (truncated) line and the
  // tooltip's full (untruncated) copy — same spans, same classes, so the
  // tooltip reads with identical fonts/colors to the row itself, just not
  // clipped.
  const sentence = (
    <>
      <span className={styles.domainName}>{item.itemLabel}</span> {VERB[item.action]} for{' '}
      <span className={`${styles.price} ${styles[item.action]}`}>${item.priceUsd.toLocaleString('en-US')}</span>{' '}
      by {item.actorAddress}
    </>
  )

  return (
    <div className={styles.item}>
      <img src="/assets/img/marketplace/activity-icon.svg" alt="" aria-hidden="true" className={styles.icon} />
      <Tooltip
        variant="light"
        placement="bottom"
        portal
        portalAlign="right"
        content={<span className={styles.tooltipSentence}>{sentence}</span>}
        className={styles.textTooltip}
      >
        <p className={styles.text}>{sentence}</p>
      </Tooltip>
      {/* mockActivity's occurredAt is computed from Date.now() at module load, a different wall-clock instant on the server than on the client, so this text can legitimately differ between them — same fix React's own docs recommend for relative-time display, not a real mismatch to warn about */}
      <span className={styles.time} suppressHydrationWarning>
        {formatRelativeTime(item.occurredAt)}
      </span>
    </div>
  )
}

export default ActivityItem
