import React, { forwardRef } from 'react'
import styles from './Primarybutton.module.scss'

export interface PrimaryButtonProps {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'default' | 'transparent' | 'dark' | 'error'
  transparent?: boolean
  dark?: boolean
  size?: 'sm' | 'md'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      children,
      onClick,
      disabled     = false,
      variant,
      transparent = false,
      dark = false,
      size         = 'md',
      loading      = false,
      type         = 'button',
      className    = '',
      fullWidth    = false,
      icon,
      iconPosition = 'left',
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    // resolve variant: explicit `variant` prop takes precedence over legacy boolean shorthands
    const resolvedVariant = variant ?? (dark ? 'dark' : transparent ? 'transparent' : 'default')

    const shellClass = [
      styles.button,
      size === 'sm' ? styles.sm : '',
      fullWidth     ? styles.fullWidth : '',
      isDisabled    ? styles.disabled  : '',
      resolvedVariant !== 'default' ? styles[resolvedVariant] : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={shellClass}
        aria-busy={loading}
      >
        {/* <span className={styles.inner}> */}

          {loading && (
            <span className={styles.spinner} aria-hidden="true" />
          )}

          {!loading && icon && iconPosition === 'left' && (
            <span className={styles.iconLeft} aria-hidden="true">{icon}</span>
          )}

          <span>{children}</span>

          {!loading && icon && iconPosition === 'right' && (
            <span className={styles.iconRight} aria-hidden="true">{icon}</span>
          )}

        {/* </span> */}
      </button>
    )
  },
)

PrimaryButton.displayName = 'PrimaryButton'
export default PrimaryButton