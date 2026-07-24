import { useCallback, useState } from 'react'
import Image from 'next/image'
import { FiCopy, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import { NFT_CHAINS } from '../GmCreateNft/gmCreateNft.data'
import { DeployTokenFormState } from './gmDeployContract.data'
import styles from './GmDeployContractStep2Token.module.scss'

interface GmDeployContractStep2TokenProps {
  form: DeployTokenFormState
  onChange: (patch: Partial<DeployTokenFormState>) => void
  onBack: () => void
  onContinue: () => void
}

export function GmDeployContractStep2Token({ form, onChange, onBack, onContinue }: GmDeployContractStep2TokenProps) {
  const [copied, setCopied] = useState(false)

  const handleContinue = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onContinue()
  }, [onContinue])

  const handleCopyOwner = useCallback(() => {
    navigator.clipboard.writeText(form.owner)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }, [form.owner])

  const canContinue = form.tokenName.trim().length > 0 && form.symbol.trim().length > 0

  return (
    <form className={styles.form} onSubmit={handleContinue}>

      <div className={styles.field}>
        <label htmlFor="token-name" className={styles.label}>Token Name</label>
        <input
          id="token-name"
          type="text"
          className={styles.input}
          placeholder="enter token name"
          value={form.tokenName}
          onChange={e => onChange({ tokenName: e.target.value })}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="token-symbol" className={styles.label}>Symbol</label>
          <input
            id="token-symbol"
            type="text"
            className={styles.input}
            placeholder="Symbol"
            value={form.symbol}
            onChange={e => onChange({ symbol: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="token-total-supply" className={styles.label}>Total Supply</label>
          <input
            id="token-total-supply"
            type="text"
            inputMode="numeric"
            className={styles.input}
            placeholder="10000000000"
            value={form.totalSupply}
            onChange={e => onChange({ totalSupply: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Owner</span>
        <div className={styles.ownerField}>
          <span className={styles.ownerAddress}>{form.owner}</span>
          <button type="button" className={styles.copyButton} onClick={handleCopyOwner} aria-label="Copy owner address">
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Chain</span>
        <div className={styles.chainGrid} role="radiogroup" aria-label="Select deployment chain">
          {NFT_CHAINS.map(chain => (
            <button
              key={chain.id}
              type="button"
              role="radio"
              aria-checked={form.chainId === chain.id}
              className={`${styles.chainCard} ${form.chainId === chain.id ? styles.chainCardActive : ''}`}
              onClick={() => onChange({ chainId: chain.id })}
            >
              <Image src={chain.icon} alt="" width={20} height={20} className={styles.chainIcon} unoptimized />
              <span className={styles.chainLabel}>{chain.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <SecondaryButton type="button" onClick={onBack} icon={<FiArrowLeft size={18} />}>
          Back
        </SecondaryButton>

        <PrimaryButton type="submit" shape="octagon" disabled={!canContinue}>
          Continue To Preview
        </PrimaryButton>
      </div>

    </form>
  )
}

export default GmDeployContractStep2Token
