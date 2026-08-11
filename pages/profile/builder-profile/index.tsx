import { useCallback, useState } from 'react'
import Head from 'next/head'

import { BuilderHero } from '@/design-system/composites/builder-profile/BuilderHero'
import { ProjectsSection } from '@/design-system/composites/builder-profile/ProjectsSection'
import { AchievementsSection } from '@/design-system/composites/builder-profile/AchievementsSection'
import { BuilderSidebar } from '@/design-system/composites/builder-profile/BuilderSidebar'
import {
  EditProfileModal,
  EditSocialLinksModal,
  CreateProjectModal,
  RemoveProjectModal,
  type EditProfileFormValues,
  type SocialLinksFormValues,
  type CreateProjectFormValues,
} from '@/design-system/composites/builder-profile/modals'
import type {
  BuilderProfileHero,
  BuilderProject,
  BuilderProjectLink,
  BuilderAchievement,
  BuilderSocialLink,
} from '@/design-system/composites/builder-profile/types'
import styles from './builder-profile-owner.module.scss'

// ── Placeholder data — replace with the signed-in user's live profile data once wired up ──

const INITIAL_HERO: BuilderProfileHero = {
  avatarSrc: '/builder-profile/avatar-placeholder.png',
  avatarAlt: "Erin Vetrovs's avatar",
  eyebrow: "Builder's Profile",
  name: 'Erin Vetrovs',
  primaryDomain: 'Erin Vetrovs.og',
  tier: 'gold',
  tierLabel: 'Gold',
  tierIconSrc: '/builder-profile/tier-badge-gold.svg',
  bio: 'Smart-contract engineer building yield infra on Base. Ex-audit, now shipping.',
  stats: [
    { id: 'reputation', value: '742', unit: '/ 1000', label: 'Reputation', progress: 74.2, variant: 'blue' },
    { id: 'streak', value: '47', unit: 'days', label: 'GM streak', variant: 'blue' },
    { id: 'tier', value: 'Gold', label: 'Tier', variant: 'gold' },
  ],
  disclaimer: 'Reputation, tier and streak are read live from your reputation record — not editable here.',
  profileUrl: 'endless.domains/endlessid/yogesh.og',
}

const INITIAL_PROJECTS: BuilderProject[] = [
  {
    id: 'vault-router-1',
    title: 'Vault Router',
    description: 'Gas-optimized ERC-4626 aggregator routing deposits across yield vaults.',
    links: [
      { label: 'Repo', href: 'https://github.com', icon: 'repo' },
      { label: 'live', href: 'https://example.com', icon: 'live' },
    ],
  },
  {
    id: 'vault-router-2',
    title: 'Vault Router',
    description: 'Gas-optimized ERC-4626 aggregator routing deposits across yield vaults.',
    links: [
      { label: 'Repo', href: 'https://github.com', icon: 'repo' },
      { label: 'live', href: 'https://example.com', icon: 'live' },
    ],
  },
]

const ACHIEVEMENTS: BuilderAchievement[] = [
  { id: 'ach-1', title: 'Contract Deployed', subtitle: 'StakingPool.sol', badgeLabel: 'Base · verified' },
  { id: 'ach-2', title: 'NFT Collection', subtitle: 'Genesis Builders', badgeLabel: '412 minted' },
  { id: 'ach-3', title: 'Contract Deployed', subtitle: 'VaultRouter.sol', badgeLabel: 'Base · verified' },
  { id: 'ach-4', title: 'Contract Deployed', subtitle: 'StakingPool.sol', badgeLabel: 'Base · verified' },
]

const INITIAL_SKILLS = ['Solidity', 'Frontend', 'DeFi', 'Security', 'Rust', 'NFTs']

const SOCIAL_LINKS: BuilderSocialLink[] = [
  { id: 'facebook', platform: 'facebook', displayName: 'debielily', handle: 'debielily', href: 'https://facebook.com' },
  { id: 'twitter', platform: 'twitter', displayName: 'debielily', handle: 'debielily', href: 'https://x.com' },
  { id: 'instagram', platform: 'instagram', displayName: 'debielily', handle: 'debielily', href: 'https://instagram.com' },
  { id: 'linkedin', platform: 'linkedin', displayName: 'debielily', handle: 'debielily', href: 'https://linkedin.com' },
]

function buildProjectLinks(githubUrl: string, websiteUrl: string): BuilderProjectLink[] {
  const links: BuilderProjectLink[] = []
  if (githubUrl.trim()) links.push({ label: 'Repo', href: `http://${githubUrl.trim()}`, icon: 'repo' })
  if (websiteUrl.trim()) links.push({ label: 'live', href: `http://${websiteUrl.trim()}`, icon: 'live' })
  return links
}

export default function BuilderProfileOwnerPage() {
  const [heroProfile, setHeroProfile] = useState({
    name: INITIAL_HERO.name,
    bio: INITIAL_HERO.bio,
    avatarSrc: INITIAL_HERO.avatarSrc,
  })
  const [skills, setSkills] = useState(INITIAL_SKILLS)
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [socialLinksValues, setSocialLinksValues] = useState<SocialLinksFormValues | undefined>(undefined)

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false)
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
  const [removingProjectId, setRemovingProjectId] = useState<string | null>(null)

  const hero: BuilderProfileHero = { ...INITIAL_HERO, ...heroProfile }
  const removingProject = projects.find(project => project.id === removingProjectId) ?? null

  const handleEditUrl = useCallback(() => {
    // TODO: open the profile-URL edit modal once it's built
  }, [])

  const handleEditName = useCallback(() => setIsProfileModalOpen(true), [])
  const handleCloseProfileModal = useCallback(() => setIsProfileModalOpen(false), [])

  const handleSaveProfile = useCallback((values: EditProfileFormValues) => {
    setHeroProfile(prev => ({
      name: values.username.trim() || prev.name,
      bio: values.bio.trim() || prev.bio,
      avatarSrc: values.avatarFile ? URL.createObjectURL(values.avatarFile) : prev.avatarSrc,
    }))
    setSkills(values.skills)
  }, [])

  const handleEditLinks = useCallback(() => setIsSocialModalOpen(true), [])
  const handleCloseSocialModal = useCallback(() => setIsSocialModalOpen(false), [])

  const handleSaveSocialLinks = useCallback((values: SocialLinksFormValues) => {
    setSocialLinksValues(values)
  }, [])

  const handleCreateProject = useCallback(() => setIsCreateProjectModalOpen(true), [])
  const handleCloseCreateProjectModal = useCallback(() => setIsCreateProjectModalOpen(false), [])

  const handleCreateProjectSubmit = useCallback((values: CreateProjectFormValues) => {
    setProjects(prev => [
      ...prev,
      {
        id: `project-${prev.length}-${values.title.trim().toLowerCase().replace(/\s+/g, '-')}`,
        title: values.title.trim(),
        description: values.description.trim(),
        links: buildProjectLinks(values.githubUrl, values.websiteUrl),
      },
    ])
  }, [])

  const handleOpenRemoveProjectModal = useCallback((projectId: string) => setRemovingProjectId(projectId), [])
  const handleCloseRemoveProjectModal = useCallback(() => setRemovingProjectId(null), [])

  const handleConfirmRemoveProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId))
  }, [])

  const handleShowMoreProjects = useCallback(() => {
    // TODO: wire up pagination once the projects API is connected
  }, [])

  const handleShowMoreAchievements = useCallback(() => {
    // TODO: wire up pagination once the achievements API is connected
  }, [])

  return (
    <>
      <Head>
        <title>Edit Builder Profile — Endless Domains</title>
        <meta name="description" content="Manage your builder profile — edit your projects, achievements, and skills." />
      </Head>
      <main className={styles.page}>
        <BuilderHero data={hero} editable onEditUrl={handleEditUrl} onEditName={handleEditName} />
        <div className={styles.content}>
          <div className={styles.mainColumn}>
            <ProjectsSection
              projects={projects}
              onShowMore={handleShowMoreProjects}
              editable
              onCreateProject={handleCreateProject}
              onRemoveProject={handleOpenRemoveProjectModal}
            />
            <AchievementsSection
              achievements={ACHIEVEMENTS}
              subtitle="Derived from your confirmed on-chain activity — read-only"
              onShowMore={handleShowMoreAchievements}
            />
          </div>
          <BuilderSidebar
            skills={skills}
            skillsNote="Chosen from a curated set — keeps profiles filterable."
            socialLinks={SOCIAL_LINKS}
            editable
            onEditLinks={handleEditLinks}
          />
        </div>
      </main>

      {isProfileModalOpen && (
        <EditProfileModal
          initialValues={{ username: hero.name, bio: hero.bio, skills, published: true }}
          onClose={handleCloseProfileModal}
          onSave={handleSaveProfile}
        />
      )}

      {isSocialModalOpen && (
        <EditSocialLinksModal
          initialValues={socialLinksValues}
          onClose={handleCloseSocialModal}
          onSave={handleSaveSocialLinks}
        />
      )}

      {isCreateProjectModalOpen && (
        <CreateProjectModal onClose={handleCloseCreateProjectModal} onCreate={handleCreateProjectSubmit} />
      )}

      {removingProject && (
        <RemoveProjectModal
          project={removingProject}
          onClose={handleCloseRemoveProjectModal}
          onConfirmRemove={handleConfirmRemoveProject}
        />
      )}
    </>
  )
}
