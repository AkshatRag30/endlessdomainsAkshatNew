import Image from 'next/image'
import React from 'react'
import PrimaryButton from '@/design-system/primitives/button'
import styles from './WaitlistNav.module.scss'

export interface WaitlistNavProps {
  isRegistered?: boolean
  onAlreadyRegistered?: () => void
  onLogout?: () => void
}

export function WaitlistNav({ isRegistered = false, onAlreadyRegistered, onLogout }: WaitlistNavProps) {
  return (
    <nav className={styles.nav} aria-label="Waitlist navigation">
      <div className={styles.inner}>
        <div className={styles.logoWrap}>
          <Image
            src="/user-profile/endlessnewlogo.svg"
            alt="Endless Domains"
            width={180}
            height={36}
            priority
          />
        </div>
        <div className={styles.btnWrap}>
          {isRegistered ? (
            <PrimaryButton size="sm" type="button" onClick={onLogout}>
              Logout
            </PrimaryButton>
          ) : (
            <PrimaryButton size="sm" type="button" onClick={onAlreadyRegistered}>
              Already Registered?
            </PrimaryButton>
          )}
        </div>
      </div>
    </nav>
  )
}

export default WaitlistNav
