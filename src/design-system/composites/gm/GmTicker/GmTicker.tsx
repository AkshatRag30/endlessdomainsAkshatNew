import styles from './GmTicker.module.scss'

const TICKER_TEXT = [
  { emoji: '☀️', text: 'GM on Ethereum', change: '+2.1k today' },
  { emoji: '🌙', text: 'GN on Base',     change: '+890 today'  },
  { emoji: '☀️', text: 'GM on Optimism', change: '+1.4k today' },
  { emoji: '🌙', text: 'GN on Avalanche',change: '+760 today'  },
  { emoji: '☀️', text: 'GM on Polygon',  change: '+3.2k today' },
  { emoji: '🌙', text: 'GN on Linea',    change: '+420 today'  },
  { emoji: '☀️', text: 'GM on Arbitrum', change: '+980 today'  },
  { emoji: '🌙', text: 'GN on BNB Chain',change: '+1.1k today' },
]

export function GmTicker() {
  const items = [...TICKER_TEXT, ...TICKER_TEXT]

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        {items.map((item, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.emoji}>{item.emoji}</span>
            {item.text} {item.change}
          </span>
        ))}
      </div>
      <span className={styles.fadeLeft}  aria-hidden="true" />
      <span className={styles.fadeRight} aria-hidden="true" />
    </div>
  )
}

export default GmTicker
