import React from 'react'

import styles from './Toast.module.scss'

interface Props {
  message?: string
  closeToast?: () => void
}

// Simple success: ○✓ icon + single message + ✕ dismiss button
const ToastSuccessMessage = ({ message = '', closeToast }: Props) => {
  return (
    <div className={styles.container_toast}>

    <div className={`${styles.toast} ${styles.toast_success}`} role="alert">
      <span className={styles.icon} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

export default ToastSuccessMessage
