import React, { useState } from 'react'
import { FiInfo, FiClock, FiAlertTriangle } from 'react-icons/fi'
import type { DomainListingInsights, MyDomainListing } from '@/marketplace-preview/types/my-domains'
import DomainAvatar from '@/marketplace-preview/design-system/primitives/avatars/domain-avatar'
import ExtensionBadge from '@/marketplace-preview/design-system/primitives/badges/extension-badge'
import ChainBadge from '@/marketplace-preview/design-system/primitives/badges/chain-badge'
import PriceInput from '@/marketplace-preview/design-system/primitives/inputs/price-input'
import PillButton from '@/marketplace-preview/design-system/primitives/buttons/pill-button'
import SegmentedToggle from '@/marketplace-preview/design-system/primitives/toggles/segmented-toggle'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import DomainInsightsCard from '../DomainInsightsCard'
import FeeBreakdownRow from '../FeeBreakdownRow'
import TokenChainIcon from '../TokenChainIcon'
import { formatExpiry, formatToken } from '../format'
import styles from './ListingFormStep.module.scss'

export type HowToSell = 'fixed' | 'auction'
export type ListingDurationDays = 7 | 30 | 90

const DAY_MS = 24 * 60 * 60 * 1000

export interface ListingFormStepProps {
  domain: MyDomainListing
  insights: DomainListingInsights
  price: string
  onPriceChange: (value: string) => void
  durationDays: ListingDurationDays
  onDurationChange: (days: ListingDurationDays) => void
  /** Figma node 1:9355 — non-blocking, the form underneath still renders and is fillable while this shows. */
  isWrongNetwork?: boolean
  onSwitchNetwork?: () => void
  switchingNetwork?: boolean
}

/** Figma node 1:8593 ("Edit listing" frame) — the form body between the modal's header and pinned footer. */
export const ListingFormStep = ({
  domain,
  insights,
  price,
  onPriceChange,
  durationDays,
  onDurationChange,
  isWrongNetwork = false,
  onSwitchNetwork,
  switchingNetwork = false,
}: ListingFormStepProps) => {
  const [howToSell, setHowToSell] = useState<HowToSell>('fixed')
  const priceNumber = Number(price)
  const expiresAt = Date.now() + durationDays * DAY_MS

  return (
    <div className={styles.form}>
      {isWrongNetwork && (
        <div className={styles.networkBanner}>
          <FiAlertTriangle size={16} aria-hidden="true" className={styles.networkBannerIcon} />
          <div className={styles.networkBannerText}>
            <p className={styles.networkBannerTitle}>Your wallet is on Ethereum</p>
            <p className={styles.networkBannerBody}>Listings settle on Polygon, so the order cannot be signed from another network.</p>
          </div>
          <PrimaryButton size="sm" variant="error" loading={switchingNetwork} onClick={onSwitchNetwork} className={styles.switchButton}>
            Switch
          </PrimaryButton>
        </div>
      )}

      <section className={styles.section}>
        <div className={styles.domainHeader}>
          <DomainAvatar extension={domain.extension} />
          <div className={styles.domainText}>
            <div className={styles.nameRow}>
              <span className={styles.domainName}>{domain.domainName}</span>
              <ExtensionBadge extension={domain.extension} />
            </div>
            <div className={styles.metaRow}>
              <ChainBadge chain={domain.chain} />
              <span className={styles.metaDivider} aria-hidden="true">·</span>
              <span className={styles.chars}>{domain.lengthChars} chars</span>
            </div>
          </div>
        </div>
        <div className={styles.infoNote}>
          <FiInfo size={14} aria-hidden="true" />
          <span>It stays in your wallet the whole time. It only moves if someone buys at your price.</span>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>How to sell</h3>
        <SegmentedToggle
          variant="radio"
          value={howToSell}
          onChange={setHowToSell}
          options={[
            { value: 'fixed', label: 'Fixed price', sublabel: 'One price, instant purchase, settles on chain.' },
            { value: 'auction', label: 'Auction', sublabel: 'Timed bidding. In the contract, not yet in the interface.', disabled: true, badge: 'Coming Soon' },
          ]}
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Your price · buyers pay this exact amount</h3>
        <PriceInput
          value={price}
          onChange={onPriceChange}
          tokenSymbol="USDT"
          tokenIcon={<TokenChainIcon chainIconSrc={domain.chain.iconSrc} />}
          className={styles.priceInput}
        />
        <div className={styles.pillRow}>
          <PillButton active={priceNumber === insights.quickSaleUsd} onClick={() => onPriceChange(String(insights.quickSaleUsd))}>
            Quick sale {formatToken(insights.quickSaleUsd)}
          </PillButton>
          <PillButton active={priceNumber === insights.suggestedUsd} onClick={() => onPriceChange(String(insights.suggestedUsd))}>
            Suggested {formatToken(insights.suggestedUsd)}
          </PillButton>
          <PillButton active={priceNumber === insights.ambitiousUsd} onClick={() => onPriceChange(String(insights.ambitiousUsd))}>
            Ambitious {formatToken(insights.ambitiousUsd)}
          </PillButton>
        </div>
        <DomainInsightsCard insights={insights} className={styles.insightsCard} />
      </section>

      <section className={`${styles.section} ${styles.sectionLast}`}>
        <h3 className={styles.heading}>How long it runs</h3>
        <SegmentedToggle
          variant="centered"
          value={String(durationDays)}
          onChange={(value) => onDurationChange(Number(value) as ListingDurationDays)}
          options={[
            { value: '7', label: '7', sublabel: 'days' },
            { value: '30', label: '30', sublabel: 'days' },
            { value: '90', label: '90', sublabel: 'days' },
          ]}
        />
        <p className={styles.expires}>
          <FiClock size={12} aria-hidden="true" /> Expires <strong>{formatExpiry(expiresAt)}</strong>
        </p>
        <p className={styles.helper}>Maximum 90 days. The signed order stays valid until it expires, so shorter runs keep more control with you.</p>
      </section>
    </div>
  )
}

export default ListingFormStep

export interface ListingFormFooterProps {
  price: string
  hasApproval: boolean
  onSubmit: () => void
  submitting?: boolean
  /** Figma node 1:9355 — the wrong-network banner is non-blocking for the form itself, but signing still needs the wallet on the right chain, so the CTA stays disabled until the user switches. */
  isWrongNetwork?: boolean
}

/**
 * Rendered separately from the form body above and passed into Modal's
 * `footer` slot (implementation plan §4.1 — header/footer pinned, only the
 * middle content scrolls), even though Figma draws it as part of the same
 * "Form" frame.
 */
export const ListingFormFooter = ({ price, hasApproval, onSubmit, submitting = false, isWrongNetwork = false }: ListingFormFooterProps) => {
  const priceNumber = Number(price) || 0

  return (
    <div className={styles.footer}>
      <FeeBreakdownRow priceUsd={priceNumber} />
      <PrimaryButton fullWidth loading={submitting} disabled={!price || isWrongNetwork} onClick={onSubmit}>
        {hasApproval ? 'Sign to list' : 'Approve, then sign'}
      </PrimaryButton>
      <p className={styles.gasNote}>
        <strong>No gas.</strong> Signing is free, instant, and cancelling later is free too.
      </p>
    </div>
  )
}
