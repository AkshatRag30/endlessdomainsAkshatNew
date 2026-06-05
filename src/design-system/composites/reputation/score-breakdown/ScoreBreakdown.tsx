import NextImage from 'next/image'
import dynamic from 'next/dynamic'
import { BsExclamationCircle } from 'react-icons/bs'
import { TierBadge, type TierBadgeTier } from '@/design-system/composites/reputation/TierBadge'
import { MOCK_REPUTATION_SCORE } from '../data/mockScoreBreakdown'
import styles from './ScoreBreakdown.module.scss'

const ScoreHistoryChart = dynamic(() => import('./ScoreHistoryChart'), { ssr: false })

// ── Wired to mock data ─────────────────────────────────────────────────────────

const SCORE = MOCK_REPUTATION_SCORE.totalScore
const TIER  = MOCK_REPUTATION_SCORE.tier.charAt(0) + MOCK_REPUTATION_SCORE.tier.slice(1).toLowerCase()

// Tier thresholds: Bronze < 250 · Silver 250–499 · Gold 500–749 · Platinum 750+
const TIER_MAP: Record<string, { next: string; threshold: number }> = {
  Bronze:   { next: 'Silver',   threshold: 250 },
  Silver:   { next: 'Gold',     threshold: 500 },
  Gold:     { next: 'Platinum', threshold: 750 },
  Platinum: { next: 'Max',      threshold: 1000 },
}
const { next: NEXT_TIER, threshold: NEXT_TIER_THRESHOLD } = TIER_MAP[TIER] ?? TIER_MAP.Bronze
const PTS_TO_NEXT = Math.max(0, NEXT_TIER_THRESHOLD - SCORE)

const { breakdown } = MOCK_REPUTATION_SCORE
const BREAKDOWN_BARS = [
  { label: 'EVM Activity',  current: breakdown.evmActivityScore,   max: 250, color: '#5b8ef0' },
  { label: 'GM Streak',     current: breakdown.gmStreakScore,       max: 200, color: '#fa7217' },
  { label: 'Domain Count',  current: breakdown.domainCountScore,   max: 150, color: '#00d97e' },
  { label: 'Domain Tenure', current: breakdown.domainTenureScore,  max: 150, color: '#b366ff' },
  { label: 'OG Holdings',   current: breakdown.solanaScore,        max: 150, color: '#b366ff' },
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

// ── Tier badge image map ───────────────────────────────────────────────────────

const TIER_BADGE = {
  SILVER:   { src: '/reputation/silvertier.svg',   width: 176, height: 157 },
  GOLD:     { src: '/reputation/goldtier.svg',     width: 156, height: 153 },
  BRONZE:   { src: '/reputation/bronzetier.svg',   width: 135, height: 162 },
  PLATINUM: { src: '/reputation/platinumtier.svg', width: 176, height: 138 },
} as const

// ── Score medal ────────────────────────────────────────────────────────────────

const ScoreMedal = () => {
  const tierKey = TIER.toUpperCase() as keyof typeof TIER_BADGE
  const badge   = TIER_BADGE[tierKey] ?? TIER_BADGE.SILVER
  const barWidth = Math.min((SCORE / NEXT_TIER_THRESHOLD) * 100, 100)

  const tier = TIER.toLowerCase()

  return (
    <div className={styles.medalWrap} data-tier={tier}>

      <div className={styles.medalOuter}>

        {/* Tier SVG badge + score overlay */}
        <div className={styles.badgeImgWrap} data-tier={tier}>
          <NextImage
            src={badge.src}
            alt={`${TIER} tier badge`}
            width={badge.width}
            height={badge.height}
            unoptimized
          />
          <div className={styles.scoreOverlay}>
            <span className={styles.scoreNumber}>{SCORE}</span>
            <span className={styles.scoreMax}>/ 1000</span>
          </div>
        </div>

        {/* Tier label badge */}
        <TierBadge tier={TIER.toLowerCase() as TierBadgeTier} aria-label={`Current tier: ${TIER}`} />
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
        <div className={styles.scoreCard} data-tier={TIER.toLowerCase()}>
          {/* Tier polygon decorations — positioned relative to scoreCard */}
          <div className={styles.medalBg} aria-hidden="true" />
          <div className={styles.medalBgBottom} aria-hidden="true" />
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
