import React from 'react'
import styles from './TabButton.module.scss'

export interface TabButtonProps {
  label: string
  icon?: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}

export const TabButton = ({ label, icon, isActive = false, onClick }: TabButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.btn} ${isActive ? styles.active : styles.inactive}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </button>
  )
}

export default TabButton
