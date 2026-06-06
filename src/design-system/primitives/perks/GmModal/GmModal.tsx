import { useCallback, useEffect, useState } from 'react'
import styles from './GmModal.module.scss'
import { ChooseChainModal } from '@/design-system/primitives/perks/ChooseChainModal'
import { GmPendingModal } from '@/design-system/primitives/perks/GmPendingModal'
import { GmTransactionFailedModal } from '@/design-system/primitives/perks/GmTransactionFailedModal'
import type { DomainProviderKey } from '@/helpers/chaincurrency/chaincurrency'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GmModalProps {
  isOpen: boolean
  onClose: () => void
  username?: string
  streakDays?: number
  onGm?: (chain: string) => void
}

// ── Static data ───────────────────────────────────────────────────────────────

// Active chain shown in the transaction details section
const ACTIVE_CHAIN = { id: 'polygon', label: 'POLYGON', name: 'Polygon' }

// Chain selector list (switch chain options)
const SWITCH_CHAINS = [
  { id: 'arbitrum', name: 'Arbitrum', gasEst: '~$0.01', balance: '0.12 ETH', highlighted: true },
  { id: 'base', name: 'Base', gasEst: '~$0.005', balance: '0.05 ETH' },
  { id: 'optimism', name: 'Optimism', gasEst: '~$0.005', balance: '0.08 ETH' },
  { id: 'ethereum', name: 'Ethereum', gasEst: '~$0.08', balance: '0.42 ETH' },
]

// design-specific: approximate brand colors for chain icons — replace with actual assets
const CHAIN_COLORS: Record<string, string> = {
  arbitrum: '#28A0F0',
  base: '#0052FF',
  optimism: '#FF0420',
  ethereum: '#627EEA',
}

const CHAIN_LABELS: Record<string, string> = {
  arbitrum: 'A',
  base: 'B',
  optimism: 'O',
  ethereum: 'Ξ',
}

// ── Icon sub-components ───────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="18.6" height="18.6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Chain icon — colored circle with brand-approximate color + initial letter
// TODO: replace with actual chain brand SVG assets from public/
const ChainCircle = ({ id }: { id: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill={CHAIN_COLORS[id] ?? '#888888'} />
    <text x="10" y="14" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">
      {CHAIN_LABELS[id] ?? id[0].toUpperCase()}
    </text>
  </svg>
)

// Arrow icons — gray for regular chains, blue for highlighted
const ArrowRight = ({ highlight }: { highlight?: boolean }) => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
    <path
      d="M11 1l6 6-6 6M1 7h16"
      stroke={highlight ? '#2639ed' : '#c0c0c0'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export function GmModal({
  isOpen,
  onClose,
  username = 'myname.og',
  streakDays = 12,
  onGm,
}: GmModalProps) {

  const [showChainPicker, setShowChainPicker] = useState(false)
  const [selectedChain, setSelectedChain] = useState<DomainProviderKey | undefined>(undefined)
  // 'idle' = GM modal visible | 'pending' = loading modal | 'failed' = error modal
  const [gmStatus, setGmStatus] = useState<'idle' | 'pending' | 'failed'>('idle')

  // Escape key closes the modal (only when chain picker and result modals are not open)
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !showChainPicker && gmStatus === 'idle') onClose()
  }, [onClose, showChainPicker, gmStatus])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  // Reset status when modal closes so next open always starts from GM form
  useEffect(() => {
    if (!isOpen) setGmStatus('idle')
  }, [isOpen])

  const handleGm = useCallback(() => {
    setGmStatus('pending')
    onGm?.(ACTIVE_CHAIN.id)
  }, [onGm])

  const handlePendingClose = useCallback(() => {
    setGmStatus('idle')
    onClose()
  }, [onClose])

  const handleFailedTryAgain = useCallback(() => {
    setGmStatus('idle')
  }, [])

  const handleFailedPickChain = useCallback(() => {
    setGmStatus('idle')
    setShowChainPicker(true)
  }, [])

  const handleChainSwitch = useCallback((chainId: string) => {
    onGm?.(chainId)
  }, [onGm])

  const handleOpenChainPicker = useCallback(() => setShowChainPicker(true), [])
  const handleCloseChainPicker = useCallback(() => setShowChainPicker(false), [])

  const handleChainSelect = useCallback((chain: DomainProviderKey) => {
    setSelectedChain(chain)
    setShowChainPicker(false)
  }, [])

  if (!isOpen) return null

  if (gmStatus === 'pending') {
    return (
      <>
        <GmPendingModal isOpen onClose={handlePendingClose} />
        <ChooseChainModal
          isOpen={showChainPicker}
          onClose={handleCloseChainPicker}
          selectedChain={selectedChain}
          onChainSelect={handleChainSelect}
        />
      </>
    )
  }

  if (gmStatus === 'failed') {
    return (
      <>
        <GmTransactionFailedModal
          isOpen
          onClose={() => { setGmStatus('idle'); onClose() }}
          chainName={ACTIVE_CHAIN.name}
          onTryAgain={handleFailedTryAgain}
          onPickChain={handleFailedPickChain}
        />
        <ChooseChainModal
          isOpen={showChainPicker}
          onClose={handleCloseChainPicker}
          selectedChain={selectedChain}
          onChainSelect={handleChainSelect}
        />
      </>
    )
  }

  return (
    <>
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modalWrap}>

        {/* Close button — right: -2px top: -1px, hangs just outside modal border (Figma spec) */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close GM modal"
        >
          <CloseIcon />
        </button>

        {/* Modal panel */}
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gm-modal-title"
          onClick={e => e.stopPropagation()}
        >
          {/* Stripe background overlay */}
          <div className={styles.stripe} aria-hidden="true" />

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <header className={styles.header}>
            <h2 className={styles.title} id="gm-modal-title">Say GM ☀️</h2>
            <p className={styles.subtitle}>{username} · Day {streakDays} 🔥</p>
          </header>

          {/* ── Main section ───────────────────────────────────────────────── */}
          <div className={styles.mainSection}>

            {/* Transaction container */}
            <div className={styles.txContainer}>

              {/* Transaction info stack */}
              <div className={styles.txInfo}>

                {/* Transaction Details — black bg, orange border, inner glow */}
                <div className={styles.txDetails}>
                  <div className={styles.txMessage}>
                    <span className={styles.txBolt}>⚡</span>
                    <span className={styles.txText}>Sending GM on {ACTIVE_CHAIN.name}...</span>
                  </div>
                  <div className={styles.chainTag} aria-label={`Chain: ${ACTIVE_CHAIN.label}`}>
                    {ACTIVE_CHAIN.label}
                  </div>
                </div>

                {/* Transaction Summary — gas + balance */}
                <div className={styles.txSummary}>
                  <span className={styles.txMeta}>⛽&nbsp;&nbsp;~$0.001 gas</span>
                  <span className={styles.txMeta}>💳&nbsp;&nbsp;0.05 MATIC balance</span>
                </div>

                {/* GM Sign button */}
                <button
                  type="button"
                  className={styles.gmBtn}
                  onClick={handleGm}
                  aria-label={`Sign and GM on ${ACTIVE_CHAIN.name}`}
                >
                  <span className={styles.gmBtnText}>👋&nbsp;&nbsp;Sign &amp; GM on {ACTIVE_CHAIN.name}&nbsp;&nbsp;→</span>
                </button>

              </div>

              {/* Switch chain prompt — opens ChooseChainModal */}
              <button
                type="button"
                className={styles.switchChainLabel}
                onClick={handleOpenChainPicker}
                aria-haspopup="dialog"
              >
                or switch chain
              </button>

            </div>

            {/* Chain selector */}
            <div className={styles.chainSelector}>

              {SWITCH_CHAINS.map(chain => (
                <button
                  key={chain.id}
                  type="button"
                  className={[
                    styles.chainRow,
                    chain.highlighted ? styles.chainRowHighlight : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleChainSwitch(chain.id)}
                  aria-label={`Switch to ${chain.name} — ${chain.gasEst} gas, ${chain.balance}`}
                >
                  <div className={styles.chainInfo}>
                    <ChainCircle id={chain.id} />
                    <div className={styles.chainText}>
                      <span className={[
                        styles.chainName,
                        chain.highlighted ? styles.chainNameHighlight : '',
                      ].filter(Boolean).join(' ')}>
                        {chain.name}
                      </span>
                      <span className={styles.chainGas}>{chain.gasEst} · {chain.balance}</span>
                    </div>
                  </div>
                  <ArrowRight highlight={chain.highlighted} />
                </button>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Chain picker — renders on top of GmModal (z-index 201 > 200) */}
    <ChooseChainModal
      isOpen={showChainPicker}
      onClose={handleCloseChainPicker}
      selectedChain={selectedChain}
      onChainSelect={handleChainSelect}
    />
    </>
  )
}

export default GmModal
