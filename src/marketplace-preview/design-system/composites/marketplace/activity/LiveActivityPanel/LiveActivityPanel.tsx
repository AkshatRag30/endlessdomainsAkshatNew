import React, { useState } from 'react'
import { mockActivity } from '@/marketplace-preview/data/marketplace/activity'
import type { ActivityFilter, ActivityAction } from '@/marketplace-preview/types/marketplace'
import ActivityItem from '../ActivityItem'
import styles from './LiveActivityPanel.module.scss'

const TABS: { id: ActivityFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'Sale' },
  { id: 'listing', label: 'Listing' },
  { id: 'drop', label: 'Drop' },
]

const FILTER_TO_ACTION: Record<Exclude<ActivityFilter, 'all'>, ActivityAction> = {
  sale: 'bought',
  listing: 'listed',
  drop: 'dropped',
}

// Same pacing idea as PromotedDomainsSection's horizontal marquee — tied to
// item count so the feed doesn't speed up/slow down as a side effect of
// how many rows a given filter happens to leave.
const SECONDS_PER_ITEM = 2.5

/** Figma node 1:1543. Self-contained like PromotedDomainsSection — owns its own mock data and tab-filter state, no required props. */
export const LiveActivityPanel = () => {
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all')
  const items = activeFilter === 'all' ? mockActivity : mockActivity.filter((item) => item.action === FILTER_TO_ACTION[activeFilter])

  const trackStyle = {
    '--loop-seconds': `${items.length * SECONDS_PER_ITEM}s`,
  } as React.CSSProperties

  return (
    <div className={styles.panel}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeFilter}
            className={`${styles.tab} ${tab.id === activeFilter ? styles.tabActive : ''}`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.heading}>
          <span className={styles.liveDot} aria-hidden="true" />
          Live activity
        </div>

        <div className={styles.list}>
          {items.length === 0 ? (
            <p className={styles.empty}>No activity in this category yet.</p>
          ) : (
            <div className={styles.track} style={trackStyle}>
              {[0, 1].map((pass) => (
                <div className={styles.pass} key={pass} aria-hidden={pass === 1}>
                  {items.map((item) => (
                    <ActivityItem key={`${item.id}-${pass}`} item={item} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveActivityPanel
