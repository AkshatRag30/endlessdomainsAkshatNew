import Link from 'next/link'
import { useCallback } from 'react'
import { FiGithub, FiRadio, FiTrash2 } from 'react-icons/fi'
import type { IconType } from 'react-icons'

import type { BuilderProject } from '../../types'
import { ModalShell } from '../shared/ModalShell'
import styles from './RemoveProjectModal.module.scss'

const LINK_ICON: Record<'repo' | 'live', IconType> = {
  repo: FiGithub,
  live: FiRadio,
}

interface RemoveProjectModalProps {
  project: BuilderProject
  onClose: () => void
  onConfirmRemove?: (projectId: string) => void
}

export default function RemoveProjectModal({ project, onClose, onConfirmRemove }: RemoveProjectModalProps) {
  const handleRemove = useCallback(() => {
    onConfirmRemove?.(project.id)
    onClose()
  }, [onConfirmRemove, onClose, project.id])

  return (
    <ModalShell
      title="Project"
      onClose={onClose}
      headerAction={
        <button type="button" className={styles.removeBtn} onClick={handleRemove}>
          <FiTrash2 aria-hidden="true" />
          <span>Remove</span>
        </button>
      }
    >
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDescription}>{project.description}</p>
        {project.links.length > 0 && (
          <div className={styles.linkRow}>
            {project.links.map(link => {
              const LinkIcon = LINK_ICON[link.icon]
              return (
                <Link key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.linkPill}>
                  <LinkIcon aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </ModalShell>
  )
}
