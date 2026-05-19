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
    <div className={styles.banner} role="status" aria-label="Sync status">
      <span className={styles.syncText}>Last Synced {lastSynced}</span>
      <div className={styles.actions}>
        <button
          className={styles.syncBtn}
          type="button"
          onClick={onSync}
          aria-label="Sync domains now"
        >
          Sync Now
          <svg
            className={styles.syncIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
