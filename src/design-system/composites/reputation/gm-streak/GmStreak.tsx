import { useCallback, useState } from 'react'
import Image from 'next/image'
import { CURRENCY_MAP } from '@/helpers/chaincurrency/chaincurrency'
import { MOCK_GM_STREAK, MOCK_GM_HISTORY, MOCK_ALL_CHECKIN_DATES } from '../data/mockGmStreak'
import styles from './GmStreak.module.scss'

// ── Fire icon ─────────────────────────────────────────────────────────────────

const FireIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="67" viewBox="0 0 50 67" fill="none" aria-hidden="true" className={className}>
    <path d="M45.799 55.827C44.4473 58.5522 40.3279 63.5103 33.52 66.5271C42.7818 58.9295 29.3145 50.2256 35.1455 45.7499C33.6215 45.4114 31.9267 46.4852 31.5824 48.0076C31.3626 48.9799 31.6376 49.9873 31.683 50.9827C31.7469 52.3871 31.3152 53.8415 30.354 54.867C29.3928 55.8925 27.8762 56.4228 26.5199 56.0529C25.1641 55.6827 24.09 54.3409 24.1823 52.9385C24.2603 51.7542 25.0627 50.7666 25.6519 49.7365C27.0003 47.3787 27.2844 44.4383 26.4127 41.866C25.5406 39.2933 23.5271 37.1318 21.0229 36.0799C22.735 40.0059 22.2752 44.8007 19.8489 48.33C18.0898 50.8891 15.398 52.7983 14.1016 55.62C13.1235 57.7485 13.062 60.2804 13.9362 62.4535C14.4929 63.8373 15.4232 65.0632 16.5885 65.9931C12.4691 64.5911 8.37815 61.8081 5.95847 58.285C3.44396 54.6233 2.22587 50.1188 2.55823 45.7128C2.84934 41.8586 4.27855 38.1511 4.54988 34.2952C4.82162 30.4398 3.5289 26.0367 0 24.3341C2.74791 23.4455 6.06898 25.3002 6.70112 28.0753C6.9609 29.2171 6.81657 30.4068 6.91348 31.5729C7.01079 32.7386 7.43428 33.9913 8.45938 34.5851C9.84241 35.3871 11.7607 34.5344 12.4992 33.1328C13.2381 31.7312 13.0394 30.0183 12.505 28.5297C11.9706 27.0412 11.1285 25.6746 10.5801 24.1914C9.40573 21.0151 9.68118 17.3505 11.3178 14.3787C12.6971 11.8741 14.9308 9.93519 16.572 7.58767C18.1208 5.37252 19.1063 2.42133 18.035 0C20.6881 0.228855 23.3387 1.02016 25.3291 2.73842C27.538 4.64472 28.7227 7.86642 27.6271 10.5484C26.8878 12.359 25.2833 13.6649 24.0945 15.2261C22.688 17.0734 21.8443 19.4209 22.1894 21.7024C22.535 23.9844 24.2269 26.1196 26.5125 26.6412C28.7982 27.1632 31.4731 25.7315 31.9378 23.4698C32.3213 21.6064 31.2772 19.7314 31.337 17.8305C31.4278 14.9617 34.494 12.5569 37.359 13.1091C35.9154 13.213 34.8932 14.7284 34.9307 16.151C34.9682 17.5736 35.8057 18.8601 36.7801 19.9124C37.754 20.9652 38.8946 21.8723 39.7589 23.0137C41.6066 25.4532 41.979 28.8353 40.9275 31.6954C40.4079 33.1077 39.5647 34.3864 38.5029 35.4659C37.3252 36.663 38.006 38.6926 39.6871 38.8958C39.7131 38.8991 39.7391 38.9016 39.7651 38.9041C40.8426 38.9973 41.8503 38.3429 42.5802 37.5578C43.3105 36.7731 43.8618 35.837 44.6275 35.0853C45.9066 33.8297 47.7696 33.1728 49.5687 33.3431C41.9196 36.35 50.4813 46.3829 45.799 55.827Z" fill="url(#paint0_linear_fire)" />
    <defs>
      <linearGradient id="paint0_linear_fire" x1="24.7844" y1="3.68377" x2="24.7844" y2="64.706" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7B08" />
        <stop offset="1" stopColor="#CF0606" />
      </linearGradient>
    </defs>
  </svg>
)

// ── Types ──────────────────────────────────────────────────────────────────────

type CellColor = 'empty' | 'gray' | 'purple' | 'blue' | 'gold'

// ── Stats from mock ────────────────────────────────────────────────────────────

const STATS = MOCK_GM_STREAK

// ── Heatmap grid builder ───────────────────────────────────────────────────────
// Heatmap: 53 weeks × 7 days (Mon–Sun), starting 2024-06-03 (Monday).
// Reference today is fixed at 2024-06-04 — no Date.now() for determinism.
// Color reflects streak run-length ending on that day:
//   1–2 days → purple   (streak just started)
//   3–5 days → blue     (building momentum)
//   6+ days  → gold     (strong streak)

const HEATMAP_START = '2024-06-03'
const HEATMAP_TODAY = '2025-06-04'

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d + n)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

function buildHeatmapGrid(checkinDates: string[]): CellColor[][] {
  // Compute consecutive streak length ending on each checked-in date
  const sorted = [...checkinDates].sort()
  const streakDay: Record<string, number> = {}
  for (const date of sorted) {
    const prev = addDays(date, -1)
    streakDay[date] = (streakDay[prev] ?? 0) + 1
  }

  const grid: CellColor[][] = []
  for (let wi = 0; wi < 53; wi++) {
    const week: CellColor[] = []
    for (let di = 0; di < 7; di++) {
      const date = addDays(HEATMAP_START, wi * 7 + di)
      if (date > HEATMAP_TODAY) { week.push('empty'); continue }
      const n = streakDay[date]
      if (!n)          week.push('gray')
      else if (n <= 2) week.push('purple')
      else if (n <= 5) week.push('blue')
      else             week.push('gold')
    }
    grid.push(week)
  }
  return grid
}

const HEATMAP_WEEKS = buildHeatmapGrid(MOCK_ALL_CHECKIN_DATES)

// ── Mobile heatmap: 12 months × 7 weekdays ────────────────────────────────────
// Rows = months (Jun 2024 → May 2025), Cols = weekday (Mon=0 … Sun=6).
// Color = max streak color across all checkins in that month on that weekday.

const MONTH_YEAR_LABELS = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May']
const WEEKDAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function buildMonthDayGrid(checkinDates: string[]): CellColor[][] {
  const sorted = [...checkinDates].sort()
  const streakDay: Record<string, number> = {}
  for (const date of sorted) {
    const prev = addDays(date, -1)
    streakDay[date] = (streakDay[prev] ?? 0) + 1
  }
  const monthStarts = [
    '2024-06','2024-07','2024-08','2024-09','2024-10','2024-11',
    '2024-12','2025-01','2025-02','2025-03','2025-04','2025-05',
  ]
  return monthStarts.map(ym =>
    Array.from({ length: 7 }, (_, weekday) => {
      const streaks = checkinDates
        .filter(d => {
          if (!d.startsWith(ym)) return false
          const [y, mo, day] = d.split('-').map(Number)
          return ((new Date(y, mo - 1, day).getDay() + 6) % 7) === weekday
        })
        .map(d => streakDay[d] ?? 0)
      if (streaks.length === 0) return 'gray' as CellColor
      const mx = Math.max(...streaks)
      if (mx <= 2) return 'purple' as CellColor
      if (mx <= 5) return 'blue' as CellColor
      return 'gold' as CellColor
    })
  )
}

const MONTH_DAY_GRID = buildMonthDayGrid(MOCK_ALL_CHECKIN_DATES)

// ── Month label positions ──────────────────────────────────────────────────────
// Verified against HEATMAP_START = 2024-06-03 (Monday).
// Each entry: week index where the 1st of that month falls in the 53-col grid.

const MONTHS = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun']
const MONTH_WEEK_STARTS = [0, 4, 8, 12, 17, 21, 25, 30, 34, 38, 43, 47, 51]

// Month-boundary cell keys ("weekIndex-dayIndex") for the top-border indicator.
// Each key marks the first day of a new month so it gets a visual separator.
const MONTH_BOUNDARIES: Set<string> = new Set([
  '4-0','8-3','12-6','17-1','21-4','25-6','30-2','34-5','38-5','43-1','47-3','51-6',
])

// ── History table rows (from mock) ─────────────────────────────────────────────

const CHAIN_NAMES: Record<string, string> = {
  '1': 'Ethereum', '137': 'Polygon', '8453': 'Base', '42161': 'Arbitrum',
}

const DEMO_HISTORY = MOCK_GM_HISTORY.result.map(r => ({
  date: r.checkinDate,
  chainId: r.chainId,
  chain: CHAIN_NAMES[r.chainId] ?? r.chainId,
  txHash: `${r.txHash.slice(0, 6)}...${r.txHash.slice(-4)}`,
}))

// ── Sparkline SVG ──────────────────────────────────────────────────────────────

const Sparkline = () => (
  <svg width="92" height="60" viewBox="-2 -6 92 64" fill="none" aria-hidden="true" className={styles.sparkline}>
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
    {/* indicator dot at path endpoint */}
    <circle cx="88" cy="3" r="3" fill="var(--color-blue-primary)" opacity="0.6" />
    <line x1="88" y1="6" x2="88" y2="56" stroke="var(--color-blue-primary)" strokeWidth="1" opacity="0.25" strokeDasharray="2 2" />
  </svg>
)

// ── Chain icon map ─────────────────────────────────────────────────────────────
// Local SVGs for chains that have assets in public/domain/.
// Falls back to CURRENCY_MAP (cryptologos.cc) for chains without a local file.

const CHAIN_ICON_MAP: Record<string, string> = {
  '1':     '/domain/ethereum.svg',
  '137':   CURRENCY_MAP.MATIC.icon,
  '8453':  '/domain/ethereum.svg',   // Base is an ETH L2 — no dedicated local icon
  '42161': '/domain/arb.svg',
}

const ChainIcon = ({ chainId, name, className }: { chainId: string; name: string; className?: string }) => {
  const src = CHAIN_ICON_MAP[chainId] ?? '/domain/ethereum.svg'
  return (
    <Image
      src={src}
      alt={name}
      width={36}
      height={36}
      className={className ?? styles.chainIcon}
      unoptimized={src.startsWith('http')}
    />
  )
}

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
              <FireIcon className={styles.fireIcon} />
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
          <div className={`${styles.statCard} ${styles.statCardBlue}`}>
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
        <div className={styles.heatmapContent}>
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
              {HEATMAP_WEEKS.map((week, wi) => (
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
        </div> {/* heatmapContent */}

        {/* ── Alternate heatmap: mobile / tablet only ──────────────────── */}
        <div className={styles.heatmapContentAlt} role="region" aria-label="Calendar heatmap — 12 months">
          <p className={styles.altSectionTitle}>Calendar Heatmap — 12 Months</p>

          <div className={styles.altHeatmapWrap}>
            {/* Day-of-week header row */}
            <div className={styles.altHeaderRow} aria-hidden="true">
              <div className={styles.altLabelPlaceholder} />
              <div className={styles.altCellRow}>
                {WEEKDAY_LABELS.map(day => (
                  <span key={day} className={styles.altDayLabel}>{day}</span>
                ))}
              </div>
            </div>

            {/* 12 month rows */}
            {MONTH_DAY_GRID.map((row, mi) => (
              <div key={mi} className={styles.altMonthRow}>
                <span className={styles.altMonthLabel}>{MONTH_YEAR_LABELS[mi]}</span>
                <div className={styles.altCellRow}>
                  {row.map((color, di) => (
                    <div
                      key={di}
                      className={`${styles.altBlock} ${styles[`cell_${color}`]}`}
                      aria-label={`${MONTH_YEAR_LABELS[mi]} ${WEEKDAY_LABELS[di]}: ${color}`}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className={styles.altFooter}>
              <span className={styles.footerNote}>2026 Monday first</span>
              <div className={styles.altLegend} aria-label="Activity level legend">
                <span className={styles.legendText}>Less</span>
                <div className={`${styles.altLegendCell} ${styles.altLegendEmpty}`} aria-hidden="true" />
                <div className={`${styles.altLegendCell} ${styles.altLegendL1}`} aria-hidden="true" />
                <div className={`${styles.altLegendCell} ${styles.altLegendL2}`} aria-hidden="true" />
                <div className={`${styles.altLegendCell} ${styles.altLegendL3}`} aria-hidden="true" />
                <span className={styles.legendText}>More</span>
              </div>
            </div>
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
                <ChainIcon chainId={row.chainId} name={row.chain} />
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

        {/* ── Mobile card view (shown on mobile only) ──────────────────── */}
        <div className={styles.historyCardList}>
          {DEMO_HISTORY.map((row, i) => (
            <div key={i} className={styles.historyCard}>
              {/* Top row: Date + Chain */}
              <div className={styles.historyCardTop}>
                <div className={styles.historyCardField}>
                  <span className={styles.historyCardLabel}>Date</span>
                  <span className={styles.dateBadge}>{row.date}</span>
                </div>
                <div className={styles.historyCardField}>
                  <span className={styles.historyCardLabel}>Chain</span>
                  <div className={styles.historyCardChainInfo}>
                    <ChainIcon chainId={row.chainId} name={row.chain} className={styles.chainIconSm} />
                    <span className={styles.historyCardChainName}>{row.chain}</span>
                  </div>
                </div>
              </div>
              {/* Divider */}
              <div className={styles.historyCardDivider} aria-hidden="true" />
              {/* Bottom row: TX Hash */}
              <div className={styles.historyCardBottom}>
                <span className={styles.historyCardLabel}>TX Hash</span>
                <a
                  href="#"
                  className={`${styles.txLink} ${styles.txLinkCard}`}
                  onClick={e => e.preventDefault()}
                >
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
