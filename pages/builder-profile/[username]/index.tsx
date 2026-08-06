import { useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { BuilderHero } from '@/design-system/composites/builder-profile/BuilderHero'
import { ProjectsSection } from '@/design-system/composites/builder-profile/ProjectsSection'
import { AchievementsSection } from '@/design-system/composites/builder-profile/AchievementsSection'
import { BuilderSidebar } from '@/design-system/composites/builder-profile/BuilderSidebar'
import type {
  BuilderProfileHero,
  BuilderProject,
  BuilderAchievement,
  BuilderSocialLink,
} from '@/design-system/composites/builder-profile/types'
import styles from './builder-profile.module.scss'

// ── Placeholder data — replace with live reputation / project data once wired up ──

const HERO: BuilderProfileHero = {
  avatarSrc: '/builder-profile/avatar-placeholder.png',
  avatarAlt: "Erin Vetrovs's avatar",
  eyebrow: "Builder's Profile",
  name: 'Erin Vetrovs.og',
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

const PROJECTS: BuilderProject[] = [
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

const SKILLS = ['Solidity', 'Frontend', 'DeFi', 'Security', 'Rust', 'NFTs']

const SOCIAL_LINKS: BuilderSocialLink[] = [
  { id: 'facebook', platform: 'facebook', displayName: 'debielily', handle: 'debielily', href: 'https://facebook.com' },
  { id: 'twitter', platform: 'twitter', displayName: 'debielily', handle: 'debielily', href: 'https://x.com' },
  { id: 'instagram', platform: 'instagram', displayName: 'debielily', handle: 'debielily', href: 'https://instagram.com' },
  { id: 'linkedin', platform: 'linkedin', displayName: 'debielily', handle: 'debielily', href: 'https://linkedin.com' },
]

export default function BuilderProfilePage() {
  const router = useRouter()
  const { username } = router.query

  const handleShowMoreProjects = useCallback(() => {
    // TODO: wire up pagination once the projects API is connected
  }, [])

  const handleShowMoreAchievements = useCallback(() => {
    // TODO: wire up pagination once the achievements API is connected
  }, [])

  const pageTitle = typeof username === 'string' ? `${username} — Builder Profile — Endless Domains` : 'Builder Profile — Endless Domains'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="View this builder's on-chain reputation, shipped projects, and achievements." />
      </Head>
      <main className={styles.page}>
        <BuilderHero data={HERO} />
        <div className={styles.content}>
          <div className={styles.mainColumn}>
            <ProjectsSection projects={PROJECTS} onShowMore={handleShowMoreProjects} />
            <AchievementsSection
              achievements={ACHIEVEMENTS}
              subtitle="Derived from your confirmed on-chain activity — read-only"
              onShowMore={handleShowMoreAchievements}
            />
          </div>
          <BuilderSidebar
            skills={SKILLS}
            skillsNote="Chosen from a curated set — keeps profiles filterable."
            socialLinks={SOCIAL_LINKS}
          />
        </div>
      </main>
    </>
  )
}
