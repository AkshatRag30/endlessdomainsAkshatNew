import React, { forwardRef } from 'react'
import styles from './CartButton.module.scss'

export interface CartButtonProps {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const CartButton = forwardRef<HTMLButtonElement, CartButtonProps>(
  (
    {
      children,
      onClick,
      disabled     = false,
      type         = 'button',
      className    = '',
      fullWidth    = false,
      icon,
      iconPosition = 'right',
    },
    ref,
  ) => {
    const shellClass = [
      styles.button,
      fullWidth ? styles.fullWidth : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={shellClass}
      >
        {icon && iconPosition === 'left' && (
          <span className={styles.icon} aria-hidden="true">{icon}</span>
        )}
        {children && <span className={styles.label}>{children}</span>}
        {icon && iconPosition === 'right' && (
          <span className={styles.icon} aria-hidden="true">{icon}</span>
        )}
      </button>
    )
  },
)

CartButton.displayName = 'CartButton'
export default CartButton
