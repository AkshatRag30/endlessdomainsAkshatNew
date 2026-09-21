import React from 'react'
import styles from './StatCard.module.scss'

export type StatCardVariant = 'blue' | 'dark' | 'gray' | 'purple'

export interface StatCardProps {
  label: string
  value: string
  sublabel: string
  variant: StatCardVariant
  className?: string
}

/**
 * Figma node 50:6238 — four portfolio stat tiles (Domains, Estimated value,
 * Listed value, Sold all time). One primitive with a gradient variant prop,
 * not four bespoke components — the layout, left alignment, and sizing are
 * identical across all four, only the gradient changes.
 */
export const StatCard = ({ label, value, sublabel, variant, className = '' }: StatCardProps) => {
  const shellClass = [styles.card, styles[variant], className].filter(Boolean).join(' ')

  return (
    <div className={shellClass}>
      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}</span>
        </div>
        <span className={styles.sublabel}>{sublabel}</span>
      </div>
    </div>
  )
}

export default StatCard
