import { useCallback, useEffect } from 'react'
import Image from 'next/image'
import { DOMAIN_PROVIDERS } from '@/helpers/chaincurrency/chaincurrency'
import type { DomainProviderKey } from '@/helpers/chaincurrency/chaincurrency'
import styles from './ChooseChainModal.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChooseChainModalProps {
  isOpen: boolean
  onClose: () => void
  selectedChain?: DomainProviderKey
  onChainSelect?: (chain: DomainProviderKey) => void
}

// ── Icon sub-components ───────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function ChooseChainModal({ isOpen, onClose, selectedChain, onChainSelect }: ChooseChainModalProps) {

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  const handleSelect = useCallback((chain: DomainProviderKey) => {
    onChainSelect?.(chain)
    onClose()
  }, [onChainSelect, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="choose-chain-title"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.title} id="choose-chain-title">Choose a Chain</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close chain selector"
          >
            <CloseIcon />
          </button>
        </header>

        <div className={styles.divider} aria-hidden="true" />

        {/* 3-column chain grid */}
        <div className={styles.grid} role="list">
          {DOMAIN_PROVIDERS.map(chain => (
            <button
              key={chain.provider}
              type="button"
              role="listitem"
              className={[
                styles.chainCard,
                selectedChain === chain.provider ? styles.chainCardSelected : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleSelect(chain.provider)}
              aria-label={`${chain.label} — select chain`}
              aria-pressed={selectedChain === chain.provider}
            >
              {/* Chain icon circle — bg color set via data-provider attribute selector in SCSS */}
              <div className={styles.chainIconWrap} data-provider={chain.provider} aria-hidden="true">
                <Image
                  src={chain.image}
                  alt=""
                  width={36}
                  height={36}
                  className={styles.chainLogo}
                />
              </div>

              <span className={styles.chainName}>{chain.label}</span>
              <span className={styles.chainBalance}>~$0.01 · 0.12 ETH</span>
              <span className={styles.chainGasEst}>~$0.001 Gas</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ChooseChainModal
