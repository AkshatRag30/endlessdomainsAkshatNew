import { useCallback, useState } from 'react'
import Image from 'next/image'
import { DomainProviders } from '@/design-system/composites/domain/DomainProviders'
import { AiModeToggle } from './AiModeToggle'
import { DomainSearchBar } from './DomainSearchBar'
import { DomainSearchNotchWings } from './DomainSearchNotchWings'
import { DomainSearchPolygon } from './DomainSearchPolygon'
import { SuggestionPills } from './SuggestionPills'
import styles from './DomainSearchHero.module.scss'

export function DomainSearchHero() {
  const [aiMode, setAiMode] = useState(false)
  const [query, setQuery] = useState('')

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setQuery(suggestion)
  }, [])

  return (
    <section className={styles.hero} aria-labelledby="domain-search-heading">

      {/* ── Heading + description ── */}
      <div className={styles.textStack}>
        <div className={styles.labelWrap}>
          <span className={styles.labelBracketTL} aria-hidden="true" />
          <span className={styles.labelBracketTR} aria-hidden="true" />
          <span className={styles.labelBracketBL} aria-hidden="true" />
          <span className={styles.labelBracketBR} aria-hidden="true" />
          <p className={styles.labelText}>Web3 identity</p>
        </div>

        <h1 id="domain-search-heading" className={styles.heading}>
          Own your <span className={styles.headingAccent}>digital identity.</span>
        </h1>
        <p className={styles.description}>
          Search, claim, and manage onchain domains across the extensions people actually use
        </p>
      </div>

      {/* ── Polygon frame — shine backdrop, search bar, notch marquee ── */}
      <div className={styles.frame}>
        <div className={styles.polygonLayer} aria-hidden="true">
          <DomainSearchPolygon />
        </div>

        <div className={styles.contentCard}>
          <div className={styles.cardBackground} aria-hidden="true">
            <Image src="/domain-search/Subtract.svg" alt="" width={754} height={264} className={styles.cardHalf} unoptimized />
            <Image src="/domain-search/Subtract-1.svg" alt="" width={754} height={264} className={styles.cardHalf} unoptimized />
          </div>

          <div className={styles.wingsWrap}>
            <div className={styles.wingsLayer} aria-hidden="true">
              <DomainSearchNotchWings />
            </div>

            <div className={styles.band}>
              <DomainSearchBar aiMode={aiMode} query={query} onQueryChange={setQuery} />
            </div>
          </div>

          {/* ── Suggestion pills + AI toggle ── */}
          <div className={styles.controlsRow}>
            <SuggestionPills onSelect={handleSuggestionSelect} />
            <span className={styles.controlsDivider} aria-hidden="true" />
            <AiModeToggle checked={aiMode} onChange={setAiMode} />
          </div>
        </div>

        <div className={styles.marqueeLayer}>
          <DomainProviders />
          <span className={styles.marqueeFadeLeft} aria-hidden="true" />
          <span className={styles.marqueeFadeRight} aria-hidden="true" />
        </div>
      </div>

    </section>
  )
}

export default DomainSearchHero
