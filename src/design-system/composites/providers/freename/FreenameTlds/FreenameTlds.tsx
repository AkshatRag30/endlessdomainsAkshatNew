import { useState, useEffect } from 'react'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { FiArrowRight, FiChevronDown } from 'react-icons/fi'
import styles from './FreenameTlds.module.scss'

const TLDS = [
  { tld: '.metaverse', price: '$2', chain: 'Multi-chain', desc: 'Secure your place in the digital worlds of tomorrow.' },
  { tld: '.hodl',      price: '$2', chain: 'Multi-chain', desc: 'Built for long-term believers in crypto.' },
  { tld: '.satosh',    price: '$2', chain: 'Multi-chain', desc: 'Inspired by the creator of Bitcoin.' },
  { tld: '.genesis',   price: '$2', chain: 'Multi-chain', desc: 'The perfect identity for new beginnings.' },
  { tld: '.token',     price: '$2', chain: 'Multi-chain', desc: 'A Web3-native identity built around digital ownership.' },
  { tld: '.sat',       price: '$2', chain: 'Multi-chain', desc: 'Short, memorable, and Bitcoin-inspired.' },
  { tld: '.airdrop',   price: '$2', chain: 'Multi-chain', desc: 'For users at the forefront of Web3 discovery.' },
  { tld: '.rwa',       price: '$2', chain: 'Multi-chain', desc: 'Built for the future of real-world assets on-chain.' },
]

const MOBILE_INITIAL = 4

export function FreenameTlds() {
  const [isMobile, setIsMobile] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const visibleTlds = isMobile && !expanded ? TLDS.slice(0, MOBILE_INITIAL) : TLDS
  const showLoadMore = isMobile && !expanded

  return (
    <section className={styles.section} aria-labelledby="freename-tlds-heading">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.reticleTL} aria-hidden="true" />
            <span className={styles.reticleTR} aria-hidden="true" />
            <span className={styles.reticleBL} aria-hidden="true" />
            <p className={styles.eyebrow}>TLD Catalog</p>
            <span className={styles.reticleBR} aria-hidden="true" />
          </div>
          <h2 id="freename-tlds-heading" className={styles.heading}>
            All
            <br />
            <mark className={styles.headingAccent}>Freename TLDs</mark>
          </h2>
        </div>

        <div className={styles.headerDescWrap}>
          <span className={styles.descReticleTL} aria-hidden="true" />
          <p className={styles.headerDesc}>
            8 TLDs available across Web3 culture, ownership, rewards, and digital assets.
          </p>
          <span className={styles.descReticleBR} aria-hidden="true" />
        </div>
      </div>

      {/* ── Card grid ──────────────────────────────────────────────────────── */}
      <ul className={styles.grid}>
        {visibleTlds.map(item => (
          <li key={item.tld} className={styles.cardOuter}>
            <div className={styles.cardInner}>
              <div className={styles.contentPolygon}>
                <div className={styles.contentInner}>
                  <h3 className={styles.tldName}>{item.tld}</h3>
                  <div className={styles.meta}>
                    <p className={styles.price}>{item.price}</p>
                    <p className={styles.chain}>{item.chain}</p>
                    <p className={styles.desc}>{item.desc}</p>
                  </div>
                  <PrimaryButton
                    size="sm"
                    icon={<FiArrowRight />}
                    iconPosition="right"
                    aria-label={`Register ${item.tld}`}
                  >
                    Register
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ── Load More — mobile only ─────────────────────────────────────────── */}
      {showLoadMore && (
        <div className={styles.loadMoreWrap}>
          <SecondaryButton
            icon={<FiChevronDown />}
            iconPosition="right"
            onClick={() => setExpanded(true)}
          >
            Load More
          </SecondaryButton>
        </div>
      )}

    </section>
  )
}

export default FreenameTlds
