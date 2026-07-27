import { IoWarning } from 'react-icons/io5'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { StatusModal } from '@/design-system/primitives/StatusModal'

export interface SignatureCancelledModalProps {
  onClose: () => void
  onBackToPreviews?: () => void
}

export function SignatureCancelledModal({ onClose, onBackToPreviews }: SignatureCancelledModalProps) {
  return (
    <StatusModal
      tone="error"
      icon={<IoWarning size={24} aria-hidden="true" color="white" />}
      heading="Signature Request Cancelled"
      description="You cancelled the request in your wallet. Nothing was submitted and no gas was spent."
      ariaLabelledBy="signature-cancelled-heading"
      onClose={onClose}
    >
      <PrimaryButton type="button" shape="octagon" fullWidth onClick={onBackToPreviews}>
        Back To Previews
      </PrimaryButton>
    </StatusModal>
  )
}

export default SignatureCancelledModal
