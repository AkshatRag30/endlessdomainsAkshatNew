import { FiCheck, FiArrowUpRight } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { StatusModal } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'

export interface AlreadyRecordedModalProps {
  collectionName: string
  chainName: string
  txHash: string
  onClose: () => void
  onViewCollection?: () => void
  onViewExplorer?: () => void
}

export function AlreadyRecordedModal({
  collectionName,
  chainName,
  txHash,
  onClose,
  onViewCollection,
  onViewExplorer,
}: AlreadyRecordedModalProps) {
  return (
    <StatusModal
      tone="success"
      icon={<FiCheck size={24} aria-hidden="true" color="var(--color-white-primary)" />}
      heading="Already Recorded"
      description="This transaction was already verified — nothing extra to do here."
      ariaLabelledBy="already-recorded-heading"
      onClose={onClose}
    >
      <div className={parts.summaryRow}>
        <span className={parts.summaryName}>{collectionName}</span>
        <span className={parts.summaryChain}>{chainName}</span>
      </div>

      <div className={parts.hashRow}>
        <span className={parts.hashText}>{txHash}</span>
        <button type="button" className={parts.hashLink} onClick={onViewExplorer}>
          view explore <FiArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>

      <PrimaryButton type="button" shape="octagon" fullWidth onClick={onViewCollection}>
        View Collection
      </PrimaryButton>
    </StatusModal>
  )
}

export default AlreadyRecordedModal
