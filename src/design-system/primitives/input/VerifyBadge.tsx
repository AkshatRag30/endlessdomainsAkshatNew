import React from 'react'
import styles from './VerifyBadge.module.scss'

export interface VerifyBadgeProps {
  onVerify: () => void
  verified?: boolean
}

export const VerifyBadge: React.FC<VerifyBadgeProps> = ({ onVerify, verified = false }) => {
  if (verified) {
    return (
      <span className={styles.verified} aria-label="Verified">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    )
  }

  return (
    <button type="button" className={styles.verifyBtn} onClick={onVerify} aria-label="Verify email address">
      verify
    </button>
  )
}

export default VerifyBadge
