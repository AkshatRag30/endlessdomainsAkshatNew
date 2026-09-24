import React from 'react'
import Image from 'next/image'
import WalletPendingStep from '@/marketplace-preview/design-system/primitives/wallet-pending-step'
import TransactionChecklist, { type TransactionChecklistItem } from '@/marketplace-preview/design-system/primitives/progress/transaction-checklist'
import type { Chain } from '@/marketplace-preview/types/marketplace'
import { formatToken } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './BuyPendingStep.module.scss'

export type BuyPendingPhase = 'approving' | 'confirming' | 'settling'

export interface BuyPendingStepProps {
  phase: BuyPendingPhase
  /** Whether this purchase needed a USDT approval first — adds the "Approve USDT" row, 4 rows instead of 3. */
  includeApprovalRow: boolean
  priceUsd: number
  domainLabel: string // e.g. "cryptowave.ud"
  chain: Chain
  /** Lowercase chain name as Figma writes it in prose ("Settling on polygon"). */
  chainShortName: string
  /** Truncated display hash, shown once the purchase is submitted ('settling' only). */
  txHashLabel?: string
}

const PHASE_ORDER: BuyPendingPhase[] = ['approving', 'confirming', 'settling']

function statusFor(rowPhase: BuyPendingPhase, current: BuyPendingPhase): TransactionChecklistItem['status'] {
  const diff = PHASE_ORDER.indexOf(current) - PHASE_ORDER.indexOf(rowPhase)
  if (diff > 0) return 'done'
  return diff === 0 ? 'active' : 'pending'
}

function checklistItems(phase: BuyPendingPhase, includeApprovalRow: boolean): TransactionChecklistItem[] {
  const items: TransactionChecklistItem[] = [
    { label: 'Confirm purchase', status: statusFor('confirming', phase) },
    { label: 'Settling on chain', status: statusFor('settling', phase) },
    // Only ever becomes done on the Bought screen, which has no checklist.
    { label: 'Domain transferred', status: 'pending' },
  ]
  return includeApprovalRow ? [{ label: 'Approve USDT', status: statusFor('approving', phase) }, ...items] : items
}

/**
 * The buying flow's wallet-pending screens, one thin wrapper around the
 * shared WalletPendingStep (size "lg") so BuyFlowModal doesn't need to know
 * the per-phase copy/checklist details.
 *
 * - 'approving' — Figma 1:877 ("Approving"): the USDT approve() prompt.
 * - 'confirming' — Figma 1:156 ("Confirm purchase"): the purchase itself.
 * - 'settling' — Figma 1:1066 ("Purchase submitted"): the wallet has
 *   signed, the transaction is on its way; dismissible (BuyFlowModal).
 *
 * Flag for design: both 1:877 and 1:1066 draw the checklist one step behind
 * their own copy — 1:877's approval prompt already shows "Approve USDT"
 * done, and 1:1066's "The transaction is in" still shows "Confirm purchase"
 * spinning with "Settling on chain" pending. Here the active row is always
 * the one the screen's own heading describes.
 */
export const BuyPendingStep = ({ phase, includeApprovalRow, priceUsd, domainLabel, chain, chainShortName, txHashLabel }: BuyPendingStepProps) => {
  const amount = <strong>{formatToken(priceUsd)} USDT</strong>
  const heading = phase === 'settling' ? `Settling on ${chainShortName}` : 'Confirm in your wallet'
  let subtext: React.ReactNode
  if (phase === 'approving') {
    subtext = <>Your wallet is open. This allows exactly {amount} to be spent on this purchase.</>
  } else if (phase === 'confirming') {
    subtext = <>Your wallet is open. Confirming sends {amount} and receives {domainLabel} in the same transaction.</>
  } else {
    subtext = 'The transaction is in. Nothing else is needed from you, and you can close this and keep browsing.'
  }

  return (
    <WalletPendingStep status="pending" size="lg" showWaitingRow={false} heading={heading} subtext={subtext}>
      <TransactionChecklist items={checklistItems(phase, includeApprovalRow)} />
      {phase === 'settling' && (
        <div className={styles.submitted}>
          <dl className={styles.txCard}>
            <div className={styles.txRow}>
              <dt>Transaction</dt>
              <dd>{txHashLabel}</dd>
            </div>
            <div className={styles.txRow}>
              <dt>Network</dt>
              <dd className={styles.network}>
                {chain.iconSrc && <Image src={chain.iconSrc} alt="" aria-hidden="true" width={17} height={17} />}
                {chain.label}
              </dd>
            </div>
          </dl>
          <p className={styles.helper}>Typically under 30 seconds. We will notify you either way.</p>
        </div>
      )}
    </WalletPendingStep>
  )
}

export default BuyPendingStep
