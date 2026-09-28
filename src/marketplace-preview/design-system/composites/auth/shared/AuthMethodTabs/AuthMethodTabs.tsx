import React, { useRef } from 'react'
import Image from 'next/image'
import styles from './AuthMethodTabs.module.scss'

export type AuthMethod = 'wallet' | 'email'

export interface AuthMethodTabsProps {
  value: AuthMethod
  onChange: (method: AuthMethod) => void
  /** Prefix for the tab / panel ids, so the panel can point back with aria-labelledby. */
  idPrefix: string
  label: string
}

const TABS: { id: AuthMethod; label: string }[] = [
  { id: 'wallet', label: 'Web3 Wallet' },
  { id: 'email', label: 'Email' },
]

export const authTabId = (idPrefix: string, method: AuthMethod) => `${idPrefix}-tab-${method}`
export const authPanelId = (idPrefix: string, method: AuthMethod) => `${idPrefix}-panel-${method}`

/**
 * Figma 16:1009 / 16:424: the "Web3 Wallet / Email" switch inside its
 * decorative frame (hairlines, corner dot rails, soft band). Presentational:
 * the page owns which tab is open.
 */
export const AuthMethodTabs = ({ value, onChange, idPrefix, label }: AuthMethodTabsProps) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = (TABS.findIndex((tab) => tab.id === value) + 1) % TABS.length
    onChange(TABS[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className={styles.frame}>
      {/* Figma's rail: a hairline with a dot at each end of the frame. */}
      <span className={`${styles.rail} ${styles.railLeft}`} aria-hidden="true">
        <Image src="/assets/img/auth/tabs-rail.svg" alt="" fill className={styles.railImage} />
      </span>
      <span className={`${styles.rail} ${styles.railRight}`} aria-hidden="true">
        <Image src="/assets/img/auth/tabs-rail.svg" alt="" fill className={styles.railImage} />
      </span>
      <div className={styles.band}>
        <div className={styles.track} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
          {TABS.map((tab, index) => {
            const active = tab.id === value
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  refs.current[index] = el
                }}
                type="button"
                role="tab"
                id={authTabId(idPrefix, tab.id)}
                aria-selected={active}
                aria-controls={authPanelId(idPrefix, tab.id)}
                tabIndex={active ? 0 : -1}
                className={active ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                onClick={() => onChange(tab.id)}
              >
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AuthMethodTabs
