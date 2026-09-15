import React from 'react'
import styles from './ExtensionBadge.module.scss'

export interface ExtensionBadgeProps {
  extension: string // '.ud', '.eth'
  className?: string
}

export const ExtensionBadge = ({ extension, className = '' }: ExtensionBadgeProps) => {
  const shellClass = [styles.badge, className].filter(Boolean).join(' ')

  return <span className={shellClass}>{extension}</span>
}

export default ExtensionBadge
