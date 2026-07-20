import React from 'react'

import styles from './AiAdvisorHero.module.scss'

export interface AiAdvisorHeroProps {
  children?: React.ReactNode
}

export function AiAdvisorHero({ children }: AiAdvisorHeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.grid} aria-hidden="true">
        <img src="/ai-advisor/grid-vector-1.svg" alt="" className={styles.gridLine} />
        <img src="/ai-advisor/grid-vector-2.svg" alt="" className={styles.gridTicks} />
      </div>

      <div className={styles.glow} aria-hidden="true" />

      {children}
    </div>
  )
}

export default AiAdvisorHero
