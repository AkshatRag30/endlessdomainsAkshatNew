import React from 'react'
import Image from 'next/image'
import type { MarketplaceBuyInsights, MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import NoticeBanner from '@/marketplace-preview/design-system/primitives/banners/notice-banner'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
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

/**
 * Figma writes the chain in lowercase short form inside meta lines ("bnb ·
 * 7 chars", "Balance … USDT on polygon") — the first word of the chain's own
 * label gives exactly that for every chain in the mock set ("BNB Chain" →
 * "bnb", "Polygon" → "polygon").
 */
export const chainShortName = (listing: MarketplaceListing) => listing.chain.label.split(' ')[0].toLowerCase()

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
      <div className={styles.domainHeader}>
        <DomainAvatar extension={listing.extension} className={styles.avatar} />
        <div className={styles.domainText}>
          <div className={styles.nameRow}>
            <span className={styles.domainName}>{listing.domainName}</span>
            <ExtensionBadge extension={listing.extension} className={styles.extension} />
          </div>
          <div className={styles.metaRow}>
            {listing.chain.iconSrc && <Image src={listing.chain.iconSrc} alt="" aria-hidden="true" width={12} height={12} />}
            <span className={styles.meta}>
              {chainShortName(listing)} · {listing.domainName.length} chars
              {listing.isOneTimePurchase && ' · one time · no renewal'}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.price}>
        <span className={styles.priceAmount}>{formatToken(listing.priceUsd)}</span>
        <TokenSuffix iconSize={15} iconFirst className={styles.priceSymbol} />
      </div>
    </section>

    <PaymentMethodSection balanceUsd={balanceUsd} chainName={chainShortName(listing)} />
    <WhatYouPaySection priceUsd={listing.priceUsd} networkFeeUsd={insights.networkFeeEstimateUsd} balanceUsd={balanceUsd} />
    <AfterYouBuySection sellerAddress={listing.sellerAddress} expiresAt={listing.expiresAt} />
  </div>
)

export default ReviewPurchaseStep
