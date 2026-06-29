import { useState, useEffect, useCallback } from 'react'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styles from './UdTlds.module.scss'

const TLDS = [
  { tld: '.crypto',    price: '$20', chain: 'Multi-chain', desc: 'The flagship Web3 TLD for crypto natives and DeFi enthusiasts.' },
  { tld: '.wallet',    price: '$20', chain: 'Multi-chain', desc: 'A universal identity for your digital assets across any chain.' },
  { tld: '.blockchain', price: '$20', chain: 'Multi-chain', desc: 'Stake your claim on the foundational technology of Web3.' },
  { tld: '.bitcoin',   price: '$20', chain: 'Multi-chain', desc: 'For maximalists and believers in the original decentralized currency.' },
  { tld: '.nft',       price: '$20', chain: 'Multi-chain', desc: 'The go-to namespace for digital collectors and NFT creators.' },
  { tld: '.dao',       price: '$20', chain: 'Multi-chain', desc: 'Built for decentralized organizations and on-chain governance.' },
  { tld: '.888',       price: '$20', chain: 'Multi-chain', desc: 'A lucky, memorable Web3 identity for global communities.' },
  { tld: '.x',         price: '$20', chain: 'Multi-chain', desc: 'Short, sharp, and versatile — the minimal Web3 identity.' },
  { tld: '.polygon',   price: '$5',  chain: 'Polygon',     desc: 'Native identity for the Polygon Layer 2 ecosystem.' },
  { tld: '.eth',       price: '$5',  chain: 'Ethereum',    desc: 'An ENS-compatible identity for the Ethereum mainnet.' },
  { tld: '.zil',       price: '$5',  chain: 'Zilliqa',     desc: 'The primary identity layer for the Zilliqa blockchain.' },
  { tld: '.unstoppable', price: '$20', chain: 'Multi-chain', desc: 'Own the identity that represents decentralized freedom.' },
  { tld: '.coin',      price: '$20', chain: 'Multi-chain', desc: 'For crypto holders, traders, and digital-asset enthusiasts.' },
  { tld: '.klever',    price: '$5',  chain: 'Multi-chain', desc: 'Integrated with the Klever ecosystem for seamless Web3 access.' },
  { tld: '.hi',        price: '$5',  chain: 'Multi-chain', desc: 'A friendly, approachable Web3 identity for everyday use.' },
  { tld: '.anime',     price: '$5',  chain: 'Multi-chain', desc: 'Celebrate Japanese culture and animation in the Web3 space.' },
  { tld: '.manga',     price: '$5',  chain: 'Multi-chain', desc: 'For manga artists, fans, and communities in the digital world.' },
  { tld: '.binanceus', price: '$5',  chain: 'Multi-chain', desc: 'Exclusive identity for the Binance US community.' },
  { tld: '.kresus',    price: '$5',  chain: 'Multi-chain', desc: 'The home identity for the Kresus smart wallet ecosystem.' },
  { tld: '.go',        price: '$5',  chain: 'Multi-chain', desc: 'A concise, action-driven Web3 identity for movers and makers.' },
  { tld: '.meta',      price: '$20', chain: 'Multi-chain', desc: 'Claim your presence in the expanding metaverse landscape.' },
  { tld: '.altimist',  price: '$5',  chain: 'Multi-chain', desc: 'Built for the long-term thinkers shaping decentralized finance.' },
  { tld: '.ubu',       price: '$5',  chain: 'Multi-chain', desc: 'Community-first identity for decentralized collaboration.' },
  { tld: '.pudgy',     price: '$5',  chain: 'Multi-chain', desc: 'The identity home for the Pudgy Penguins NFT community.' },
]

const PAGE_SIZE = 9

export function UdTlds() {
  const [page, setPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const totalPages = Math.ceil(TLDS.length / PAGE_SIZE)

  const visibleTlds = isMobile && !expanded
    ? TLDS.slice(0, 4)
    : TLDS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const showPagination = !isMobile
  const showLoadMore = isMobile && !expanded

  const prev = useCallback(() => setPage(p => Math.max(0, p - 1)), [])
  const next = useCallback(() => setPage(p => Math.min(totalPages - 1, p + 1)), [totalPages])

  return (
    <section className={styles.section} aria-labelledby="ud-tlds-heading">

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrowWrap}>
            <span className={styles.reticleTL} aria-hidden="true" />
            <span className={styles.reticleTR} aria-hidden="true" />
            <span className={styles.reticleBL} aria-hidden="true" />
            <p className={styles.eyebrow}>TLD Catalog</p>
            <span className={styles.reticleBR} aria-hidden="true" />
          </div>
          <h2 id="ud-tlds-heading" className={styles.heading}>
            All
            <br />
            <mark className={styles.headingAccent}>Unstoppable TLDs</mark>
          </h2>
        </div>

        <div className={styles.headerDescWrap}>
          <span className={styles.descReticleTL} aria-hidden="true" />
          <p className={styles.headerDesc}>
            55 TLDs spanning crypto culture, identity, finance, and community — the largest on-chain namespace catalog.
          </p>
          <span className={styles.descReticleBR} aria-hidden="true" />
        </div>
      </div>

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

      {showPagination && (
        <nav className={styles.pagination} aria-label="TLD catalog pages">
          <button
            className={styles.paginationBtn}
            onClick={prev}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <FiChevronLeft size={18} aria-hidden="true" />
          </button>

          <div className={styles.paginationDots}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${page === i ? styles.dotActive : ''}`}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={page === i ? 'page' : undefined}
              />
            ))}
          </div>

          <button
            className={styles.paginationBtn}
            onClick={next}
            disabled={page === totalPages - 1}
            aria-label="Next page"
          >
            <FiChevronRight size={18} aria-hidden="true" />
          </button>
        </nav>
      )}

      {showLoadMore && (
        <div className={styles.loadMoreWrap}>
          <SecondaryButton
            icon={<FiChevronRight />}
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

export default UdTlds
