import React, { useId, useState } from 'react'
import PrimaryButton from '@/marketplace-preview/design-system/primitives/buttons/primary-button'
import { acceptPriceInput, normalizePrice, PRICE_FILTER_MAX, validatePriceBounds } from '@/marketplace-preview/helpers/marketplace/priceFilter'
import styles from './PriceFilterPanel.module.scss'

export interface PriceFilterPanelProps {
  /** The applied bounds, '' meaning none; the fields start from these. */
  minPrice: string
  maxPrice: string
  currency: string
  /** Called with normalised bounds ('' for none) on Apply or Clear. */
  onApply: (minPrice: string, maxPrice: string) => void
  /** Closes the dropdown hosting the panel. */
  onClose?: () => void
}

type Field = 'min' | 'max'

/**
 * Min and max price inputs for ListingFilterBar's Price pill, replacing the
 * old slider. No Figma frame exists for this panel, so it uses the design
 * system's roles and PrimaryButton.
 *
 * Typing is checked per keystroke (acceptPriceInput): digits and one dot
 * only, at most 6 decimals, never negative, never above 9B; a refused
 * keystroke leaves the field as it was and says why. Apply (or Enter)
 * checks the pair (min not above max) and applies normalised values; Clear
 * removes both bounds. The draft only reaches the filters on Apply, so the
 * table doesn't refilter and refetch on every keystroke.
 */
export const PriceFilterPanel = ({ minPrice, maxPrice, currency, onApply, onClose }: PriceFilterPanelProps) => {
  const id = useId()
  const [draft, setDraft] = useState<Record<Field, string>>({ min: minPrice, max: maxPrice })
  const [typingError, setTypingError] = useState<Partial<Record<Field, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  // Pair errors (an unusable value, min above max) show once Apply was tried;
  // typing errors show straight away and clear on the next accepted keystroke.
  const boundsErrors = submitted ? validatePriceBounds(draft.min, draft.max) : {}
  const errorFor = (field: Field) => typingError[field] ?? boundsErrors[field]

  const handleChange = (field: Field) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = acceptPriceInput(event.target.value)
    if (!result.ok) {
      setTypingError((prev) => ({ ...prev, [field]: result.error }))
      return
    }
    setTypingError((prev) => ({ ...prev, [field]: undefined }))
    setDraft((prev) => ({ ...prev, [field]: result.value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const errors = validatePriceBounds(draft.min, draft.max)
    if (errors.min || errors.max) return
    onApply(normalizePrice(draft.min) ?? '', normalizePrice(draft.max) ?? '')
    onClose?.()
  }

  const handleClear = () => {
    onApply('', '')
    onClose?.()
  }

  const renderField = (field: Field, label: string, placeholder: string) => {
    const error = errorFor(field)
    const inputId = `${id}-${field}`
    const errorId = `${inputId}-error`
    return (
      <div className={styles.field}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <div className={`${styles.inputWrap} ${error ? styles.inputWrapError : ''}`}>
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            className={styles.input}
            placeholder={placeholder}
            value={draft[field]}
            onChange={handleChange(field)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <span className={styles.currency} aria-hidden="true">
            {currency}
          </span>
        </div>
        {error && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit} noValidate aria-label={`Price range in ${currency}`}>
      <div className={styles.fields}>
        {renderField('min', 'Min', '0')}
        {renderField('max', 'Max', PRICE_FILTER_MAX.toLocaleString('en-US'))}
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.clear} onClick={handleClear} disabled={minPrice === '' && maxPrice === '' && draft.min === '' && draft.max === ''}>
          Clear
        </button>
        <PrimaryButton type="submit" size="sm" className={styles.apply}>
          Apply
        </PrimaryButton>
      </div>
    </form>
  )
}

export default PriceFilterPanel
