'use client'
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './Analytics.module.scss'
import type { DomainAnalyticsResult } from './analyticsData'

// Matches the design token color palette from tokens.scss
const CHART_COLORS = ['#2639ED', '#16A163', '#9457f6', '#fdc651', '#00C49F', '#ef8d32', '#e25265']

interface PieEntry {
  name: string
  value: number
}

const renderInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.08) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const domainCountFormatter = (value: any) => `${value} domain${Number(value) !== 1 ? 's' : ''}`

interface PieCardProps {
  title: string
  data: PieEntry[]
}

const PieCard = ({ title, data }: PieCardProps) => (
  <div className={styles.chartCard}>
    <p className={styles.sectionTitle}>{title}</p>
    {data.length === 0 ? (
      <div className={styles.emptyChart} role="status">No data available</div>
    ) : (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={42}
            labelLine={false}
            label={renderInnerLabel}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={domainCountFormatter} />
          <Legend iconType="circle" iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>
)

interface Props {
  result: DomainAnalyticsResult
}

const AnalyticsDomainCharts: React.FC<Props> = ({ result }) => {
  const tldData: PieEntry[] = result.domainsByTLD.map(({ tld, count }) => ({
    name: `.${tld}`,
    value: count,
  }))

  const providerData: PieEntry[] = result.allDomains.reduce((acc: PieEntry[], domain) => {
    const existing = acc.find(a => a.name === domain.domainProvider)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: domain.domainProvider, value: 1 })
    }
    return acc
  }, [])

  return (
    <div className={styles.chartsRow}>
      <PieCard title="Domains by TLD" data={tldData} />
      <PieCard title="Domains by Provider" data={providerData} />
    </div>
  )
}

export default AnalyticsDomainCharts
