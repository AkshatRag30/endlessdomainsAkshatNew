import { useCallback, useState } from 'react'
import type { ChangeEvent } from 'react'
import { FiArrowRight } from 'react-icons/fi'

import { TextInput } from '@/design-system/primitives/input/TextInput'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { UrlField } from '../shared/UrlField'
import { ModalShell } from '../shared/ModalShell'
import styles from './CreateProjectModal.module.scss'

export interface CreateProjectFormValues {
  title: string
  description: string
  githubUrl: string
  websiteUrl: string
}

interface CreateProjectModalProps {
  onClose: () => void
  onCreate?: (values: CreateProjectFormValues) => void
}

const EMPTY_VALUES: CreateProjectFormValues = {
  title: '',
  description: '',
  githubUrl: '',
  websiteUrl: '',
}

export default function CreateProjectModal({ onClose, onCreate }: CreateProjectModalProps) {
  const [values, setValues] = useState<CreateProjectFormValues>(EMPTY_VALUES)

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, title: e.target.value }))
  }, [])

  const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, description: e.target.value }))
  }, [])

  const handleGithubUrlChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, githubUrl: e.target.value }))
  }, [])

  const handleWebsiteUrlChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, websiteUrl: e.target.value }))
  }, [])

  const canSubmit = values.title.trim().length > 0

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return
    onCreate?.(values)
    onClose()
  }, [canSubmit, onCreate, onClose, values])

  return (
    <ModalShell title="Project" onClose={onClose}>
      <div className={styles.fields}>
        <TextInput
          id="projectTitle"
          label="Title"
          placeholder="Enter title"
          value={values.title}
          onChange={handleTitleChange}
          boldLabel={false}
        />
        <TextInput
          id="projectDescription"
          label="Description"
          placeholder="Write"
          value={values.description}
          onChange={handleDescriptionChange}
          boldLabel={false}
        />
        <UrlField id="githubUrl" label="Github URL" value={values.githubUrl} onChange={handleGithubUrlChange} />
        <UrlField id="websiteUrl" label="Website URL" value={values.websiteUrl} onChange={handleWebsiteUrlChange} />
      </div>
      <PrimaryButton icon={<FiArrowRight />} iconPosition="right" onClick={handleSubmit} disabled={!canSubmit}>
        Create Project
      </PrimaryButton>
    </ModalShell>
  )
}
