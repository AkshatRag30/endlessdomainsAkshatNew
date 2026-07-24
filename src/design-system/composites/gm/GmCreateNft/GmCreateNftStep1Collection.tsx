import { useCallback, useRef } from 'react'
import Image from 'next/image'
import { FiUpload, FiInfo, FiArrowLeft } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import { GmCreateNftFormState, NFT_CHAINS } from './gmCreateNft.data'
import styles from './GmCreateNftStep1Collection.module.scss'

interface GmCreateNftStep1CollectionProps {
  form: GmCreateNftFormState
  onChange: (patch: Partial<GmCreateNftFormState>) => void
  onContinue: () => void
}

export function GmCreateNftStep1Collection({ form, onChange, onContinue }: GmCreateNftStep1CollectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange({ imageFile: file })
  }, [onChange])

  const handleContinue = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onContinue()
  }, [onContinue])

  const canContinue = form.collectionName.trim().length > 0 && form.symbol.trim().length > 0

  return (
    <form className={styles.form} onSubmit={handleContinue}>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="nft-collection-name" className={styles.label}>Collection Name</label>
          <input
            id="nft-collection-name"
            type="text"
            className={styles.input}
            placeholder="e.g. Neon Cats"
            value={form.collectionName}
            onChange={e => onChange({ collectionName: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="nft-symbol" className={styles.label}>Symbol</label>
          <input
            id="nft-symbol"
            type="text"
            className={styles.input}
            placeholder="e.g. NCAT"
            value={form.symbol}
            onChange={e => onChange({ symbol: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="nft-description" className={styles.label}>Description</label>
          <FiInfo size={12} aria-hidden="true" className={styles.infoIcon} />
        </div>
        <textarea
          id="nft-description"
          className={styles.textarea}
          placeholder="Describe your NFT collection..."
          value={form.description}
          onChange={e => onChange({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Collection Image</span>
          <FiInfo size={12} aria-hidden="true" className={styles.infoIcon} />
        </div>
        <button type="button" className={styles.uploadButton} onClick={handleUploadClick}>
          {form.imageFile ? (
            <span className={styles.uploadFileName}>{form.imageFile.name}</span>
          ) : (
            <>
              <FiUpload size={16} aria-hidden="true" />
              <span>Click to upload (JPEG/PNG/WebP/GIF, 5MB max)</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={styles.srOnlyInput}
          onChange={handleFileChange}
          aria-label="Upload collection image"
        />
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
        <SecondaryButton type="button" disabled icon={<FiArrowLeft size={18} />}>
          Back
        </SecondaryButton>

        <PrimaryButton type="submit" shape="octagon" disabled={!canContinue}>
          Continue To Preview
        </PrimaryButton>
      </div>

    </form>
  )
}

export default GmCreateNftStep1Collection
