import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { FiArrowRight, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { DOMAIN_PROVIDERS } from '@/helpers/chaincurrency/chaincurrency'
import styles from './UdCompare.module.scss'

const PROVIDERS_INITIAL = [
  { key: 'Freename',           name: 'Freename',            tlds: '8 TLDs',       desc: 'Custom Web3 namespaces with user-owned TLD infrastructure.' },
  { key: 'ENS',                name: 'ENS',                 tlds: '1 TLD (.eth)', desc: 'The original Ethereum identity protocol powering millions of .eth names.' },
  { key: 'UD',                 name: 'Unstoppable Domains', tlds: '55 TLDs',      desc: 'The largest on-chain identity provider with millions of registered identities.' },
  { key: 'Bonfida',            name: 'Bonfida',             tlds: '1 TLD (.sol)', desc: 'The leading identity layer for the Solana ecosystem.' },
  { key: 'Arbitrum',           name: 'Arbitrum Names',      tlds: '1 TLD (.arb)', desc: 'Native identity for users and builders across the Arbitrum ecosystem.' },
  { key: 'BinanceSmartChain',  name: 'BNB Chain Names',     tlds: '1 TLD (.bnb)', desc: 'A human-readable identity layer for the BNB Chain ecosystem.' },
]

const PROVIDERS_EXTRA = [
  { key: 'Tezos',    name: 'Tezos Domains', tlds: '1 TLD (.tez)',   desc: 'Decentralized identity and wallet resolution for Tezos users.' },
  { key: 'Aptos',    name: 'Aptos Names',   tlds: '1 TLD (.apt)',   desc: 'Identity infrastructure built for the Aptos ecosystem.' },
  { key: 'Ton',      name: 'TON DNS',       tlds: '1 TLD (.ton)',   desc: 'Telegram-native identities secured by the TON blockchain.' },
  { key: 'Starknet', name: 'Starknet ID',   tlds: '1 TLD (.stark)', desc: "Identity infrastructure for Starknet's growing ecosystem." },
  { key: 'Box',      name: 'Box Domains',   tlds: '1 TLD (.box)',   desc: 'A simple and memorable identity namespace for Web3 users.' },
]

const MOBILE_INITIAL = 3

export function UdCompare() {
  const [isMobile, setIsMobile] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const allProviders = expanded ? [...PROVIDERS_INITIAL, ...PROVIDERS_EXTRA] : PROVIDERS_INITIAL
  const visibleProviders = isMobile && !expanded ? PROVIDERS_INITIAL.slice(0, MOBILE_INITIAL) : allProviders
  const showLoadMore = !expanded

  return (
    <section className={styles.section} aria-labelledby="ud-compare-heading">

      <div className={styles.header}>
        <div className={styles.eyebrowWrap}>
          <span className={styles.reticleTL} aria-hidden="true" />
          <span className={styles.reticleTR} aria-hidden="true" />
          <span className={styles.reticleBL} aria-hidden="true" />
          <p className={styles.eyebrow}>Compare Providers</p>
          <span className={styles.reticleBR} aria-hidden="true" />
        </div>

        <h2 id="ud-compare-heading" className={styles.heading}>
          <span className={styles.headingLine1}>Compare With</span>
          <br />
          <mark className={styles.headingAccent}>Other Providers</mark>
        </h2>

        <p className={styles.subheading}>
          Explore leading identity providers and find the namespace that best fits your on-chain presence.
        </p>
      </div>

      <div className={styles.gridWrap}>
        <ul className={styles.grid}>
          {visibleProviders.map(item => {
            const provider = DOMAIN_PROVIDERS.find(p => p.provider === item.key)
            if (!provider) return null
            return (
              <li key={item.key} className={styles.card}>
                <span className={styles.cardBracketTL} aria-hidden="true" />
                <span className={styles.cardBracketBR} aria-hidden="true" />
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

      <div className={styles.loadMoreWrap}>
        {showLoadMore ? (
          <SecondaryButton
            icon={<FiChevronDown />}
            iconPosition="right"
            onClick={() => setExpanded(true)}
          >
            Load More
          </SecondaryButton>
        ) : (
          <SecondaryButton
            icon={<FiChevronUp />}
            iconPosition="right"
            onClick={() => setExpanded(false)}
          >
            Show Less
          </SecondaryButton>
        )}
      </div>

    </section>
  )
}

export default UdCompare
