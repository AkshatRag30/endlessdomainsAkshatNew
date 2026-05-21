import React from 'react'
import { FiArrowRight, FiAward } from 'react-icons/fi'
import { HiOutlineUser } from 'react-icons/hi'
import PrimaryButton from '@/design-system/primitives/button'
import styles from './WaitlistLeaderboard.module.scss'

interface LeaderboardEntry {
  rank: number
  username: string
  actionsTaken: number
  domainsOwned: number
  chainActivity: number
  score: number
}

export interface WaitlistLeaderboardProps {
  isJoined?: boolean
}

const DEMO_DATA: LeaderboardEntry[] = [
  { rank: 1, username: '0xCrypt0...a3F2', actionsTaken: 1842, domainsOwned: 47, chainActivity: 23, score: 98420 },
  { rank: 2, username: 'blockninja.eth', actionsTaken: 1721, domainsOwned: 38, chainActivity: 21, score: 91340 },
  { rank: 3, username: 'web3ghost.sol', actionsTaken: 1650, domainsOwned: 31, chainActivity: 18, score: 87120 },
  { rank: 4, username: 'defimaster.arb', actionsTaken: 1590, domainsOwned: 29, chainActivity: 17, score: 83450 },
  { rank: 5, username: 'chainwalker.bnb', actionsTaken: 1480, domainsOwned: 25, chainActivity: 15, score: 79800 },
  { rank: 6, username: '0xNFTcol...d7B1', actionsTaken: 1420, domainsOwned: 22, chainActivity: 14, score: 75600 },
  { rank: 7, username: 'metaverse99.eth', actionsTaken: 1380, domainsOwned: 20, chainActivity: 13, score: 71200 },
  { rank: 8, username: 'cryptopunk.sol', actionsTaken: 1320, domainsOwned: 18, chainActivity: 12, score: 67800 },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <FiAward className={styles.rankGold} aria-label="Rank 1" />
  return <p className={styles.rankNum}>{rank}</p>
}

export function WaitlistLeaderboard({ isJoined = false }: WaitlistLeaderboardProps) {
  return (
    <section className={styles.section} aria-labelledby="leaderboard-heading">

      {/* ── Shaped banner ── */}
      <div className={styles.banner} role="presentation">
        <h2 id="leaderboard-heading" className={styles.bannerTitle}>
          Leaderboard
        </h2>
      </div>

      <div className={styles.inner}>
        <div className={styles.tableWrap}>
          {/* Table — blurred until user joins */}
          <div className={isJoined ? undefined : styles.tableBlur} aria-hidden={!isJoined}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.th}>Rank</th>
                  <th scope="col" className={styles.th}>User</th>
                  <th scope="col" className={styles.th}>Actions Taken</th>
                  <th scope="col" className={styles.th}>Domains Owned</th>
                  <th scope="col" className={styles.th}>Chain Activity</th>
                  <th scope="col" className={styles.th}>Score</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_DATA.map(entry => (
                  <tr key={entry.rank} className={styles.tr}>
                    <td className={styles.td}>
                      <RankBadge rank={entry.rank} />
                    </td>
                    <td className={styles.td}>
                      <div className={styles.userCell}>
                        <div className={styles.avatar} aria-hidden="true">
                          <HiOutlineUser />
                        </div>
                        <p className={styles.username}>{entry.username}</p>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.statCell}>{entry.actionsTaken.toLocaleString()}</p>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.statCell}>{entry.domainsOwned}</p>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.statCell}>{entry.chainActivity}</p>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.scoreCell}>{entry.score.toLocaleString()}</p>
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
                  Join The Waitlist To See The Full Leaderboard
                </h3>
                <p className={styles.ctaDescription}>
                  The OD rewards platform has 100 spots in the OS. Secure your place in the
                  top — join the waitlist now to unlock your score and full ranking.
                </p>
                <PrimaryButton type="button" icon={<FiArrowRight />} iconPosition="right">
                  Join The Waitlist
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default WaitlistLeaderboard
