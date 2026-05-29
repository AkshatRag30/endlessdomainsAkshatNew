import React, { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import styles from '../Analytics.module.scss'
import AnalyticsDomainList from '../AnalyticsDomainList'
import AnalyticsLegendPanel from '../AnalyticsLegendPanel'
import { mockAnalyticsDomains, applyPDFilter, computeProviderStats } from '../data/mockAnalyticsData'
import type { AnalyticsProvider, PDFilterState } from '../data/mockAnalyticsData'

const AnalyticsProviderDonut = dynamic(() => import('../AnalyticsProviderDonut'), { ssr: false })

interface Props {
  filterState: PDFilterState
}

const AnalyticsProviderDistribution: React.FC<Props> = ({ filterState }) => {
  const [selectedProvider, setSelectedProvider] = useState<AnalyticsProvider | null>(null)

  const handleProviderSelect = useCallback((provider: AnalyticsProvider | null) => {
    setSelectedProvider(provider)
  }, [])

  // Apply date / status / time-period filters → recompute donut stats from filtered set
  const filteredDomains = useMemo(
    () => applyPDFilter(mockAnalyticsDomains, filterState),
    [filterState],
  )

  const filteredStats = useMemo(
    () => computeProviderStats(filteredDomains),
    [filteredDomains],
  )

  const filteredTotal = filteredDomains.length

  // Reset selected provider if it no longer exists in the filtered stats
  const resolvedProvider = useMemo(
    () => (filteredStats.some(s => s.provider === selectedProvider) ? selectedProvider : null),
    [filteredStats, selectedProvider],
  )

  return (
    <div className={styles.providerLayout}>
      <div className={styles.domainListWrapper}>
        <h2 className={styles.domainListTitle}>Domains By Provider</h2>
        <AnalyticsDomainList domains={filteredDomains} selectedProvider={resolvedProvider} />
      </div>
      <AnalyticsProviderDonut
        stats={filteredStats}
        totalDomains={filteredTotal}
        selectedProvider={resolvedProvider}
        onProviderSelect={handleProviderSelect}
      />
      <AnalyticsLegendPanel
        stats={filteredStats}
        selectedProvider={resolvedProvider}
        onProviderSelect={handleProviderSelect}
      />
    </div>
  )
}

export default AnalyticsProviderDistribution
