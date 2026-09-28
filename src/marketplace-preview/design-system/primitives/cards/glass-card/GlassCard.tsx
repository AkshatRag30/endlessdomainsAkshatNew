import React from 'react'
import styles from './GlassCard.module.scss'

export interface GlassCardProps {
  title?: string
  children: React.ReactNode
  /**
   * 'plain' is the domain overview tab's white card (Figma 5:3700). 'glass'
   * is the frosted card the price history chart sits in (5:4719), the same
   * treatment as the tab bar above it.
   */
  variant?: 'plain' | 'glass'
  className?: string
  /** Renders as a <section> labelled by the title. */
  titleId?: string
}

/**
 * A titled card container. Spacing below the title is left to the content,
 * since each Figma card sets its own (the facts well sits 17px under it, the
 * seller header 9px, the interest bars 30px).
 */
export const GlassCard = ({ title, children, variant = 'plain', className = '', titleId }: GlassCardProps) => (
  <section className={[styles.card, styles[variant], className].filter(Boolean).join(' ')} aria-labelledby={title ? titleId : undefined}>
    {title && (
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
    )}
    {children}
  </section>
)

export default GlassCard
