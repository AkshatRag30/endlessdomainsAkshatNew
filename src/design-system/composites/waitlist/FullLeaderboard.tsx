import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { FiArrowUpRight, FiX } from 'react-icons/fi'
import { HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi'
import PrimaryButton from '@/design-system/primitives/button'
import styles from './FullLeaderboard.module.scss'

interface LeaderboardEntry {
  rank: number
  walletAddress: string
  chainUsername: string
  points: number
  referrals: number
}

export interface FullLeaderboardProps {
  onClose: () => void
  onLogout?: () => void
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

const TOTAL_PAGES = 10

export function FullLeaderboard({ onClose, onLogout }: FullLeaderboardProps) {
  const [alertVisible, setAlertVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const dismissAlert = useCallback(() => setAlertVisible(false), [])
  const goToPrev = useCallback(() => setCurrentPage(p => Math.max(1, p - 1)), [])
  const goToNext = useCallback(() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1)), [])

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="fl-heading">

      {/* ── Nav ── */}
      <nav className={styles.nav} aria-label="Leaderboard navigation">
        <div className={styles.navInner}>
          <Image
            src="/user-profile/endlessnewlogo.svg"
            alt="Endless Domains"
            width={159}
            height={53}
            className={styles.navLogo}
          />
          <PrimaryButton size="sm" type="button" onClick={onLogout}>
            Logout
          </PrimaryButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.liveTag}>
            <span className={styles.liveTagText}>Live Rankings</span>
          </div>
          <div className={styles.headingWrap}>
            <Image
              src="/waitlist/osleaderboardbg.svg"
              alt=""
              width={1508}
              height={171}
              aria-hidden="true"
              className={styles.headingBg}
            />
            <h1 id="fl-heading" className={styles.heroHeading}>OS Leaderboard</h1>
          </div>
          <p className={styles.heroSubtitle}>
            Top nodes ranked by points. Rank freezes at the OS Reveal. Top 500 get early access.
          </p>
        </div>
      </section>

      {/* ── Alert ── */}
      {alertVisible && (
        <div className={styles.alertWrap}>
          <div className={styles.alert} role="alert">
            <div className={styles.alertContent}>
              <HiOutlineLockClosed className={styles.alertIcon} aria-hidden="true" />
              <p className={styles.alertText}>
                The Leaderboard Is Frozen. Ranks Are Final. The OS Reveal Is Imminent. Top 500 Nodes Will Receive Early Access.
              </p>
            </div>
            <button
              type="button"
              className={styles.alertClose}
              onClick={dismissAlert}
              aria-label="Dismiss alert"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ── Table section ── */}
      <section className={styles.tableSection} aria-label="Full leaderboard table">
        <div className={styles.tableSectionInner}>

          {/* Live status bar */}
          <div className={styles.liveBar}>
            <div className={styles.liveStatus}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span className={styles.liveText}>Live Leaderboard · Top Originals · Auto-Refresh 2 Min</span>
            </div>
            <button type="button" className={styles.enterOsBtn} aria-label="Enter the OS" onClick={onClose}>
              Enter The OS
              <FiArrowUpRight className={styles.enterOsIcon} aria-hidden="true" />
            </button>
          </div>

          {/* Table */}
          <div className={styles.tableWrap}>
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

          {/* Pagination */}
          <nav className={styles.pagination} aria-label="Leaderboard pages">
            <div className={styles.paginationGroup}>
              <button
                type="button"
                className={styles.pageNavBtn}
                onClick={goToPrev}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <span className={styles.pageNavChevron} aria-hidden="true">«</span>
                Previous
              </button>
              <div className={styles.pageDivider} aria-hidden="true" />
              {[1, 2, 3].map(page => (
                <React.Fragment key={page}>
                  <button
                    type="button"
                    className={`${styles.pageNum} ${currentPage === page ? styles.pageNumActive : ''}`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                  <div className={styles.pageDivider} aria-hidden="true" />
                </React.Fragment>
              ))}
              <span className={styles.pageDots} aria-hidden="true">•••</span>
              <div className={styles.pageDivider} aria-hidden="true" />
              <button
                type="button"
                className={`${styles.pageNum} ${currentPage === TOTAL_PAGES ? styles.pageNumActive : ''}`}
                onClick={() => setCurrentPage(TOTAL_PAGES)}
                aria-current={currentPage === TOTAL_PAGES ? 'page' : undefined}
              >
                {TOTAL_PAGES}
              </button>
              <div className={styles.pageDivider} aria-hidden="true" />
              <button
                type="button"
                className={styles.pageNavBtn}
                onClick={goToNext}
                disabled={currentPage === TOTAL_PAGES}
                aria-label="Next page"
              >
                Next
                <span className={styles.pageNavChevron} aria-hidden="true">»</span>
              </button>
            </div>
          </nav>

        </div>
      </section>

    </div>
  )
}

export default FullLeaderboard
