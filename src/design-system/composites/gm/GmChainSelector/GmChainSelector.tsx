import Image from 'next/image'
import { FiAlertCircle } from 'react-icons/fi'
import { useSupportedChains } from './useSupportedChains'
import styles from './GmChainSelector.module.scss'

export interface GmChainSelectorProps {
  value: string
  onChange: (chainId: string) => void
}

// Fetches the supported chain list directly from the GM API — intentionally
// inline (no shared API client on this branch yet) so it's a single drop-in
// swap once a senior dev wires this through the real service layer.
export function GmChainSelector({ value, onChange }: GmChainSelectorProps) {
  const { chains, loading, error } = useSupportedChains()

  if (loading) {
    return (
      <div className={styles.chainGrid} aria-busy="true" aria-label="Loading supported chains">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.chainCardSkeleton} aria-hidden="true" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorState} role="alert">
        <FiAlertCircle size={16} aria-hidden="true" />
        <span>Couldn&apos;t load supported chains. Please refresh and try again.</span>
      </div>
    )
  }

  return (
    <div className={styles.chainGrid} role="radiogroup" aria-label="Select deployment chain">
      {chains.map(chain => {
        const isActive = chain.status === 'active'
        return (
          <button
            key={chain.chainId}
            type="button"
            role="radio"
            aria-checked={value === chain.chain}
            disabled={!isActive}
            className={`${styles.chainCard} ${value === chain.chain ? styles.chainCardActive : ''} ${!isActive ? styles.chainCardDisabled : ''}`}
            onClick={() => onChange(chain.chain)}
            title={!isActive ? `${chain.name} — unavailable` : chain.name}
          >
            <Image src={chain.logo} alt="" width={20} height={20} className={styles.chainIcon} unoptimized />
            <span className={styles.chainLabel}>{chain.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default GmChainSelector
