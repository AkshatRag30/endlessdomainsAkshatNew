import React, { ReactNode } from 'react'
import styles from './TabButton.module.scss'

export interface TabButtonProps {
  label: string
  icon: ReactNode
  isActive: boolean
  onClick: () => void
}

export const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
  <button
    type="button"
    className={`${styles.btn} ${isActive ? styles.active : styles.inactive}`}
    onClick={onClick}
    aria-pressed={isActive}
  >
    <span className={styles.icon} aria-hidden="true">{icon}</span>
    <span className={styles.label}>{label}</span>
  </button>
)

export default TabButton
