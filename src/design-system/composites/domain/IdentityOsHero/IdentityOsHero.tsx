import styles from './IdentityOsHero.module.scss'
import BoxLoader from './BoxLoader'
import StripeAnimation from './StripeAnimation'
import SearchBar from './SearchBar'
import SeeHowItWorksButton from './SeeHowItWorksButton'
import TypeWord from './TypeWord'

// "reputation" leads so server-rendered, no-JS, and pre-hydration text all match what
// the page already used before this cycled — the other three only show up client-side.
const HERO_WORDS = ['reputation', 'identity', 'name', 'presence'] as const

export function IdentityOsHero() {
  return (
    <section className={styles.heroSection}>
      <BoxLoader interval={100} pauseDuration={800} gap={5} />
      <BoxLoader interval={100} pauseDuration={800} gap={5} position="right" />

      <div className={styles.animationBg}>
        <StripeAnimation />
        <div className={styles.content_wrapper}>
          <div className={styles.subheading}>
            <h4>The OS for onchain identity</h4>
            <span></span>
          </div>
          <h1>
            <span aria-hidden="true">
              <span>Own your</span> <br />
              <span className={styles.txt_gradient}>
                <TypeWord words={HERO_WORDS} /> forever.
              </span>
            </span>
            {/* Real accessible text lives outside .txt_gradient — its background-clip: text nests badly with hidden fallback content. */}
            <span className={styles.srOnly}>Own your reputation forever.</span>
          </h1>
          <p>
            Your email, social media, and payment methods all belong to someone else. One domain on Endless changes that. Claim it once. No renewals. No landlord. No platform that can revoke it.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <SearchBar />
        <div className={styles.ctaWrap}>
          <SeeHowItWorksButton />
        </div>
      </div>
    </section>
  )
}

export default IdentityOsHero
