import { FiArrowUpRight } from 'react-icons/fi'
import { IoWarning } from 'react-icons/io5'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { StatusModal } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'

export interface TransactionFailedOnChainModalProps {
  txHash: string
  onClose: () => void
  onTryAgain?: () => void
  onViewExplorer?: () => void
}

export function TransactionFailedOnChainModal({
  txHash,
  onClose,
  onTryAgain,
  onViewExplorer,
}: TransactionFailedOnChainModalProps) {
  return (
    <StatusModal
      tone="error"
      icon={<IoWarning size={24} aria-hidden="true" color="white" />}
      heading="Transaction Failed On-Chain"
      description="The network rejected this transaction. No funds beyond the gas already spent were charged."
      ariaLabelledBy="transaction-failed-onchain-heading"
      onClose={onClose}
    >
      <div className={parts.hashRow}>
        <span className={parts.hashText}>{txHash}</span>
        <button type="button" className={parts.hashLink} onClick={onViewExplorer}>
          view explore <FiArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>

      <PrimaryButton type="button" shape="octagon" fullWidth onClick={onTryAgain}>
        Try Again
      </PrimaryButton>
    </StatusModal>
  )
}

export default TransactionFailedOnChainModal
