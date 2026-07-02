import { IoColorPaletteOutline } from 'react-icons/io5'
import { GM_LIVE_EVENTS, GM_STATS } from '../gm.data'
import styles from './GmSidebar.module.scss'

const STATS = [
  { value: GM_STATS.totalGms,  label: 'TOTAL GMs'  },
  { value: GM_STATS.wallets,   label: 'WALLETS'     },
  { value: GM_STATS.chains,    label: 'CHAINS'      },
  { value: GM_STATS.gmsToday,  label: 'GMs TODAY'   },
]

export function GmSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="GM live activity and stats">

      {/* ── Live Activity ── */}
      <div className={styles.liveCard}>
        <div className={styles.liveHeader}>
          <span className={styles.liveDot} aria-hidden="true" />
          <h2 className={styles.liveTitle}>Live Activity</h2>
        </div>

        <ul className={styles.liveList} aria-label="Recent on-chain GM activity">
          {GM_LIVE_EVENTS.map((event, i) => (
            <li key={i} className={styles.liveItem}>
              <div className={styles.liveIconWrap} aria-hidden="true">
                <IoColorPaletteOutline className={styles.liveIcon} size={20} />
              </div>
              <div className={styles.liveContent}>
                <p className={styles.liveMainLine}>
                  <span className={styles.liveAddr}>{event.address}</span>
                  {' '}
                  <span className={styles.liveAction}>{event.action}</span>
                  {' '}
                  <span
                    className={styles.liveChainWrap}
                    style={{ '--chain-color': event.chainColor } as React.CSSProperties}
                  >
                    <span className={styles.liveChainDot} aria-hidden="true" />
                    <span className={styles.liveChainName}>{event.chain}</span>
                  </span>
                </p>
                <p className={styles.liveTime}>{event.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Stats panel ── */}
      <div className={styles.statsCard} aria-label="GM platform statistics">
        <div className={styles.statsGrid}>
          {STATS.map(stat => (
            <div key={stat.label} className={styles.statItem}>
              {/* 4 corner brackets */}
              <span className={styles.bTL} aria-hidden="true" />
              <span className={styles.bTR} aria-hidden="true" />
              <span className={styles.bBL} aria-hidden="true" />
              <span className={styles.bBR} aria-hidden="true" />
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}

export default GmSidebar
