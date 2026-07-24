import styles from './GmHero.module.scss'

export interface GmHeroProps {
  heading?: React.ReactNode
  description?: string
}

export function GmHeroAccent({ children }: { children: React.ReactNode }) {
  return <span className={styles.headingAccent}>{children}</span>
}

export function GmHero({
  heading = <>Daily Ritual, <GmHeroAccent>Say GM !</GmHeroAccent></>,
  description = 'Send your daily GM across every supported chain with a single click. Each greeting is verified on chain before it counts, building your streak and growing the reputation score tied to your on-chain identity.',
}: GmHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="gm-hero-heading">
      <h1 id="gm-hero-heading" className={styles.heading}>
        {heading}
      </h1>
      <p className={styles.desc}>
        {description}
      </p>
    </section>
  )
}

export default GmHero
