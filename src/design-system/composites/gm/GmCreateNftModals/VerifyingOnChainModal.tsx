import { StatusModal, WaveLoader } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'

export interface VerifyingOnChainModalProps {
  txHash: string
  onClose: () => void
}

export function VerifyingOnChainModal({ txHash, onClose }: VerifyingOnChainModalProps) {
  return (
    <StatusModal
      tone="pending"
      icon={<WaveLoader />}
      heading="Verifying On-Chain"
      description="Your transaction was submitted. We're waiting for network confirmation."
      ariaLabelledBy="verifying-onchain-heading"
      ariaLive="polite"
      onClose={onClose}
    >
      <div className={parts.hashRow}>
        <span className={parts.hashText}>{txHash}</span>
        <span className={parts.hashStatus}>
          <span className={parts.hashSpinner} aria-hidden="true" />
          Pending
        </span>
      </div>
    </StatusModal>
  )
}

export default VerifyingOnChainModal
