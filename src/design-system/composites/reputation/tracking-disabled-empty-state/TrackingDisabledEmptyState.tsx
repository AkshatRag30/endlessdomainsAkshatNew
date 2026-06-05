import styles from './TrackingDisabledEmptyState.module.scss'

const GradientToggleOff = () => (
  <svg viewBox="0 0 16 16" width="98" height="98" aria-hidden="true" className={styles.toggleIcon}>
    <defs>
      <linearGradient id="tgl-off-grad" x1="7%" y1="76%" x2="93%" y2="24%">
        <stop offset="0%"    stopColor="#000000" />
        <stop offset="62.06%" stopColor="#BABABA" />
        <stop offset="100%"  stopColor="#787878" />
      </linearGradient>
    </defs>
    <path d="M9 11c.628-.836 1-1.874 1-3a4.978 4.978 0 0 0-1-3h3.5a3 3 0 1 1 0 6H9z" fill="url(#tgl-off-grad)" />
    <path d="M5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1A5 5 0 1 0 5 3a5 5 0 0 0 0 10z" fill="url(#tgl-off-grad)" />
  </svg>
)

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface TrackingDisabledEmptyStateProps {
  onEnableClick?: () => void
}

export default function TrackingDisabledEmptyState({ onEnableClick }: TrackingDisabledEmptyStateProps) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>

        <div className={styles.illustration} aria-hidden="true">
          <GradientToggleOff />
        </div>

        <div className={styles.textBlock}>
          <h2 className={styles.heading}>Enable Reputation Tracking</h2>
          <p className={styles.subtitle}>See your score, tiers, and earn perks</p>
        </div>

        <button type="button" className={styles.ctaBtn} onClick={onEnableClick} aria-label="Enable Now">
          <span>Enable Now</span>
          <ArrowRight />
        </button>

      </div>
    </div>
  )
}
