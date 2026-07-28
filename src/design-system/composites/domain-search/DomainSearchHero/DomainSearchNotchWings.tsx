import styles from './DomainSearchNotchWings.module.scss'

// The two angled "wing" lines flanking the search bar's polygon notch — a soft blue glow
// dot travels outward along each wing's exact path (via offset-path motion), top and
// bottom, matching the Figma hero.
export function DomainSearchNotchWings() {
  return (
    <svg
      className={styles.wings}
      viewBox="0 0 1519 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Right wing */}
      <path className={styles.wingLine} d="M1224 0.000329971L1293.68 0.000336063L1312.14 18.5348L1519.39 18.5348" />
      <path className={styles.wingLine} d="M1224 67.1444L1293.68 67.1445L1312.14 48.61L1519.39 48.61" />

      {/* Left wing (mirrored) */}
      <path className={styles.wingLine} d="M295 0.000207901L225.321 0.000201809L206.859 18.5347L-0.392943 18.5346" />
      <path className={styles.wingLine} d="M295 67.1443H225.321L206.859 48.6099H-0.392943" />

      <g className={styles.glowGroup}>
        <circle className={`${styles.glow} ${styles.glowTopRight}`} r="5" fill="var(--color-blue-primary)" />
        <circle className={`${styles.glow} ${styles.glowBottomRight}`} r="5" fill="var(--color-blue-primary)" />
        <circle className={`${styles.glow} ${styles.glowTopLeft}`} r="5" fill="var(--color-blue-primary)" />
        <circle className={`${styles.glow} ${styles.glowBottomLeft}`} r="5" fill="var(--color-blue-primary)" />
      </g>
    </svg>
  )
}

export default DomainSearchNotchWings
