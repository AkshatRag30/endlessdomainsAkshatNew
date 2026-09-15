import React from 'react'
import styles from './Badge.module.scss'

export interface BadgeProps {
  children?: React.ReactNode
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'
  className?: string
}

export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => {
  const shellClass = [styles.badge, styles[variant], className].filter(Boolean).join(' ')

  return <span className={shellClass}>{children}</span>
}

export default Badge
