import React from 'react'

import styles from './Toast.module.scss'

interface Props {
  message?: string
  closeToast?: () => void
}

// Notification: ↻ sync icon + message + ✕ dismiss button
const ToastInfoMessage = ({ message = '', closeToast }: Props) => {
  return (
    <div className={styles.container_toast}>

    <div className={`${styles.toast} ${styles.toast_info}`} role="status">
      <span className={styles.icon} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 3v4.5h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 15v-4.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.47 6.75A6 6 0 004.83 4.83L1.5 7.5M16.5 10.5l-3.33 2.67a6 6 0 01-9.64-1.92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <p className={`${styles.body} ${styles.message}`}>{message}</p>
      {closeToast && (
        <button type="button" className={styles.close} onClick={closeToast} aria-label="Dismiss">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M11 1L1 11M1 1l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
    </div>
  )
}

export default ToastInfoMessage
