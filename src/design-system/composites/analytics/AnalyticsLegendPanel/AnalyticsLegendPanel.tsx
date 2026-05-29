import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { BsArrowRight } from 'react-icons/bs'
import styles from '../Analytics.module.scss'
import type { ProviderStat, AnalyticsProvider } from '../data/mockAnalyticsData'

interface Props {
  stats: ProviderStat[]
  selectedProvider: AnalyticsProvider | null
  onProviderSelect: (provider: AnalyticsProvider | null) => void
}

const AnalyticsLegendPanel: React.FC<Props> = ({ stats, selectedProvider, onProviderSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const provider = e.currentTarget.dataset.provider as AnalyticsProvider
      onProviderSelect(selectedProvider === provider ? null : provider)
    },
    [selectedProvider, onProviderSelect],
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

  return (
    <>
      <div className={styles.legendCol} role="list" aria-label="Provider legend">
        {stats.map(stat => (
          <button
            key={stat.provider}
            type="button"
            role="listitem"
            data-provider={stat.provider}
            className={`${styles.legendItem} ${selectedProvider === stat.provider ? styles.legendItem_active : ''}`}
            onClick={handleClick}
            aria-pressed={selectedProvider === stat.provider}
            aria-label={`${selectedProvider === stat.provider ? 'Clear filter' : 'Filter'} by ${stat.provider}: ${stat.count} domains, ${stat.percentage}%`}
          >
            <span
              className={`${styles.legendSwatch} ${styles[`legendSwatch_${stat.provider.toLowerCase()}`]}`}
              aria-hidden="true"
            />
            <div className={styles.legendProviderGroup}>
              <Image
                src={stat.iconSrc}
                alt=""
                aria-hidden="true"
                width={31}
                height={31}
                className={styles.legendProviderIcon}
              />
              <span className={styles.legendProviderName}>{stat.provider}</span>
            </div>
            <span className={styles.legendStats}>
              {stat.count} Domains {stat.percentage}%
            </span>
          </button>
        ))}

        {/* View More — mobile only, spans both grid columns, only when there are hidden items */}
        {stats.length > 6 && (
          <button
            type="button"
            className={styles.legendViewMore}
            onClick={openModal}
            aria-haspopup="dialog"
          >
            View More +{stats.length - 6} <BsArrowRight aria-hidden="true" />
          </button>
        )}
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
              {stats.map(stat => (
                <button
                  key={stat.provider}
                  type="button"
                  role="listitem"
                  data-provider={stat.provider}
                  className={`${styles.legendModalItem} ${selectedProvider === stat.provider ? styles.legendModalItem_active : ''}`}
                  onClick={handleClick}
                  aria-pressed={selectedProvider === stat.provider}
                  aria-label={`${selectedProvider === stat.provider ? 'Clear filter' : 'Filter'} by ${stat.provider}: ${stat.count} domains, ${stat.percentage}%`}
                >
                  <div className={styles.legendModalProviderGroup}>
                    <Image
                      src={stat.iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={38}
                      height={38}
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

export default AnalyticsLegendPanel

