import React from 'react'

import type { DomainStats } from '@/design-system/composites/mydomains/types'
import styles from './StatsBar.module.scss'

interface StatsBarProps {
  stats: DomainStats
}

const TILES: { key: keyof DomainStats; label: string }[] = [
  { key: 'total', label: 'Total Domains' },
  { key: 'expiringSoon', label: 'Expiring Soon' },
  { key: 'listedOnMarketplace', label: 'Listed On Marketplace' },
  { key: 'notConfigured', label: 'Not Configured' },
]

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className={styles.bar} role="region" aria-label="Domain statistics">
      {TILES.map(tile => (
        <div key={tile.key} className={styles.tile}>
          <span className={styles.count}>{stats[tile.key].toLocaleString()}</span>
          <span className={styles.label}>{tile.label}</span>
        </div>
      ))}
    </div>
  )
}
