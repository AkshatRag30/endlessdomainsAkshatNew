import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './IdentityOsStatsAndPartners.module.scss'
import PrimaryButton from '@/components/waitlist/PrimaryButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Static data ───────────────────────────────────────────────────────────────

// The four logos below have their wordmark baked into the SVG as fill="white" (or, for
// fluxor, a near-white #FBFFFD) — correct on the old dark background, invisible on this
// page's white one. Those exact files are still shared with the dark-themed homepage
// StatsAndPartners and the payment-method UI, so they can't be recolored in place —
// these point at page-scoped copies with the wordmark recolored to black instead.
const _PARTNER_LOGOS = [
  { src: '/new-assets/partners/ethereum.svg', alt: 'Ethereum Name Service' },
  { src: '/new-assets/partners/binance.svg', alt: 'Binance Smart Chain' },
  { src: '/new-assets/identity-os-logos/solana.svg', alt: 'Solana' },
  { src: '/new-assets/partners/spaceid.svg', alt: 'Space ID' },
  { src: '/new-assets/identity-os-logos/bonfida.svg', alt: 'Bonfida' },
  { src: '/new-assets/partners/unstoppable.svg', alt: 'Unstoppable Domains' },
  { src: '/new-assets/identity-os-logos/tezos.svg', alt: 'Tezos Domains' },
  { src: '/new-assets/identity-os-logos/fluxor.svg', alt: 'fluxor' },
]

// gpay's original file (public/new-assets/feature-and-stats/gpay.svg) is shared with the
// dark-themed homepage StatsAndPartners sections and bakes its "Pay" wordmark in as
// fill="white" — same problem as the partner logos above, invisible on this page's white
// background even though the colored "G" icon paths render fine. Points at a page-scoped
// copy with the wordmark recolored to black instead of touching the shared file.
const _PAYMENT_LOGOS = [
  { src: '/new-assets/identity-os-logos/coingate.svg', alt: 'coingate' },
  { src: '/new-assets/identity-os-logos/cryptomus.svg', alt: 'cryptomus' },
  { src: '/new-assets/identity-os-logos/apple-pay.svg', alt: 'apple-pay' },
  { src: '/new-assets/identity-os-logos/gpay.svg', alt: 'gpay' },
  { src: '/new-assets/identity-os-logos/link.svg', alt: 'link' },
]

// Partners: 7 logos × 3 = 21 cards — one set (~1400px) exceeds any viewport.
// Payments: only 4 logos so needs 6× repetitions so one set (~800px × 2 = ~1600px) exceeds any viewport.
const PARTNER_LOGOS = [..._PARTNER_LOGOS, ..._PARTNER_LOGOS, ..._PARTNER_LOGOS]
const PAYMENT_LOGOS = [
  ..._PAYMENT_LOGOS, ..._PAYMENT_LOGOS, ..._PAYMENT_LOGOS,
  ..._PAYMENT_LOGOS, ..._PAYMENT_LOGOS, ..._PAYMENT_LOGOS,
]

const LogoCard = ({ src, alt }: { src: string; alt: string }) => (
  <div className={styles.logoCard}>
    <Image src={src} alt={alt} width={100} height={50} className={styles.logoImg} />
  </div>
)

// ── Main component ────────────────────────────────────────────────────────────

const IdentityOsStatsAndPartners: React.FC = () => {
  // GSAP refs
  const payRow1Ref = useRef<HTMLDivElement>(null)
  const partRow1Ref = useRef<HTMLDivElement>(null)
  const paymentsHeaderRef = useRef<HTMLDivElement>(null)
  const partnersHeaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Seamless marquee via gsap.ticker — x accumulates forever and wraps mod oneSet,
    // so there is never a reset jump. Content is 3× repeated; oneSet = scrollWidth / 3.
    const tickerCallbacks: (() => void)[] = []
    const marqueeCtx = {
      revert: () => {
        tickerCallbacks.forEach(cb => gsap.ticker.remove(cb))
        tickerCallbacks.length = 0
      },
    }
    ;[
      { el: payRow1Ref.current, speed: 80, dir: -1, reps: 6 },
      { el: partRow1Ref.current, speed: 38, dir: -1, reps: 3 },
    ].forEach(({ el, speed, dir, reps }) => {
      if (!el) return
      // Measure one set using getBoundingClientRect so margins between cards are included.
      const children = Array.from(el.children) as HTMLElement[]
      const first = children[0].getBoundingClientRect()
      const last = children[children.length / reps - 1].getBoundingClientRect()
      const oneSet = last.right - first.left
      let x = dir === 1 ? -oneSet : 0
      gsap.set(el, { x })
      let lastTime = gsap.ticker.time
      const cb = () => {
        const now = gsap.ticker.time
        const dt = now - lastTime
        lastTime = now
        x += dir * speed * dt
        if (dir === -1 && x <= -oneSet) x += oneSet
        if (dir === 1 && x >= 0) x -= oneSet
        gsap.set(el, { x })
      }
      gsap.ticker.add(cb)
      tickerCallbacks.push(cb)
    })

    const fadeCtx = gsap.context(() => {
      ;[paymentsHeaderRef, partnersHeaderRef].forEach(ref => {
        if (!ref.current) return
        gsap.fromTo(
          ref.current.children,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    })

    return () => {
      marqueeCtx.revert()
      fadeCtx.revert()
    }
  }, [])

  return (
    <section className={styles.wrapper}>
      <div className={styles.lightContent}>
        {/* Payments */}
        <div ref={paymentsHeaderRef}>
          <div className={styles.sectionHeaderSplit}>
            <div className={styles.headerLeft}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowText}>
                  FRICTIONLESS PAYMENTS
                  <span className={styles.cornerSpan} />
                </span>
              </div>
              <h2 className={styles.sectionHeading}>
                <span className={styles.headingPlain}>No Crypto? No Problem.</span>
                <span className={styles.headingAccent}>Pay Your Way.</span>
              </h2>
            </div>
            <p className={styles.sectionBodyRight}>
              We support every major payment option so nothing stands between you and the identity you own. Onchain assets, credit card, Google Pay, Apple Pay and more, all accepted. Zero friction. Claim your identity in minutes.
            </p>
          </div>
        </div>
        <div className={styles.marqueeStrip}>
          <div className={styles.logoRows}>
            <div className={styles.logoScrollBg}>
              <div className={styles.logoScrollTrack}>
                <div
                  ref={payRow1Ref}
                  className={styles.logoScrollRow}
                >
                  {PAYMENT_LOGOS.map((logo, i) => React.createElement(LogoCard, { key: i, src: logo.src, alt: logo.alt }))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners & Ecosystems */}
        <div ref={partnersHeaderRef}>
          <div className={styles.sectionHeaderCenter}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowText}>
                ECOSYSTEM PARTNERS
                <span className={styles.cornerSpan} />
              </span>
            </div>
            <h2 className={styles.sectionHeading}>
              <span className={styles.headingPlain}>Strong Partners.</span>
              <span className={styles.headingAccent}>Stronger Identity</span>
            </h2>
            <p className={styles.sectionBody}>
              Every partner in the network is live and connected. Each integration adds real utility to your identity across wallets, protocols, and chains. The more the network grows, the more powerful every identity within it becomes.
            </p>
          </div>
        </div>
        <div className={styles.marqueeStrip}>
          <div className={styles.logoRows}>
            <div className={styles.logoScrollBg}>
              <div className={styles.logoScrollTrack}>
                <div
                  ref={partRow1Ref}
                  className={styles.logoScrollRow}
                >
                  {PARTNER_LOGOS.map((logo, i) => React.createElement(LogoCard, { key: i, src: logo.src, alt: logo.alt }))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.partnerCta}>
            <PrimaryButton onClick={() => { window.location.href = 'mailto:partnerships@endlessdomains.io' }}>
              Partner With Us
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IdentityOsStatsAndPartners
