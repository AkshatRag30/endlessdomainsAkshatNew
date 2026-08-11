import { useCallback, useId, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent } from 'react'
import { FiArrowRight, FiX } from 'react-icons/fi'

import { TextInput } from '@/design-system/primitives/input/TextInput'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { ModalShell } from '../shared/ModalShell'
import styles from './EditProfileModal.module.scss'

export interface EditProfileFormValues {
  username: string
  bio: string
  skills: string[]
  avatarFile: File | null
  published: boolean
}

interface EditProfileModalProps {
  initialValues?: Partial<Pick<EditProfileFormValues, 'username' | 'bio' | 'skills' | 'published'>>
  onClose: () => void
  onSave?: (values: EditProfileFormValues) => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function EditProfileModal({ initialValues, onClose, onSave }: EditProfileModalProps) {
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [username, setUsername] = useState(initialValues?.username ?? '')
  const [bio, setBio] = useState(initialValues?.bio ?? '')
  const [skills, setSkills] = useState<string[]>(initialValues?.skills ?? [])
  const [skillDraft, setSkillDraft] = useState('')
  const [published, setPublished] = useState(initialValues?.published ?? true)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleUsernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value), [])
  const handleBioChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setBio(e.target.value), [])
  const handleSkillDraftChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setSkillDraft(e.target.value), [])

  const commitSkillDraft = useCallback(() => {
    const trimmed = skillDraft.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed])
    }
    setSkillDraft('')
  }, [skillDraft, skills])

  const handleSkillDraftKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        commitSkillDraft()
      } else if (e.key === 'Backspace' && !skillDraft && skills.length > 0) {
        setSkills(prev => prev.slice(0, -1))
      }
    },
    [commitSkillDraft, skillDraft, skills],
  )

  const handleRemoveSkillClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const skill = e.currentTarget.dataset.skill
    if (skill) setSkills(prev => prev.filter(s => s !== skill))
  }, [])

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelected = useCallback((file: File | null | undefined) => {
    if (file && ACCEPTED_TYPES.includes(file.type)) {
      setAvatarFile(file)
    }
  }, [])

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => handleFileSelected(e.target.files?.[0]),
    [handleFileSelected],
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelected(e.dataTransfer.files?.[0])
    },
    [handleFileSelected],
  )

  const handlePublishedChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setPublished(e.target.checked), [])

  const handleSubmit = useCallback(() => {
    onSave?.({ username, bio, skills, avatarFile, published })
    onClose()
  }, [onSave, onClose, username, bio, skills, avatarFile, published])

  return (
    <ModalShell title="Profile" onClose={onClose}>
      <div className={styles.fields}>
        <TextInput
          id="username"
          label="Username"
          placeholder="Enter username"
          value={username}
          onChange={handleUsernameChange}
          boldLabel={false}
        />

        <TextInput id="bio" label="Bio" placeholder="Write" value={bio} onChange={handleBioChange} boldLabel={false} />

        <div className={styles.skillsField}>
          <label className={styles.skillsLabel} htmlFor="skillDraft">
            Skills
          </label>
          <div className={styles.skillsInputRow}>
            {skills.map(skill => (
              <span key={skill} className={styles.skillBadge}>
                {skill}
                <button
                  type="button"
                  className={styles.skillRemoveBtn}
                  data-skill={skill}
                  onClick={handleRemoveSkillClick}
                  aria-label={`Remove ${skill}`}
                >
                  <FiX aria-hidden="true" />
                </button>
              </span>
            ))}
            <input
              id="skillDraft"
              type="text"
              className={styles.skillDraftInput}
              value={skillDraft}
              onChange={handleSkillDraftChange}
              onKeyDown={handleSkillDraftKeyDown}
              onBlur={commitSkillDraft}
              placeholder={skills.length === 0 ? 'Add a skill and press Enter' : ''}
            />
          </div>
        </div>

        <div className={styles.avatarField}>
          <label className={styles.skillsLabel} htmlFor={fileInputId}>
            Upload avatar
          </label>
          <div
            className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileInputChange}
              className={styles.hiddenFileInput}
            />
            {avatarFile ? (
              <p className={styles.dropzoneTitle}>{avatarFile.name}</p>
            ) : (
              <p className={styles.dropzoneTitle}>
                Drop your files here or{' '}
                <button type="button" className={styles.dropzoneLink} onClick={handleBrowseClick}>
                  Click to upload (JPEG/PNG/WebP/GIF)
                </button>
              </p>
            )}
            <p className={styles.dropzoneSubtitle}>Maximum size: 5MB</p>
          </div>
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={published}
            onChange={handlePublishedChange}
            className={styles.checkboxInput}
          />
          <span>Published</span>
        </label>
      </div>

      <PrimaryButton icon={<FiArrowRight />} iconPosition="right" onClick={handleSubmit}>
        Update
      </PrimaryButton>
    </ModalShell>
  )
}
