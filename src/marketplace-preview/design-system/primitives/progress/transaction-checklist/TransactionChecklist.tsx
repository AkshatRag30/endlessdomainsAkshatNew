import React from 'react'
import Image from 'next/image'
import styles from './TransactionChecklist.module.scss'

export interface TransactionChecklistItem {
  label: string
  status: 'done' | 'active' | 'pending'
  /** A second line under the label, e.g. the receipt's calendar + "18 Sep 2026 at 14:22". */
  detail?: React.ReactNode
}

export interface TransactionChecklistProps {
  items: TransactionChecklistItem[]
  /**
   * 'card' (default) is the buying flow's dark blue progress card. 'plain'
   * is the order receipt's "What happened" list (Figma 5:7594): no card,
   * dark 13px labels on the page's light surface, taller rows.
   */
  variant?: 'card' | 'plain'
  className?: string
}

const STATUS_LABEL: Record<TransactionChecklistItem['status'], string> = {
  done: 'Done',
  active: 'In progress',
  pending: 'Not started',
}

/**
 * Figma node 1:891 (4 rows, "Approving") / 1:170 (3 rows, "Confirm
 * purchase") — the dark blue progress card inside the buying flow's
 * wallet-pending screens. Row icon per status: green filled check (done,
 * 1:893), spinning dotted circle (active, 1:901), empty outline (pending, 1:915).
 */
export const TransactionChecklist = ({ items, variant = 'card', className = '' }: TransactionChecklistProps) => (
  <ol className={[variant === 'plain' ? styles.plain : styles.card, className].filter(Boolean).join(' ')}>
    {items.map((item) => (
      <li key={item.label} className={[styles.row, styles[item.status]].join(' ')}>
        {item.status === 'done' && (
          <span className={styles.doneIcon}>
            <Image src="/assets/img/buying-flow/checklist-done.svg" alt="" aria-hidden="true" width={15} height={15} />
          </span>
        )}
        {item.status === 'active' && (
          <Image src="/assets/img/buying-flow/checklist-active.svg" alt="" aria-hidden="true" width={16} height={16} className={styles.activeIcon} />
        )}
        {item.status === 'pending' && <span className={styles.pendingIcon} aria-hidden="true" />}
        <span className={styles.text}>
          <span className={styles.label}>
            {item.label}
            <span className={styles.srOnly}> ({STATUS_LABEL[item.status]})</span>
          </span>
          {item.detail && <span className={styles.detail}>{item.detail}</span>}
        </span>
      </li>
    ))}
  </ol>
)

export default TransactionChecklist
