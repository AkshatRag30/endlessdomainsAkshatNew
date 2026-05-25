import React, { useCallback, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { BsWallet2 } from 'react-icons/bs'
import PrimaryButton from '@/design-system/primitives/button'
import styles from './WaitlistLoginCard.module.scss'

export interface WaitlistLoginCardProps {
  onComplete?: () => void
}

export function WaitlistLoginCard({ onComplete }: WaitlistLoginCardProps) {
  const [email, setEmail] = useState('')
  const handleContinue = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  return (
    <article className={styles.wrapper} aria-label="Log in to your waitlist account">
      <div className={styles.card}>
        <div className={styles.body}>
          <h3 className={styles.heading}>Welcome Back! You&apos;re Already On The Waitlist.</h3>

          <div className={styles.fieldGroup}>
            <p className={styles.hint}>Log in to view your status, referrals, rewards, and updates.</p>
            <input
              id="login-email"
              type="email"
              className={styles.textInput}
              placeholder="enter your email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Email address"
            />
          </div>

          <PrimaryButton
            type="button"
            fullWidth
            icon={<FiArrowRight />}
            iconPosition="right"
            onClick={handleContinue}
          >
            Continue
          </PrimaryButton>

          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          <PrimaryButton
            type="button"
            fullWidth
            variant="transparent"
            icon={<BsWallet2 />}
            iconPosition="left"
            onClick={undefined}
          >
            Connect Wallet
          </PrimaryButton>
        </div>
      </div>
    </article>
  )
}

export default WaitlistLoginCard
