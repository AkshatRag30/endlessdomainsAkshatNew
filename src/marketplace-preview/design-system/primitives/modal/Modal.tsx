import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { useBodyScrollLock } from './useBodyScrollLock'
import styles from './Modal.module.scss'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  /** false disables Escape + backdrop-click, and hides the close button entirely. Default true. */
  dismissible?: boolean
  /** Pinned, non-scrolling region below the body — each listing-flow step supplies its own (fee breakdown + CTA, or just a CTA + link), since it differs per step. */
  footer?: React.ReactNode
  /** Scrollable middle content. */
  children: React.ReactNode
  className?: string
}

const EXIT_DURATION_MS = 300

/**
 * Figma node 6:8705 ("list" panel, first listing section) — a right-edge
 * slide-in drawer, not a centered card: full viewport height, flush to the
 * right edge, 540px wide on desktop, full-bleed below the mobile breakpoint.
 * Every step of the listing flow shares this one shell (header + close are
 * owned here; the scrollable body and pinned footer are supplied by the
 * caller since their content differs per step).
 */
export const Modal = ({ isOpen, onClose, title, dismissible = true, footer, children, className = '' }: ModalProps) => {
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  useBodyScrollLock(isOpen)

  // Mount immediately, then flip the "entered" class a frame later so the
  // panel's transform transition actually animates from off-screen instead
  // of snapping straight to its open position. Unmounting is delayed to let
  // the reverse transition play before the portal is torn down.
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      const raf = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(raf)
    }
    setEntered(false)
    const timeout = setTimeout(() => setMounted(false), EXIT_DURATION_MS)
    return () => clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    if (!mounted || !dismissible) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mounted, dismissible, onClose])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div className={styles.root}>
      <div
        className={[styles.backdrop, entered ? styles.backdropVisible : ''].filter(Boolean).join(' ')}
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className={[styles.panel, entered ? styles.panelEntered : '', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {dismissible && (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              <FiX size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export default Modal
