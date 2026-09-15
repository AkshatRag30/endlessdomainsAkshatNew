
import React, { forwardRef } from 'react'
import styles from './Secondarybutton.module.scss'

// ── Props ──────────────────────────────────────────────────────────────────

export interface SecondaryButtonProps {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
  transparent?: boolean
  variant?: 'default' | 'error'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  iconOnly?: boolean
}

// ── Component ──────────────────────────────────────────────────────────────

export const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  (
    {
      children  = 'Button',
      onClick,
      disabled  = false,
      type      = 'button',
      className = '',
      fullWidth = false,
      transparent = false,
      variant = 'default',
      icon,
      iconPosition = 'left',
      iconOnly = false,
    },
    ref,
  ) => {
    const shellClass = [
      styles.button,
      fullWidth ? styles.fullWidth : '',
      iconOnly ? styles.iconOnly : '',
      transparent ? styles.transparent : '',
      variant === 'error' ? styles.variantError : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={shellClass}
        aria-label={iconOnly && typeof children === 'string' ? children : undefined}
      >
        {icon && iconPosition === 'left' && (
          <span className={styles.iconLeft} aria-hidden="true">{icon}</span>
        )}
        <span className={iconOnly ? styles.labelSrOnly : styles.label}>
          {children}
        </span>
        {icon && iconPosition === 'right' && (
          <span className={styles.iconRight} aria-hidden="true">{icon}</span>
        )}
        <span className={styles.corner} aria-hidden="true" />
      </button>
    )
  },
)

SecondaryButton.displayName = 'SecondaryButton'
export default SecondaryButton