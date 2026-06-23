import React, { useRef } from 'react'
import { useEntranceAnimation } from '@/design-system/composites/about-us/useEntranceAnimation'
import styles from './ParkedStats.module.scss'

const STATS = [
  { value: '10M+', label: 'Web3 Domains Registered Globally' },
  { value: '94%',  label: 'Currently Idle And Earning Nothing' },
  { value: '3 steps', label: 'From Idle Domain To Earning' },
  { value: '10+',  label: 'Blockchains Supported' },
]

export function ParkedStats() {
  const item0Ref = useRef<HTMLDivElement>(null)
  const item1Ref = useRef<HTMLDivElement>(null)
  const item2Ref = useRef<HTMLDivElement>(null)
  const item3Ref = useRef<HTMLDivElement>(null)
  const refs = [item0Ref, item1Ref, item2Ref, item3Ref]

  useEntranceAnimation(refs)

  return (
    <section className={styles.section} aria-label="Parked domains statistics">
      <div className={styles.inner}>
        {STATS.map((stat, i) => (
          <div key={stat.value} className={styles.item} ref={refs[i]}>
            {i !== 0 && <div className={styles.divider} aria-hidden="true" />}
            <div className={styles.card}>
              <span className={styles.bracket} aria-hidden="true" />
              <div className={styles.cardInner}>
                <p className={styles.value}>{stat.value}</p>
                <p className={styles.label}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ParkedStats
