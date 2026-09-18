import React, { useEffect, useRef, useState } from 'react'
import { mockTickerItems } from '@/data/marketplace/activity'
import type { ActivityAction, ActivityFilter, TickerItem } from '@/types/marketplace'
import styles from './LiveActivityTicker.module.scss'

const TABS: { id: ActivityFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'Sale' },
  { id: 'listing', label: 'Listing' },
  { id: 'drop', label: 'Drop' },
]

// Same mapping LiveActivityPanel uses — kept in sync deliberately so "All
// activity happening right now" means the same thing in both places.
const FILTER_TO_ACTION: Record<Exclude<ActivityFilter, 'all'>, ActivityAction> = {
  sale: 'bought',
  listing: 'listed',
  drop: 'dropped',
}

function formatRelativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 30) return 'now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const TickerEntry = ({ item }: { item: TickerItem }) => (
  <div className={styles.entry}>
    <span className={styles.dot} aria-hidden="true" />
    <span className={styles.domain}>{item.domain}</span>
    <span className={styles.price}>${item.priceUsd.toLocaleString('en-US')}</span>
    <span className={`${styles.change} ${item.changePercent >= 0 ? styles.up : styles.down}`}>
      {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent)}%
    </span>
    {/* mockTickerItems' occurredAt is computed from Date.now() at module load, which happens at a different wall-clock instant on the server than on the client, so this text can legitimately differ between them — same fix React's own docs recommend for relative-time display, not a real mismatch to warn about */}
    <span className={styles.time} suppressHydrationWarning>
      {formatRelativeTime(item.occurredAt)}
    </span>
  </div>
)

/**
 * Figma node 34:2031 — mobile-only, replaces LiveActivityPanel (CSS-hidden
 * at mobile, see its own module) with a condensed always-scrolling ticker
 * instead of the full tabs + list panel. Same duplicate-pass marquee
 * technique PromotedDomainsSection already runs, own mock data since this
 * shows a domain's price move, not an actor/action event like
 * ActivityFeedItem. The chevron next to "Live activity" in the Figma export
 * is a real dropdown trigger, not decoration — opens the same All/Sale/
 * Listing/Drop filter LiveActivityPanel has, just as a dropdown instead of
 * a row of tabs since there's no room for four buttons in a 30px bar.
 */
export const LiveActivityTicker = () => {
  const [filter, setFilter] = useState<ActivityFilter>('all')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const items = filter === 'all' ? mockTickerItems : mockTickerItems.filter((item) => item.action === FILTER_TO_ACTION[filter])
  const activeLabel = TABS.find((tab) => tab.id === filter)?.label ?? 'Live activity'

  return (
    <div className={styles.bar}>
      <div className={styles.dropdown} ref={rootRef}>
        <button
          type="button"
          className={styles.label}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className={styles.liveDot} aria-hidden="true" />
          <span>{filter === 'all' ? 'Live activity' : activeLabel}</span>
          <img src="/assets/img/marketplace/ticker-dropdown-arrow.svg" alt="" aria-hidden="true" className={styles.chevron} />
        </button>

        {open && (
          <ul className={styles.menu} role="listbox">
            {TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={tab.id === filter}
                  className={`${styles.menuOption} ${tab.id === filter ? styles.menuOptionActive : ''}`}
                  onClick={() => {
                    setFilter(tab.id)
                    setOpen(false)
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.marquee}>
        {items.length === 0 ? (
          <p className={styles.empty}>No activity in this category yet.</p>
        ) : (
          <div className={styles.track}>
            <div className={styles.pass}>
              {items.map((item) => (
                <TickerEntry key={item.id} item={item} />
              ))}
            </div>
            <div className={styles.pass} aria-hidden="true">
              {items.map((item) => (
                <TickerEntry key={`${item.id}-dup`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveActivityTicker
