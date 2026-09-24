import React from 'react'
import Link from 'next/link'
import Checkbox from '@/marketplace-preview/design-system/primitives/inputs/checkbox'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import styles from './PurchaseTermsFooter.module.scss'

export interface PurchaseTermsFooterProps {
  /**
   * The terms checkbox, which gates the CTA. Optional: the review screen
   * passes it; the approval explainer (1:856) leaves it out at product's
   * request, so its CTA is gated by `ctaDisabled` alone.
   */
  termsAccepted?: boolean
  onTermsChange?: (accepted: boolean) => void
  ctaLabel: string
  onCta: () => void
  /** Extra gating on top of the terms checkbox (e.g. a blocking banner in Phases C/D). */
  ctaDisabled?: boolean
  submitting?: boolean
  /** Line under the review CTA: "Resolve the notice above to continue" until the terms box is ticked, then "Opens your wallet to confirm" (1:1296 / 1:805). */
  helperText?: string
  /** "Back" link under the approval explainer's CTA (1:870) — takes the place of helperText. */
  onBack?: () => void
}

/**
 * Figma nodes 1:791 (review purchase) / 1:856 (approval explainer) — the
 * pinned footer both screens share: an optional terms checkbox that gates
 * the CTA (review only — the explainer drops it at product's request, though
 * Figma 1:857 draws it there too), the CTA itself, then either a helper line
 * or a Back link. Rendered into Modal's `footer` slot, same split as the
 * listing flow's step footers.
 *
 * There is no terms page anywhere in this app yet, so "terms" points at a
 * /terms route that 404s today — opened in a new tab so following it never
 * discards the drawer's in-progress purchase. Swap the href once a real
 * terms page exists.
 */
export const PurchaseTermsFooter = ({
  termsAccepted,
  onTermsChange,
  ctaLabel,
  onCta,
  ctaDisabled = false,
  submitting = false,
  helperText,
  onBack,
}: PurchaseTermsFooterProps) => {
  const hasTerms = onTermsChange !== undefined

  return (
    <div className={styles.footer}>
      {hasTerms && (
        <Checkbox
          checked={!!termsAccepted}
          onChange={onTermsChange}
          label={
            <>
              I understand this purchase is final once the transaction settles, and I have read the{' '}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
                terms
              </Link>
              <span className={styles.termsPeriod}>.</span>
            </>
          }
        />
      )}
      <PrimaryButton
        fullWidth
        loading={submitting}
        disabled={(hasTerms && !termsAccepted) || ctaDisabled}
        onClick={onCta}
        className={styles.cta}
      >
        {ctaLabel}
      </PrimaryButton>
      {onBack ? (
        <button type="button" className={styles.backLink} onClick={onBack}>
          Back
        </button>
      ) : (
        helperText && <p className={styles.helper}>{helperText}</p>
      )}
    </div>
  )
}

export default PurchaseTermsFooter
