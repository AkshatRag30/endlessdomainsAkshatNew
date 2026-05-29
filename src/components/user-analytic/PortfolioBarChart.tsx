import React, { useState, useCallback } from 'react'
import styles from './Analytics.module.scss'
import { pvBarProviders, PV_BAR_MAX } from './mockAnalyticsData'
import type { PVBarProvider } from './mockAnalyticsData'

interface Props {
  providers?: PVBarProvider[]
  maxValue?: number
}

const PortfolioBarChart: React.FC<Props> = ({ providers, maxValue }) => {
  const [hovered, setHovered] = useState<PVBarProvider | null>(null)

  const handleEnter = useCallback((p: PVBarProvider) => setHovered(p), [])
  const handleLeave = useCallback(() => setHovered(null), [])

  const data = providers ?? pvBarProviders
  const barMax = maxValue ?? PV_BAR_MAX

  // Y-axis labels scale to the actual max value
  const yMax = Math.ceil(barMax / 1000) * 1000
  const yStep = yMax / 8
  const yLabels = Array.from({ length: 9 }, (_, i) => {
    const val = yMax - i * yStep
    return val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
  })

  return (
    <div className={styles.pvBarChartCard}>
      <h2 className={styles.pvChartTitle}>Value by Provider</h2>
      <div className={styles.pvChartInner}>
        <div className={styles.pvYAxis} aria-hidden="true">
          {yLabels.map(label => (
            <span key={label} className={styles.pvYLabel}>{label}</span>
          ))}
        </div>

        <div className={styles.pvBarsArea}>
          <div className={styles.pvGridOverlay} aria-hidden="true">
            {yLabels.map((_, i) => (
              <div key={i} className={styles.pvGridLine} />
            ))}
          </div>

          <div className={styles.pvBarsRow}>
            {data.map(provider => {
              const barHeightPct = barMax > 0 ? (provider.value / barMax) * 100 : 0
              const isHovered = hovered?.key === provider.key
              const tooltipInside = barHeightPct > 78

              return (
                <div
                  key={provider.key}
                  className={styles.pvBarCol}
                  onMouseEnter={() => handleEnter(provider)}
                  onMouseLeave={handleLeave}
                  onFocus={() => handleEnter(provider)}
                  onBlur={handleLeave}
                  tabIndex={0}
                  role="img"
                  aria-label={`${provider.name}: ${provider.domains} domains, $${provider.value} total value`}
                >
                  <div className={styles.pvBarSpacer}>
                    <div
                      className={styles.pvBarWithTooltip}
                      style={{ '--pvBarH': `${barHeightPct}%` } as React.CSSProperties}
                    >
                      <div className={`${styles.pvBar} ${styles[`pvBar_${provider.key}`]}`}>
                        <span className={styles.pvBarLabel} aria-hidden="true">
                          {provider.name}
                        </span>
                      </div>

                      {isHovered && (
                        <div className={`${styles.pvTooltip} ${tooltipInside ? styles.pvTooltip_inside : ''}`} role="tooltip">
                          <div className={styles.pvTooltipHeader}>
                            {provider.iconSrc && (
                              <img
                                src={provider.iconSrc}
                                alt=""
                                aria-hidden="true"
                                className={styles.pvTooltipIcon}
                                width={23}
                                height={23}
                              />
                            )}
                            <span className={styles.pvTooltipName}>{provider.name}</span>
                          </div>
                          <div className={styles.pvTooltipRow}>
                            <span className={styles.pvTooltipLabel}>Total Domains</span>
                            <span className={styles.pvTooltipValue}>{provider.domains}</span>
                          </div>
                          <div className={styles.pvTooltipRow}>
                            <span className={styles.pvTooltipLabel}>Total Value</span>
                            <span className={styles.pvTooltipValue}>${provider.value}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.pvBarToken}>
                    {provider.iconSrc ? (
                      <img
                        src={provider.iconSrc}
                        alt={provider.name}
                        className={styles.pvBarTokenImg}
                        width={22}
                        height={22}
                      />
                    ) : (
                      <div
                        className={`${styles.pvBarTokenFallback} ${styles[`pvBarTokenFallback_${provider.key}`]}`}
                        aria-label={provider.name}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioBarChart
