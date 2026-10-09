import React from 'react'

import styles from './Toast.module.scss'

interface Props {
  title?: string
  message?: string
}

// Primary (blue): info circle icon + title + message
const ToastPrimaryMessage = ({ title = '', message = '' }: Props) => {
  return (
    <div className={styles.container_toast}>

    <div className={`${styles.toast} ${styles.toast_primary}`} role="alert">
      <span className={styles.icon} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9" cy="5.5" r="0.75" fill="currentColor"/>
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

export default ToastPrimaryMessage
