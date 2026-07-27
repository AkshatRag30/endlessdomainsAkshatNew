import { FiRotateCcw } from 'react-icons/fi'
import { IoWarning } from 'react-icons/io5'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { StatusModal } from '@/design-system/primitives/StatusModal'
import parts from '@/design-system/primitives/StatusModal/StatusModalParts.module.scss'

export interface NetworkUnavailableModalProps {
  chainName?: string
  onClose: () => void
  onChangeChain?: () => void
  onTryAgain?: () => void
}

export function NetworkUnavailableModal({
  chainName = 'Base',
  onClose,
  onChangeChain,
  onTryAgain,
}: NetworkUnavailableModalProps) {
  return (
    <StatusModal
      tone="error"
      icon={<IoWarning size={24} aria-hidden="true" color="white" />}
      heading="Network Unavailable"
      description={<>We couldn&apos;t reach {chainName} right now. This is usually temporary — check your connection or try again shortly.</>}
      ariaLabelledBy="network-unavailable-heading"
      onClose={onClose}
    >
      <div className={parts.actionsRow}>
        <button type="button" className={parts.linkButton} onClick={onChangeChain}>
          <FiRotateCcw size={14} aria-hidden="true" />
          Change Chain
        </button>
        <PrimaryButton type="button" shape="octagon" onClick={onTryAgain}>
          Try Again
        </PrimaryButton>
      </div>
    </StatusModal>
  )
}

export default NetworkUnavailableModal
