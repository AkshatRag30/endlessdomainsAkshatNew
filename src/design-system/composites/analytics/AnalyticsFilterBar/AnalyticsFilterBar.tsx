import React, { useCallback } from 'react'
import styles from '../Analytics.module.scss'
import {
  TLD_OPTIONS,
  PROVIDER_OPTIONS,
  EXPIRY_OPTIONS,
  RENEWAL_TYPE_OPTIONS,
  DOMAIN_TYPE_OPTIONS,
  DOMAIN_LISTING_OPTIONS,
  DEFAULT_FILTER_STATE,
} from '../data/mockAnalyticsData'
import type { AnalyticsFilterState, TLDFilter, ProviderFilter, ExpiryFilter, RenewalTypeFilter, DomainTypeFilter, DomainListingFilter } from '../data/mockAnalyticsData'

interface Props {
  value: AnalyticsFilterState
  onChange: (state: AnalyticsFilterState) => void
}

const AnalyticsFilterBar: React.FC<Props> = ({ value, onChange }) => {
  const set = useCallback(
    (patch: Partial<AnalyticsFilterState>) => onChange({ ...value, ...patch }),
    [value, onChange],
  )

  const handleReset = useCallback(() => onChange(DEFAULT_FILTER_STATE), [onChange])

  return (
    <div className={styles.filterBar} role="search" aria-label="Analytics filters">
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-tld">TLD</label>
        <select id="filter-tld" className={styles.filterSelect} value={value.tld} onChange={e => set({ tld: e.target.value as TLDFilter })}>
          {TLD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-provider">Provider</label>
        <select id="filter-provider" className={styles.filterSelect} value={value.provider} onChange={e => set({ provider: e.target.value as ProviderFilter })}>
          {PROVIDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-expiry">Expiry</label>
        <select id="filter-expiry" className={styles.filterSelect} value={value.expiry} onChange={e => set({ expiry: e.target.value as ExpiryFilter })}>
          {EXPIRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-renewal">Renewal Type</label>
        <select id="filter-renewal" className={styles.filterSelect} value={value.renewalType} onChange={e => set({ renewalType: e.target.value as RenewalTypeFilter })}>
          {RENEWAL_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-domain-type">Domain Type</label>
        <select id="filter-domain-type" className={styles.filterSelect} value={value.domainType} onChange={e => set({ domainType: e.target.value as DomainTypeFilter })}>
          {DOMAIN_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-listing">Domain Listing</label>
        <select id="filter-listing" className={styles.filterSelect} value={value.domainListing} onChange={e => set({ domainListing: e.target.value as DomainListingFilter })}>
          {DOMAIN_LISTING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className={styles.filterDivider} aria-hidden="true" />
      <button type="button" className={styles.filterReset} onClick={handleReset} aria-label="Reset all filters">
        Reset
      </button>
    </div>
  )
}

export default AnalyticsFilterBar
