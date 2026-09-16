import React from 'react'
import styles from './ViewToggle.module.scss'

export type ViewMode = 'grid' | 'list'

export interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

/** Figma node 50:6199 — the grid/list icon pair beside the filter dropdowns. */
export const ViewToggle = ({ value, onChange, className = '' }: ViewToggleProps) => {
  const shellClass = [styles.toggle, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass} role="group" aria-label="Switch listings view">
      <button
        type="button"
        className={`${styles.option} ${value === 'grid' ? styles.optionActive : ''}`}
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
        onClick={() => onChange('grid')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        className={`${styles.option} ${value === 'list' ? styles.optionActive : ''}`}
        aria-pressed={value === 'list'}
        aria-label="List view"
        onClick={() => onChange('list')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="1.5" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="6" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="10.5" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}

export default ViewToggle
