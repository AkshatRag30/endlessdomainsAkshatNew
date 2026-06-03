import { BsExclamationCircle } from 'react-icons/bs'
import styles from './ScoreBreakdown.module.scss'

// ── Demo data (will be replaced on integration) ────────────────────────────────

const SCORE = 312
const MAX_SCORE = 1000
const TIER = 'Silver'
const NEXT_TIER = 'Gold'
const PTS_TO_NEXT = 188
const NEXT_TIER_THRESHOLD = 500

const BREAKDOWN_BARS = [
  { label: 'EVM Activity',   current: 120, max: 250, color: '#5b8ef0' },
  { label: 'GM Streak',      current: 80,  max: 200, color: '#fa7217' },
  { label: 'Domain Count',   current: 75,  max: 150, color: '#00d97e' },
  { label: 'Domain Tenure',  current: 37,  max: 150, color: '#b366ff' },
  { label: 'OG Holdings',    current: 37,  max: 150, color: '#b366ff' },
]

// 30-day score history (two series: score trend + activity)
const HISTORY_DAYS = 30
const HISTORY_SCORE: number[] = [
  148,162,175,168,178,185,190,184,196,208,
  212,215,230,242,238,241,250,255,248,252,
  260,258,254,248,245,250,257,262,260,268,
]
const HISTORY_ACTIVITY: number[] = [
  140,152,158,162,170,175,182,180,188,195,
  200,205,218,228,224,227,234,240,233,236,
  244,242,238,232,229,235,241,248,244,252,
]

const BOOST_ACTIONS = [
  {
    title: 'Say GM Daily',
    subtitle: '+2–5 pts/day',
    progress: 0.6,
    status: 'Daily streak: 3',
    statusColor: 'blue' as const,
    cta: 'Say GM Now',
    ctaStyle: 'blue' as const,
  },
  {
    title: 'Connect More Wallets',
    subtitle: '+20 pts each',
    progress: 0.2,
    status: '1 / 5 done',
    statusColor: 'blue' as const,
    cta: 'Connect',
    ctaStyle: 'blue' as const,
  },
  {
    title: 'Hold Your Domains',
    subtitle: 'Tenure growing',
    progress: 0.6,
    status: '✓ Active',
    statusColor: 'green' as const,
    cta: 'AUTO',
    ctaStyle: 'green' as const,
  },
  {
    title: 'Get .og Domains',
    subtitle: '+15 pts each',
    progress: 0,
    status: 'Not started',
    statusColor: 'blue' as const,
    cta: 'Browse',
    ctaStyle: 'dark' as const,
  },
]

// ── Score medal (SVG hexagon) ──────────────────────────────────────────────────

const ScoreMedal = () => {
  const tierProgress = (SCORE / NEXT_TIER_THRESHOLD) * 100
  const barWidth = Math.min(tierProgress, 100)

  return (
    <div className={styles.medalWrap}>
      {/* Hexagonal medal */}
      <div className={styles.medalOuter}>
        <div className={styles.medalInner}>
          {/* Wings */}
          <div className={styles.wingLeft} aria-hidden="true">
            <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
              <path d="M38 40 C30 20 10 15 2 8 C8 25 12 35 15 40 C12 45 8 55 2 72 C10 65 30 60 38 40Z"
                fill="url(#wingGradL)" opacity="0.7" />
              <defs>
                <linearGradient id="wingGradL" x1="0" y1="0" x2="40" y2="0">
                  <stop offset="0%" stopColor="#c0c8d4" />
                  <stop offset="100%" stopColor="#e8ecf0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className={styles.hexagonWrap}>
            <svg width="130" height="150" viewBox="0 0 130 150" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="hexGrad" x1="0" y1="0" x2="130" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#d4d9e0" />
                  <stop offset="25%"  stopColor="#f0f3f6" />
                  <stop offset="50%"  stopColor="#ffffff" />
                  <stop offset="75%"  stopColor="#d0d6de" />
                  <stop offset="100%" stopColor="#b8c0cc" />
                </linearGradient>
                <linearGradient id="hexInner" x1="0" y1="0" x2="130" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#c8ced8" />
                  <stop offset="50%"  stopColor="#e8ecf2" />
                  <stop offset="100%" stopColor="#b0b8c4" />
                </linearGradient>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#7a96ac" />
                  <stop offset="30%"  stopColor="#eaeff3" />
                  <stop offset="50%"  stopColor="#ffffff" />
                  <stop offset="70%"  stopColor="#d4dee5" />
                  <stop offset="100%" stopColor="#abbcc8" />
                </linearGradient>
                <filter id="medalGlow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(180,190,210,0.5)" />
                </filter>
              </defs>
              {/* Outer hexagon */}
              <polygon
                points="65,8 118,38 118,112 65,142 12,112 12,38"
                fill="url(#hexGrad)"
                filter="url(#medalGlow)"
              />
              {/* Inner hexagon */}
              <polygon
                points="65,18 108,43 108,107 65,132 22,107 22,43"
                fill="url(#hexInner)"
              />
              {/* Score value */}
              <text
                x="65" y="82"
                textAnchor="middle"
                fontFamily="Satoshi, sans-serif"
                fontWeight="700"
                fontSize="32"
                fill="url(#scoreGrad)"
              >
                {SCORE}
              </text>
              {/* /1000 */}
              <text
                x="65" y="98"
                textAnchor="middle"
                fontFamily="Satoshi, sans-serif"
                fontWeight="400"
                fontSize="10"
                fill="rgba(255,255,255,0.85)"
              >
                / 1000
              </text>
            </svg>
          </div>

          <div className={styles.wingRight} aria-hidden="true">
            <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
              <path d="M2 40 C10 20 30 15 38 8 C32 25 28 35 25 40 C28 45 32 55 38 72 C30 65 10 60 2 40Z"
                fill="url(#wingGradR)" opacity="0.7" />
              <defs>
                <linearGradient id="wingGradR" x1="40" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#c0c8d4" />
                  <stop offset="100%" stopColor="#e8ecf0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Tier badge */}
        <div className={styles.tierBadge} aria-label={`Current tier: ${TIER}`}>
          <span className={styles.tierText}>{TIER}</span>
        </div>
      </div>

      {/* Progress to next tier */}
      <div className={styles.tierProgress}>
        <div className={styles.tierProgressTrack}>
          <div
            className={styles.tierProgressFill}
            style={{ width: `${barWidth}%` } as React.CSSProperties}
          />
        </div>
        <p className={styles.tierProgressLabel}>{PTS_TO_NEXT} pts to {NEXT_TIER}</p>
      </div>
    </div>
  )
}

// ── Score history SVG chart ────────────────────────────────────────────────────

const CHART_W = 1314
const CHART_H = 216
const Y_MIN = 130
const Y_MAX = 275

function toChartY(val: number): number {
  return CHART_H - ((val - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H
}

function toChartX(i: number): number {
  return (i / (HISTORY_DAYS - 1)) * CHART_W
}

function buildSmoothPath(data: number[]): string {
  const pts = data.map((v, i) => ({ x: toChartX(i), y: toChartY(v) }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const cur = pts[i]
    const cx = (prev.x + cur.x) / 2
    d += ` C ${cx} ${prev.y} ${cx} ${cur.y} ${cur.x} ${cur.y}`
  }
  return d
}

function buildAreaPath(data: number[]): string {
  const line = buildSmoothPath(data)
  return `${line} L ${toChartX(data.length - 1)} ${CHART_H} L 0 ${CHART_H} Z`
}

const ScoreHistoryChart = () => {
  const scorePath    = buildSmoothPath(HISTORY_SCORE)
  const scoreArea    = buildAreaPath(HISTORY_SCORE)
  const activityPath = buildSmoothPath(HISTORY_ACTIVITY)

  const Y_LABELS = [260, 220, 180, 140]
  const X_LABELS = [{ val: 1, i: 0 }, { val: 5, i: 4 }, { val: 10, i: 9 },
    { val: 15, i: 14 }, { val: 20, i: 19 }, { val: 25, i: 24 }, { val: 30, i: 29 }]

  return (
    <div className={styles.chartWrap}>
      <svg
        viewBox={`0 0 ${CHART_W + 120} ${CHART_H + 60}`}
        preserveAspectRatio="none"
        className={styles.chartSvg}
        aria-label="Score history chart"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#422f8a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#422f8a" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines + labels */}
        {Y_LABELS.map((label, li) => {
          const y = toChartY(label)
          return (
            <g key={label} transform="translate(80, 0)">
              <line x1="0" y1={y} x2={CHART_W} y2={y} stroke="#ece9f1" strokeWidth="1" />
              <text x="-10" y={y + 5} textAnchor="end" fontSize="14" fill="#a2a3a5" fontFamily="Lato, sans-serif">
                {label}
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {X_LABELS.map(({ val, i }) => (
          <text
            key={val}
            x={80 + toChartX(i)}
            y={CHART_H + 30}
            textAnchor="middle"
            fontSize="14"
            fill="#a2a3a5"
            fontFamily="Lato, sans-serif"
          >
            {val}
          </text>
        ))}

        {/* Chart area */}
        <g transform="translate(80, 0)">
          {/* Area fill */}
          <path d={scoreArea} fill="url(#areaGrad)" />
          {/* Activity line (gold) */}
          <path d={activityPath} fill="none" stroke="#fdc651" strokeWidth="2" opacity="0.5" />
          {/* Main score line (purple) */}
          <path d={scorePath} fill="none" stroke="#422f8a" strokeWidth="2.5" />

          {/* Tooltip indicator at day ~13 */}
          <line
            x1={toChartX(12)} y1={0}
            x2={toChartX(12)} y2={CHART_H}
            stroke="#422f8a" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
          />
          <circle cx={toChartX(12)} cy={toChartY(HISTORY_SCORE[12])} r="6"
            fill="#422f8a" stroke="white" strokeWidth="3"
          />

          {/* Tooltip */}
          <g transform={`translate(${toChartX(12) - 60}, ${toChartY(HISTORY_SCORE[12]) - 75})`}>
            <rect x="0" y="0" width="140" height="64" rx="6" fill="white"
              filter="drop-shadow(0 4px 8px rgba(50,50,71,0.12))"
            />
            <text x="12" y="18" fontSize="11" fill="rgba(60,60,67,0.6)" fontFamily="Lato, sans-serif">This Month</text>
            <text x="12" y="42" fontSize="20" fill="#11263c" fontWeight="700" fontFamily="Lato, sans-serif">
              {HISTORY_SCORE[12] * 1000000}
            </text>
            <text x="12" y="58" fontSize="11" fill="rgba(60,60,67,0.6)" fontFamily="Lato, sans-serif">May</text>
          </g>
        </g>
      </svg>

      {/* Legend */}
      <div className={styles.chartLegend} aria-label="Chart legend">
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotGold}`} />
          <span className={styles.legendLabel}>Impressions</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotPurple}`} />
          <span className={styles.legendLabel}>Click</span>
        </div>
      </div>
    </div>
  )
}

// ── Arrow right icon ───────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── ScoreBreakdown main component ─────────────────────────────────────────────

export default function ScoreBreakdown() {
  return (
    <div className={styles.root}>

      {/* ── Section 1: Score card + Breakdown bars ───────────────────────── */}
      <div className={styles.topSection}>

        {/* Left: Score medal card */}
        <div className={styles.scoreCard}>
          <ScoreMedal />
        </div>

        {/* Right: Breakdown bars */}
        <div className={styles.breakdownCard}>
          <p className={styles.breakdownTitle}>Score Breakdown</p>

          <div className={styles.barsContainer}>
            {BREAKDOWN_BARS.map((bar, i) => (
              <div key={i} className={styles.barRow}>
                <span className={styles.barLabel}>{bar.label}</span>
                <div className={styles.barTrackWrap}>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${(bar.current / bar.max) * 100}%`,
                        background: bar.color,
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
                <span className={styles.barValue} style={{ color: bar.color } as React.CSSProperties}>
                  {bar.current}/{bar.max}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.breakdownFooter}>
            <BsExclamationCircle className={styles.footerIcon} aria-hidden="true" />
            <span className={styles.footerText}>Score from 3 wallets · Last updated 2h ago</span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Score history chart ───────────────────────────────── */}
      <div className={styles.historySection}>
        <p className={styles.sectionTitle}>Score History</p>
        <div className={styles.historyCard}>
          <ScoreHistoryChart />
        </div>
      </div>

      {/* ── Section 3: Boost Your Score ──────────────────────────────────── */}
      <div className={styles.boostSection}>
        <div className={styles.boostHeader}>
          <p className={styles.boostTitle}>Boost Your Score</p>
          <p className={styles.boostSubtitle}>Complete actions to earn points and climb the leaderboard</p>
        </div>

        <div className={styles.boostGrid}>
          {BOOST_ACTIONS.map((action, i) => (
            <div key={i} className={styles.boostCard}>
              {/* Blue border glow */}
              <div className={styles.boostCardBorder} aria-hidden="true" />

              <div className={styles.boostCardLeft}>
                <div className={styles.boostCardText}>
                  <p className={styles.boostCardTitle}>{action.title}</p>
                  <p className={styles.boostCardSubtitle}>{action.subtitle}</p>
                </div>
                <div className={styles.boostCardProgress}>
                  <div className={styles.miniBarTrack}>
                    <div
                      className={styles.miniBarFill}
                      style={{ width: `${action.progress * 100}%` } as React.CSSProperties}
                    />
                  </div>
                  <span className={[
                    styles.boostStatus,
                    action.statusColor === 'green' ? styles.boostStatusGreen : '',
                  ].filter(Boolean).join(' ')}>
                    {action.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={[
                  styles.boostBtn,
                  styles[`boostBtn_${action.ctaStyle}`],
                ].join(' ')}
                aria-label={action.cta}
              >
                <span>{action.cta}</span>
                <ArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
