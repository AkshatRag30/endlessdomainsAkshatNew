export interface Category {
  id: string
  name: string
  slug: string
}

export const CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'All', slug: 'all' },
  { id: 'cat-identity', name: 'Identity', slug: 'identity' },
  { id: 'cat-wallets', name: 'Wallets', slug: 'wallets' },
  { id: 'cat-events', name: 'Events', slug: 'events' },
  { id: 'cat-tutorials', name: 'Tutorials', slug: 'tutorials' },
  { id: 'cat-ton', name: 'TON', slug: 'ton' },
  { id: 'cat-defi', name: 'DeFi', slug: 'defi' },
  { id: 'cat-ecosystem', name: 'Ecosystem', slug: 'ecosystem' },
  { id: 'cat-partnerships', name: 'Partnerships', slug: 'partnerships' },
  { id: 'cat-community', name: 'Community', slug: 'community' },
]

export const getCategoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find(c => c.slug === slug)
