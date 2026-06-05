import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MOCK_SCORE_HISTORY } from '../data/mockScoreBreakdown'
import styles from './ScoreBreakdown.module.scss'

const CHART_DATA = MOCK_SCORE_HISTORY.result.map((entry, i) => {
  const d = new Date(entry.calculatedAt)
  return {
    day: i + 1,
    score: entry.totalScore,
    activity: Math.round(entry.totalScore * 0.87 + 8),
    label: `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`,
  }
})

export default function ScoreHistoryChart() {
  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height={216}>
        <AreaChart data={CHART_DATA} margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
          <defs>
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#422f8a" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#422f8a" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ece9f1" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#a2a3a5', fontFamily: 'Satoshi, sans-serif' }}
            tickLine={false}
            axisLine={false}
            interval={14}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#a2a3a5', fontFamily: 'Satoshi, sans-serif' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            width={36}
          />
          <Tooltip
            contentStyle={{ background: '#fff', border: 'none', borderRadius: 6, boxShadow: '0 4px 12px rgba(50,50,71,0.12)', fontSize: 13, fontFamily: 'Satoshi, sans-serif' }}
            labelFormatter={i => `Day ${i}`}
          />
          <Area type="monotone" dataKey="activity" stroke="#fdc651" strokeWidth={2} fill="none" strokeOpacity={0.5} dot={false} />
          <Area type="monotone" dataKey="score"    stroke="#422f8a" strokeWidth={2.5} fill="url(#scoreAreaGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div className={styles.chartLegend} aria-label="Chart legend">
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotGold}`} />
          <span className={styles.legendLabel}>Activity</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotPurple}`} />
          <span className={styles.legendLabel}>Score</span>
        </div>
      </div>
    </div>
  )
}
