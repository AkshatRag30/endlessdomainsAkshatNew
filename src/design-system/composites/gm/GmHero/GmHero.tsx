import styles from './GmHero.module.scss'

export function GmHero() {
  return (
    <section className={styles.hero} aria-labelledby="gm-hero-heading">
      <h1 id="gm-hero-heading" className={styles.heading}>
        Daily Ritual, <span className={styles.headingAccent}>Say GM !</span>
      </h1>
      <p className={styles.desc}>
        Send your daily GM across every supported chain with a single click. Each greeting is verified on chain before it counts, building your streak and growing the reputation score tied to your on-chain identity.
      </p>
    </section>
  )
}

export default GmHero
