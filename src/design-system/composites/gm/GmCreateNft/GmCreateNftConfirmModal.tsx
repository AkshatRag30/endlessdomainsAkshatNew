import { FiInfo } from 'react-icons/fi'
import { StatusModal } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'

interface GmCreateNftConfirmModalProps {
  onClose: () => void
}

export function GmCreateNftConfirmModal({ onClose }: GmCreateNftConfirmModalProps) {
  return (
    <StatusModal
      tone="pending"
      icon={<span className={parts.spinner} aria-hidden="true" />}
      heading="Confirm In Your Wallet"
      description="A signature request was sent to your wallet. Nothing is submitted until you approve it."
      ariaLabelledBy="confirm-wallet-heading"
      onClose={onClose}
      narrowDescription
    >
      <div className={parts.notice} role="status">
        <FiInfo size={18} aria-hidden="true" className={parts.noticeIcon} />
        <p className={parts.noticeText}>
          Complete this within 10 minutes of signing — after that the transaction can no longer be verified and you&apos;ll need to restart.
        </p>
      </div>
    </StatusModal>
  )
}

export default GmCreateNftConfirmModal
