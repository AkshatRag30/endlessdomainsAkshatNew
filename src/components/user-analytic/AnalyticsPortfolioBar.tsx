'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styles from './Analytics.module.scss'
import type { DomainAnalyticsResult } from './analyticsData'

// Each key matches a domainProvider value from the API
const CHAIN_COLORS: Record<string, string> = {
  UD: '#2639ED',
  UDBASE: '#9457f6',
  ENS: '#16A163',
  BinanceSmartChain: '#fdc651',
}

const FALLBACK_COLOR = '#2639ED'

// Recharts SVG text props require literal values — CSS vars are not supported inside SVG fill attributes
const TICK_STYLE = { fontFamily: 'Satoshi, sans-serif', fontSize: 13, fill: '#6B7280' }

interface Props {
  result: DomainAnalyticsResult
}

const AnalyticsPortfolioBar: React.FC<Props> = ({ result }) => {
  const data = result.portfolioValueByChain.map(c => ({ name: c.blockchain, value: c.totalValue }))
  const isEmpty = data.every(d => d.value === 0)

  return (
    <div className={styles.portfolioCard}>
      <p className={styles.sectionTitle}>Portfolio Value by Chain</p>
      {isEmpty ? (
        <div className={styles.emptyChart} role="status">No portfolio value data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" vertical={false} />
            <XAxis dataKey="name" tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v: number) => `$${v}`} tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: any) => `$${value}`}
              labelStyle={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700, fontSize: 13 }}
              itemStyle={{ fontFamily: 'Satoshi, sans-serif', fontSize: 13 }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={64} aria-label="Portfolio value bar chart">
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={CHAIN_COLORS[entry.name] ?? FALLBACK_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default AnalyticsPortfolioBar
