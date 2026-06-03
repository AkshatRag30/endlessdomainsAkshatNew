import { useCallback, useState } from 'react'
import { BsExclamationCircle } from 'react-icons/bs'
import styles from './AccountSettings.module.scss'

const ChevronDown = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DomainAvatar = () => (
  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" aria-hidden="true">
    <circle cx="14.5" cy="14.5" r="14.5" fill="rgba(38,57,237,0.08)" />
    <circle cx="14.5" cy="14.5" r="5" stroke="#2639ED" strokeWidth="1.5" />
    <path d="M5 14.5h19M14.5 5c-3 3-4.5 6-4.5 9.5S11.5 23 14.5 26m0-21c3 3 4.5 6 4.5 9.5S17.5 23 14.5 26" stroke="#2639ED" strokeWidth="1.2" />
  </svg>
)

export default function AccountSettings() {
  const [trackingOn, setTrackingOn] = useState(true)

  const handleToggle = useCallback(() => setTrackingOn(v => !v), [])

  return (
    <div className={styles.card}>
      <div className={styles.grid}>

        {/* ── Primary Domain ─────────────────────────────────────────── */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Primary Domain</p>

          <div className={styles.fieldRow}>
            <div className={styles.domainDisplay}>
              <DomainAvatar />
              <span className={styles.domainName}>myname.og</span>
              <span className={styles.primaryBadge}>Primary</span>
            </div>
            <button type="button" className={styles.changeBtn} aria-label="Change primary domain">
              <span>Change</span>
              <ChevronDown />
            </button>
          </div>

          <div className={styles.warningRow}>
            <BsExclamationCircle className={styles.warningIcon} aria-hidden="true" />
            <p className={styles.warningText}>
              Reputation is attached to your primary domain. Changing it doesn't transfer your score — each domain has its own history.
            </p>
          </div>
        </div>

        {/* ── Reputation Tracking ────────────────────────────────────── */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Reputation Tracking</p>

          <div className={styles.fieldRow}>
            <span className={styles.trackingLabel}>Score, tiers, and perk eligibility</span>
            <div className={styles.toggleGroup}>
              <span className={styles.toggleHint}>Off</span>
              <button
                type="button"
                role="switch"
                aria-checked={trackingOn}
                aria-label="Toggle reputation tracking"
                className={`${styles.toggle} ${trackingOn ? styles.toggleOn : ''}`}
                onClick={handleToggle}
              >
                <span className={styles.toggleThumb} />
              </button>
              <span className={styles.toggleHint}>On</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
