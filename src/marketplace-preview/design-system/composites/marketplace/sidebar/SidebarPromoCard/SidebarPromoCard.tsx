import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/marketplace-preview/stubs/auth'
import primaryBtnStyles from '@/marketplace-preview/design-system/primitives/buttons/primary-button/Primarybutton.module.scss'
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
      <p className={styles.heading}>What Is Your Name Worth?</p>
      <p className={styles.body}>See the pricing signals free. The valuation is a paid report.</p>
      <Link href="/login" className={`${primaryBtnStyles.button} ${primaryBtnStyles.sm} ${primaryBtnStyles.transparent} ${styles.cta}`}>
        {/* PrimaryButton's ::before fill layer sits above unwrapped text — span required, not decorative */}
        <span>connect wallet</span>
      </Link>
    </div>
  )
}

export default SidebarPromoCard
