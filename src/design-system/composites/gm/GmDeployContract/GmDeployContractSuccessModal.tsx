import { FiCheck } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { StatusModal } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'
import { DeployTokenFormState } from './gmDeployContract.data'

interface GmDeployContractSuccessModalProps {
  form: DeployTokenFormState
  onClose: () => void
}

export function GmDeployContractSuccessModal({ form, onClose }: GmDeployContractSuccessModalProps) {
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

      <PrimaryButton type="button" shape="octagon" fullWidth onClick={onClose}>
        Done
      </PrimaryButton>
    </StatusModal>
  )
}

export default GmDeployContractSuccessModal
