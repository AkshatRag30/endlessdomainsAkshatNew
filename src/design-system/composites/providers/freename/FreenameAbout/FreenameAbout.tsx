import Image from 'next/image'
import styles from './FreenameAbout.module.scss'

const FEATURES = [
  {
    icon: '/providers/freename/fi_14721174.svg',
    title: 'Custom TLD Ownership',
    body: 'Freename pioneered user-owned TLDs, allowing communities, brands, and creators to own entire namespaces instead of just individual identities.',
  },
  {
    icon: '/providers/freename/Vector (10).svg',
    title: 'Multi-chain Infrastructure',
    body: 'Identities can be minted across multiple blockchain networks while remaining fully owned and transferable.',
  },
  {
    icon: '/providers/freename/fi_12640603.svg',
    title: 'Built for Onchain Expansion',
    body: 'Freename enables businesses and communities to launch identity ecosystems around custom TLDs and digital brands.',
  },
]

export function FreenameAbout() {
  return (
    <section className={styles.section} aria-labelledby="freename-about-heading">

      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.reticleTL} aria-hidden="true" />
          <span className={styles.reticleTR} aria-hidden="true" />
          <span className={styles.reticleBL} aria-hidden="true" />
          <p className={styles.eyebrow}>About the provider</p>
          <span className={styles.reticleBR} aria-hidden="true" />
        </div>

        <h2 id="freename-about-heading" className={styles.heading}>
          Everything About
          <br />
          <mark className={styles.headingAccent}>Freename</mark>
        </h2>
      </div>

      <div className={styles.body}>

        <ul className={styles.featureList}>
          {FEATURES.map(feat => (
            <li key={feat.title} className={styles.featureItem}>
              <div className={styles.iconBox}>
                <Image
                  src="/providers/freename/icon-bg-texture.png"
                  alt=""
                  aria-hidden="true"
                  fill
                  className={styles.iconBgTexture}
                />
                <Image src={feat.icon} alt="" aria-hidden="true" width={22} height={22} className={styles.iconImg} unoptimized />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureBody}>{feat.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.card} aria-label="Freename platform preview">
          <Image
            src="/providers/freename/Vector (2).jpg"
            alt="Freename platform"
            fill
            className={styles.cardImg}
          />
        </div>

      </div>
    </section>
  )
}

export default FreenameAbout
