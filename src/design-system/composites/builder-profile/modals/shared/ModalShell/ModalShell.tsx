import { useCallback, useEffect, useId } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { FiX } from 'react-icons/fi'

import styles from './ModalShell.module.scss'

interface ModalShellProps {
  title: string
  onClose: () => void
  children: ReactNode
  /** Renders in place of the close corner — used by the remove-project confirm, which leads with a destructive action instead */
  headerAction?: ReactNode
}

export default function ModalShell({ title, onClose, children, headerAction }: ModalShellProps) {
  const titleId = useId()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleOverlayClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {headerAction ?? (
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <FiX aria-hidden="true" />
            </button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
