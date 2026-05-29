import React from 'react'
import Image from 'next/image'
import styles from '../Analytics.module.scss'
import { mockProviderStats } from '../data/mockAnalyticsData'
import type { AnalyticsDomain, AnalyticsProvider, DomainStatus } from '../data/mockAnalyticsData'

const STATUS_DOT_CLASS: Record<DomainStatus, string> = {
  Active: styles.statusDot_active,
  Processing: styles.statusDot_processing,
  Complete: styles.statusDot_complete,
  Cancel: styles.statusDot_cancel,
  Pending: styles.statusDot_pending,
  Expired: styles.statusDot_expired,
}

function getProviderIcon(provider: AnalyticsProvider): string {
  return mockProviderStats.find(s => s.provider === provider)?.iconSrc ?? '/domain/ud.svg'
}

interface Props {
  domains: AnalyticsDomain[]
  selectedProvider: AnalyticsProvider | null
  wrapperClassName?: string
}

const AnalyticsDomainList: React.FC<Props> = ({ domains, selectedProvider, wrapperClassName }) => {
  const filtered = selectedProvider ? domains.filter(d => d.provider === selectedProvider) : domains

  return (
    <div className={wrapperClassName ?? styles.domainListCol}>
      <div className={styles.domainListScroll} role="list" aria-label="Domain list">
        {filtered.length === 0 ? (
          <div className={styles.emptyChart} role="status">
            No domains match the selected filter
          </div>
        ) : (
          filtered.map(domain => {
            const iconSrc = getProviderIcon(domain.provider)
            return (
              <div key={domain.id} className={styles.domainRow} role="listitem">

                <div className={styles.domainRowNameCell}>
                  <span className={styles.domainCellLabel}>Domain Name</span>
                  <div className={styles.domainRowNameValue}>
                    <Image
                      src={iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={26}
                      height={26}
                      className={styles.domainRowIcon}
                    />
                    <span className={styles.domainRowName}>{domain.domainName}</span>
                  </div>
                </div>

                <div className={styles.domainRowStatusCell}>
                  <span className={styles.domainCellLabel}>Status</span>
                  <div className={styles.domainRowStatusValue}>
                    <span
                      className={`${styles.statusDot} ${STATUS_DOT_CLASS[domain.status]}`}
                      aria-hidden="true"
                    />
                    <span className={styles.statusText}>{domain.status}</span>
                  </div>
                </div>

                <div className={styles.domainRowProvider}>
                  <span className={styles.domainCellLabel}>Provider</span>
                  <div className={styles.domainRowProviderValue}>
                    <Image
                      src={iconSrc}
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={24}
                      className={styles.domainRowProviderIcon}
                    />
                    <span className={styles.domainRowProviderName}>{domain.provider}</span>
                  </div>
                </div>

                <div className={styles.domainRowPriceCell}>
                  <span className={styles.domainCellLabel}>Price</span>
                  <span className={styles.domainRowPrice}>${domain.price.toFixed(2)}</span>
                </div>

              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AnalyticsDomainList

