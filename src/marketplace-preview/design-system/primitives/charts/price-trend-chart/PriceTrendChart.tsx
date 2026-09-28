import React, { useId, useMemo } from 'react'
import { Area, ComposedChart, Line, ResponsiveContainer, Scatter, XAxis, YAxis } from 'recharts'
import type { PricePoint, TradePoint } from '@/marketplace-preview/types/marketplace'
import { formatShortDate } from '@/marketplace-preview/helpers/token-format/tokenFormat'
import styles from './PriceTrendChart.module.scss'

export interface PriceTrendChartProps {
  points: PricePoint[]
  trades: TradePoint[]
  className?: string
}

// Figma 5:5143 / 5:5144: the line and area run lilac → blue → sky, left to right.
const GRADIENT_STOPS = [
  { offset: 0, color: [0xdb, 0xb7, 0xff] },
  { offset: 0.505, color: [0x00, 0x47, 0xff] },
  { offset: 1, color: [0x52, 0xd5, 0xff] },
] as const

const Y_TICKS = 5
const X_TICKS = 7

/** The gradient's colour at `t` (0 → 1), so each trade dot matches the line above it. */
const colorAt = (t: number): string => {
  const upper = GRADIENT_STOPS.findIndex((stop) => stop.offset >= t)
  if (upper <= 0) return `rgb(${GRADIENT_STOPS[0].color.join(',')})`
  const a = GRADIENT_STOPS[upper - 1]
  const b = GRADIENT_STOPS[upper]
  const mix = (t - a.offset) / (b.offset - a.offset)
  return `rgb(${a.color.map((channel, i) => Math.round(channel + (b.color[i] - channel) * mix)).join(',')})`
}

/** Five evenly spaced, round-numbered ticks covering every price shown. */
const niceTicks = (min: number, max: number): number[] => {
  const rawStep = Math.max((max - min) / (Y_TICKS - 1), 1)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((candidate) => Math.floor(min / candidate) * candidate + candidate * (Y_TICKS - 1) >= max) ?? rawStep
  const low = Math.floor(min / step) * step
  return Array.from({ length: Y_TICKS }, (_, i) => low + step * i)
}

/** "12.5k" / "8k" / "950" — USDT, compact to fit the 21px label column. */
const formatAxisPrice = (value: number): string => (value >= 1000 ? `${Number((value / 1000).toFixed(1))}k` : String(Math.round(value)))

interface DotProps {
  cx?: number
  cy?: number
  payload?: { color: string; opacity: number }
}

const TradeDot = ({ cx, cy, payload }: DotProps) =>
  cx === undefined || cy === undefined || !payload ? null : <circle cx={cx} cy={cy} r={1.5} fill={payload.color} fillOpacity={payload.opacity} />

/**
 * Figma node 5:4718 (desktop) / 5:5549 (mobile). Built the way Figma layers
 * it: an HTML label column and date row around a plot box with a CSS square
 * grid, a strip of volume columns along its bottom, and a recharts layer
 * with the smoothed average line, a fading area under it and the individual
 * trades as dots. Rendered client side only (see index.ts).
 *
 * Figma quirk (plan §2.7 Q6, open question O1): the frame titles this
 * "30 days" but labels the axis 1AM…7AM and prices in Ξ, while every price on
 * the page is USDT. Per the plan's recommendation this uses day ticks and
 * USDT values; revisit once design answers O1.
 */
export const PriceTrendChart = ({ points, trades, className = '' }: PriceTrendChartProps) => {
  const id = useId().replace(/:/g, '')

  const chart = useMemo(() => {
    const series = points.map((point) => ({ t: new Date(point.date).getTime(), avg: point.avgPriceUsd }))
    const start = series[0]?.t ?? 0
    const end = series[series.length - 1]?.t ?? 1
    const span = Math.max(end - start, 1)
    const dots = trades
      .map((trade, index) => ({ t: new Date(trade.date).getTime(), price: trade.priceUsd, index }))
      .filter((trade) => trade.t >= start && trade.t <= end)
      // Deterministic per trade, so dots don't flicker between renders.
      .map((trade) => ({ ...trade, color: colorAt((trade.t - start) / span), opacity: 0.55 + ((trade.index * 37) % 45) / 100 }))
    const prices = [...series.map((s) => s.avg), ...dots.map((d) => d.price)]
    const ticks = niceTicks(Math.min(...prices), Math.max(...prices))
    const maxVolume = Math.max(...points.map((point) => point.volumeUsd), 1)
    const dates = Array.from({ length: X_TICKS }, (_, i) => formatShortDate(start + (span * i) / (X_TICKS - 1)))
    return { series, dots, ticks, start, end, maxVolume, dates }
  }, [points, trades])

  return (
    <div className={[styles.chart, className].filter(Boolean).join(' ')} role="img" aria-label={`Average price over the last 30 days, ${chart.dates[0]} to ${chart.dates[X_TICKS - 1]}`}>
      <div className={styles.yAxis} aria-hidden="true">
        {[...chart.ticks].reverse().map((tick) => (
          <span key={tick}>{formatAxisPrice(tick)}</span>
        ))}
      </div>

      <div className={styles.plot}>
        <div className={styles.volume} aria-hidden="true">
          {points.map((point) => (
            // Runtime share of the busiest bucket — the one inline style
            // design-system CLAUDE.md §4.5 allows.
            <span key={point.date} style={{ height: `${(point.volumeUsd / chart.maxVolume) * 100}%` }} />
          ))}
        </div>

        <div className={styles.lines}>
          <ResponsiveContainer width="100%" height="100%">
            {/* Zero margin so the price domain maps exactly onto the plot box and its HTML labels. */}
            <ComposedChart data={chart.series} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
                  {GRADIENT_STOPS.map((stop) => (
                    <stop key={stop.offset} offset={stop.offset} stopColor={`rgb(${stop.color.join(',')})`} />
                  ))}
                </linearGradient>
                <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
                  <stop offset="1" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
                <mask id={`${id}-mask`} maskContentUnits="objectBoundingBox">
                  <rect width="1" height="1" fill={`url(#${id}-fade)`} />
                </mask>
              </defs>
              <XAxis dataKey="t" type="number" domain={[chart.start, chart.end]} hide />
              <YAxis type="number" domain={[chart.ticks[0], chart.ticks[Y_TICKS - 1]]} hide />
              <Area
                type="monotone"
                dataKey="avg"
                stroke="none"
                fill={`url(#${id}-stroke)`}
                fillOpacity={0.35}
                mask={`url(#${id}-mask)`}
                isAnimationActive={false}
              />
              <Scatter data={chart.dots} dataKey="price" shape={<TradeDot />} isAnimationActive={false} />
              <Line type="monotone" dataKey="avg" stroke={`url(#${id}-stroke)`} strokeWidth={3.5} dot={false} activeDot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.xAxis} aria-hidden="true">
        {chart.dates.map((date, index) => (
          <span key={`${date}-${index}`}>{date}</span>
        ))}
      </div>
    </div>
  )
}

export default PriceTrendChart
