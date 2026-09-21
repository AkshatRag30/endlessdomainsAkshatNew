import React from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
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
        <FiGrid size={14} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.option} ${value === 'list' ? styles.optionActive : ''}`}
        aria-pressed={value === 'list'}
        aria-label="List view"
        onClick={() => onChange('list')}
      >
        <FiList size={14} aria-hidden="true" />
      </button>
    </div>
  )
}

export default ViewToggle
