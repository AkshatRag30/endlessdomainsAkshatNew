import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { IoIosSearch } from 'react-icons/io'

import { Input } from '@/design-system/primitives/input/Input'
import styles from './SearchSection.module.scss'

const PROVIDER_LOGOS: Record<string, string> = {
  unstoppable: '/domain/ud.svg',
  ens: '/domain/ethereum.svg',
  arbitrum: '/domain/arb.svg',
  bonfida: '/domain/bonnfida.svg',
  tezos: '/domain/tezos.svg',
  aptos: '/domain/apt.svg',
}

const PROVIDER_LABELS: Record<string, string> = {
  unstoppable: 'Unstoppable',
  ens: 'ENS',
  arbitrum: 'Arbitrum',
  bonfida: 'Bonfida',
  tezos: 'Tezos',
  aptos: 'Aptos',
}

function ProviderIcon({ status, className }: { status: string; className?: string }) {
  const [broken, setBroken] = useState(false)
  const src = PROVIDER_LOGOS[status]

  if (!src || broken) {
    return (
      <span
        className={[styles.tabIconFallback, className].filter(Boolean).join(' ')}
        data-provider={status}
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      src={src}
      alt=""
      className={[styles.tabIcon, className].filter(Boolean).join(' ')}
      onError={() => setBroken(true)}
      aria-hidden="true"
    />
  )
}

interface FilterSidebarProps {
  endings: string[]
  onRemoveEnding: (ending: string) => void
  onAddEnding: (ending: string) => void
  tldPills: string[][]
  filterText: string
  onFilterText: (text: string) => void
}

export function FilterSidebar({ endings, onRemoveEnding, onAddEnding, tldPills, filterText, onFilterText }: FilterSidebarProps) {
  const allTlds = tldPills.flat()
  const filteredTlds = filterText.trim()
    ? allTlds.filter(t => {
        const label = PROVIDER_LABELS[t] ?? t
        return label.toLowerCase().includes(filterText.toLowerCase()) || t.toLowerCase().includes(filterText.toLowerCase())
      })
    : allTlds

  return (
    <aside className={styles.filterSidebar} aria-label="Search filters">
      <div className={styles.filterSearchWrap}>
        <Input
          variant="filter"
          type="text"
          placeholder="Search TLDs"
          aria-label="Search TLD extensions"
          value={filterText}
          onChange={e => onFilterText(e.target.value)}
        />
        <div className={styles.filterSearchBtns}>
          <button
            className={styles.filterClearBtn}
            type="button"
            aria-label="Clear filter"
            onClick={() => onFilterText('')}
            disabled={!filterText}
          >
            <IoClose />
          </button>
          <button className={styles.filterSearchIconBtn} type="button" aria-label="Search filter">
            <IoIosSearch />
          </button>
        </div>
      </div>

      {endings.length > 0 && (
        <div>
          <p className={styles.filterTitle}>Endings</p>
          <div className={styles.filterTags}>
            {endings.map(e => (
              <span key={e} className={styles.filterTag}>
                <ProviderIcon status={e} className={styles.tabIconSm} />
                <span className={styles.filterTagLabel}>{PROVIDER_LABELS[e] ?? e}</span>
                <button
                  className={styles.filterTagRemove}
                  onClick={() => onRemoveEnding(e)}
                  aria-label={`Remove ${PROVIDER_LABELS[e] ?? e} filter`}
                  type="button"
                >
                  <IoClose />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {filteredTlds.length > 0 && (
        <div className={styles.tldPillsGrid}>
          {filteredTlds.map(tld => (
            <button
              key={tld}
              className={[styles.tldPill, endings.includes(tld) ? styles.tldPillActive : ''].filter(Boolean).join(' ')}
              type="button"
              onClick={() => (endings.includes(tld) ? onRemoveEnding(tld) : onAddEnding(tld))}
              aria-pressed={endings.includes(tld)}
            >
              <ProviderIcon status={tld} />
              <span className={styles.tldPillLabel}>{PROVIDER_LABELS[tld] ?? tld}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
