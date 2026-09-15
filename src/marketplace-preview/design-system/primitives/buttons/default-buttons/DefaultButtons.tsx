import React, { forwardRef } from 'react'
import styles from './DefaultButtons.module.scss'

// ── DefaultButton ─────────────────────────────────────────────────────────────

export interface DefaultButtonProps {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'default' | 'transparent' | 'dark' | 'error'
  size?: 'sm' | 'md'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const DefaultButton = forwardRef<HTMLButtonElement, DefaultButtonProps>(
  (
    {
      children,
      onClick,
      variant      = 'default',
      size         = 'md',
      disabled     = false,
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

    const shellClass = [
      styles.btn,
      size === 'sm'          ? styles.sm       : '',
      fullWidth              ? styles.fullWidth : '',
      variant !== 'default'  ? styles[variant]  : '',
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
        {loading && <span className={styles.spinner} aria-hidden="true" />}

        {!loading && icon && iconPosition === 'left' && (
          <span className={styles.icon_left} aria-hidden="true">{icon}</span>
        )}

        <span>{children}</span>

        {!loading && icon && iconPosition === 'right' && (
          <span className={styles.icon_right} aria-hidden="true">{icon}</span>
        )}
      </button>
    )
  },
)

DefaultButton.displayName = 'DefaultButton'

// ── ConnectWalletButton (composition) ─────────────────────────────────────────

export interface ConnectWalletButtonProps {
  onClick: () => void
  loading?: boolean
  connected?: boolean
  disabled?: boolean
}

export const ConnectWalletButton = ({
  onClick,
  loading   = false,
  connected = false,
  disabled  = false,
}: ConnectWalletButtonProps) => (
  <DefaultButton
    onClick={onClick}
    loading={loading}
    disabled={disabled}
    className={connected ? styles.btn_connected : ''}
  >
    {loading ? 'Connecting' : connected ? 'Wallet Connected' : 'Connect Wallet'}
  </DefaultButton>
)

export default DefaultButton
