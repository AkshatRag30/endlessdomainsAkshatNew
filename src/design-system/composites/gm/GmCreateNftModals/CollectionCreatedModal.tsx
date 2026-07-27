import { FiCheck, FiInfo, FiArrowUpRight, FiRotateCcw } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { StatusModal } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'

export interface CollectionCreatedModalProps {
  txHash: string
  onClose: () => void
  onCreateAnother?: () => void
  onViewCollection?: () => void
  onViewExplorer?: () => void
}

export function CollectionCreatedModal({
  txHash,
  onClose,
  onCreateAnother,
  onViewCollection,
  onViewExplorer,
}: CollectionCreatedModalProps) {
  return (
    <StatusModal
      tone="success"
      icon={<FiCheck size={24} aria-hidden="true" color="var(--color-white-primary)" />}
      heading="Collection Created"
      description="Your collection is live on-chain."
      ariaLabelledBy="collection-created-heading"
      onClose={onClose}
    >
      <div className={parts.notice} role="status">
        <FiInfo size={18} aria-hidden="true" className={parts.noticeIcon} />
        <p className={parts.noticeText}>
          This counts toward your NFT Activity score (up to 125 pts) at tonight&apos;s reputation update — it won&apos;t move instantly.
        </p>
      </div>

      <div className={parts.hashRow}>
        <span className={parts.hashText}>{txHash}</span>
        <button type="button" className={parts.hashLink} onClick={onViewExplorer}>
          view explore <FiArrowUpRight size={14} aria-hidden="true" />
        </button>
      </div>

      <div className={parts.actionsRow}>
        <button type="button" className={parts.linkButton} onClick={onCreateAnother}>
          <FiRotateCcw size={14} aria-hidden="true" />
          Create Another
        </button>
        <PrimaryButton type="button" shape="octagon" onClick={onViewCollection}>
          View Collection
        </PrimaryButton>
      </div>
    </StatusModal>
  )
}

export default CollectionCreatedModal
