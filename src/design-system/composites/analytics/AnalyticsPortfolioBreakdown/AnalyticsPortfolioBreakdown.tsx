import React, { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { BsArrowRight } from 'react-icons/bs'
import styles from '../Analytics.module.scss'
import { mockAnalyticsDomains, applyPBFilter, computeBreakdownStats } from '../data/mockAnalyticsData'
import type { AnalyticsProvider, AnalyticsFilterState } from '../data/mockAnalyticsData'

const AnalyticsProviderDonut = dynamic(() => import('../AnalyticsProviderDonut'), { ssr: false })

const VISIBLE_COUNT = 6

interface Props {
  filterState: AnalyticsFilterState
  onFilterChange: (state: AnalyticsFilterState) => void
}

function toSelectedProvider(providerFilter: string): AnalyticsProvider | null {
  return providerFilter === 'All' ? null : (providerFilter as AnalyticsProvider)
}

const AnalyticsPortfolioBreakdown: React.FC<Props> = ({ filterState, onFilterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedProvider = toSelectedProvider(filterState.provider)

  // Apply all filters (TLD, Expiry, Renewal, Domain Type, Listing) then recompute stats
  const filteredDomains = useMemo(
    () => applyPBFilter(mockAnalyticsDomains, filterState),
    [filterState],
  )

  const breakdownStats = useMemo(
    () => computeBreakdownStats(filteredDomains),
    [filteredDomains],
  )

  const filteredTotal = filteredDomains.length

  // Clear selected provider if it no longer exists in the filtered set
  const resolvedProvider = useMemo(
    () => (breakdownStats.some(s => s.provider === selectedProvider) ? selectedProvider : null),
    [breakdownStats, selectedProvider],
  )

  const handleProviderSelect = useCallback(
    (provider: AnalyticsProvider | null) => {
      onFilterChange({ ...filterState, provider: provider ?? 'All' })
    },
    [filterState, onFilterChange],
  )

  const handleLegendClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const clicked = e.currentTarget.dataset.provider as AnalyticsProvider
      onFilterChange({
        ...filterState,
        provider: filterState.provider === clicked ? 'All' : clicked,
      })
    },
    [filterState, onFilterChange],
  )

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closeModal()
    },
    [closeModal],
  )

  useEffect(() => {
    if (!isModalOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isModalOpen, closeModal])

  const hiddenCount = Math.max(0, breakdownStats.length - VISIBLE_COUNT)

  return (
    <>
      <div className={styles.pbWrap}>
        <p className={styles.pbHint}>Click A Segment Or Legend Item To Filter The Domain List</p>

        <div className={styles.pbChartArea}>
          <AnalyticsProviderDonut
            stats={breakdownStats}
            totalDomains={filteredTotal}
            selectedProvider={resolvedProvider}
            onProviderSelect={handleProviderSelect}
            wrapperClassName={styles.pbDonutCol}
            showHint={false}
            size="lg"
          />

          <div className={styles.pbLegend} role="list" aria-label="Provider legend">
            {breakdownStats.map(stat => (
              <button
                key={stat.provider}
                type="button"
                role="listitem"
                data-provider={stat.provider}
                className={`${styles.pbLegendItem} ${resolvedProvider === stat.provider ? styles.pbLegendItem_active : ''}`}
                onClick={handleLegendClick}
                aria-pressed={resolvedProvider === stat.provider}
                aria-label={`${resolvedProvider === stat.provider ? 'Clear filter' : 'Filter'} by ${stat.provider}: ${stat.count} domains, ${stat.percentage}%`}
              >
                <div className={styles.pbIconGroup}>
                  <div className={styles.pbTokenBadge}>
                    <Image
                      src={stat.iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={22}
                      height={22}
                      className={styles.pbTokenIcon}
                    />
                  </div>
                  <span className={styles.pbLegendName}>{stat.provider}</span>
                </div>
                <span className={styles.pbLegendStats} data-provider={stat.provider.toLowerCase()}>
                  {stat.count} Domains {stat.percentage}%
                </span>
              </button>
            ))}

            {hiddenCount > 0 && (
              <button
                type="button"
                className={styles.legendViewMore}
                onClick={openModal}
                aria-haspopup="dialog"
              >
                View More +{hiddenCount} <BsArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className={styles.legendModalOverlay}
          onClick={handleOverlayClick}
          role="presentation"
        >
          <div
            className={styles.legendModal}
            role="dialog"
            aria-modal="true"
            aria-label="All providers"
          >
            <button
              type="button"
              className={styles.legendModalClose}
              onClick={closeModal}
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className={styles.legendModalList} role="list" aria-label="All providers">
              {breakdownStats.map(stat => (
                <button
                  key={stat.provider}
                  type="button"
                  role="listitem"
                  data-provider={stat.provider}
                  className={`${styles.legendModalItem} ${resolvedProvider === stat.provider ? styles.legendModalItem_active : ''}`}
                  onClick={handleLegendClick}
                  aria-pressed={resolvedProvider === stat.provider}
                  aria-label={`${resolvedProvider === stat.provider ? 'Clear filter' : 'Filter'} by ${stat.provider}: ${stat.count} domains, ${stat.percentage}%`}
                >
                  <div className={styles.legendModalProviderGroup}>
                    <Image
                      src={stat.iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={48}
                      height={48}
                      className={styles.legendModalProviderIcon}
                    />
                    <span className={styles.legendModalProviderName}>{stat.provider}</span>
                  </div>
                  <span className={styles.legendModalStats}>
                    {stat.count} Domains {stat.percentage}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AnalyticsPortfolioBreakdown

