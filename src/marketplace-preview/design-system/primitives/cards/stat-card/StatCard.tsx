import React from 'react'
import styles from './StatCard.module.scss'

export type StatCardVariant = 'blue' | 'dark' | 'gray' | 'purple'

export interface StatCardProps {
  label: string
  value: string
  sublabel: string
  variant: StatCardVariant
  /** Right-aligns the text column in a narrow strip — matches the "Domains" and "Sold, all time" cards in the reference design. */
  align?: 'start' | 'end'
  className?: string
}

/**
 * Figma node 50:6238 — four portfolio stat tiles (Domains, Estimated value,
 * Listed value, Sold all time). One primitive with a gradient variant prop,
 * not four bespoke components — the layout is identical across all four,
 * only the gradient and text alignment change.
 */
export const StatCard = ({ label, value, sublabel, variant, align = 'start', className = '' }: StatCardProps) => {
  const shellClass = [styles.card, styles[variant], className].filter(Boolean).join(' ')
  const bodyClass = [styles.body, align === 'end' ? styles.alignEnd : ''].filter(Boolean).join(' ')

  return (
    <div className={shellClass}>
      <div className={bodyClass}>
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
