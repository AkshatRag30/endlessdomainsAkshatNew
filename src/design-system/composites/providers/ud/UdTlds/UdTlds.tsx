import { useState, useEffect, useCallback } from 'react'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styles from './UdTlds.module.scss'

const TLDS = [
  { tld: '.og',          desc: 'Own the original internet identity.' },
  { tld: '.crypto',      desc: 'The most recognized crypto-native identity.' },
  { tld: '.nft',         desc: 'Built for creators, collectors, and communities.' },
  { tld: '.wallet',      desc: 'A human-readable name for every wallet.' },
  { tld: '.blockchain',  desc: 'For builders shaping the decentralized future.' },
  { tld: '.bitcoin',     desc: "Show your allegiance to the world's first cryptocurrency." },
  { tld: '.dao',         desc: 'Designed for decentralized communities and governance.' },
  { tld: '.zil',         desc: 'The original blockchain domain extension.' },
  { tld: '.x',           desc: 'Short, premium, and unforgettable.' },
  { tld: '.polygon',     desc: 'Built for the Polygon ecosystem.' },
  { tld: '.binanceus',   desc: 'Identity for the Binance US community.' },
  { tld: '.bitget',      desc: 'Represent your presence across the Bitget ecosystem.' },
  { tld: '.anime',       desc: 'For anime fans, creators, and collectors.' },
  { tld: '.manga',       desc: 'A home for manga culture on-chain.' },
  { tld: '.clay',        desc: 'Shape your digital identity your way.' },
  { tld: '.witg',        desc: "For communities creating what's next." },
  { tld: '.wrkx',        desc: 'Built for builders, creators, and innovators.' },
  { tld: '.austin',      desc: "Represent one of the world's leading tech hubs." },
  { tld: '.mumu',        desc: 'Playful, memorable, and community-driven.' },
  { tld: '.bald',        desc: 'A badge of internet culture and conviction.' },
  { tld: '.chomp',       desc: 'Bold identities for those who move first.' },
  { tld: '.tball',       desc: 'For players, fans, and sports communities.' },
  { tld: '.dfz',         desc: 'Unique identities for emerging digital communities.' },
  { tld: '.secret',      desc: 'Exclusive, private, and unmistakably yours.' },
  { tld: '.raiin',       desc: 'Built for creators and digital entrepreneurs.' },
  { tld: '.stepn',       desc: 'For the move-to-earn generation.' },
  { tld: '.ubu',         desc: 'Simple, unique, and easy to remember.' },
  { tld: '.pudgy',       desc: "Join one of Web3's most iconic communities." },
  { tld: '.go',          desc: 'Short, action-oriented, and universally understood.' },
  { tld: '.smobler',     desc: 'Community-first identity for Web3 natives.' },
  { tld: '.lfg',         desc: 'For builders ready to ship and win.' },
  { tld: '.pog',         desc: 'Celebrate every achievement on-chain.' },
  { tld: '.dream',       desc: 'Turn your vision into a permanent identity.' },
  { tld: '.propykeys',   desc: 'Built for the future of digital property ownership.' },
  { tld: '.unstoppable', desc: 'A statement of freedom and self-sovereignty.' },
]

const PAGE_SIZE = 12

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
            55 TLDs available across identity, payments, communities, brands, and digital ownership.

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
                  <p className={styles.desc}>{item.desc}</p>
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
