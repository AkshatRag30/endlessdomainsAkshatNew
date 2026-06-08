import { TbPointerFilled } from 'react-icons/tb'
import styles from './NoDomainEmptyState.module.scss'
import { FaGlobe } from "react-icons/fa6";

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function NoDomainEmptyState() {
  return (
    <div className={styles.root}>
      <div className={styles.card}>

        <div className={styles.illustration} aria-hidden="true">
          <FaGlobe className={styles.globeIcon} />
          <TbPointerFilled className={styles.cursorIcon} />
        </div>

        <div className={styles.textBlock}>
          <h2 className={styles.heading}>Get a .og identity to start building reputation</h2>
          <p className={styles.subtitle}>You need a .og identity to access Identity OS features including your reputation score, GM streak, perks, and on-chain credentials. One transaction. Permanent ownership. No renewals.</p>
        </div>

        <button type="button" className={styles.ctaBtn} aria-label="Claim your .og">
          <span>Claim your .og</span>
          <ArrowRight />
        </button>

        <p className={styles.disclaimer}>Identity OS features unlock the moment you claim your .og</p>

      </div>
    </div>
  )
}
