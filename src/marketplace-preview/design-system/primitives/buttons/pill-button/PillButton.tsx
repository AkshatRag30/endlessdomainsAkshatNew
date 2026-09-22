import React from 'react'
import styles from './PillButton.module.scss'

export interface PillButtonProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

/** Figma node 1:8689 — the Quick sale / Suggested / Ambitious price presets under the price input. */
export const PillButton = ({ active = false, onClick, children, className = '' }: PillButtonProps) => {
  const shellClass = [styles.pill, active ? styles.active : '', className].filter(Boolean).join(' ')

  return (
    <button type="button" className={shellClass} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}

export default PillButton
