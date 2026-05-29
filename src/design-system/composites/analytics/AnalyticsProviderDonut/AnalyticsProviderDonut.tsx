'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import styles from '../Analytics.module.scss'
import type { ProviderStat, AnalyticsProvider } from '../data/mockAnalyticsData'

const DEFAULT_OUTER = 130
const DEFAULT_INNER = 98 // ring thickness: 52 → 32px
const DEFAULT_CHART_H = 300

const LG_OUTER = 155
const LG_INNER = 118 // ring thickness: 60 → 37px
const LG_CHART_H = 350

// Smaller variant for lg donut on mobile — ~70% of lg dimensions
const MOBILE_LG_OUTER = 108
const MOBILE_LG_INNER = 82
const MOBILE_LG_CHART_H = 240

function lightenHex(hex: string, amount = 0.6): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.round(r + (255 - r) * amount)},${Math.round(g + (255 - g) * amount)},${Math.round(b + (255 - b) * amount)})`
}

interface Props {
  stats: ProviderStat[]
  totalDomains: number
  selectedProvider: AnalyticsProvider | null
  onProviderSelect: (provider: AnalyticsProvider | null) => void
  wrapperClassName?: string
  showHint?: boolean
  size?: 'default' | 'lg'
}

const AnalyticsProviderDonut: React.FC<Props> = ({
  stats,
  totalDomains,
  selectedProvider,
  onProviderSelect,
  wrapperClassName,
  showHint = true,
  size = 'default',
}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992) // tablet-down matches @include tablet-down (≤991px)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isLg = size === 'lg'
  const outerR = isLg ? (isMobile ? MOBILE_LG_OUTER : LG_OUTER) : DEFAULT_OUTER
  const innerR = isLg ? (isMobile ? MOBILE_LG_INNER : LG_INNER) : DEFAULT_INNER
  const chartH = isLg ? (isMobile ? MOBILE_LG_CHART_H : LG_CHART_H) : DEFAULT_CHART_H

  // Unique filter ID per size variant to avoid collisions when both charts are on screen
  const filterId = `inset-white-shadow-${size}`

  // Global vertical gradient — lighter at top of chart, full color at bottom
  const gradY1 = chartH / 2 - outerR
  const gradY2 = chartH / 2 + outerR

  const pieData = stats.map(s => ({ name: s.provider, value: s.count, color: s.color }))

  const handleSegmentClick = useCallback(
    (entry: any) => {
      const clicked = entry.name as AnalyticsProvider
      onProviderSelect(selectedProvider === clicked ? null : clicked)
    },
    [selectedProvider, onProviderSelect],
  )

  return (
    <div className={wrapperClassName ?? styles.chartCol}>
      {showHint && <p className={styles.chartInstruction}>Click A Segment Or Legend Item To Filter The Domain List</p>}
      <div className={`${styles.donutWrap} ${isLg ? styles.donutWrap_lg : ''}`}>
        <ResponsiveContainer width="100%" height={chartH}>
          <PieChart>
            <defs>
              {/* Gradient fills for each segment */}
              {pieData.map(entry => {
                const id = `donut-grad-${entry.name.toLowerCase().replace(/\s+/g, '-')}`
                return (
                  <linearGradient key={id} id={id} x1="0" y1={gradY1} x2="0" y2={gradY2} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={lightenHex(entry.color, 0.62)} />
                    <stop offset="100%" stopColor={entry.color} />
                  </linearGradient>
                )
              })}

              {/*
                Inset white shadow filter — applied only to the colored segment Pie.
                Works by inverting the shape alpha, blurring + offsetting it,
                flood-filling white, then compositing the result inside the original
                shape so the glow stays strictly within each bar.
              */}
              <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 1"
                  result="inverse"
                />
                <feGaussianBlur in="inverse" stdDeviation="4.116" result="blur" />
                <feOffset dx="0" dy="3.04912" in="blur" result="offsetBlur" />
                <feFlood floodColor="#ffffff" floodOpacity="1" result="white" />
                <feComposite in="white" in2="offsetBlur" operator="in" result="shadow" />
                <feComposite in="shadow" in2="SourceAlpha" operator="in" result="clippedShadow" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="clippedShadow" />
                </feMerge>
              </filter>
            </defs>

            {/* Light grey circular background track */}
            <Pie
              data={[{ value: 1 }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={outerR + 10}
              innerRadius={innerR - 10}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              stroke="none"
              paddingAngle={0}
            >
              <Cell fill="#ececec" stroke="none" />
            </Pie>

            {/* Main donut — inset white shadow filter applied directly to the segments */}
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={outerR}
              innerRadius={innerR}
              paddingAngle={4}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              onClick={handleSegmentClick}
              cursor="pointer"
              stroke="none"
              aria-label="Provider distribution chart"
              style={{ filter: `url(#${filterId})` }}
            >
              {pieData.map((entry, index) => {
                const gradId = `donut-grad-${entry.name.toLowerCase().replace(/\s+/g, '-')}`
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradId})`}
                    fillOpacity={selectedProvider === null || selectedProvider === entry.name ? 1 : 0.25}
                    stroke="none"
                  />
                )
              })}
            </Pie>

            <Tooltip
              formatter={(value: any, name: any) => [`${value} domains`, name]}
              itemStyle={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13 }}
              labelStyle={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className={styles.donutCenter} aria-label={`${totalDomains} total domains`}>
          <span className={styles.donutNumber}>{totalDomains}</span>
          <span className={styles.donutLabel}>Total Domains</span>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsProviderDonut

