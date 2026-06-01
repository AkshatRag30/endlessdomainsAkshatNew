import React, { useCallback } from 'react'
import styles from '../Analytics.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'
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
        <FilterDropdown id="filter-tld" value={value.tld} options={TLD_OPTIONS} onChange={v => set({ tld: v as TLDFilter })} />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-provider">Provider</label>
        <FilterDropdown id="filter-provider" value={value.provider} options={PROVIDER_OPTIONS} onChange={v => set({ provider: v as ProviderFilter })} />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-expiry">Expiry</label>
        <FilterDropdown id="filter-expiry" value={value.expiry} options={EXPIRY_OPTIONS} onChange={v => set({ expiry: v as ExpiryFilter })} />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-renewal">Renewal Type</label>
        <FilterDropdown id="filter-renewal" value={value.renewalType} options={RENEWAL_TYPE_OPTIONS} onChange={v => set({ renewalType: v as RenewalTypeFilter })} />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-domain-type">Domain Type</label>
        <FilterDropdown id="filter-domain-type" value={value.domainType} options={DOMAIN_TYPE_OPTIONS} onChange={v => set({ domainType: v as DomainTypeFilter })} />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-listing">Domain Listing</label>
        <FilterDropdown id="filter-listing" value={value.domainListing} options={DOMAIN_LISTING_OPTIONS} onChange={v => set({ domainListing: v as DomainListingFilter })} />
      </div>

      <div className={styles.filterDivider} aria-hidden="true" />
      <button type="button" className={styles.filterReset} onClick={handleReset} aria-label="Reset all filters">
        Reset
      </button>
    </div>
  )
}

export default AnalyticsFilterBar

