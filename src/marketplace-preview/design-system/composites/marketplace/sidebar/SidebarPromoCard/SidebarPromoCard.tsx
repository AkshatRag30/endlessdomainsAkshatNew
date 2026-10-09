import React from 'react'
import { useAuth } from '@/marketplace-preview/stubs/auth'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import ToastMessage from '@/marketplace-preview/design-system/primitives/toast-message'
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
      <p className={styles.heading}>Promote a listing</p>
      <p className={styles.body}>Push a name into the spotlight. $1 for 24 hours, $5 for 7 days.</p>
      {/* Promotions are a future feature, so the CTA shows a coming soon toast instead of navigating. */}
      <button
        type="button"
        className={`${primaryBtnStyles.button} ${primaryBtnStyles.sm} ${primaryBtnStyles.transparent} ${styles.cta}`}
        onClick={() => ToastMessage(TOAST_TYPE.PRIMARY, 'Promotions are coming soon', 'You will be able to push a name into the spotlight from here.')}
      >
        {/* PrimaryButton's ::before fill layer sits above unwrapped text — span required, not decorative */}
        <span>Choose a domain</span>
      </button>
    </div>
  )
}

export default SidebarPromoCard
