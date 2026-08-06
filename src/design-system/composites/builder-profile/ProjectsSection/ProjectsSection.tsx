import Link from 'next/link'
import { FiGithub, FiRadio, FiPlus } from 'react-icons/fi'
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
  /** Owner view — shows the "Create project" control in the section header */
  editable?: boolean
  onCreateProject?: () => void
}

export default function ProjectsSection({
  projects,
  onShowMore,
  showMoreVisible = true,
  editable = false,
  onCreateProject,
}: ProjectsSectionProps) {
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
            <h3 className={styles.cardTitle}>{project.title}</h3>
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
