export interface Author {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
  twitter?: string
  linkedin?: string
}

export const AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Endless Domains',
    role: 'Editorial Team',
    avatar: '/new-assets/endlessmonogramblog.svg',
    bio: 'The Endless Domains editorial team covers product updates, ecosystem news, and educational content about multi-chain domain infrastructure and Web3 identity.',
    twitter: 'https://twitter.com/EndlessDomains',
    linkedin: 'https://linkedin.com/company/endless-domains',
  },
  {
    id: 'author-2',
    name: 'Endless Domains',
    role: 'Editorial Team',
    avatar: '/new-assets/endlessmonogramblog.svg',
    bio: 'The Endless Domains editorial team covers product updates, ecosystem news, and educational content about multi-chain domain infrastructure and Web3 identity.',
    twitter: 'https://twitter.com/EndlessDomains',
    linkedin: 'https://linkedin.com/company/endless-domains',
  },
  {
    id: 'author-3',
    name: 'Endless Domains',
    role: 'Editorial Team',
    avatar: '/new-assets/endlessmonogramblog.svg',
    bio: 'The Endless Domains editorial team covers product updates, ecosystem news, and educational content about multi-chain domain infrastructure and Web3 identity.',
    twitter: 'https://twitter.com/EndlessDomains',
    linkedin: 'https://linkedin.com/company/endless-domains',
  },
  {
    id: 'author-4',
    name: 'Endless Domains',
    role: 'Editorial Team',
    avatar: '/new-assets/endlessmonogramblog.svg',
    bio: 'The Endless Domains editorial team covers product updates, ecosystem news, and educational content about multi-chain domain infrastructure and Web3 identity.',
    twitter: 'https://twitter.com/EndlessDomains',
    linkedin: 'https://linkedin.com/company/endless-domains',
  },
  {
    id: 'author-5',
    name: 'Endless Domains',
    role: 'Editorial Team',
    avatar: '/new-assets/endlessmonogramblog.svg',
    bio: 'The Endless Domains editorial team covers product updates, ecosystem news, and educational content about multi-chain domain infrastructure and Web3 identity.',
    twitter: 'https://twitter.com/EndlessDomains',
    linkedin: 'https://linkedin.com/company/endless-domains',
  },
  {
    id: 'author-6',
    name: 'Endless Domains',
    role: 'Editorial Team',
    avatar: '/new-assets/endlessmonogramblog.svg',
    bio: 'The Endless Domains editorial team covers product updates, ecosystem news, and educational content about multi-chain domain infrastructure and Web3 identity.',
    twitter: 'https://twitter.com/EndlessDomains',
    linkedin: 'https://linkedin.com/company/endless-domains',
  },
]

export const getAuthorById = (id: string): Author | undefined =>
  AUTHORS.find(a => a.id === id)
