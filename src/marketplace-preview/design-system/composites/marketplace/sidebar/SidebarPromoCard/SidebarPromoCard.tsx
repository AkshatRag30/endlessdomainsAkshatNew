import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import primaryBtnStyles from '@/design-system/primitives/buttons/primary-button/Primarybutton.module.scss'
import styles from './SidebarPromoCard.module.scss'

/**
 * Static promo copy, matches the reference design. The CTA reuses the exact
 * same /login destination and button styling as the header's connect wallet
 * action — same pattern, not a new auth entry point. Header hides its own
 * connect wallet button once authenticated; this card's CTA is that same
 * action, so it hides the whole card for the same reason rather than
 * showing a signed-in user a prompt to connect a wallet they already have.
 */
export const SidebarPromoCard = () => {
  const { authenticated } = useAuth()
  if (authenticated) return null

  return (
    <div className={styles.card}>
      <p className={styles.heading}>Promote a listing</p>
      <p className={styles.body}>Push a name into the spotlight. $1 for 24 hours, $5 for 7 days.</p>
      <Link href="/login" className={`${primaryBtnStyles.button} ${primaryBtnStyles.sm} ${primaryBtnStyles.transparent} ${styles.cta}`}>
        {/* PrimaryButton's ::before fill layer sits above unwrapped text — span required, not decorative */}
        <span>Choose a domain</span>
      </Link>
    </div>
  )
}

export default SidebarPromoCard
