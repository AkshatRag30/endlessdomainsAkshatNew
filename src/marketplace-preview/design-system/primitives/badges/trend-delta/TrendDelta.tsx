import React from 'react'
import styles from './TrendDelta.module.scss'

export interface TrendDeltaProps {
  /** Signed percent change, e.g. 9.7 or -3.1. */
  changePct: number
  className?: string
}

/**
 * "▲ 9.7%" / "▼ 3.1%" — the domain overview's change figure (Figma 5:3776,
 * 5:4860). Arrow and colour follow the sign; zero reads as flat-up green.
 * Unlike TrendIndicator (the listings table's high/low appraisal chip), this
 * is plain text with no icon asset. Screen readers hear "up 9.7%".
 */
export const TrendDelta = ({ changePct, className = '' }: TrendDeltaProps) => {
  const tone = changePct < 0 ? 'negative' : 'positive'
  return (
    <span className={[styles.delta, className].filter(Boolean).join(' ')} data-tone={tone}>
      <span aria-hidden="true">{tone === 'negative' ? '▼' : '▲'} </span>
      <span className={styles.srOnly}>{tone === 'negative' ? 'down ' : 'up '}</span>
      {Math.abs(changePct).toFixed(1)}%
    </span>
  )
}

export default TrendDelta
