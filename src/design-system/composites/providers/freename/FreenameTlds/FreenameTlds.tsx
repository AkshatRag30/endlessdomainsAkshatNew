import { useState, useEffect, useCallback } from 'react'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'
import { FiArrowRight, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styles from './FreenameTlds.module.scss'

const TLDS = [
  { tld: '.metaverse', desc: 'Secure your place in the digital worlds of tomorrow.' },
  { tld: '.hodl',      desc: 'Built for long-term believers in crypto.' },
  { tld: '.satosh',    desc: 'Inspired by the creator of Bitcoin.' },
  { tld: '.genesis',   desc: 'The perfect identity for new beginnings.' },
  { tld: '.token',     desc: 'A Web3-native identity built around digital ownership.' },
  { tld: '.sat',       desc: 'Short, memorable, and Bitcoin-inspired.' },
  { tld: '.airdrop',   desc: 'For users at the forefront of Web3 discovery.' },
  { tld: '.rwa',       desc: 'Built for the future of real-world assets on-chain.' },
]

const PAGE_SIZE = 8
const MOBILE_INITIAL = 4

export function FreenameTlds() {
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
    ? TLDS.slice(0, MOBILE_INITIAL)
    : TLDS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const showPagination = !isMobile && totalPages > 1
  const showLoadMore = isMobile && !expanded

  const prev = useCallback(() => setPage(p => Math.max(0, p - 1)), [])
  const next = useCallback(() => setPage(p => Math.min(totalPages - 1, p + 1)), [totalPages])

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

      {/* ── Pagination — desktop only ───────────────────────────────────────── */}
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
