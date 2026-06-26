import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { FiArrowRight, FiChevronDown } from 'react-icons/fi'
import { DOMAIN_PROVIDERS } from '@/helpers/chaincurrency/chaincurrency'
import styles from './FreenameCompare.module.scss'

const PROVIDERS = [
  { key: 'UD',                 name: 'Unstoppable Domains', tlds: '55 TLDs',      desc: 'The largest on-chain identity provider with millions of registered identities.' },
  { key: 'ENS',                name: 'ENS',                 tlds: '1 TLD (.eth)', desc: 'The original Ethereum identity protocol powering millions of .eth names.' },
  { key: 'Freename',           name: 'Freename',            tlds: '8 TLDs',       desc: 'Custom Web3 namespaces with user-owned TLD infrastructure.' },
  { key: 'Bonfida',            name: 'Bonfida',             tlds: '1 TLD (.sol)', desc: 'The leading identity layer for the Solana ecosystem.' },
  { key: 'Arbitrum',           name: 'Arbitrum Names',      tlds: '1 TLD (.arb)', desc: 'Native identity for users and builders across the Arbitrum ecosystem.' },
  { key: 'BinanceSmartChain',  name: 'BNB Chain Names',     tlds: '1 TLD (.bnb)', desc: 'A human-readable identity layer for the BNB Chain ecosystem.' },
]

const MOBILE_INITIAL = 3

export function FreenameCompare() {
  const [isMobile, setIsMobile] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const visibleProviders = isMobile && !expanded ? PROVIDERS.slice(0, MOBILE_INITIAL) : PROVIDERS
  const showLoadMore = isMobile && !expanded

  return (
    <section className={styles.section} aria-labelledby="freename-compare-heading">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.reticleTL} aria-hidden="true" />
          <span className={styles.reticleTR} aria-hidden="true" />
          <span className={styles.reticleBL} aria-hidden="true" />
          <p className={styles.eyebrow}>Compare Providers</p>
          <span className={styles.reticleBR} aria-hidden="true" />
        </div>

        <h2 id="freename-compare-heading" className={styles.heading}>
          <span className={styles.headingLine1}>Compare With</span>
          <br />
          <mark className={styles.headingAccent}>Other Providers</mark>
        </h2>

        <p className={styles.subheading}>
          Explore leading identity providers and find the namespace that best fits your on-chain presence.
        </p>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      <div className={styles.gridWrap}>
        <ul className={styles.grid}>
          {visibleProviders.map(item => {
            const provider = DOMAIN_PROVIDERS.find(p => p.provider === item.key)
            if (!provider) return null
            return (
              <li key={item.key} className={styles.card}>
                <div className={styles.cardInner}>
                  <div className={styles.iconBox}>
                    <Image
                      src={provider.image}
                      alt={item.name}
                      width={36}
                      height={36}
                      className={styles.logo}
                      unoptimized
                    />
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.providerName}>{item.name}</h3>
                    <div className={styles.meta}>
                      <p className={styles.tlds}>{item.tlds}</p>
                      <p className={styles.desc}>{item.desc}</p>
                    </div>
                    <PrimaryButton
                      size="sm"
                      icon={<FiArrowRight />}
                      iconPosition="right"
                      aria-label={`Register with ${item.name}`}
                    >
                      Register Now
                    </PrimaryButton>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── Load More — mobile only, replaces static button ────────────────── */}
      {showLoadMore ? (
        <div className={styles.loadMoreWrap}>
          <SecondaryButton
            icon={<FiChevronDown />}
            iconPosition="right"
            onClick={() => setExpanded(true)}
          >
            Load More
          </SecondaryButton>
        </div>
      ) : (
        <div className={styles.loadMore}>
          <span className={styles.loadMoreBracketTL} aria-hidden="true" />
          <span className={styles.loadMoreBracketBR} aria-hidden="true" />
          <button className={styles.loadMoreBtn} type="button">Load More</button>
        </div>
      )}

    </section>
  )
}

export default FreenameCompare
