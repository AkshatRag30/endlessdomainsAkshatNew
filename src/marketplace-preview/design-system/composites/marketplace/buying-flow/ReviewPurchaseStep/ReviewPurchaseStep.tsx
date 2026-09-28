import React from 'react'
import Image from 'next/image'
import type { MarketplaceBuyInsights, MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import NoticeBanner from '@/marketplace-preview/design-system/primitives/banners/notice-banner'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { chainShortName } from '@/marketplace-preview/helpers/marketplace/chain'
import DomainPriceHeader from '../../shared/DomainPriceHeader'
import PaymentMethodSection from '../PaymentMethodSection'
import WhatYouPaySection from '../WhatYouPaySection'
import AfterYouBuySection from '../AfterYouBuySection'
import styles from './ReviewPurchaseStep.module.scss'

export interface ReviewPurchaseNotice {
  /** 'error' = wrong network (red, "Switch", Figma 1:1297); 'warning' = insufficient funds (amber, blue "Add Funds", 1:1685). */
  tone: 'error' | 'warning'
  title: string
  body: string
  actionLabel: string
  onAction: () => void
  actionLoading?: boolean
}

export interface ReviewPurchaseStepProps {
  listing: MarketplaceListing
  insights: MarketplaceBuyInsights
  balanceUsd: number
  /** The blocking banner (wrong network or insufficient funds), pinned at the top while the order scrolls. */
  notice?: ReviewPurchaseNotice
}

// Moved to helpers/marketplace/chain.ts; re-exported for existing importers.
export { chainShortName }

/**
 * Figma node 1:650 ("Review purchase", need-usdt-approval scenario) — the
 * body between the drawer's header and its pinned PurchaseTermsFooter. The
 * price here is a read-only display, never a PriceInput: the buyer can't
 * edit it.
 *
 * `notice` renders the shared NoticeBanner (the listing flow's own banner,
 * plan §3). Figma 1:1297 places it outside that frame's scroll container,
 * i.e. pinned — unlike the listing flow's inline one — so it's sticky at
 * the top of this scrolling body and a blocking problem stays in view.
 * Done here rather than by adding a slot to Modal, which the buying flow
 * reuses unmodified.
 */
export const ReviewPurchaseStep = ({ listing, insights, balanceUsd, notice }: ReviewPurchaseStepProps) => (
  <div className={styles.body}>
    {notice && (
      <div className={styles.noticeSlot}>
        <NoticeBanner
          tone={notice.tone}
          className={styles.notice}
          icon={<Image src="/assets/img/buying-flow/network-alert.svg" alt="" aria-hidden="true" width={16} height={16} className={styles.noticeIcon} />}
          title={notice.title}
          body={notice.body}
          action={
            <PrimaryButton
              size="sm"
              variant={notice.tone === 'error' ? 'error' : undefined}
              loading={notice.actionLoading}
              onClick={notice.onAction}
              className={styles.noticeAction}
            >
              {notice.actionLabel}
            </PrimaryButton>
          }
        />
      </div>
    )}

    <section className={styles.domainSection}>
      <DomainPriceHeader
        label={listing.domainName}
        extension={listing.extension}
        chain={listing.chain}
        characterCount={listing.domainName.length}
        oneTimePurchase={listing.isOneTimePurchase}
        priceUsd={listing.priceUsd}
      />
    </section>

    <PaymentMethodSection balanceUsd={balanceUsd} chainName={chainShortName(listing)} />
    <WhatYouPaySection priceUsd={listing.priceUsd} networkFeeUsd={insights.networkFeeEstimateUsd} balanceUsd={balanceUsd} />
    <AfterYouBuySection sellerAddress={listing.sellerAddress} expiresAt={listing.expiresAt} />
  </div>
)

export default ReviewPurchaseStep
