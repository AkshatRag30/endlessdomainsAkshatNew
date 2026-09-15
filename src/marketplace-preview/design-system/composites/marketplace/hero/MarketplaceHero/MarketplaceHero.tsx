import React from 'react'
import styles from './MarketplaceHero.module.scss'

/**
 * Figma node 1:1017. The abstract network illustration and its floating
 * category chips (Collectibles, Credit, Real Estate, Equity, Commodity) are
 * baked into the exported background image itself, not separate elements —
 * confirmed via get_design_context, not guessed from the screenshot. The
 * HeroCategoryChip type/data from Phase 2 assumed separately positioned
 * chips and goes unused here as a result.
 */
export const MarketplaceHero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.badge}>
        <img src="/assets/img/hero/logo-white-text.svg" alt="Endless Domains" className={styles.logo} />
      </div>
    </div>
  )
}

export default MarketplaceHero
