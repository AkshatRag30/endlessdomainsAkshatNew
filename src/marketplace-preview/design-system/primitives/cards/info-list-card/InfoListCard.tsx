import React from 'react'
import type { IconType } from 'react-icons'
import styles from './InfoListCard.module.scss'

export interface InfoListCardRow {
  id: string
  icon: IconType
  title: string
  subtitle: string
  trailing?: React.ReactNode
}

export interface InfoListCardProps {
  title: string
  rows: InfoListCardRow[]
  /** Gradient behind each row's icon avatar — Figma uses blue for Needs Attention, black for the other two right-rail panels. */
  iconVariant?: 'blue' | 'dark'
  emptyMessage?: string
  className?: string
}

/**
 * Figma node 50:6263 — one primitive behind all three right-rail panels
 * (Needs Attention, Getting The Most Views, Quick Actions). They're
 * visually identical containers: a title, a divided list of rows, each row
 * an icon avatar plus a two-line label block plus optional trailing
 * content. Only the row data and the trailing slot differ per panel.
 */
export const InfoListCard = ({ title, rows, iconVariant = 'blue', emptyMessage, className = '' }: InfoListCardProps) => {
  const shellClass = [styles.card, className].filter(Boolean).join(' ')
  const avatarClass = [styles.avatar, iconVariant === 'dark' ? styles.avatarDark : styles.avatarBlue].filter(Boolean).join(' ')

  return (
    <div className={shellClass}>
      <p className={styles.heading}>{title}</p>

      {rows.length === 0 ? (
        <p className={styles.empty}>{emptyMessage ?? 'Nothing to show.'}</p>
      ) : (
        <div className={styles.list}>
          {rows.map((row) => (
            <div key={row.id} className={styles.row}>
              <div className={styles.rowMain}>
                <span className={avatarClass} aria-hidden="true">
                  <row.icon size={15} className={styles.avatarIcon} />
                </span>
                <div className={styles.textBlock}>
                  <span className={styles.title} title={row.title}>{row.title}</span>
                  <span className={styles.subtitle}>{row.subtitle}</span>
                </div>
              </div>
              {row.trailing && <div className={styles.trailing}>{row.trailing}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InfoListCard
