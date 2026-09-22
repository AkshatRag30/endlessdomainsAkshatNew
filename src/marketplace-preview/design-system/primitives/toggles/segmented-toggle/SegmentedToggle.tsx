import React from 'react'
import styles from './SegmentedToggle.module.scss'

export interface SegmentedToggleOption<T extends string> {
  value: T
  label: string
  sublabel?: string
  disabled?: boolean
  badge?: string
}

export interface SegmentedToggleProps<T extends string> {
  options: SegmentedToggleOption<T>[]
  value: T
  onChange: (value: T) => void
  /**
   * 'radio' (default) — left-aligned label + description with a radio dot,
   * used for "How to sell" (Figma node 1:8648, 2 options). 'centered' — a
   * big centered label + caption, no radio dot, used for "How long it runs"
   * (Figma node 1:8752, 3 options). Same underlying group/option pattern
   * (modeled on ViewToggle's role="group" + aria-pressed markup) either way.
   */
  variant?: 'radio' | 'centered'
  className?: string
}

export const SegmentedToggle = <T extends string>({
  options,
  value,
  onChange,
  variant = 'radio',
  className = '',
}: SegmentedToggleProps<T>) => {
  const groupClass = [styles.group, variant === 'centered' ? styles.centered : '', className].filter(Boolean).join(' ')

  return (
    <div className={groupClass} role="group">
      {options.map((option) => {
        const active = option.value === value
        const optionClass = [
          styles.option,
          variant === 'centered' ? styles.optionCentered : styles.optionRadio,
          active ? styles.optionActive : '',
          option.disabled ? styles.optionDisabled : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={option.value}
            type="button"
            className={optionClass}
            aria-pressed={active}
            disabled={option.disabled}
            onClick={() => !option.disabled && onChange(option.value)}
          >
            {variant === 'centered' ? (
              <>
                <span className={styles.bigLabel}>{option.label}</span>
                {option.sublabel && <span className={styles.caption}>{option.sublabel}</span>}
              </>
            ) : (
              <>
                <span className={styles.optionHead}>
                  <span className={styles.radio} aria-hidden="true" />
                  <span className={styles.label}>{option.label}</span>
                  {option.badge && <span className={styles.badge}>{option.badge}</span>}
                </span>
                {option.sublabel && <span className={styles.sublabel}>{option.sublabel}</span>}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedToggle
