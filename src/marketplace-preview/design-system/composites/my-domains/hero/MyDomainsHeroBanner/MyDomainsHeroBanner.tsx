import React from 'react'
import SecondaryButton from '@/marketplace-preview/design-system/primitives/buttons/secondary-button'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import styles from './MyDomainsHeroBanner.module.scss'

export interface MyDomainsHeroBannerProps {
  onBulkList?: () => void
  onListDomain?: () => void
}

/**
 * Figma node 50:6510. Background is a single exported PNG (bannerbg.png) —
 * the gradient, the noise texture, and the faint rounded-square accents are
 * all baked into that one image now, replacing the earlier three-layer
 * reconstruction (CSS gradient + a separate noise-texture pseudo-element +
 * five individually-positioned blob images) that used to live here.
 */
export const MyDomainsHeroBanner = ({ onBulkList, onListDomain }: MyDomainsHeroBannerProps) => (
  <div className={styles.hero}>
    <div className={styles.copy}>
      <p className={styles.heading}>My domains</p>
      <p className={styles.body}>Everything in your connected wallet. List, reprice or transfer without leaving this page.</p>
    </div>

    <div className={styles.actions}>
      {/* Figma's "Bulk List" corner brackets are this primitive's own
          signature decoration, not a bespoke flourish — reused rather than
          rebuilt. Sized down from its 200x57 marketing-page default via
          .bulkListWrap, see the stylesheet. */}
      <span className={styles.bulkListWrap}>
        <SecondaryButton transparent onClick={onBulkList}>
          Bulk List
        </SecondaryButton>
      </span>
      <PrimaryButton size="sm" onClick={onListDomain}>
        List a domain
      </PrimaryButton>
    </div>
  </div>
)

export default MyDomainsHeroBanner
