import React from 'react'
import Image from 'next/image'
import styles from './TransactionChecklist.module.scss'

export interface TransactionChecklistItem {
  label: string
  status: 'done' | 'active' | 'pending'
}

export interface TransactionChecklistProps {
  items: TransactionChecklistItem[]
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
export const TransactionChecklist = ({ items, className = '' }: TransactionChecklistProps) => (
  <ol className={[styles.card, className].filter(Boolean).join(' ')}>
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
        <span className={styles.label}>
          {item.label}
          <span className={styles.srOnly}> ({STATUS_LABEL[item.status]})</span>
        </span>
      </li>
    ))}
  </ol>
)

export default TransactionChecklist
