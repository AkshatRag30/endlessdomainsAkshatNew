import React, { useEffect, useRef, useState } from 'react'
import Modal from '@/marketplace-preview/design-system/primitives/modal'
import StatusIcon from '@/marketplace-preview/design-system/primitives/badges/status-icon'
import TokenSuffix from '@/marketplace-preview/design-system/primitives/token-suffix'
import { WalletPendingFooter } from '@/marketplace-preview/design-system/primitives/wallet-pending-step'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import ToastMessage from '@/design-system/primitives/toast-message'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import type { MarketplaceListing } from '@/marketplace-preview/types/marketplace'
import { mockMarketplaceBuyInsights } from '@/marketplace-preview/data/marketplace/domains'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import ReviewPurchaseStep, { chainShortName, type ReviewPurchaseNotice } from '../ReviewPurchaseStep'
import ApprovalExplainerStep from '../ApprovalExplainerStep'
import PurchaseTermsFooter from '../PurchaseTermsFooter'
import BuyPendingStep from '../BuyPendingStep'
import BuyResultStep, { BuyResultFooter } from '../BuyResultStep'
import { useBuyFlowActions } from '../useBuyFlowActions'
import styles from './BuyFlowModal.module.scss'

/**
 * A wallet whose USDT allowance can't cover this price ("need usdt
 * approval", Figma section 1:649) goes
 * review -> approval-explainer -> pending-approving -> pending-confirming -> pending-settling -> success;
 * one whose allowance already covers it ("normal purchase", 1:101) skips the
 * explainer and the approving phase, and its checklist drops the "Approve
 * USDT" row. A wallet on the wrong network ("wrong network", 1:988) is held
 * on review behind a pinned banner until it switches; settling can end in
 * success, reject (1:1043) or no-longer-available (1:1478, another wallet
 * bought it first while this purchase was settling).
 */
export type BuyFlowStep =
  | 'review'
  | 'approval-explainer'
  | 'pending-approving'
  | 'pending-confirming'
  | 'pending-settling'
  | 'success'
  | 'reject'
  | 'no-longer-available'

export interface BuyFlowModalProps {
  isOpen: boolean
  onClose: () => void
  listing: MarketplaceListing
  /**
   * "Watch this name" (1:1520). Reuses the marketplace's existing watchlist
   * — the heart on every listing row/card ("Add to watchlist") — rather than
   * new state (plan §2.1), so the caller passes its own add-to-watchlist.
   */
  onWatch?: (listing: MarketplaceListing) => void
}

// Both wallet prompts are non-dismissible, same reasoning as the listing
// flow's approval-pending/signing: closing the drawer can't cancel a prompt
// the wallet itself is showing. 'pending-settling' IS dismissible — the
// transaction is already in, and it keeps settling after the drawer closes.
const NON_DISMISSIBLE_STEPS: BuyFlowStep[] = ['pending-approving', 'pending-confirming']

const TITLE_BY_STEP: Record<BuyFlowStep, string> = {
  review: 'Review purchase',
  // Figma 1:812 keeps "Review purchase" on the approval explainer too — kept as drawn (plan §2.1).
  'approval-explainer': 'Review purchase',
  'pending-approving': 'Approving',
  'pending-confirming': 'Confirm purchase',
  'pending-settling': 'Purchase submitted',
  success: 'Bought',
  reject: 'Reject',
  'no-longer-available': 'No longer available',
}

const BOUGHT_SUBTEXT = 'Ownership transferred in the same transaction as the payment. It will appear in your account within 10 to 15 minutes.'

/** "0x7f3a…456e8" — Figma 1:973's own truncation: 6 leading characters, 5 trailing. */
const truncateHash = (hash: string) => `${hash.slice(0, 6)}…${hash.slice(-5)}`

interface NetworkState {
  ok: boolean
  walletChainName?: string
  requiredChainName?: string
}

/** Orchestrates the buying flow across the shared right-edge drawer (the listing flow's Modal, unmodified). */
export const BuyFlowModal = ({ isOpen, onClose, listing, onWatch }: BuyFlowModalProps) => {
  const [step, setStep] = useState<BuyFlowStep>('review')
  const [termsAccepted, setTermsAccepted] = useState(false)
  // Snapshotted on open (not re-read every render) so the balance a buyer is
  // reviewing doesn't change under them once the mock purchase debits it.
  const [balanceUsd, setBalanceUsd] = useState(0)
  // Snapshotted on open too — a successful approve() changes the live
  // answer, but the checklist should keep showing the "Approve USDT" row
  // for the rest of this purchase.
  const [neededApproval, setNeededApproval] = useState(false)
  // "no fund" (Figma 1:1529) — a real numeric comparison against the wallet
  // balance (plan §6.2), not a fixture flag. Snapshotted with the balance.
  const [hasFunds, setHasFunds] = useState(true)
  const [txHash, setTxHash] = useState('')
  // null = the mock network read is still in flight: no banner yet, but the
  // CTA stays disabled until the wallet's chain is confirmed.
  const [network, setNetwork] = useState<NetworkState | null>(null)
  const [switchingNetwork, setSwitchingNetwork] = useState(false)
  // Bumped on every open, so a wallet round-trip that resolves after the
  // drawer was reopened for another listing can't advance the new session.
  const runId = useRef(0)
  // Read by settlement callbacks that outlive a closed drawer, to decide
  // between updating the screen and notifying with a toast instead.
  const isOpenRef = useRef(isOpen)
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  const actions = useBuyFlowActions(listing)
  const { needsUsdtApproval, getUsdtBalance, hasSufficientBalance, checkNetwork } = actions
  const insights = mockMarketplaceBuyInsights[listing.id]
  const priceUsd = listing.priceUsd
  const domainLabel = `${listing.domainName}${listing.extension}`
  const soldSubtext = `${domainLabel} was bought by another wallet about a minute ago. Nothing was charged to you.`

  useEffect(() => {
    if (!isOpen) return
    runId.current += 1
    const run = runId.current
    setStep('review')
    setTermsAccepted(false)
    setTxHash('')
    setBalanceUsd(getUsdtBalance())
    setHasFunds(hasSufficientBalance(priceUsd))
    // Re-read per open, never cached across opens — plan §11's allowance
    // check depends on a second, differently-priced listing seeing the
    // approval that the previous purchase consumed.
    setNeededApproval(needsUsdtApproval(priceUsd))
    setNetwork(null)
    setSwitchingNetwork(false)
    checkNetwork().then((result) => {
      if (run === runId.current) setNetwork(result)
    })
  }, [isOpen, listing.id, priceUsd, getUsdtBalance, hasSufficientBalance, needsUsdtApproval, checkNetwork])

  if (!insights) return null // fixture gap — every mock listing has an insights entry, guards a future data change

  const handleSwitchNetwork = async () => {
    const run = runId.current
    setSwitchingNetwork(true)
    await actions.switchNetwork()
    if (run !== runId.current) return
    setSwitchingNetwork(false)
    setNetwork({ ok: true })
  }

  const runPurchase = async (run: number) => {
    setStep('pending-confirming')
    const submitted = await actions.confirmPurchase({ listingId: listing.id, priceUsd })
    if (run !== runId.current) return
    if (!submitted.ok) {
      // Declined in the wallet — same Reject screen as an on-chain failure.
      setStep('reject')
      return
    }
    setTxHash(submitted.txHash)
    setStep('pending-settling')

    const settled = await actions.awaitSettlement(submitted.txHash)
    // "We will notify you either way" (1:1128): once the buyer has closed the
    // drawer or moved on to another listing, the result arrives as a toast
    // instead. Toast copy reuses Figma's own lines (Bought 1:942/1:944,
    // Reject 1:1049, No longer available 1:1487/1:1489); there's no
    // dedicated notification design yet.
    if (!isOpenRef.current || run !== runId.current) {
      if (settled.ok) ToastMessage(TOAST_TYPE.SUCCESS, `${domainLabel} is yours`, BOUGHT_SUBTEXT)
      else if (settled.reason === 'already-sold') ToastMessage(TOAST_TYPE.ERROR, 'This listing just ended', soldSubtext)
      else ToastMessage(TOAST_TYPE.ERROR, 'Transaction fail', 'Nothing was charged to you.')
      return
    }
    if (settled.ok) setStep('success')
    else setStep(settled.reason === 'already-sold' ? 'no-longer-available' : 'reject')
  }

  // Reject's "Try Again": back to review with a fresh approval/balance read,
  // not the values snapshotted on open — a failed purchase charged nothing,
  // so an approval made on the way in still covers this price.
  const handleTryAgain = () => {
    setBalanceUsd(getUsdtBalance())
    setHasFunds(hasSufficientBalance(priceUsd))
    setNeededApproval(needsUsdtApproval(priceUsd))
    setTxHash('')
    setStep('review')
  }

  const handleReviewCta = () => {
    if (neededApproval) {
      setStep('approval-explainer')
      return
    }
    runPurchase(runId.current)
  }

  const handleApprove = async () => {
    const run = runId.current
    setStep('pending-approving')
    await actions.approveUsdt(priceUsd)
    if (run !== runId.current) return
    await runPurchase(run)
  }

  const wrongNetwork = network?.ok === false
  const shortChain = chainShortName(listing)

  let body: React.ReactNode = null
  let footer: React.ReactNode = null

  if (step === 'review') {
    // One banner at a time: the wrong network first (nothing can be signed
    // until the wallet switches), then insufficient funds.
    let notice: ReviewPurchaseNotice | undefined
    if (wrongNetwork) {
      // Figma 1:1297. "Listings settle… the order cannot be signed" is the
      // listing flow's banner copy, carried over verbatim in this file too
      // (its layer is still named "My domains · listing drawer") — kept as
      // drawn, worth a buying-specific rewrite from design.
      notice = {
        tone: 'error',
        title: `Your wallet is on ${network?.walletChainName}`,
        body: `Listings settle on ${network?.requiredChainName}, so the order cannot be signed from another network.`,
        actionLabel: 'Switch',
        onAction: handleSwitchNetwork,
        actionLoading: switchingNetwork,
      }
    } else if (!hasFunds) {
      notice = {
        tone: 'warning',
        // Flag for design (plan §2.1): Figma 1:1692's heading is a leftover
        // copy of the wrong-network banner's, wrong for a balance shortfall.
        // Kept verbatim rather than inventing replacement copy.
        title: 'Your wallet is on Ethereum',
        // Figma 1:1693's own example numbers contradict themselves ("You
        // hold 41,200.00 and this costs 8,460.00"); the real balance and
        // price fill the same sentence here.
        body: `You hold ${formatToken(balanceUsd)} and this costs ${formatToken(priceUsd)}. Top up or pick a cheaper name.`,
        actionLabel: 'Add Funds',
        // No top-up flow exists yet (out of scope, plan §1.2) — visually
        // real but inert, same convention as "View receipt".
        onAction: () => {},
      }
    }
    body = <ReviewPurchaseStep listing={listing} insights={insights} balanceUsd={balanceUsd} notice={notice} />
    footer = (
      <PurchaseTermsFooter
        termsAccepted={termsAccepted}
        onTermsChange={setTermsAccepted}
        // Figma 1:803 — the approval scenario's CTA names both steps, the
        // same way the listing flow's first-time CTA reads "Approve, then sign".
        ctaLabel={neededApproval ? 'Approve USDT, then buy' : `Buy for ${formatToken(priceUsd)} USDT`}
        onCta={handleReviewCta}
        // Figma 1:1282 / 1:1679 draw the CTA at full strength next to either
        // banner; it's disabled here anyway (plan §2.1's "safer default"): a
        // purchase can't be signed from the wrong network or without funds.
        ctaDisabled={network?.ok !== true || !hasFunds}
        // "The notice above" is the terms checkbox right above the CTA, not
        // the network banner: the helper asks for the box to be ticked, then
        // says what the button does. That's why 1:1141 and 1:1316 (unticked)
        // both show "Resolve…" with or without the banner. Figma 1:650 draws
        // an unticked box with "Opens your wallet to confirm"; this follows
        // the checkbox rule instead.
        helperText={termsAccepted ? 'Opens your wallet to confirm' : 'Resolve the notice above to continue'}
      />
    )
  } else if (step === 'approval-explainer') {
    body = (
      <ApprovalExplainerStep
        priceUsd={priceUsd}
        approvalFeeUsd={insights.approvalFeeEstimateUsd}
        purchaseFeeUsd={insights.networkFeeEstimateUsd}
      />
    )
    footer = (
      // No terms checkbox here (product request) — the terms were already
      // accepted on the review screen before reaching this step.
      <PurchaseTermsFooter
        ctaLabel="Approve in wallet"
        onCta={handleApprove}
        onBack={() => setStep('review')}
      />
    )
  } else if (step === 'pending-approving' || step === 'pending-confirming' || step === 'pending-settling') {
    const phase = step === 'pending-approving' ? 'approving' : step === 'pending-confirming' ? 'confirming' : 'settling'
    body = (
      <BuyPendingStep
        phase={phase}
        includeApprovalRow={neededApproval}
        priceUsd={priceUsd}
        domainLabel={domainLabel}
        chain={listing.chain}
        chainShortName={shortChain}
        txHashLabel={txHash ? truncateHash(txHash) : undefined}
      />
    )
    footer =
      phase === 'settling' ? (
        // Figma 1:1130 — a real, enabled button: the purchase keeps settling after the drawer closes.
        <div className={styles.footer}>
          <PrimaryButton fullWidth onClick={onClose}>
            Keep browsing
          </PrimaryButton>
        </div>
      ) : (
        <WalletPendingFooter />
      )
  } else if (step === 'success') {
    body = (
      <BuyResultStep
        icon={<StatusIcon variant="success" />}
        heading={`${domainLabel} is yours`}
        subtext={BOUGHT_SUBTEXT}
        summaryRows={[
          { label: 'You paid', value: <>{formatToken(priceUsd)} <TokenSuffix iconSize={15} /></> },
          { label: 'Network fee', value: <>{formatToken(insights.networkFeeEstimateUsd)} <TokenSuffix iconSize={15} /></> },
          { label: 'Transaction', value: truncateHash(txHash), small: true },
        ]}
      />
    )
    footer = <BuyResultFooter primaryLabel="View receipt" secondaryLabel="Keep browsing" onSecondary={onClose} />
  } else if (step === 'reject') {
    body = (
      <BuyResultStep
        icon={<StatusIcon variant="error" />}
        heading="Transaction fail"
        // Flag for design (plan §2.1): Figma 1:1051 is a verbatim copy of the
        // Bought screen's success subtext, which contradicts a failure. Kept
        // as drawn rather than inventing replacement copy.
        subtext={BOUGHT_SUBTEXT}
      />
    )
    footer = <BuyResultFooter primaryLabel="Try Again" onPrimary={handleTryAgain} secondaryLabel="Keep browsing" onSecondary={onClose} />
  } else if (step === 'no-longer-available') {
    body = (
      <BuyResultStep
        icon={<StatusIcon variant="error" glyph="exclamation" />}
        heading="This listing just ended"
        subtext={soldSubtext}
        summaryRows={[
          { label: 'Sold for', value: <>{formatToken(priceUsd)} <TokenSuffix iconSize={15} /></> },
          // Flag for design (plan §2.1): Figma 1:1509 shows the same amount as
          // "Sold for" — either "the estimate was spot on" or reused
          // placeholder data. The real per-listing estimate is shown here, so
          // the two only match when the listing sold at its estimate.
          { label: 'Model estimate', value: <>{formatToken(insights.modelEstimateUsd)} <TokenSuffix iconSize={15} /></> },
        ]}
        helperText="You can watch the name in case it is relisted, or look at similar ones."
      />
    )
    footer = (
      <BuyResultFooter
        primaryLabel="Watch this name"
        onPrimary={
          onWatch &&
          (() => {
            onWatch(listing)
            onClose()
          })
        }
        // "See similar" implies a filtered discovery view outside the drawer,
        // which doesn't exist yet (plan §9) — visually real but inert, same
        // convention as "View receipt" and "Add Funds".
        secondaryLabel="See similar"
      />
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={TITLE_BY_STEP[step]}
      dismissible={!NON_DISMISSIBLE_STEPS.includes(step)}
      footer={footer}
    >
      {body}
    </Modal>
  )
}

export default BuyFlowModal
