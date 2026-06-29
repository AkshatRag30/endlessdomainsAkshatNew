import Image from 'next/image'
import { GoShieldCheck } from 'react-icons/go'
import { AiOutlineLink } from 'react-icons/ai'
import styles from './UdAbout.module.scss'

const PolygonIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15.4808 5.82353C15.1002 5.58368 14.6109 5.58368 14.1896 5.82353L11.2402 7.68594L9.22868 8.89932L6.27931 10.7617C5.89874 11.0016 5.40945 11.0016 4.98811 10.7617L2.63677 9.30849C2.2562 9.06863 1.99796 8.61714 1.99796 8.13743V5.27328C1.99796 4.79357 2.22902 4.34208 2.63677 4.10222L4.94733 2.69131C5.3279 2.45146 5.81719 2.45146 6.23853 2.69131L8.5491 4.10222C8.92967 4.34208 9.18791 4.79357 9.18791 5.27328V7.13568L11.1995 5.87997V4.01757C11.1995 3.53786 10.9684 3.08637 10.5607 2.84651L6.27931 0.179891C5.89874 -0.0599637 5.40945 -0.0599637 4.98811 0.179891L0.638805 2.84651C0.217466 3.08637 0 3.53786 0 4.01757V9.37903C0 9.85874 0.231057 10.3102 0.638805 10.5501L4.98811 13.2167C5.36867 13.4566 5.85797 13.4566 6.27931 13.2167L9.22868 11.3966L11.2402 10.1409L14.1896 8.32085C14.5702 8.08099 15.0595 8.08099 15.4808 8.32085L17.7914 9.73176C18.1719 9.97161 18.4302 10.4231 18.4302 10.9028V13.767C18.4302 14.2467 18.1991 14.6982 17.7914 14.938L15.4808 16.3913C15.1002 16.6311 14.6109 16.6311 14.1896 16.3913L11.879 14.9803C11.4985 14.7405 11.2402 14.289 11.2402 13.8093V11.9469L9.22868 13.2026V15.065C9.22868 15.5447 9.45974 15.9962 9.86748 16.2361L14.2168 18.9027C14.5974 19.1425 15.0866 19.1425 15.508 18.9027L19.8573 16.2361C20.2379 15.9962 20.4961 15.5447 20.4961 15.065V9.70354C20.4961 9.22383 20.265 8.77234 19.8573 8.53248L15.4808 5.82353Z" fill="white"/>
  </svg>
)

const FEATURES = [
  {
    Icon: GoShieldCheck,
    title: 'Battle-Tested Infrastructure',
    body: 'Over 4 million identities registered, making Unstoppable Domains the largest on-chain naming provider in the ecosystem.',
  },
  {
    Icon: AiOutlineLink,
    title: 'Universal Compatibility',
    body: 'Works across 450+ wallets, exchanges, applications, and Dapp services with seamless identity resolution.',
  },
  {
    Icon: PolygonIcon,
    title: 'Permanent Ownership',
    body: 'Every identity is minted on-chain and controlled by your wallet. No subscriptions, no renewals, no platform dependency.',
  },
]

export function UdAbout() {
  return (
    <section className={styles.section} aria-labelledby="ud-about-heading">

      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.reticleTL} aria-hidden="true" />
          <span className={styles.reticleTR} aria-hidden="true" />
          <span className={styles.reticleBL} aria-hidden="true" />
          <p className={styles.eyebrow}>About the provider</p>
          <span className={styles.reticleBR} aria-hidden="true" />
        </div>

        <h2 id="ud-about-heading" className={styles.heading}>
          Everything About
          <br />
          <mark className={styles.headingAccent}>Unstoppable Domains</mark>
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
                <feat.Icon className={styles.iconImg} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureBody}>{feat.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.card} aria-label="Unstoppable Domains platform preview">
          <Image
            src="/providers/freename/ud.jpg"
            alt="Unstoppable Domains platform"
            fill
            className={styles.cardImg}
          />
        </div>

      </div>
    </section>
  )
}

export default UdAbout
