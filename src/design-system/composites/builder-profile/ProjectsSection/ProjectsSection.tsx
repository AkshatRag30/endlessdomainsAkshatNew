import Link from 'next/link'
import { useCallback } from 'react'
import type { MouseEvent } from 'react'
import { FiGithub, FiRadio, FiPlus, FiTrash2 } from 'react-icons/fi'
import type { IconType } from 'react-icons'

import type { BuilderProject } from '../types'
import styles from './ProjectsSection.module.scss'

const LINK_ICON: Record<'repo' | 'live', IconType> = {
  repo: FiGithub,
  live: FiRadio,
}

interface ProjectsSectionProps {
  projects: BuilderProject[]
  onShowMore?: () => void
  showMoreVisible?: boolean
  /** Owner view — shows the "Create project" control in the section header and a remove icon per card */
  editable?: boolean
  onCreateProject?: () => void
  onRemoveProject?: (projectId: string) => void
}

export default function ProjectsSection({
  projects,
  onShowMore,
  showMoreVisible = true,
  editable = false,
  onCreateProject,
  onRemoveProject,
}: ProjectsSectionProps) {
  const handleRemoveClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const projectId = e.currentTarget.dataset.projectId
      if (projectId) onRemoveProject?.(projectId)
    },
    [onRemoveProject],
  )

  return (
    <section className={styles.section} aria-labelledby="builder-projects-heading">
      <div className={styles.headingRow}>
        <h2 id="builder-projects-heading" className={styles.heading}>
          Projects
        </h2>
        {editable && (
          <div className={styles.createControl}>
            <button type="button" className={styles.createIconBtn} onClick={onCreateProject} aria-label="Create project">
              <FiPlus aria-hidden="true" />
            </button>
            <button type="button" className={styles.createLabelBtn} onClick={onCreateProject}>
              Create project
            </button>
          </div>
        )}
      </div>

      <div className={styles.list}>
        {projects.map((project, i) => (
          <div key={project.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              {editable && (
                <button
                  type="button"
                  className={styles.deleteBtn}
                  data-project-id={project.id}
                  onClick={handleRemoveClick}
                  aria-label={`Remove ${project.title}`}
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              )}
            </div>
            <p className={styles.cardDescription}>{project.description}</p>
            {project.links.length > 0 && (
              <div className={styles.linkRow}>
                {project.links.map(link => {
                  const LinkIcon = LINK_ICON[link.icon]
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkPill}
                    >
                      <LinkIcon aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
            {i < projects.length - 1 && <div className={styles.divider} aria-hidden="true" />}
          </div>
        ))}
      </div>

      {showMoreVisible && (
        <button type="button" className={styles.showMoreBtn} onClick={onShowMore}>
          Show more
        </button>
      )}
    </section>
  )
}
