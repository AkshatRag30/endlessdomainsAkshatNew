import React from 'react'
import styles from './MarketplaceHero.module.scss'

/**
 * Figma node 1:1017. The category chips (Collectibles, Credit, Real Estate,
 * Equity, Commodity) are baked into the exported background image itself,
 * not separate elements — confirmed via get_design_context, not guessed
 * from the screenshot. The HeroCategoryChip type/data from Phase 2 assumed
 * separately positioned chips and goes unused here as a result.
 *
 * The floating "Endless Domains" badge that used to sit centered on top of
 * the background is gone — the current background (hero-network-bg.png)
 * already has its own centered logo mark and headline baked in, so the
 * badge just duplicated on top of it.
 */
export const MarketplaceHero = () => {
  return <div className={styles.hero} />
}

export default MarketplaceHero
