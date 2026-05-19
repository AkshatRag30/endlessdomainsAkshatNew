export interface ProviderTabItem {
  id: string
  label: string
  provider: string
  icon?: string
}

export interface DomainResult {
  id: string
  name: string
  tld: string
  status: 'available' | 'taken'
  price?: number
  expiry?: string
  provider: string
  providerIcons: string[]
  domainName?: string
  domainProvider?: string
  redirectUrl?: string
  isInCart?: boolean
}

export interface SearchSectionProps {
  query?: string
  className?: string
}

// ── My Domains page types ──────────────────────────────────────────────────────

export type ViewMode = 'grid' | 'list'

export type DomainStatus = 'unstoppable' | 'ens' | 'arbitrum' | 'bonfida' | 'tezos' | 'aptos'

export type DomainChain = 'polygon' | 'ethereum' | 'solana' | 'tezos' | 'aptos'

export interface DomainItem {
  id: string
  name: string
  tld: string
  chain: DomainChain
  status: DomainStatus
  expiryDate: string
  isListed: boolean
  isConfigured: boolean
}

export interface DomainFilter {
  search: string
  tlds: DomainStatus[]
}

export interface DomainStats {
  total: number
  expiringSoon: number
  listedOnMarketplace: number
  notConfigured: number
}
