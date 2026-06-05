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
          <h2 className={styles.heading}>Get a .og domain to start building reputation</h2>
        </div>

        <button type="button" className={styles.ctaBtn} aria-label="Search Domains">
          <span>Search Domains</span>
          <ArrowRight />
        </button>

      </div>
    </div>
  )
}
