import { useCallback, useEffect } from 'react'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import styles from './GmPendingModal.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GmPendingModalProps {
  isOpen: boolean
  onClose: () => void
  onCheckStatus?: () => void
}

// ── Icon sub-components ───────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Wave loader SVG — same visual as ScoreLoading, sized to fit modal
const WaveLoader = () => (
  <svg className={styles.waveSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <circle cx="21.6471" cy="21.6471" r="20.2941" stroke="white" strokeWidth="2.70588" />
    <mask id="gm-pending-wave-mask">
      <circle cx="21.6471" cy="21.6471" r="16.2353" fill="white" />
    </mask>
    <g mask="url(#gm-pending-wave-mask)">
      <g className={styles.waveBack}>
        <path
          d="M-44 24 C-33 18 -22 18 -11 24 C0 30 11 30 22 24 C33 18 44 18 55 24 C66 30 77 30 88 24 V60 H-44 Z"
          fill="white"
          opacity={0.35}
        />
      </g>
      <g className={styles.waveFront}>
        <path
          d="M-44 26 C-33 20 -22 20 -11 26 C0 32 11 32 22 26 C33 20 44 20 55 26 C66 32 77 32 88 26 V60 H-44 Z"
          fill="white"
        />
      </g>
    </g>
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function GmPendingModal({ isOpen, onClose, onCheckStatus }: GmPendingModalProps) {

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  const handleCheckStatus = useCallback(() => {
    onCheckStatus?.()
    onClose()
  }, [onCheckStatus, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gm-pending-title"
        aria-live="polite"
        onClick={e => e.stopPropagation()}
      >

        {/* Close button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Icon + text */}
        <div className={styles.content}>
          <div className={styles.iconWrap} aria-hidden="true">
            <div className={styles.outerRing}>
              <div className={styles.innerCircle}>
                <WaveLoader />
              </div>
            </div>
            <div className={styles.shadowEllipse} aria-hidden="true" />
          </div>

          <div className={styles.textBlock}>
            <h2 className={styles.title} id="gm-pending-title">Taking Longer Than Usual</h2>
            <p className={styles.subtitle}>Your GM may still be processing.</p>
          </div>
        </div>

        {/* Footer action bar */}
        <div className={styles.footer}>
          <SecondaryButton onClick={onClose}>Close</SecondaryButton>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleCheckStatus}
            aria-label="Check Status"
          >
            <span className={styles.primaryBtnText}>Check Status&nbsp;&nbsp;↗</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default GmPendingModal
