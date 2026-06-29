import Image from 'next/image'
import styles from './UdBanner.module.scss'

const STATS = [
  { label: 'Founded',          value: '2018' },
  { label: 'Headquarters',     value: 'San Francisco' },
  { label: 'Chains Supported', value: 'Multi-chain' },
  { label: 'Price Range',      value: '$5 to $100+' },
]

export function UdBanner() {
  return (
    <section className={styles.section} aria-label="Unstoppable Domains at a glance">
      <div className={styles.bannerWrap}>
        <Image
          src="/providers/freename/union.svg"
          alt=""
          aria-hidden="true"
          fill
          unoptimized
          className={styles.unionBg}
        />

        <ul className={styles.statsList}>
          {STATS.map((stat, i) => (
            <li key={stat.label} className={styles.statItem}>
              {i > 0 && <span className={styles.divider} aria-hidden="true" />}
              <div className={styles.statContent}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </section>
  )
}

export default UdBanner
