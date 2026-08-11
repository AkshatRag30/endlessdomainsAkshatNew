import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'
import { FiArrowRight } from 'react-icons/fi'

import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { UrlField } from '../shared/UrlField'
import { ModalShell } from '../shared/ModalShell'
import styles from './EditSocialLinksModal.module.scss'

export interface SocialLinksFormValues {
  twitter: string
  farcaster: string
  telegram: string
  discord: string
  linkedin: string
}

interface EditSocialLinksModalProps {
  initialValues?: Partial<SocialLinksFormValues>
  onClose: () => void
  onSave?: (values: SocialLinksFormValues) => void
}

const EMPTY_VALUES: SocialLinksFormValues = {
  twitter: '',
  farcaster: '',
  telegram: '',
  discord: '',
  linkedin: '',
}

export default function EditSocialLinksModal({ initialValues, onClose, onSave }: EditSocialLinksModalProps) {
  const [values, setValues] = useState<SocialLinksFormValues>({ ...EMPTY_VALUES, ...initialValues })

  const handleChange = useCallback(
    (field: keyof SocialLinksFormValues) => (e: ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({ ...prev, [field]: e.target.value }))
    },
    [],
  )

  const handleSubmit = useCallback(() => {
    onSave?.(values)
    onClose()
  }, [onSave, onClose, values])

  return (
    <ModalShell title="Social Links" onClose={onClose}>
      <div className={styles.fields}>
        <UrlField id="twitter" label="Twitter" value={values.twitter} onChange={handleChange('twitter')} />
        <UrlField id="farcaster" label="Farcaster" value={values.farcaster} onChange={handleChange('farcaster')} />
        <UrlField id="telegram" label="Telegram" value={values.telegram} onChange={handleChange('telegram')} />
        <UrlField id="discord" label="Discord" value={values.discord} onChange={handleChange('discord')} />
        <UrlField id="linkedin" label="LinkedIn" value={values.linkedin} onChange={handleChange('linkedin')} />
      </div>
      <PrimaryButton icon={<FiArrowRight />} iconPosition="right" onClick={handleSubmit}>
        Save Links
      </PrimaryButton>
    </ModalShell>
  )
}
