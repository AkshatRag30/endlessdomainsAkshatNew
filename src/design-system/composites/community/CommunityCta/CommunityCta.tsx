import React from 'react'
import Image from 'next/image'
import { PrimaryButton } from '@/design-system/primitives/button'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import tier1Badge from '../../../../../public/community/tier1.png'
import tier2Badge from '../../../../../public/community/tier2.png'
import styles from './CommunityCta.module.scss'

export function CommunityCta() {
  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      <div className={styles.bannerWrap}>
        <Image src={tier2Badge} alt="" aria-hidden="true" className={`${styles.tierBadge} ${styles.tierBadgeLeft}`} />
        <Image src={tier1Badge} alt="" aria-hidden="true" className={`${styles.tierBadge} ${styles.tierBadgeRight}`} />

        <div className={styles.content}>
          <h2 id="cta-heading" className={styles.heading}>Your Reputation Starts Here</h2>
          <p className={styles.description}>
            Join the community that is redefining what it means to have an identity onchain.
          </p>

          <div className={styles.ctaRow}>
            <div className={styles.secondaryButtonInverted}>
              <SecondaryButton>Join the community</SecondaryButton>
            </div>
            <PrimaryButton>Become an ambassador</PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunityCta
