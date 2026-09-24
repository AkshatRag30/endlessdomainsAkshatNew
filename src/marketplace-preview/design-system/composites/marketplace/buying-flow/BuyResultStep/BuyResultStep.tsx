import React from 'react'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import styles from './BuyResultStep.module.scss'

export interface BuyResultSummaryRow {
  label: string
  value: React.ReactNode
  /** The transaction hash row's slightly smaller value type (Figma 1:973). */
  small?: boolean
}

export interface BuyResultStepProps {
  /** A StatusIcon — green check (Bought), red X (Reject) or red "!" (No longer available). */
  icon: React.ReactNode
  heading: string
  subtext: React.ReactNode
  summaryRows?: BuyResultSummaryRow[]
  helperText?: string
}

/**
 * The buying flow's shared "result screen" template (plan §2.1/§4.7): icon →
 * heading → subtext → optional dark summary card → optional helper text,
 * with BuyResultFooter's primary CTA + secondary link pinned below. Three
 * call sites: Bought (Figma 1:934), Reject (1:1043, no card) and No longer
 * available (1:1478, 2-row card + helper text).
 */
export const BuyResultStep = ({ icon, heading, subtext, summaryRows, helperText }: BuyResultStepProps) => {
  const bare = !summaryRows?.length && !helperText

  return (
    <div className={[styles.wrap, bare ? styles.wrapBare : ''].filter(Boolean).join(' ')}>
      {icon}
      <h3 className={styles.heading}>{heading}</h3>
      <p className={styles.subtext}>{subtext}</p>

      {summaryRows && summaryRows.length > 0 && (
        <dl className={styles.summaryCard}>
          {summaryRows.map((row) => (
            <div key={row.label} className={styles.summaryRow}>
              <dt>{row.label}</dt>
              <dd className={row.small ? styles.valueSmall : undefined}>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {helperText && <p className={styles.helper}>{helperText}</p>}
    </div>
  )
}

export default BuyResultStep

export interface BuyResultFooterProps {
  primaryLabel: string
  /** Optional — "View receipt" has no receipt view to open yet, so Bought leaves it visually real but inert, same convention as the rest of this preview. */
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export const BuyResultFooter = ({ primaryLabel, onPrimary, secondaryLabel, onSecondary }: BuyResultFooterProps) => (
  <div className={styles.footer}>
    <PrimaryButton fullWidth onClick={onPrimary}>
      {primaryLabel}
    </PrimaryButton>
    {secondaryLabel && (
      <button type="button" className={styles.secondaryLink} onClick={onSecondary}>
        {secondaryLabel}
      </button>
    )}
  </div>
)
