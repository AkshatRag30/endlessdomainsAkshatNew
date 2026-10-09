import React from 'react'
import Image from 'next/image'
import type { IconType } from 'react-icons'
import FadeScrollList from '@/marketplace-preview/design-system/primitives/lists/fade-scroll-list'
import styles from './InfoListCard.module.scss'

export interface InfoListCardRow {
  id: string
  icon?: IconType
  /**
   * An exported icon file in place of `icon`, drawn at its own size (the
   * watchlist Overview panel's per row icons, Figma 35:11469). Wins over
   * `icon` when both are set.
   */
  iconImage?: { src: string; width: number; height: number }
  title: string
  subtitle: string
  trailing?: React.ReactNode
  onClick?: () => void
}

export interface InfoListCardProps {
  title: string
  rows: InfoListCardRow[]
  /** Gradient behind each row's icon avatar — Figma uses blue for Needs Attention, black for the other two right-rail panels. */
  iconVariant?: 'blue' | 'dark'
  emptyMessage?: string
  className?: string
  /** Beside the title, e.g. the watchlist's "All" link (Figma 20:11968). */
  headerAction?: React.ReactNode
  /** A paragraph between the title and the list (the watchlist Alerts panel's intro, 20:12061). */
  description?: React.ReactNode
  /** Below the list, e.g. a full width button. */
  footer?: React.ReactNode
  /**
   * Makes the list scroll inside a FadeScrollList, its last visible rows
   * fading while there's more below (the watchlist Overview panel, 20:11883).
   * This class must set that list's max-height.
   */
  scrollClassName?: string
}

/**
 * Figma node 50:6263 — one primitive behind all three right-rail panels
 * (Needs Attention, Getting The Most Views, Quick Actions). They're
 * visually identical containers: a title, a divided list of rows, each row
 * an icon avatar plus a two-line label block plus optional trailing
 * content. Only the row data and the trailing slot differ per panel.
 *
 * The watchlist rail (Overview, Needs A Look, Alerts) reuses it through the
 * optional headerAction / description / footer / scrollClassName slots;
 * without them it renders exactly as before.
 */
export const InfoListCard = ({
  title,
  rows,
  iconVariant = 'blue',
  emptyMessage,
  className = '',
  headerAction,
  description,
  footer,
  scrollClassName,
}: InfoListCardProps) => {
  const shellClass = [styles.card, className].filter(Boolean).join(' ')
  const avatarClass = [styles.avatar, iconVariant === 'dark' ? styles.avatarDark : styles.avatarBlue].filter(Boolean).join(' ')

  const list = (
    <div className={styles.list}>
      {rows.map((row) => (
        <div
          key={row.id}
          className={[styles.row, row.onClick ? styles.rowClickable : ''].filter(Boolean).join(' ')}
          role={row.onClick ? 'button' : undefined}
          tabIndex={row.onClick ? 0 : undefined}
          onClick={row.onClick}
          onKeyDown={
            row.onClick
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    row.onClick?.()
                  }
                }
              : undefined
          }
        >
          <div className={styles.rowMain}>
            <span className={avatarClass} aria-hidden="true">
              {row.iconImage ? (
                <Image src={row.iconImage.src} alt="" width={row.iconImage.width} height={row.iconImage.height} className={styles.avatarImage} />
              ) : (
                row.icon && <row.icon size={15} className={styles.avatarIcon} />
              )}
            </span>
            <div className={styles.textBlock}>
              <span className={styles.title} title={row.title}>{row.title}</span>
              {row.subtitle && <span className={styles.subtitle}>{row.subtitle}</span>}
            </div>
          </div>
          {row.trailing && <div className={styles.trailing}>{row.trailing}</div>}
        </div>
      ))}
    </div>
  )

  return (
    <div className={shellClass}>
      {headerAction ? (
        <div className={styles.headingRow}>
          <p className={styles.heading}>{title}</p>
          {headerAction}
        </div>
      ) : (
        <p className={styles.heading}>{title}</p>
      )}

      {description && <p className={styles.description}>{description}</p>}

      {rows.length === 0 ? (
        <p className={styles.empty}>{emptyMessage ?? 'Nothing to show.'}</p>
      ) : scrollClassName ? (
        <FadeScrollList ariaLabel={title} className={scrollClassName}>
          {list}
        </FadeScrollList>
      ) : (
        list
      )}

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}

export default InfoListCard
