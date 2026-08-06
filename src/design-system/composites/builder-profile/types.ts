export type BuilderTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface BuilderHeroStat {
  id: string
  value: string
  unit?: string
  label: string
  /** 0-100, only rendered when present */
  progress?: number
  variant?: 'blue' | 'gold'
}

export interface BuilderProfileHero {
  avatarSrc: string
  avatarAlt: string
  eyebrow: string
  name: string
  tier: BuilderTier
  tierLabel: string
  tierIconSrc: string
  bio: string
  stats: BuilderHeroStat[]
  disclaimer: string
  profileUrl: string
}

export interface BuilderProjectLink {
  label: string
  href: string
  icon: 'repo' | 'live'
}

export interface BuilderProject {
  id: string
  title: string
  description: string
  links: BuilderProjectLink[]
}

export interface BuilderAchievement {
  id: string
  title: string
  subtitle: string
  badgeLabel: string
}

export type BuilderSocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin'

export interface BuilderSocialLink {
  id: string
  platform: BuilderSocialPlatform
  displayName: string
  handle: string
  href: string
}
