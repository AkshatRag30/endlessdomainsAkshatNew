import React from 'react'

import styles from './Toast.module.scss'

interface Props {
  title?: string
  message?: string
}

// Bordered alert (compact): ⚠️ icon + bold title + description — no bullet list, no dismiss
// Uses error/red styling per Figma "Bordered styles alert" example
const ToastWarningMessage = ({ title = '', message = '' }: Props) => {
  return (
    <div className={styles.container_toast}>

    <div className={`${styles.toast} ${styles.toast_warning}`} role="alert">
      <span className={styles.icon} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.684 2.75a1.5 1.5 0 012.632 0l5.576 9.853A1.5 1.5 0 0114.576 15H3.424a1.5 1.5 0 01-1.316-2.397L7.684 2.75z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
          <path d="M9 7.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9" cy="12.5" r="0.75" fill="currentColor"/>
        </svg>
      </span>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
    </div>
  )
}

export default ToastWarningMessage
