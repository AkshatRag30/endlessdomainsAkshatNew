import React from 'react'
import Link from 'next/link'
import styles from './ActionTile.module.scss'

export interface ActionTileProps {
  /** The glyph inside the dark glossy badge. */
  icon: React.ReactNode
  title: string
  subtitle: string
  /** Renders a Link when set, else a button, or an inert tile with neither. */
  href?: string
  onClick?: () => void
  /** 'lg' is Figma's larger 37px badge (the "List it for sale" tile, 5:7717); default 29px. */
  badgeSize?: 'md' | 'lg'
  className?: string
}

/**
 * Figma node 5:7693 (the receipt's "What next" tiles): the summary tile's
 * grey gradient surface with a dark glossy icon badge, a blue title and a
 * muted subtitle.
 */
export const ActionTile = ({ icon, title, subtitle, href, onClick, badgeSize = 'md', className = '' }: ActionTileProps) => {
  const content = (
    <>
      <span className={styles.badge} data-size={badgeSize} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={[styles.tile, styles.interactive, className].filter(Boolean).join(' ')}>
        {content}
      </Link>
    )
  }
  if (onClick) {
    return (
      <button type="button" className={[styles.tile, styles.interactive, className].filter(Boolean).join(' ')} onClick={onClick}>
        {content}
      </button>
    )
  }
  return <div className={[styles.tile, className].filter(Boolean).join(' ')}>{content}</div>
}

export default ActionTile
