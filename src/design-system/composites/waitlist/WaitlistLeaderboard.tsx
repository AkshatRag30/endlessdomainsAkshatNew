import React, { useState } from 'react'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { HiOutlineUser } from 'react-icons/hi'
import PrimaryButton from '@/design-system/primitives/button'
import { FullLeaderboard } from './FullLeaderboard'
import styles from './WaitlistLeaderboard.module.scss'

interface LeaderboardEntry {
  rank: number
  walletAddress: string
  chainUsername: string
  points: number
  referrals: number
}

export interface WaitlistLeaderboardProps {
  isJoined?: boolean
  onLogout?: () => void
  isLoginPage?: boolean
}

const DEMO_DATA: LeaderboardEntry[] = [
  { rank: 1, walletAddress: '0x123asdwdasw...Abc', chainUsername: 'jay.hk.pol', points: 1450, referrals: 14 },
  { rank: 2, walletAddress: '0x123asdwdasw...Abc', chainUsername: 'jay.hk.pol', points: 1450, referrals: 14 },
  { rank: 3, walletAddress: '0x123asdwdasw...Abc', chainUsername: 'jay.hk.pol', points: 1450, referrals: 14 },
  { rank: 4, walletAddress: '0x123asdwdasw...Abc', chainUsername: 'jay.hk.pol', points: 1450, referrals: 14 },
  { rank: 5, walletAddress: '0x123asdwdasw...Abc', chainUsername: 'jay.hk.pol', points: 1450, referrals: 14 },
  { rank: 6, walletAddress: '0x123asdwdasw...Abc', chainUsername: 'jay.hk.pol', points: 1450, referrals: 14 },
  { rank: 7, walletAddress: '0x123asdwdasw...Abc', chainUsername: 'jay.hk.pol', points: 1450, referrals: 14 },
]

export function WaitlistLeaderboard({ isJoined = false, onLogout, isLoginPage = false }: WaitlistLeaderboardProps) {
  const [showFull, setShowFull] = useState(false)

  return (
    <>
    {showFull && <FullLeaderboard onClose={() => setShowFull(false)} onLogout={onLogout} />}
    <section className={styles.section} aria-labelledby="leaderboard-heading">

      {/* ── Shaped banner ── */}
      <div className={styles.banner} role="presentation">
        <h2 id="leaderboard-heading" className={styles.bannerTitle}>
          Leaderboard
        </h2>
      </div>

      <div className={styles.inner}>

        {/* ── Live status bar ── */}
        <div className={`${styles.liveBar}${!isJoined ? ` ${styles.liveBarBlur}` : ''}`}>
          <div className={styles.liveStatus}>
            <span className={styles.liveDot} aria-hidden="true" />
            <span className={styles.liveText}>Live Leaderboard · Top Nodes · Auto-Refresh 2 Min</span>
          </div>
          <button type="button" className={styles.viewFullBtn} aria-label="View full leaderboard" onClick={() => setShowFull(true)}>
            View Full Leaderboard
            <FiArrowUpRight className={styles.viewFullIcon} aria-hidden="true" />
          </button>
        </div>

        {/* ── Table ── */}
        <div className={styles.tableWrap}>
          <div className={isJoined ? undefined : styles.tableBlur} aria-hidden={!isJoined}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.th}>Rank</th>
                  <th scope="col" className={styles.th}>Node</th>
                  <th scope="col" className={styles.th}>Chain</th>
                  <th scope="col" className={styles.th}>Points</th>
                  <th scope="col" className={styles.th}>Referrals</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_DATA.map(entry => (
                  <tr key={entry.rank} className={styles.tr}>
                    <td className={styles.td}>
                      <p className={styles.rankNum}>{entry.rank}</p>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.nodePill}>{entry.walletAddress}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.chainCell}>
                        <div className={styles.chainAvatar} aria-hidden="true">
                          <HiOutlineUser />
                        </div>
                        <p className={styles.chainUsername}>{entry.chainUsername}</p>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.pointsCell}>{entry.points.toLocaleString()}</p>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.referralsCell}>{entry.referrals}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overlays — only when not joined */}
          {!isJoined && (
            <>
              <div className={styles.fadeOverlay} aria-hidden="true" />
              <div className={styles.ctaCard} role="complementary" aria-label="Join waitlist call to action">
                <h3 className={styles.ctaHeading}>
                  {isLoginPage ? 'Login now, to see the full leaderboard.' : 'Join The Waitlist To See The Full Leaderboard'}
                </h3>
                <p className={styles.ctaDescription}>
                  The OD rewards platform has 100 spots in the OS. Secure your place in the
                  top — join the waitlist now to unlock your score and full ranking.
                </p>
                <PrimaryButton type="button" icon={<FiArrowRight />} iconPosition="right">
                  {isLoginPage ? 'Login now.' : 'Join The Waitlist'}
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
    </>
  )
}

export default WaitlistLeaderboard
