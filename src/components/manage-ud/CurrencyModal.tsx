import { useState, useCallback } from 'react'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'
import { FiArrowRight } from 'react-icons/fi'

import CurrencyList from './CurrencyList.json'
import styles from './CurrencyModal.module.scss'

interface CurrencyModalProps {
  onClose: () => void
  onAdd: (entry: { key: string; name: string }) => void
}

function CurrencyIcon({ symbol }: { symbol: string }) {
  const [broken, setBroken] = useState(false)
  if (broken) return <span className={styles.iconFallback} aria-hidden="true" />
  return (
    <Image
      src={`/crypto-currency/${symbol.toLowerCase()}.svg`}
      alt=""
      width={22}
      height={22}
      aria-hidden="true"
      onError={() => setBroken(true)}
    />
  )
}

export function CurrencyModal({ onClose, onAdd }: CurrencyModalProps) {
  const [search, setSearch] = useState('')

  const filtered = Object.entries(CurrencyList)
    .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = useCallback(
    (key: string) => {
      onAdd({ key, name: key })
    },
    [onAdd],
  )

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Add currency"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add currency</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <IoClose size={20} aria-hidden="true" />
          </button>
        </div>

        <hr className={styles.divider} />

        {/* Search */}
        <div className={styles.searchWrap}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search currency…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search currencies"
          />
        </div>

        {/* Currency rows */}
        <ul className={styles.currencyList} role="list">
          {filtered.map(([key]) => (
            <li key={key} className={styles.currencyRow} role="listitem">
              <div className={styles.currencyInfo}>
                <div className={styles.coinCircle}>
                  <CurrencyIcon symbol={key} />
                </div>
                <strong className={styles.currencyName}>{key}</strong>
              </div>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => handleAdd(key)}
                aria-label={`Add ${key}`}
              >
                Add
                <FiArrowRight size={18} aria-hidden="true" />
              </button>
            </li>
          ))}

          {filtered.length === 0 && (
            <li className={styles.emptyState}>No currencies found.</li>
          )}
        </ul>

      </div>
    </div>
  )
}

export default CurrencyModal
