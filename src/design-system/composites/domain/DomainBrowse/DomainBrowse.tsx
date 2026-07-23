import React, { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FiArrowRight } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { getAllDomainProviders, type DomainProviderKey } from '@helpers/chaincurrency/chaincurrency'
import { getTldsByProvider, getTldHref, TLDS_PER_PAGE } from '@data/allTlds'

import styles from './DomainBrowse.module.scss'

const PROVIDERS = getAllDomainProviders()

// design-specific: mobile shows 4 cards stacked vertically per page instead of desktop's 6-per-
// page 3x2 grid — decoupled from TLDS_PER_PAGE so each breakpoint paginates at its own natural
// page size rather than mobile inheriting desktop's count and needing to hide 2 of every 6
const MOBILE_TLDS_PER_PAGE = 4

type FilterKey = DomainProviderKey | 'ALL'

function buildPageItems(pageCount: number, page: number): Array<number | 'ellipsis'> {
  // condensed page-number list — first, last, current, and current's immediate neighbors are
  // shown as real buttons; any gap between them collapses into a single "…" marker
  const items: Array<number | 'ellipsis'> = []
  for (let i = 0; i < pageCount; i++) {
    if (i === 0 || i === pageCount - 1 || Math.abs(i - page) <= 1) {
      items.push(i)
    } else if (items[items.length - 1] !== 'ellipsis') {
      items.push('ellipsis')
    }
  }
  return items
}

export function DomainBrowse() {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterKey>('ALL')
  const [page, setPage] = useState(0)
  const [mobilePage, setMobilePage] = useState(0)

  const filteredTlds = useMemo(() => getTldsByProvider(filter), [filter])
  const pageCount = Math.max(1, Math.ceil(filteredTlds.length / TLDS_PER_PAGE))
  const mobilePageCount = Math.max(1, Math.ceil(filteredTlds.length / MOBILE_TLDS_PER_PAGE))

  const visibleTlds = useMemo(
    () => filteredTlds.slice(page * TLDS_PER_PAGE, page * TLDS_PER_PAGE + TLDS_PER_PAGE),
    [filteredTlds, page],
  )

  const mobileVisibleTlds = useMemo(
    () => filteredTlds.slice(mobilePage * MOBILE_TLDS_PER_PAGE, mobilePage * MOBILE_TLDS_PER_PAGE + MOBILE_TLDS_PER_PAGE),
    [filteredTlds, mobilePage],
  )

  const handleFilterChange = useCallback((next: FilterKey) => {
    setFilter(next)
    setPage(0)
    setMobilePage(0)
  }, [])

  const handlePrev = useCallback(() => {
    setPage(prev => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setPage(prev => Math.min(pageCount - 1, prev + 1))
  }, [pageCount])

  const handlePageClick = useCallback((index: number) => {
    setPage(index)
  }, [])

  const handleMobilePrev = useCallback(() => {
    setMobilePage(prev => Math.max(0, prev - 1))
  }, [])

  const handleMobileNext = useCallback(() => {
    setMobilePage(prev => Math.min(mobilePageCount - 1, prev + 1))
  }, [mobilePageCount])

  const handleMobilePageClick = useCallback((index: number) => {
    setMobilePage(index)
  }, [])

  const handleViewPage = useCallback((href: string) => {
    router.push(href)
  }, [router])

  const pageItems = useMemo(() => buildPageItems(pageCount, page), [pageCount, page])
  const mobilePageItems = useMemo(() => buildPageItems(mobilePageCount, mobilePage), [mobilePageCount, mobilePage])

  return (
    <section className={styles.section} aria-labelledby="domain-browse-heading">

      {/* Header — dashed top/bottom rule lines, full viewport width */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.titleBlock}>
            <div className={styles.labelWrap}>
              <span className={styles.labelBracketTL} aria-hidden="true" />
              <span className={styles.labelBracketTR} aria-hidden="true" />
              <span className={styles.labelBracketBL} aria-hidden="true" />
              <span className={styles.labelBracketBR} aria-hidden="true" />
              <p className={styles.labelText}>Browse Identities</p>
            </div>

            <h2 id="domain-browse-heading" className={styles.heading}>
              <span className={styles.headingLine1}>70+ TLDs.</span>
              <span className={styles.headingLine2}>10+ Providers.</span>
            </h2>
          </div>

          <p className={styles.description}>
            Buying identities across multiple providers and chains was a hassle. Endless brings ENS, Unstoppable, Freename, and more into one unified marketplace. One search. Every identity.
          </p>
        </div>
      </div>

      {/* Provider filter row */}
      <div className={styles.filterWrap}>
        <div className={styles.filterRow} role="tablist" aria-label="Filter by provider">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'ALL'}
            className={`${styles.filterPill} ${styles.filterPillAll} ${filter === 'ALL' ? styles.filterPillActive : ''}`}
            onClick={() => handleFilterChange('ALL')}
          >
            All TLDs
          </button>

          {PROVIDERS.map(provider => (
            <button
              key={provider.provider}
              type="button"
              role="tab"
              aria-selected={filter === provider.provider}
              className={`${styles.filterPill} ${filter === provider.provider ? styles.filterPillActive : ''}`}
              onClick={() => handleFilterChange(provider.provider)}
            >
              <span className={styles.filterAvatar} style={{ borderColor: `${provider.colorName}5c` }}>
                <Image src={provider.image} alt="" width={20} height={20} className={styles.filterIcon} />
              </span>
              {provider.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid — desktop/tablet: 3 per row, 2 rows */}
      <div className={styles.cardGrid}>
        {visibleTlds.map(entry => (
          <div key={entry.tld} className={styles.card}>
            <div className={styles.cardInner}>
              <span className={styles.cardTld}>{entry.tld}</span>
              <div className={styles.cardBody}>
                <span className={styles.cardPrice}>{entry.price}</span>
                <div className={styles.cardMeta}>
                  <span className={styles.cardProvider}>Endless Domains</span>
                  <p className={styles.cardDesc}>{entry.desc}</p>
                </div>
                <PrimaryButton
                  className={styles.viewPageBtn}
                  onClick={() => handleViewPage(getTldHref(entry))}
                  icon={<FiArrowRight size={18} aria-hidden="true" />}
                  iconPosition="right"
                >
                  View Page
                </PrimaryButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination — desktop/tablet only */}
      <nav className={styles.pagination} aria-label="Browse identities pagination">
        <button
          type="button"
          className={styles.pageNavBtn}
          onClick={handlePrev}
          disabled={page === 0}
        >
          <span aria-hidden="true">«</span> Previous
        </button>

        <span className={styles.pageDivider} aria-hidden="true" />

        <div className={styles.pageNumbers}>
          {pageItems.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className={styles.pageEllipsis} aria-hidden="true">•••</span>
            ) : (
              <React.Fragment key={item}>
                <button
                  type="button"
                  className={`${styles.pageNumberBtn} ${page === item ? styles.pageNumberBtnActive : ''}`}
                  aria-current={page === item ? 'page' : undefined}
                  onClick={() => handlePageClick(item)}
                >
                  {item + 1}
                </button>
                {index < pageItems.length - 1 && <span className={styles.pageDivider} aria-hidden="true" />}
              </React.Fragment>
            ),
          )}
        </div>

        <span className={styles.pageDivider} aria-hidden="true" />

        <button
          type="button"
          className={styles.pageNavBtn}
          onClick={handleNext}
          disabled={page === pageCount - 1}
        >
          Next <span aria-hidden="true">»</span>
        </button>
      </nav>

      {/* Card list — mobile only: 4 cards stacked vertically per page */}
      <div className={styles.mobileCardGrid}>
        {mobileVisibleTlds.map(entry => (
          <div key={entry.tld} className={styles.card}>
            <div className={styles.cardInner}>
              <span className={styles.cardTld}>{entry.tld}</span>
              <div className={styles.cardBody}>
                <span className={styles.cardPrice}>{entry.price}</span>
                <div className={styles.cardMeta}>
                  <span className={styles.cardProvider}>Endless Domains</span>
                  <p className={styles.cardDesc}>{entry.desc}</p>
                </div>
                <PrimaryButton
                  className={styles.viewPageBtn}
                  onClick={() => handleViewPage(getTldHref(entry))}
                  icon={<FiArrowRight size={18} aria-hidden="true" />}
                  iconPosition="right"
                >
                  View Page
                </PrimaryButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination — mobile only */}
      <nav className={styles.mobilePagination} aria-label="Browse identities pagination">
        <button
          type="button"
          className={styles.pageNavBtn}
          onClick={handleMobilePrev}
          disabled={mobilePage === 0}
        >
          <span aria-hidden="true">«</span> Previous
        </button>

        <span className={styles.pageDivider} aria-hidden="true" />

        <div className={styles.pageNumbers}>
          {mobilePageItems.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`mobile-ellipsis-${index}`} className={styles.pageEllipsis} aria-hidden="true">•••</span>
            ) : (
              <React.Fragment key={item}>
                <button
                  type="button"
                  className={`${styles.pageNumberBtn} ${mobilePage === item ? styles.pageNumberBtnActive : ''}`}
                  aria-current={mobilePage === item ? 'page' : undefined}
                  onClick={() => handleMobilePageClick(item)}
                >
                  {item + 1}
                </button>
                {index < mobilePageItems.length - 1 && <span className={styles.pageDivider} aria-hidden="true" />}
              </React.Fragment>
            ),
          )}
        </div>

        <span className={styles.pageDivider} aria-hidden="true" />

        <button
          type="button"
          className={styles.pageNavBtn}
          onClick={handleMobileNext}
          disabled={mobilePage === mobilePageCount - 1}
        >
          Next <span aria-hidden="true">»</span>
        </button>
      </nav>

    </section>
  )
}

export default DomainBrowse
