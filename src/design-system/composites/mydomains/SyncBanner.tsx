import React, { useState, useCallback } from 'react'
import { IoClose } from 'react-icons/io5'

import styles from './SyncBanner.module.scss'

interface SyncBannerProps {
  lastSynced: string
  onSync: () => void
}

export function SyncBanner({ lastSynced, onSync }: SyncBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = useCallback(() => setDismissed(true), [])

  if (dismissed) return null

  return (
    <div className={styles.bannerWrap} role="status" aria-label="Sync status">
      <div className={styles.banner}>
        <button
          className={styles.syncIconBtn}
          type="button"
          onClick={onSync}
          aria-label="Sync domains now"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
        <span className={styles.syncText}>Last Synced {lastSynced}</span>
        <button
          className={styles.dismissBtn}
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss sync notification"
        >
          <IoClose aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
