import Image from 'next/image'
import Link from 'next/link'
import giftSvg from '../../../../../public/reputation/gift.svg'
import styles from './EmptyMyPerks.module.scss'

export default function EmptyMyPerks() {
  return (
    <div className={styles.root}>
      <div className={styles.card}>

        <div className={styles.iconWrap}>
          <Image
            src={giftSvg}
            alt="Gift box illustration"
            width={80}
            height={80}
            className={styles.giftIcon}
          />
        </div>

        <h2 className={styles.heading}>You Have An Unclaimed Perk Waiting.</h2>

        <p className={styles.body}>
          It looks like you have not claimed your exclusive perk yet. These are
          available for a limited time and reserved just for you.
        </p>

        <Link href="/perks" className={styles.ctaBtn} aria-label="Go to perks catalog to claim your perk">
          <span>Claim My Perk</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10H16M16 10L11 5M16 10L11 15"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

      </div>
    </div>
  )
}
