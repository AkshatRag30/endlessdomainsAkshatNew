import React from 'react'
import styles from './KeyValueRows.module.scss'

export interface KeyValueRow {
  label: string
  /** A string, or an amount + TokenSuffix composite. */
  value: React.ReactNode
  /** The "Total" row's treatment — stronger divider, bold 19px blue value (Figma 1:748). */
  emphasis?: boolean
  /** 'success' = "Paid by the seller" green (1:736). 'muted' = the "After you buy" list's softer #474747 values (1:777). */
  valueColor?: 'default' | 'success' | 'muted'
}

export interface KeyValueRowsProps {
  rows: KeyValueRow[]
  /**
   * 'plain' (default) is the buying flow's receipt list. 'boxed' is the domain
   * overview's white 29px rows, 3px apart, inside a soft gradient well
   * (Figma 5:3701 / 5:3890). 'ruled' is the order receipt's list: a hairline
   * above every row including the first, 13px muted labels (Figma 5:7540).
   */
  variant?: 'plain' | 'boxed' | 'ruled'
  className?: string
}

/**
 * Figma nodes 1:721 ("What you pay") / 1:773–1:783 ("After you buy") — a
 * plain stacked receipt list, label left / value right, thin divider
 * between rows. Deliberately separate from the listing flow's 3-column
 * FeeBreakdownRow (buying-flow plan §4.3): the two files draw the seller-
 * and buyer-side breakdowns in different shapes.
 */
export const KeyValueRows = ({ rows, variant = 'plain', className = '' }: KeyValueRowsProps) => (
  <dl className={[styles.list, variant !== 'plain' ? styles[variant] : '', className].filter(Boolean).join(' ')}>
    {rows.map((row) => (
      <div key={row.label} className={[styles.row, row.emphasis ? styles.emphasis : ''].filter(Boolean).join(' ')}>
        <dt className={styles.label}>{row.label}</dt>
        <dd className={[styles.value, row.valueColor && row.valueColor !== 'default' ? styles[row.valueColor] : ''].filter(Boolean).join(' ')}>
          {row.value}
        </dd>
      </div>
    ))}
  </dl>
)

export default KeyValueRows
