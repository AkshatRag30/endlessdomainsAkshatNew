import { useCallback, useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { StatusModal } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'
import { DeployTokenFormState } from './gmDeployContract.data'

interface GmDeployContractSuccessModalProps {
  form: DeployTokenFormState
  txHash: string
  onClose: () => void
}

export function GmDeployContractSuccessModal({ form, txHash, onClose }: GmDeployContractSuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyHash = useCallback(() => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }, [txHash])

  return (
    <StatusModal
      tone="success"
      icon={<FiCheck size={24} aria-hidden="true" color="var(--color-white-primary)" />}
      heading="Contract Deployed"
      description={`${form.tokenName.trim() || 'Your token'} has been deployed on chain. It's ready to use.`}
      ariaLabelledBy="deploy-contract-success-heading"
      onClose={onClose}
    >
      <div className={parts.summaryCard}>
        <span className={parts.summaryLabel}>Symbol</span>
        <span className={parts.summaryValue}>{form.symbol.trim() || '-'}</span>
      </div>

      <div className={parts.hashRow}>
        <span className={parts.hashText}>{txHash}</span>
        <button type="button" className={parts.hashLink} onClick={handleCopyHash} aria-label="Copy transaction hash">
          {copied ? <FiCheck size={14} aria-hidden="true" /> : <FiCopy size={14} aria-hidden="true" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>

      <PrimaryButton type="button" shape="octagon" fullWidth onClick={onClose}>
        Done
      </PrimaryButton>
    </StatusModal>
  )
}

export default GmDeployContractSuccessModal
