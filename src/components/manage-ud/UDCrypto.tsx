import { useState, useCallback } from 'react'
import { SiBitcoin, SiEthereum, SiSolana } from 'react-icons/si'
import { FiPlus, FiTrash2, FiX, FiArrowRight } from 'react-icons/fi'
import { BsCheck2 } from 'react-icons/bs'
import { LuLoader } from 'react-icons/lu'
import { TbCurrencyBitcoin } from 'react-icons/tb'

import { PrimaryButton } from '@/design-system/primitives/button'
import CurrencyModal from './CurrencyModal'
import styles from './UDCrypto.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

interface CryptoEntry {
  key: string
  name: string
  chain: string
  address: string
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_CRYPTO: CryptoEntry[] = [
  { key: 'BTC', name: 'Bitcoin',  chain: 'EVM (chain)',    address: '0x5CE1F1093FD5CfDE31f23b50d27F604426842D98' },
  { key: 'ETH', name: 'Ethereum', chain: 'Solana (chain)', address: '' },
]

// ── Coin icon map ─────────────────────────────────────────────────────────────

function CoinIcon({ symbol }: { symbol: string }) {
  const s = symbol.toUpperCase()
  if (s === 'BTC') return <SiBitcoin size={20} color="#F7931A" aria-hidden="true" />
  if (s === 'ETH') return <SiEthereum size={20} color="#627EEA" aria-hidden="true" />
  if (s === 'SOL') return <SiSolana size={20} color="#9945FF" aria-hidden="true" />
  return <TbCurrencyBitcoin size={20} aria-hidden="true" />
}

// ── Success modal (shared with reverse) ───────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Save successful"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FiX size={18} aria-hidden="true" />
        </button>
        <div className={styles.iconWrap}>
          <div className={styles.iconOuter}>
            <div className={styles.iconInner}>
              <BsCheck2 className={styles.checkIcon} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.iconShadow} aria-hidden="true" />
        </div>
        <div className={styles.modalText}>
          <p className={styles.modalTitle}>Save Change Successfull</p>
          <p className={styles.modalSubtitle}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface UDCryptoProps {
  domain: string
}

export function UDCrypto({ domain }: UDCryptoProps) {
  const [entries, setEntries] = useState<CryptoEntry[]>(DEMO_CRYPTO)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = useCallback((key: string, newValue: string) => {
    setEntries(prev => prev.map(e => e.key === key ? { ...e, address: newValue } : e))
  }, [])

  const handleRemove = useCallback((key: string) => {
    setEntries(prev => prev.filter(e => e.key !== key))
  }, [])

  const handleAddCurrency = useCallback((incoming: { key: string; name: string }) => {
    setEntries(prev => {
      if (prev.find(e => e.key === incoming.key)) return prev
      return [...prev, { key: incoming.key, name: incoming.name, chain: 'EVM (chain)', address: '' }]
    })
    setIsModalOpen(false)
  }, [])

  return (
    <section className={styles.section}>
      {/* Title */}
      <div className={styles.titleRow}>
        <TbCurrencyBitcoin className={styles.titleIcon} aria-hidden="true" />
        <h2 className={styles.title}>Crypto Addresses</h2>
      </div>
      <p className={styles.subtitle}>Link payment addresses</p>

      {/* Entry list */}
      <div className={styles.list}>
        {entries.length === 0 && (
          <p className={styles.emptyState}>No crypto addresses added yet.</p>
        )}

        {entries.map(entry => (
          <div key={entry.key} className={styles.entryRow}>

            {/* Row header: icon + name + chain badge + remove */}
            <div className={styles.entryHeader}>
              <div className={styles.entryMeta}>
                <CoinIcon symbol={entry.key} />
                <strong className={styles.currencyName}>{entry.name}</strong>
                <span className={styles.chainBadge}>{entry.chain}</span>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(entry.key)}
                aria-label={`Remove ${entry.name}`}
              >
                Remove
                <FiTrash2 size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Address input row */}
            <div className={styles.inputRow}>
              <input
                type="text"
                className={[styles.input, entry.address ? styles.inputActive : styles.inputPending].join(' ')}
                value={entry.address}
                placeholder={`Enter your ${entry.name} address`}
                onChange={e => handleChange(entry.key, e.target.value)}
                aria-label={`${entry.name} address`}
              />
              {entry.address ? (
                <BsCheck2 className={styles.statusCheck} aria-hidden="true" />
              ) : (
                <div className={styles.pendingState}>
                  <LuLoader className={styles.pendingIcon} aria-hidden="true" />
                  <span className={styles.pendingText}>Pending</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Add currency link */}
      <button type="button" className={styles.addCurrencyBtn} onClick={() => setIsModalOpen(true)}>
        <FiPlus size={20} aria-hidden="true" />
        Add Currency
      </button>

      {/* Save changes */}
      <PrimaryButton
        className={styles.actionBtn}
        onClick={() => setShowSuccess(true)}
        icon={<FiArrowRight aria-hidden="true" />}
        iconPosition="right"
      >
        Save Changes
      </PrimaryButton>

      {/* Currency picker modal */}
      {isModalOpen && (
        <CurrencyModal onClose={() => setIsModalOpen(false)} onAdd={handleAddCurrency} />
      )}

      {/* Success modal */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </section>
  )
}

export default UDCrypto
