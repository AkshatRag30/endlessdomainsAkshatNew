import React, { useId } from 'react'
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts'
import { ChartPoint } from '@/types/marketplace'
import styles from './Sparkline.module.scss'

export interface SparklineProps {
  data: ChartPoint[]
  color?: string
  height?: number
  className?: string
  /** Figma node 1:1645 — Volume/New listings use a filled line, Sales uses bars. */
  variant?: 'area' | 'bar'
}

/**
 * Chrome-free area/bar chart, no axes/tooltip, modeled on the main site's
 * PVSparkline. Rendered client-side only — see index.ts, which dynamic-
 * imports this with ssr:false because recharts measures the DOM.
 */
export const Sparkline = ({ data, color = 'var(--color-blue-primary)', height = 40, className = '', variant = 'area' }: SparklineProps) => {
  const gradientId = `sparkline-${useId().replace(/:/g, '')}`
  const shellClass = [styles.wrap, className].filter(Boolean).join(' ')

  return (
    <div className={shellClass} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {variant === 'bar' ? (
          <BarChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
            <Bar dataKey="value" fill={color} fillOpacity={0.35} radius={[1, 1, 0, 0]} isAnimationActive={false} />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default Sparkline
