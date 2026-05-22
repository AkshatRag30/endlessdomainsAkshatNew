import Image from 'next/image'
import React from 'react'
import PrimaryButton from '@/design-system/primitives/button'
import styles from './WaitlistNav.module.scss'

export interface WaitlistNavProps {
  isRegistered?: boolean
}

export function WaitlistNav({ isRegistered = false }: WaitlistNavProps) {
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
        {isRegistered ? (
          <button type="button" className={styles.logoutBtn}>
            Logout
          </button>
        ) : (
          <PrimaryButton size="sm" type="button">
            Already Registered?
          </PrimaryButton>
        )}
      </div>
    </nav>
  )
}

export default WaitlistNav
