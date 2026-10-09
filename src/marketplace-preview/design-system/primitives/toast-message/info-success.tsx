import React from 'react'

import styles from './Toast.module.scss'

interface Props {
  title?: string
  message?: string
}

// Success with description: gray avatar circle + blue checkmark + bold title + description
const ToastInfoSuccessMessage = ({ title = '', message = '' }: Props) => {
  return (
    <div className={styles.container_toast}>

    <div className={`${styles.toast} ${styles.toast_info_success}`} role="alert">
      <div className={styles.avatar} aria-hidden="true">
        <div className={styles.successIcon}>
          <span className={styles.checkmark}></span>
        </div>
      </div>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
    </div>
  )
}

export default ToastInfoSuccessMessage
