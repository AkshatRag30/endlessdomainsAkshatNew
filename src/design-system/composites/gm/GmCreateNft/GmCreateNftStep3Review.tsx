import React, { useMemo } from 'react'
import Image from 'next/image'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import previousCollectionBanner from '../../../../../public/gm/create-nft/previous-collection-banner.jpg'
import { useSupportedChains } from '../GmChainSelector'
import { GmCreateNftFormState } from './gmCreateNft.data'
import styles from './GmCreateNftStep3Review.module.scss'

interface GmCreateNftStep3ReviewProps {
  form: GmCreateNftFormState
  onBack: () => void
  onCreate: () => void
}

export function GmCreateNftStep3Review({ form, onBack, onCreate }: GmCreateNftStep3ReviewProps) {
  const { chains } = useSupportedChains()
  const chainLabel = useMemo(
    () => chains.find(chain => chain.chain === form.chainId)?.name ?? '-',
    [chains, form.chainId],
  )

  const rows = [
    { label: 'Symbol', value: form.symbol.trim() || '-' },
    { label: 'Standard', value: 'ERC-721 (Collection)' },
    { label: 'Chain', value: chainLabel },
    { label: 'Metadata', value: 'ipfs:// (Generated On Submit)' },
    { label: 'Estimated Network Fee', value: '~0.0011 ETH' },
  ]

  return (
    <div className={styles.review}>

      <div className={styles.previewImageWrap}>
        <Image
          src={previousCollectionBanner}
          alt="Collection cover preview"
          fill
          sizes="613px"
          className={styles.previewImage}
        />
      </div>

      <div className={styles.summaryHeader}>
        <h3 className={styles.collectionName}>{form.collectionName.trim() || 'Untitled Collection'}</h3>
        <p className={styles.collectionDesc}>{form.description.trim() || 'No description added.'}</p>
      </div>

      <dl className={styles.table}>
        {rows.map(row =>
          // dl requires dt/dd as direct children — Fragment is the documented exception for this case,
          // and TS 5.2 + @types/react 18.3 disallow `key` on Fragment via JSX syntax
          React.createElement(
            React.Fragment,
            { key: row.label },
            <dt className={styles.tableLabel}>{row.label}</dt>,
            <dd className={styles.tableValue}>{row.value}</dd>,
          ),
        )}
      </dl>

      <div className={styles.actions}>
        <div className={styles.secondaryBtnWrap}>
          <SecondaryButton type="button" onClick={onBack} icon={<IoReturnUpBackOutline size={18} />}>
            Edit
          </SecondaryButton>
        </div>

        <div className={styles.primaryBtnWrap}>
          <PrimaryButton type="button" shape="octagon" onClick={onCreate}>
            Create
          </PrimaryButton>
        </div>
      </div>

    </div>
  )
}

export default GmCreateNftStep3Review
