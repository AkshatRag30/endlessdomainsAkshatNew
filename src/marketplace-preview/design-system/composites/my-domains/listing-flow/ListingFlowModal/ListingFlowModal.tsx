import React, { useEffect, useState } from 'react'
import Modal from '@/marketplace-preview/design-system/primitives/modal'
import ToastMessage from '@/design-system/primitives/toast-message'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import type { MyDomainListing } from '@/marketplace-preview/types/my-domains'
import { mockDomainListingInsights } from '@/marketplace-preview/data/my-domains/domains'
import LoadingStep from '../LoadingStep'
import ListingFormStep, { ListingFormFooter, type ListingDurationDays } from '../ListingFormStep'
import OneTimeApprovalStep, { OneTimeApprovalFooter } from '../OneTimeApprovalStep'
import WalletPendingStep, { WalletPendingFooter } from '../WalletPendingStep'
import ConfirmToSignStep, { ConfirmToSignFooter } from '../ConfirmToSignStep'
import ListingSuccessStep, { ListingSuccessFooter } from '../ListingSuccessStep'
import { computeFeeBreakdown } from '../format'
import { useListingFlowActions } from '../useListingFlowActions'

const DAY_MS = 24 * 60 * 60 * 1000
// Figma §2.1 "Loading" — a fixed short delay standing in for the modal's
// own data (insights, suggested price) resolving, not a real fetch.
const LOADING_DELAY_MS = 500

/**
 * 'loading' (Phase E) is now the real first screen every entry point shows,
 * for LOADING_DELAY_MS, before ListingFlowModal auto-advances to 'form'.
 * 'confirm' (ConfirmToSignStep, Phase B) is live: both paths land on it
 * before signing — an already-approved wallet goes
 * form -> confirm -> signing -> success, and a wallet that still needs the
 * one time approval goes
 * form -> approval -> approval-pending -> confirm -> signing -> success.
 */
export type ListingFlowStep = 'loading' | 'form' | 'approval' | 'approval-pending' | 'confirm' | 'signing' | 'success' | 'insufficient-funds'

export interface ListingFlowModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'list' | 'edit'
  domain: MyDomainListing
}

const NON_DISMISSIBLE_STEPS: ListingFlowStep[] = ['approval-pending', 'signing']

/** Figma section 1:8452 ("first listing") — orchestrates the shared drawer shell across every step of the listing flow. */
export const ListingFlowModal = ({ isOpen, onClose, mode, domain }: ListingFlowModalProps) => {
  const [step, setStep] = useState<ListingFlowStep>('loading')
  const [price, setPrice] = useState('')
  const [durationDays, setDurationDays] = useState<ListingDurationDays>(30)
  const [submitting, setSubmitting] = useState(false)
  // null = not checked yet (banner stays hidden while the mock "read" is in
  // flight — the form itself still renders regardless, per plan §2.1's
  // "non-blocking" note).
  const [networkOk, setNetworkOk] = useState<boolean | null>(null)
  const [switchingNetwork, setSwitchingNetwork] = useState(false)

  const actions = useListingFlowActions(domain)
  const { checkNetwork, switchNetwork } = actions
  const insights = mockDomainListingInsights[domain.id]

  // Reset to a clean first screen every time the drawer opens (or opens for
  // a different domain) rather than resuming wherever a previous session
  // left off.
  useEffect(() => {
    if (!isOpen) return
    setStep('loading')
    setPrice(mode === 'edit' && domain.priceUsd != null ? String(domain.priceUsd) : '')
    setDurationDays(30)
    setSubmitting(false)
    setNetworkOk(null)
    setSwitchingNetwork(false)

    // Every entry point (hero CTA, row/card List or Edit Price, Quick
    // Actions) opens on this same loading step first — not a per-scenario
    // code path, just this one timer advancing to the form once "the
    // modal's own data" has had its fixed short delay to resolve.
    const loadingTimeout = setTimeout(() => setStep('form'), LOADING_DELAY_MS)

    let cancelled = false
    checkNetwork().then((result) => {
      if (cancelled) return
      setNetworkOk(result.ok)
      if (!result.ok) {
        ToastMessage(
          TOAST_TYPE.ERROR,
          'Your wallet is on Ethereum',
          'Listings settle on Polygon, so this token cannot be signed from another network.'
        )
      }
    })
    return () => {
      cancelled = true
      clearTimeout(loadingTimeout)
    }
  }, [isOpen, domain.id, mode, domain.priceUsd, checkNetwork])

  if (!insights) return null // fixture gap — every mock domain has an insights entry, guards a future data change

  const handleSwitchNetwork = async () => {
    setSwitchingNetwork(true)
    await switchNetwork()
    setSwitchingNetwork(false)
    setNetworkOk(true)
  }

  const handleSubmitForm = () => {
    // Already-approved wallets go to the confirm screen instead of straight
    // into a wallet round trip — Sign to go live is its own read, not a
    // pending state, so there's nothing to await here (implementation plan §5).
    setStep(actions.needsApproval() ? 'approval' : 'confirm')
  }

  const handleConfirmSign = async () => {
    setStep('signing')
    setSubmitting(true)
    const result = await actions.signAndSubmit({ priceUsd: Number(price), durationDays })
    setSubmitting(false)
    setStep(result.ok ? 'success' : 'insufficient-funds')
  }

  const handleApprove = async () => {
    setStep('approval-pending')
    setSubmitting(true)
    await actions.approve()
    setSubmitting(false)
    setStep('confirm')
  }

  const handleListAnother = () => {
    onClose()
  }

  const expiresAt = Date.now() + durationDays * DAY_MS
  const { buyerPays, feeAmount, youReceive } = computeFeeBreakdown(Number(price) || 0)

  const titleByStep: Record<ListingFlowStep, string> = {
    loading: mode === 'edit' ? 'Edit listing' : 'List a domain',
    form: mode === 'edit' ? 'Edit listing' : 'List a domain',
    approval: 'One time approval',
    'approval-pending': 'Signing',
    confirm: 'Sign to list',
    signing: 'Signing',
    success: 'Successfully Listed',
    'insufficient-funds': 'Signing',
  }

  let body: React.ReactNode = null
  let footer: React.ReactNode = null

  if (step === 'loading') {
    body = <LoadingStep />
  } else if (step === 'form') {
    body = (
      <ListingFormStep
        domain={domain}
        insights={insights}
        price={price}
        onPriceChange={setPrice}
        durationDays={durationDays}
        onDurationChange={setDurationDays}
        isWrongNetwork={networkOk === false}
        onSwitchNetwork={handleSwitchNetwork}
        switchingNetwork={switchingNetwork}
      />
    )
    footer = (
      <ListingFormFooter
        price={price}
        hasApproval={!actions.needsApproval()}
        onSubmit={handleSubmitForm}
        submitting={submitting}
        isWrongNetwork={networkOk === false}
      />
    )
  } else if (step === 'approval') {
    body = <OneTimeApprovalStep approvalFeeEstimate={insights.approvalFeeEstimate} />
    footer = <OneTimeApprovalFooter onApprove={handleApprove} onBack={() => setStep('form')} submitting={submitting} />
  } else if (step === 'confirm') {
    body = (
      <ConfirmToSignStep
        domainLabel={`${domain.domainName}${domain.extension}`}
        buyerPaysUsd={buyerPays}
        feeUsd={feeAmount}
        youReceiveUsd={youReceive}
        expiresAt={expiresAt}
      />
    )
    footer = <ConfirmToSignFooter onSign={handleConfirmSign} onBack={() => setStep('form')} submitting={submitting} />
  } else if (step === 'approval-pending') {
    body = (
      <WalletPendingStep
        status="pending"
        heading="Confirm the approval"
        subtext="Your wallet is open. This is the one time approval and it costs a small network fee."
      />
    )
    footer = <WalletPendingFooter />
  } else if (step === 'signing') {
    body = (
      <WalletPendingStep
        status="pending"
        heading="Sign the order"
        subtext="Your wallet is open. This is a signature, not a transaction, so there is nothing to wait for."
      />
    )
    footer = <WalletPendingFooter />
  } else if (step === 'insufficient-funds') {
    body = (
      <WalletPendingStep
        status="error"
        heading="Insufficient funds"
        subtext="Your wallet is open. This is a signature, not a transaction, so nothing is charged and there is nothing to wait for."
      />
    )
    footer = <WalletPendingFooter />
  } else if (step === 'success') {
    body = (
      <ListingSuccessStep
        domainLabel={`${domain.domainName}${domain.extension}`}
        listedAtUsd={Number(price) || 0}
        youReceiveUsd={youReceive}
        expiresAt={expiresAt}
      />
    )
    footer = <ListingSuccessFooter onListAnother={handleListAnother} />
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titleByStep[step]}
      dismissible={!NON_DISMISSIBLE_STEPS.includes(step)}
      footer={footer}
    >
      {body}
    </Modal>
  )
}

export default ListingFlowModal
