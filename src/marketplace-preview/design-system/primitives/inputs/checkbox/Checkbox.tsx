import React, { useId } from 'react'
import Image from 'next/image'
import styles from './Checkbox.module.scss'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** ReactNode so a caller can embed a Link inside it (the buying flow's "... and I have read the terms."). */
  label: React.ReactNode
  disabled?: boolean
  className?: string
}

/**
 * Figma component 1:67 (the buying flow footer's terms row, "Default" /
 * "Variant2" = unchecked / checked). Figma draws its own 14px box — gray
 * when unchecked, green with a white check when checked — rather than the
 * platform control, so those two icons are rendered over a visually hidden
 * native checkbox that still owns focus, keyboard toggling and the checked
 * state for assistive tech.
 */
export const Checkbox = ({ checked, onChange, label, disabled = false, className = '' }: CheckboxProps) => {
  const id = useId()

  return (
    <div className={[styles.row, disabled ? styles.disabled : '', className].filter(Boolean).join(' ')}>
      <span className={styles.control}>
        <input
          id={id}
          type="checkbox"
          className={styles.input}
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <Image
          src={checked ? '/assets/img/buying-flow/checkbox-checked.svg' : '/assets/img/buying-flow/checkbox-unchecked.svg'}
          alt=""
          aria-hidden="true"
          width={14}
          height={14}
          className={styles.icon}
        />
      </span>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  )
}

export default Checkbox
