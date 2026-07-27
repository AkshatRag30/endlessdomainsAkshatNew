import React, { useMemo } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button'
import { useSupportedChains } from '../GmChainSelector'
import { DeployTokenFormState } from './gmDeployContract.data'
import styles from './GmDeployContractStep3Review.module.scss'

interface GmDeployContractStep3ReviewProps {
  form: DeployTokenFormState
  onBack: () => void
  onCreate: () => void
}

export function GmDeployContractStep3Review({ form, onBack, onCreate }: GmDeployContractStep3ReviewProps) {
  const { chains } = useSupportedChains()
  const chainLabel = useMemo(
    () => chains.find(chain => chain.chain === form.chainId)?.name ?? '-',
    [chains, form.chainId],
  )

  const rows = [
    { label: 'Standard', value: 'ERC-20' },
    { label: 'Chain', value: chainLabel },
    { label: 'Estimated Network Fee', value: '~0.0011 ETH' },
  ]

  return (
    <div className={styles.review}>

      <div className={styles.summaryHeader}>
        <h3 className={styles.tokenName}>{form.tokenName.trim() || 'Untitled Token'}</h3>
        <p className={styles.tokenMeta}>{form.symbol.trim() || '—'} · {form.totalSupply.trim() || '—'} supply</p>
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

export default GmDeployContractStep3Review
