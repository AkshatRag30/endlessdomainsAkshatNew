import styles from './GoldStatsDropdown.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GoldStatsDropdownProps {
  currentStreak?: number
  longestStreak?: number
  totalCheckins?: number
  onClose?: () => void
  onViewStats?: () => void
  className?: string
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function GoldStatsDropdown({
  currentStreak = 12,
  longestStreak = 34,
  totalCheckins = 89,
  onClose,
  onViewStats,
  className = '',
}: GoldStatsDropdownProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} aria-label="Gold stats panel">

      {/* Stripe background overlay — 5% opacity, matching Figma node 41:3433 */}
      <div className={styles.stripe} aria-hidden="true" />

      {/* Close button — top-right corner */}
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close stats panel"
      >
        <CloseIcon />
      </button>

      {/* Content body */}
      <div className={styles.content}>

        {/* Current Streak header row */}
        <div className={styles.streakRow}>
          <span className={styles.streakLabel}>Current Streak</span>
          <span className={styles.streakValue}>{currentStreak} Days 🔥</span>
        </div>

        <div className={styles.divider} />

        {/* Longest Streak */}
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Longest Streak</span>
          <span className={styles.statValue}>{longestStreak} days</span>
        </div>

        <div className={styles.divider} />

        {/* Total Check-ins */}
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Total Check-ins</span>
          <span className={styles.statValue}>{totalCheckins}</span>
        </div>

        <div className={styles.divider} />

        {/* Countdown bar */}
        <div className={styles.countdown} role="status" aria-live="polite">
          <span className={styles.countdownText}>⏰&nbsp;&nbsp;Come back tomorrow at 00:00 UTC</span>
        </div>

        <div className={styles.divider} />

        {/* View full stats */}
        <button type="button" className={styles.viewStats} onClick={onViewStats}>
          View full stats →
        </button>

      </div>
    </div>
  )
}

export default GoldStatsDropdown
