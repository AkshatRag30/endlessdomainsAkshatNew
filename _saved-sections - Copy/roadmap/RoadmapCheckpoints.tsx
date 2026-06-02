import styles from './Roadmap.module.scss'

// SVG dimensions from path.svg viewBox — used for top% checkpoint positioning only
export const VH = 2578

export interface Milestone {
  year: string
  title: string
  description: string
  tags: string[]
  side: 'left' | 'right'
  py: number
  progress: number
}

// Peaks derived from path.svg stroke path — left/right alternating
// py values match where the path reaches its leftmost/rightmost extreme
export const MILESTONES: Milestone[] = [
  {
    year: '2020',
    title: 'The Idea',
    description: 'What if your name on the internet actually belonged to you? We started building before most people understood the problem.',
    tags: ['Founded', 'The Conviction'],
    side: 'left', py: 130, progress: 0.05,
  },
  {
    year: '2022',
    title: 'First identity aggregator',
    description: 'One place to buy and manage names from every provider: ENS, Bonfida, and Unstoppable Domains all in one dashboard.',
    tags: ['First Aggregator', 'Unstoppable Domains', 'Bonfida', 'ENS'],
    side: 'right', py: 425, progress: 0.16,
  },
  {
    year: '2024',
    title: 'Expansion and .og launch',
    description: 'Added Arbitrum, Starknet, and Avalanche. Launched .og with 4,000+ claimed. Built Parked Identities and the Marketplace.',
    tags: ['Arbitrum', 'Starknet', 'Avalanche', '.og 4,000+ Mints', 'Parked Identities', 'Marketplace'],
    side: 'left', py: 673, progress: 0.26,
  },
  {
    year: 'Q2 2026',
    title: 'Your identity gets a memory',
    description: 'Everything you have done online becomes one score that follows you everywhere. You stop starting from zero with every new app.',
    tags: ['Reputation Score', 'Credentials', 'Proof Of Work', 'Login With EndlessID'],
    side: 'right', py: 967, progress: 0.38,
  },
  {
    year: 'Q3 2026',
    title: 'Your identity works for you',
    description: 'It finds rewards, connects you to the right people, and earns in the background. Without you doing anything.',
    tags: ['Matchmaking', 'Airdrop Discovery', 'Passive Income', 'Global Payments'],
    side: 'left', py: 1542, progress: 0.60,
  },
  {
    year: 'Q4 2026',
    title: 'The protocol goes live',
    description: 'Any app in the world can plug into your identity with one line of code. Like Stripe but for who you are.',
    tags: ['EndlessID', 'Open API', 'Every Wallet', 'The Industry Default'],
    side: 'right', py: 1851, progress: 0.72,
  },
  {
    year: '2027',
    title: 'Own the internet. Stop renting it.',
    description: 'Email, messaging, social media all rebuilt so you own them. Not Google. Not Facebook. You.',
    tags: ['GMail', 'GChat', 'GSecret', 'Full Ecosystem'],
    side: 'left', py: 2173, progress: 0.84,
  },
]

interface Props {
  onRef: (el: HTMLDivElement | null, index: number) => void
}

export default function RoadmapCheckpoints({ onRef }: Props) {
  return (
    <>
      {MILESTONES.map((m, i) => (
        <div
          key={i}
          ref={el => onRef(el, i)}
          className={[
            styles.checkpoint,
            m.side === 'left' ? styles.cpLeft : styles.cpRight,
          ].join(' ')}
          style={{ top: `${(m.py / VH) * 100}%` } as React.CSSProperties}
        >
          <span className={styles.yearBadge}>{m.year}</span>
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.cpContent}>
            <h3 className={styles.milestoneTitle}>{m.title}</h3>
            <p className={styles.milestoneDesc}>{m.description}</p>
            <div className={styles.tags}>
              {m.tags.map((tag, ti) => (
                <span key={ti} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
