import React from 'react'
import styles from './Tooltip.module.scss'

export interface TooltipProps {
  label: string
  children: React.ReactNode
  className?: string
}

/**
 * CSS-only tooltip (no JS state, no mouseenter/leave listeners) — a themed
 * replacement for the browser's native title="" tooltip, which renders in
 * plain OS chrome and has a slow, browser-controlled delay before it shows.
 * Used wherever a truncated domain name needs its full text on hover (the
 * table row and the grid card both truncate long names to fit their column/
 * card width).
 */
export const Tooltip = ({ label, children, className = '' }: TooltipProps) => (
  <span className={[styles.wrap, className].filter(Boolean).join(' ')} data-tooltip={label}>
    {children}
  </span>
)

export default Tooltip
