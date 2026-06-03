import { useCallback, useState } from 'react'
import { FaFire } from 'react-icons/fa'
import styles from './GmStreak.module.scss'

// ── Demo data (will be replaced with real data on integration) ─────────────────

const STATS = { currentStreak: 12, longestStreak: 34, totalCheckins: 89 }

type CellColor = 'empty' | 'gray' | 'purple' | 'blue' | 'gold'

interface HeatmapCell {
  color: CellColor
  monthStart: boolean
}

// 53 weeks × 7 days — demo data matching the Figma heatmap pattern
const DEMO_WEEKS: CellColor[][] = [
  ['empty','empty','empty','gray','gray','gray','gray'],
  ['gray','gray','blue','blue','gray','gray','gray'],
  ['gray','gray','gray','gray','purple','gray','gray'],
  ['purple','purple','gray','gray','blue','gray','gray'],
  ['gray','gray','gray','purple','purple','gray','gray'],
  ['gray','purple','gray','gray','gray','gray','gray'],
  ['gray','purple','gold','gray','blue','gray','gray'],
  ['gray','gray','gold','gold','purple','gray','gray'],
  ['purple','purple','gray','purple','blue','gray','gray'],
  ['gray','purple','gray','gray','purple','gray','gray'],
  ['gray','gray','gray','purple','blue','gray','gray'],
  ['purple','gray','purple','gray','purple','gray','gray'],
  ['gray','purple','gray','blue','purple','gray','gray'],
  ['purple','gray','gray','purple','gray','gray','gray'],
  ['gray','purple','gold','gray','purple','gray','gray'],
  ['gray','purple','gray','purple','gray','gray','gray'],
  ['purple','gray','blue','gray','gray','gray','gray'],
  ['gray','gray','gray','gray','gray','gray','gray'],
  ['gray','purple','purple','gray','purple','gray','gray'],
  ['gray','gray','gray','blue','gray','gray','gray'],
  ['purple','purple','purple','purple','purple','gray','gray'],
  ['gray','gray','blue','blue','purple','gray','gray'],
  ['purple','gray','gray','gray','gray','gray','gray'],
  ['gray','purple','gray','gray','purple','gray','gray'],
  ['gray','purple','gray','gray','purple','gray','gray'],
  ['gray','gray','purple','gray','gray','gray','gray'],
  ['purple','purple','gold','blue','blue','gray','gray'],
  ['gray','gray','purple','purple','gray','gray','gray'],
  ['gray','gray','gray','gray','gray','gray','gray'],
  ['gray','purple','gray','gray','purple','gray','gray'],
  ['gray','gray','gray','gray','gray','gray','gray'],
  ['purple','gold','purple','purple','gray','gray','gray'],
  ['gray','purple','gray','gray','blue','gray','gray'],
  ['gray','blue','gray','blue','gray','gray','gray'],
  ['gray','gray','gray','blue','gray','gray','gray'],
  ['purple','gray','gray','purple','purple','gray','gray'],
  ['gray','purple','gold','gray','blue','gray','gray'],
  ['gray','gray','purple','blue','gold','gray','gray'],
  ['gray','gray','gray','gray','gray','gray','gray'],
  ['purple','gray','gray','gray','blue','gray','gray'],
  ['gray','purple','blue','gray','blue','gray','gray'],
  ['purple','purple','gray','purple','gray','gray','gray'],
  ['gray','gray','gold','gray','gray','gray','gray'],
  ['purple','purple','gold','purple','blue','gray','gray'],
  ['gray','gray','gray','gray','gray','gray','gray'],
  ['gray','purple','gray','blue','gray','gray','gray'],
  ['purple','gray','purple','gray','purple','gray','gray'],
  ['gray','gray','gray','gray','gray','gray','gray'],
  ['gray','purple','gold','purple','blue','gray','gray'],
  ['purple','gray','gray','purple','gray','gray','gray'],
  ['purple','gray','purple','blue','purple','gray','gray'],
  ['gray','gray','gray','blue','gray','gray','gray'],
  ['gray','gray','blue','purple','empty','empty','empty'],
]

// Month boundary positions (week index where a new month starts, row within that week)
const MONTH_BOUNDARIES: Set<string> = new Set([
  '4-6','9-0','13-2','18-4','22-1','27-0','31-2','36-1','40-3','44-6','49-1','52-1'
])

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
// Week index where each month label starts
const MONTH_WEEK_STARTS = [0, 4, 9, 13, 18, 22, 27, 31, 36, 40, 44, 49]

const DEMO_HISTORY = [
  { date: 'Apr 21/05/2024', chain: 'Polygon', txHash: '0x1a2b...3c4d' },
  { date: 'Mar 14/03/2024', chain: 'Polygon', txHash: '0x5e6f...7a8b' },
  { date: 'Feb 09/02/2024', chain: 'Polygon', txHash: '0x9c0d...1e2f' },
  { date: 'Jan 27/01/2024', chain: 'Polygon', txHash: '0x3a4b...5c6d' },
  { date: 'Jan 15/01/2024', chain: 'Polygon', txHash: '0x7e8f...9a0b' },
  { date: 'Dec 31/12/2023', chain: 'Polygon', txHash: '0x1c2d...3e4f' },
]

// ── Sparkline SVG ──────────────────────────────────────────────────────────────

const Sparkline = () => (
  <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden="true" className={styles.sparkline}>
    <path
      d="M0 42 C10 40 18 38 26 32 C34 26 38 22 46 18 C54 14 62 12 70 8 C76 6 82 5 88 3"
      stroke="var(--color-blue-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M0 42 C10 40 18 38 26 32 C34 26 38 22 46 18 C54 14 62 12 70 8 C76 6 82 5 88 3 L88 56 L0 56 Z"
      fill="rgba(38,57,237,0.07)"
    />
    {/* indicator dot */}
    <circle cx="59" cy="11" r="3" fill="var(--color-blue-primary)" opacity="0.6" />
    <line x1="59" y1="11" x2="59" y2="56" stroke="var(--color-blue-primary)" strokeWidth="1" opacity="0.25" strokeDasharray="2 2" />
  </svg>
)

// ── Polygon chain icon ─────────────────────────────────────────────────────────

const PolygonIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="18" fill="#7B3FE4" />
    <path d="M23.5 14.5L18 11L12.5 14.5V21.5L18 25L23.5 21.5V14.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    <path d="M18 11V25M12.5 14.5L23.5 21.5M23.5 14.5L12.5 21.5" stroke="white" strokeWidth="1.5" opacity="0.5" />
  </svg>
)

// ── Chevron ────────────────────────────────────────────────────────────────────

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── GmStreak main component ────────────────────────────────────────────────────

export default function GmStreak() {
  const [historyFilter, setHistoryFilter] = useState<'all' | '30d' | '7d'>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const toggleFilter = useCallback(() => setFilterOpen(v => !v), [])

  const filterLabel = historyFilter === 'all' ? 'All Time' : historyFilter === '30d' ? 'Last 30 Days' : 'Last 7 Days'

  return (
    <div className={styles.root}>

      {/* ── Section 1: Stat cards ────────────────────────────────────────── */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>

          {/* Current Streak */}
          <div className={`${styles.statCard} ${styles.statCardOrange}`}>
            <div className={styles.statMain}>
              <span className={styles.statValue}>{STATS.currentStreak}</span>
              <span className={styles.statLabel}>Current Streak</span>
            </div>
            <div className={styles.statDeco} aria-hidden="true">
              <FaFire className={styles.fireIcon} />
            </div>
          </div>

          {/* Longest Streak */}
          <div className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={styles.statMain}>
              <span className={styles.statValue}>{STATS.longestStreak}</span>
              <span className={styles.statLabel}>Longest Streak</span>
            </div>
            <div className={styles.statDeco} aria-hidden="true">
              <Sparkline />
            </div>
          </div>

          {/* Total Check-ins */}
          <div className={`${styles.statCard} ${styles.statCardOrange}`}>
            <div className={styles.statMain}>
              <span className={styles.statValue}>{STATS.totalCheckins}</span>
              <span className={styles.statLabel}>Total Check-ins</span>
            </div>
            <div className={styles.statDeco} aria-hidden="true">
              <Sparkline />
            </div>
          </div>

        </div>

        {/* GM Banner */}
        <div className={styles.gmBanner}>
          <p className={styles.gmBannerTitle}>Haven't GM'd today yet!</p>
          <button type="button" className={styles.gmBannerCta} aria-label="Say GM now">
            <span>Say GM Now</span>
            <ArrowRight />
          </button>
          <div className={styles.gmBannerGlow} aria-hidden="true" />
        </div>
      </div>

      {/* ── Section 2: Calendar heatmap ──────────────────────────────────── */}
      <div className={styles.heatmapSection}>
        <p className={styles.sectionTitle}>Calendar Heatmap — 12 Months</p>

        <div className={styles.heatmapOuter}>
          {/* Day labels */}
          <div className={styles.dayLabels} aria-hidden="true">
            <span className={styles.dayLabelM}>M</span>
            <span className={styles.dayLabelF}>F</span>
          </div>

          <div className={styles.heatmapInner}>
            {/* Month labels */}
            <div className={styles.monthRow} aria-hidden="true">
              {MONTHS.map((m, i) => (
                <span
                  key={m}
                  className={styles.monthLabel}
                  style={{ gridColumnStart: MONTH_WEEK_STARTS[i] + 1 } as React.CSSProperties}
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Week columns */}
            <div className={styles.weekGrid} role="grid" aria-label="GM check-in calendar">
              {DEMO_WEEKS.map((week, wi) => (
                <div key={wi} className={styles.weekCol} role="row">
                  {week.map((color, di) => {
                    const isMonthStart = MONTH_BOUNDARIES.has(`${wi}-${di}`)
                    return (
                      <div
                        key={di}
                        role="gridcell"
                        className={[
                          styles.cell,
                          styles[`cell_${color}`],
                          isMonthStart ? styles.cellMonthStart : '',
                        ].filter(Boolean).join(' ')}
                        aria-label={color === 'empty' ? 'No data' : `Activity: ${color}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap footer */}
        <div className={styles.heatmapFooter} aria-hidden="true">
          <span className={styles.footerNote}>2026 Monday first</span>
          <div className={styles.legend}>
            <span className={styles.legendText}>Less</span>
            <div className={`${styles.legendCell} ${styles.cell_empty}`} />
            <div className={`${styles.legendCell} ${styles.cell_purple}`} />
            <div className={`${styles.legendCell} ${styles.cell_blue}`} />
            <div className={`${styles.legendCell} ${styles.cell_gold}`} />
            <span className={styles.legendText}>More</span>
          </div>
        </div>
      </div>

      {/* ── Section 3: Check-in history table ───────────────────────────── */}
      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <p className={styles.sectionTitle}>Check-in History Table</p>
          <div className={styles.filterWrap}>
            <button
              type="button"
              className={styles.filterBtn}
              onClick={toggleFilter}
              aria-expanded={filterOpen}
              aria-haspopup="listbox"
            >
              <span>{filterLabel}</span>
              <ChevronDown />
            </button>
            {filterOpen && (
              <ul className={styles.filterDropdown} role="listbox">
                {(['all', '30d', '7d'] as const).map(opt => (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={historyFilter === opt}
                    className={`${styles.filterOption} ${historyFilter === opt ? styles.filterOptionActive : ''}`}
                    onClick={() => { setHistoryFilter(opt); setFilterOpen(false) }}
                  >
                    {opt === 'all' ? 'All Time' : opt === '30d' ? 'Last 30 Days' : 'Last 7 Days'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.table}>
          {/* Table header */}
          <div className={`${styles.tableRow} ${styles.tableHead}`}>
            <span className={styles.colDate}>Date</span>
            <span className={styles.colChain}>Chain</span>
            <span className={styles.colTx}>TX Hash</span>
          </div>

          {/* Table rows */}
          {DEMO_HISTORY.map((row, i) => (
            <div key={i} className={styles.tableRow}>
              <div className={styles.colDate}>
                <span className={styles.dateBadge}>{row.date}</span>
              </div>
              <div className={styles.colChain}>
                <PolygonIcon />
                <span className={styles.chainName}>{row.chain}</span>
              </div>
              <div className={styles.colTx}>
                <a href="#" className={styles.txLink} onClick={e => e.preventDefault()}>
                  {row.txHash} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
