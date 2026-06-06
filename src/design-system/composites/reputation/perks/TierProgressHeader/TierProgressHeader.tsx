import Image from 'next/image'
import TierBadge from '@/design-system/composites/reputation/TierBadge/TierBadge'
import silverTierIcon from '../../../../../../public/reputation/silvertier.svg'
import goldTierIcon from '../../../../../../public/reputation/goldtier.svg'
import styles from './TierProgressHeader.module.scss'

// ── Component ─────────────────────────────────────────────────────────────────

// design-specific: 79px white stripe bar — silver → gold progress mock.
// Segment widths and diamond position match Figma: 4 full / 1 partial / 1 empty.

export function TierProgressHeader() {
  return (
    <header className={styles.tierProgressBar}>

      {/* Left: current tier icon + silver badge + points */}
      <div className={styles.tierLeft}>
        <Image
          src={silverTierIcon}
          alt="Silver tier"
          width={43}
          height={43}
          className={styles.tierIcon}
        />
        <TierBadge tier="silver" />
        <div className={styles.tierPoints}>
          <span className={styles.tierPointsValue}>12</span>
          <span className={styles.tierPointsLabel}>/pts</span>
        </div>
      </div>

      {/* Center: segmented progress bar + diamond indicator */}
      <div className={styles.tierProgressCenter}>
        <div className={styles.tierSegs} role="presentation" aria-hidden="true">
          <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
          <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
          <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
          <div className={`${styles.tierSeg} ${styles.tierSegFull}`} />
          <div className={`${styles.tierSeg} ${styles.tierSegPartial}`} />
          <div className={`${styles.tierSeg} ${styles.tierSegEmpty}`} />
        </div>
        <div className={styles.tierDiamond} aria-hidden="true" />
      </div>

      {/* Right: gold tier badge with icon + "188 to gold" */}
      <TierBadge tier="gold">
        <Image
          src={goldTierIcon}
          alt=""
          width={22}
          height={22}
          aria-hidden="true"
        />
        <span>188 to gold</span>
      </TierBadge>

    </header>
  )
}

export default TierProgressHeader
