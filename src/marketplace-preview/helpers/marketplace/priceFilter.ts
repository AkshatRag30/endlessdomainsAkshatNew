// Rules for the Live Listings price filter (min and max inputs), shared by
// PriceFilterPanel (typing, validation, the trigger label) and
// useListingFilters' filterListings (matching). Both bounds are kept as
// strings, '' meaning "no bound", so a half typed value never turns into a
// number by accident.

/** Highest price either field accepts: 9 billion. */
export const PRICE_FILTER_MAX = 9_000_000_000
/** USDT has 6 decimals, so a finer price can't exist on a listing. */
export const PRICE_FILTER_DECIMALS = 6

// Digits with at most one dot and PRICE_FILTER_DECIMALS after it. Also
// matches the in-between states typing goes through ('', '12.', '.').
const TYPING_PATTERN = new RegExp(`^\\d*(\\.\\d{0,${PRICE_FILTER_DECIMALS}})?$`)

const MAX_LABEL = PRICE_FILTER_MAX.toLocaleString('en-US')

export type PriceInputResult = { ok: true; value: string } | { ok: false; error: string }

/**
 * Checks one keystroke or paste. Commas and spaces are dropped so a pasted
 * "1,000" works; anything that would make the field invalid is refused
 * (the field keeps its previous value) with a reason to show.
 */
export function acceptPriceInput(raw: string): PriceInputResult {
  const value = raw.replace(/[,\s]/g, '')
  if (value.includes('-')) return { ok: false, error: "Price can't be negative." }
  if (!TYPING_PATTERN.test(value)) {
    return /^\d*\.\d+$/.test(value)
      ? { ok: false, error: `Up to ${PRICE_FILTER_DECIMALS} decimal places.` }
      : { ok: false, error: 'Numbers only.' }
  }
  if (value !== '' && value !== '.' && Number(value) > PRICE_FILTER_MAX) return { ok: false, error: `Maximum is ${MAX_LABEL}.` }
  return { ok: true, value }
}

/** '' stays '' (no bound); otherwise the canonical number ('007.50' → '7.5'), or null when it isn't one ('.'). */
export function normalizePrice(value: string): string | null {
  if (value === '') return ''
  if (value === '.') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 && n <= PRICE_FILTER_MAX ? String(n) : null
}

export interface PriceBoundsErrors {
  min?: string
  max?: string
}

/** Full check before applying: each field a valid number in 0 to 9B, and min not above max. */
export function validatePriceBounds(min: string, max: string): PriceBoundsErrors {
  const errors: PriceBoundsErrors = {}
  const minN = normalizePrice(min)
  const maxN = normalizePrice(max)
  if (minN === null) errors.min = 'Enter a valid number.'
  if (maxN === null) errors.max = 'Enter a valid number.'
  if (minN && maxN && Number(minN) > Number(maxN)) errors.max = "Max can't be lower than min."
  return errors
}

export function matchesPriceBounds(price: number, min: string, max: string): boolean {
  if (min !== '' && price < Number(min)) return false
  if (max !== '' && price > Number(max)) return false
  return true
}

// Compact from a million up so 9B fits a filter pill ("9B", "2.5M").
function formatPrice(value: string): string {
  const n = Number(value)
  return n >= 1_000_000
    ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n)
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: PRICE_FILTER_DECIMALS }).format(n)
}

/** The filter pill's text: "Price" when unset, else the active range. */
export function priceFilterLabel(min: string, max: string, currency: string): string {
  if (min === '' && max === '') return 'Price'
  if (max === '') return `From ${formatPrice(min)} ${currency}`
  if (min === '') return `Up to ${formatPrice(max)} ${currency}`
  return `${formatPrice(min)} – ${formatPrice(max)} ${currency}`
}
