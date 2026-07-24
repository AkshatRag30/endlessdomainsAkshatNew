import { useCallback } from 'react'
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import { GmCreateNftFormState, NFT_CATEGORIES } from './gmCreateNft.data'
import styles from './GmCreateNftStep2Token.module.scss'

interface GmCreateNftStep2TokenProps {
  form: GmCreateNftFormState
  onChange: (patch: Partial<GmCreateNftFormState>) => void
  onBack: () => void
  onContinue: () => void
}

export function GmCreateNftStep2Token({ form, onChange, onBack, onContinue }: GmCreateNftStep2TokenProps) {
  const handleContinue = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onContinue()
  }, [onContinue])

  return (
    <form className={styles.form} onSubmit={handleContinue}>

      <div className={styles.field}>
        <label htmlFor="nft-category" className={styles.label}>Category</label>
        <div className={styles.selectWrap}>
          <select
            id="nft-category"
            className={styles.select}
            value={form.category}
            onChange={e => onChange({ category: e.target.value })}
          >
            <option value="" disabled>eg art</option>
            {NFT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <FiChevronDown size={14} aria-hidden="true" className={styles.selectIcon} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="nft-external-link" className={styles.label}>External Link (Optional)</label>
        <input
          id="nft-external-link"
          type="url"
          className={styles.input}
          placeholder="https://yourcollection.com"
          value={form.externalLink}
          onChange={e => onChange({ externalLink: e.target.value })}
        />
      </div>

      <div className={styles.actions}>
        <SecondaryButton type="button" onClick={onBack} icon={<FiArrowLeft size={18} />}>
          Back
        </SecondaryButton>

        <PrimaryButton type="submit" shape="octagon">
          Continue To Preview
        </PrimaryButton>
      </div>

    </form>
  )
}

export default GmCreateNftStep2Token
