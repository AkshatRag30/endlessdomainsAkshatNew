import React from 'react'

import { DomainItem, ViewMode } from './types'
import { DomainCardGrid } from './DomainCardGrid'
import { DomainCardList } from './DomainCardList'
import styles from './DomainCollection.module.scss'

interface DomainCollectionProps {
  domains: DomainItem[]
  viewMode: ViewMode
  onManage: (id: string) => void
}

const LIST_HEADERS = ['Domain Name', 'Chain', 'Provider', 'Expiry', 'Action']

export function DomainCollection({ domains, viewMode, onManage }: DomainCollectionProps) {
  if (domains.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <p className={styles.emptyText}>No domains found.</p>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className={styles.grid} role="list">
        {domains.map(domain => (
          <div key={domain.id} role="listitem">
            <DomainCardGrid domain={domain} onManage={onManage} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.listHeader} role="row" aria-hidden="true">
        {LIST_HEADERS.map(header => (
          <span key={header} className={styles.listHeaderCell}>
            {header}
          </span>
        ))}
      </div>
      <div className={styles.listBody} role="list">
        {domains.map(domain => (
          <div key={domain.id} role="listitem">
            <DomainCardList domain={domain} onManage={onManage} />
          </div>
        ))}
      </div>
    </div>
  )
}
