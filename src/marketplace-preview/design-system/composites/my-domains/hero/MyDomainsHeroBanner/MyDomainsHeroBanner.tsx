import React from 'react'
import SecondaryButton from '@/marketplace-preview/design-system/primitives/buttons/secondary-button'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import styles from './MyDomainsHeroBanner.module.scss'

export interface MyDomainsHeroBannerProps {
  onBulkList?: () => void
  onListDomain?: () => void
}

/**
 * Figma node 50:6510. The gradient, the noise texture, and the five faint
 * rounded-square accents are all real exported assets now — an earlier pass
 * skipped them in favor of a CSS-only stripe-bg texture, which turned out
 * to silently overwrite the gradient itself (see the stylesheet) and left
 * the white text unreadable.
 */
export const MyDomainsHeroBanner = ({ onBulkList, onListDomain }: MyDomainsHeroBannerProps) => (
  <div className={styles.hero}>
    <img src="/assets/img/my-domains/hero-blob-a.svg" alt="" aria-hidden="true" className={`${styles.blob} ${styles.blobA1}`} />
    <img src="/assets/img/my-domains/hero-blob-b.svg" alt="" aria-hidden="true" className={`${styles.blob} ${styles.blobB1}`} />
    <img src="/assets/img/my-domains/hero-blob-a.svg" alt="" aria-hidden="true" className={`${styles.blob} ${styles.blobA2}`} />
    <img src="/assets/img/my-domains/hero-blob-b.svg" alt="" aria-hidden="true" className={`${styles.blob} ${styles.blobB2}`} />
    <img src="/assets/img/my-domains/hero-blob-c.svg" alt="" aria-hidden="true" className={`${styles.blob} ${styles.blobC}`} />

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
