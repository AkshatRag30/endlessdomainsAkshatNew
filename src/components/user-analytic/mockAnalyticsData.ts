// ── Types for the Figma analytics design ─────────────────────────────────────

export type DomainStatus = 'Active' | 'Processing' | 'Complete' | 'Cancel' | 'Pending' | 'Expired'
export type AnalyticsProvider =
  | 'Unstoppable'
  | 'Freename'
  | 'ENS'
  | 'Arbitrum'
  | 'Bonfida'
  | 'Tezos'
  | 'Aptos'
  | 'Ton'
  | 'Box'
  | 'Starknet'

export type OrderStatusFilter = 'All Status' | 'Actives' | 'Expired' | 'Pending'
export type TimePeriod = 'All Time' | 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'Last Year'
export type AnalyticsTab = 'provider-distribution' | 'portfolio-value' | 'portfolio-breakdown'

export interface AnalyticsDomain {
  id: string
  domainName: string
  status: DomainStatus
  provider: AnalyticsProvider
  price: number
  registrationDate: string // ISO date string e.g. '2026-05-29'
}

export interface ProviderStat {
  provider: AnalyticsProvider
  iconSrc: string
  count: number
  percentage: number
  color: string
  pbColor: string // blue-shade used in Portfolio Breakdown donut so all segments stay in the blue palette
}

// ── Static option arrays (filter bar) ────────────────────────────────────────

export const ORDER_STATUS_OPTIONS: OrderStatusFilter[] = ['All Status', 'Actives', 'Expired', 'Pending']
export const TIME_PERIOD_OPTIONS: TimePeriod[] = ['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year']

// Filter bar option types (matches Figma filter bar: TLD, Provider, Expiry, Renewal Type, Domain Type, Domain Listing)
export type TLDFilter = 'All' | '.crypto' | '.nft' | '.wallet' | '.blockchain' | '.eth' | '.tez' | '.arb' | '.sol' | '.apt' | '.ton' | '.box' | '.stark' | '.web3'
export type ProviderFilter = 'All' | 'Unstoppable' | 'Freename' | 'ENS' | 'Arbitrum' | 'Bonfida' | 'Tezos' | 'Aptos' | 'Ton' | 'Box' | 'Starknet'
export type ExpiryFilter = 'All' | '< 30 Days' | '30–90 Days' | '> 90 Days' | 'Expired'
export type RenewalTypeFilter = 'All' | 'Auto-Renew' | 'Manual'
export type DomainTypeFilter = 'All' | 'Primary' | 'Subdomain'
export type DomainListingFilter = 'All' | 'Listed' | 'Not Listed'

export const TLD_OPTIONS: TLDFilter[] = ['All', '.crypto', '.nft', '.wallet', '.blockchain', '.eth', '.tez', '.arb', '.sol', '.apt', '.ton', '.box', '.stark', '.web3']
export const PROVIDER_OPTIONS: ProviderFilter[] = ['All', 'Unstoppable', 'Freename', 'ENS', 'Arbitrum', 'Bonfida', 'Tezos', 'Aptos', 'Ton', 'Box', 'Starknet']
export const EXPIRY_OPTIONS: ExpiryFilter[] = ['All', '< 30 Days', '30–90 Days', '> 90 Days', 'Expired']
export const RENEWAL_TYPE_OPTIONS: RenewalTypeFilter[] = ['All', 'Auto-Renew', 'Manual']
export const DOMAIN_TYPE_OPTIONS: DomainTypeFilter[] = ['All', 'Primary', 'Subdomain']
export const DOMAIN_LISTING_OPTIONS: DomainListingFilter[] = ['All', 'Listed', 'Not Listed']

// ── Shared filter state (lifted to page level, passed to FilterBar + tabs) ────

export interface AnalyticsFilterState {
  startDate: string
  endDate: string
  tld: TLDFilter
  provider: ProviderFilter
  expiry: ExpiryFilter
  renewalType: RenewalTypeFilter
  domainType: DomainTypeFilter
  domainListing: DomainListingFilter
}

export const DEFAULT_FILTER_STATE: AnalyticsFilterState = {
  startDate: '',
  endDate: '',
  tld: 'All',
  provider: 'All',
  expiry: 'All',
  renewalType: 'All',
  domainType: 'All',
  domainListing: 'All',
}

// ── Provider Distribution filter state ────────────────────────────────────────

export type PDOrderStatusFilter = 'All Status' | 'Active' | 'Expired' | 'Pending'
export type PDTimePeriodFilter = 'All Time' | 'This Week' | 'This Month' | 'This Year'

export interface PDFilterState {
  startDate: string
  endDate: string
  orderStatus: PDOrderStatusFilter
  timePeriod: PDTimePeriodFilter
}

export const DEFAULT_PD_FILTER_STATE: PDFilterState = {
  startDate: '',
  endDate: '',
  orderStatus: 'All Status',
  timePeriod: 'All Time',
}

// Parse DD/MM/YYYY (MiniCalendar format) → Date
function parseDMY(str: string): Date | null {
  if (!str) return null
  const [d, m, y] = str.split('/')
  if (!d || !m || !y) return null
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

export function applyPDFilter(domains: AnalyticsDomain[], filter: PDFilterState): AnalyticsDomain[] {
  return domains.filter(domain => {
    // Status filter
    if (filter.orderStatus !== 'All Status' && domain.status !== filter.orderStatus) return false

    // Date range filter (from MiniCalendar)
    const regDate = new Date(domain.registrationDate)
    const startDate = parseDMY(filter.startDate)
    const endDate = parseDMY(filter.endDate)
    if (startDate && regDate < startDate) return false
    if (endDate && regDate > endDate) return false

    // Time period filter (relative to current date)
    if (filter.timePeriod !== 'All Time') {
      const now = new Date()
      const cutoff = new Date(now)
      if (filter.timePeriod === 'This Week') cutoff.setDate(now.getDate() - 7)
      else if (filter.timePeriod === 'This Month') cutoff.setDate(1)       // first of current month
      else if (filter.timePeriod === 'This Year') cutoff.setMonth(0, 1)    // Jan 1 of current year
      cutoff.setHours(0, 0, 0, 0)
      if (regDate < cutoff) return false
    }

    return true
  })
}

// ── Portfolio Value computed stats ────────────────────────────────────────────

export interface PVStatsResult {
  totalValue: number
  totalDomains: number
  totalProviders: number
  newDomainsCount: number
  newDomainsPeriod: string
  avgValue: number
  barProviders: PVBarProvider[]
  barMax: number
  sparklineData: Array<{ i: number; v: number }>
}

export function computePVStats(domains: AnalyticsDomain[], filter: PDFilterState): PVStatsResult {
  const totalValue = domains.reduce((sum, d) => sum + d.price, 0)
  const totalDomains = domains.length
  const totalProviders = new Set(domains.map(d => d.provider)).size
  const avgValue = totalDomains > 0 ? Math.round(totalValue / totalDomains) : 0

  // New domains badge — period label adapts to the active time filter
  const now = new Date()
  let newCutoff = new Date(now.getFullYear(), now.getMonth(), 1)
  let newDomainsPeriod = 'this month'
  if (filter.timePeriod === 'This Week') {
    newCutoff = new Date(now)
    newCutoff.setDate(now.getDate() - 7)
    newCutoff.setHours(0, 0, 0, 0)
    newDomainsPeriod = 'this week'
  } else if (filter.timePeriod === 'This Year') {
    newCutoff = new Date(now.getFullYear(), 0, 1)
    newDomainsPeriod = 'this year'
  }
  const newDomainsCount = domains.filter(d => new Date(d.registrationDate) >= newCutoff).length

  // Bar chart: sum domain prices per provider
  const barMap = new Map<string, { value: number; domains: number }>()
  domains.forEach(d => {
    const key = d.provider.toLowerCase()
    const cur = barMap.get(key) ?? { value: 0, domains: 0 }
    barMap.set(key, { value: cur.value + d.price, domains: cur.domains + 1 })
  })
  const barProviders = pvBarProviders
    .map(p => ({ ...p, value: barMap.get(p.key)?.value ?? 0, domains: barMap.get(p.key)?.domains ?? 0 }))
    .filter(p => p.domains > 0)
  const barMax = barProviders.length > 0 ? Math.max(...barProviders.map(p => p.value)) : 1000

  // Sparkline: 13 monthly cumulative value checkpoints ending at now
  const sparklineData: Array<{ i: number; v: number }> = []
  for (let i = 0; i <= 12; i++) {
    const checkpoint = new Date(now.getFullYear(), now.getMonth() - (12 - i) + 1, 1)
    const cumValue = domains
      .filter(d => new Date(d.registrationDate) < checkpoint)
      .reduce((sum, d) => sum + d.price, 0)
    sparklineData.push({ i, v: cumValue })
  }
  sparklineData[12] = { i: 12, v: totalValue } // final point = full filtered total

  return { totalValue, totalDomains, totalProviders, newDomainsCount, newDomainsPeriod, avgValue, barProviders, barMax, sparklineData }
}

// Recompute per-provider counts + percentages from a (filtered) domain list
export function computeProviderStats(domains: AnalyticsDomain[]): ProviderStat[] {
  const total = domains.length
  if (total === 0) return []
  return mockProviderStats
    .map(stat => {
      const count = domains.filter(d => d.provider === stat.provider).length
      const percentage = Math.round((count / total) * 1000) / 10
      return { ...stat, count, percentage }
    })
    .filter(s => s.count > 0)
}

// Same as computeProviderStats but uses pbColor for the Portfolio Breakdown donut palette
export function computeBreakdownStats(domains: AnalyticsDomain[]): ProviderStat[] {
  const total = domains.length
  if (total === 0) return []
  return mockProviderStats
    .map(stat => {
      const count = domains.filter(d => d.provider === stat.provider).length
      const percentage = Math.round((count / total) * 1000) / 10
      return { ...stat, color: stat.pbColor, count, percentage }
    })
    .filter(s => s.count > 0)
}

// ── Portfolio Breakdown filter ─────────────────────────────────────────────────

// Derives expiry date deterministically from domain ID so the filter is stable.
// Distribution (current date 2026-05-29):
//   IDs  1– 8  → expires in  3–24 days  (< 30 days)
//   IDs  9–20  → expires in 35–90 days  (30–90 days)
//   IDs 21–55  → expires in 99–371 days (> 90 days)
//   IDs 56–75  → already expired
function getDerivedExpiryDate(id: number): Date {
  const now = new Date()
  if (id <= 8)  return new Date(now.getTime() + id * 3 * 86400000)
  if (id <= 20) return new Date(now.getTime() + (30 + (id - 8) * 5) * 86400000)
  if (id <= 55) return new Date(now.getTime() + (91 + (id - 20) * 8) * 86400000)
  return new Date(now.getTime() - (id - 55) * 20 * 86400000)
}

export function applyPBFilter(domains: AnalyticsDomain[], filter: AnalyticsFilterState): AnalyticsDomain[] {
  return domains.filter(domain => {
    const id = parseInt(domain.id)

    // Provider
    if (filter.provider !== 'All' && domain.provider !== filter.provider) return false

    // TLD — extract extension from last segment of domain name
    if (filter.tld !== 'All') {
      const ext = '.' + domain.domainName.split('.').pop()
      if (ext !== filter.tld) return false
    }

    // Expiry — derived from domain ID
    if (filter.expiry !== 'All') {
      const now = new Date()
      const expiry = getDerivedExpiryDate(id)
      const days = Math.ceil((expiry.getTime() - now.getTime()) / 86400000)
      if (filter.expiry === 'Expired'    && days > 0)            return false
      if (filter.expiry === '< 30 Days'  && (days <= 0 || days >= 30)) return false
      if (filter.expiry === '30–90 Days' && (days < 30 || days > 90))  return false
      if (filter.expiry === '> 90 Days'  && days <= 90)          return false
    }

    // Renewal Type — derived from ID parity (even = Auto-Renew, odd = Manual)
    if (filter.renewalType !== 'All') {
      const isAuto = id % 2 === 0
      if (filter.renewalType === 'Auto-Renew' && !isAuto) return false
      if (filter.renewalType === 'Manual'      && isAuto)  return false
    }

    // Domain Type — multiple dots in name = Subdomain, single dot = Primary
    if (filter.domainType !== 'All') {
      const isPrimary = (domain.domainName.match(/\./g) || []).length <= 1
      if (filter.domainType === 'Primary'   && !isPrimary) return false
      if (filter.domainType === 'Subdomain' && isPrimary)  return false
    }

    // Domain Listing — derived from ID (id % 3 === 0 → Listed)
    if (filter.domainListing !== 'All') {
      const isListed = id % 3 === 0
      if (filter.domainListing === 'Listed'     && !isListed) return false
      if (filter.domainListing === 'Not Listed' && isListed)  return false
    }

    return true
  })
}

// ── Provider distribution stats (total: 188 domains) ─────────────────────────

export const TOTAL_DOMAINS = 188

export const mockProviderStats: ProviderStat[] = [
  // color = brand color used in Provider Distribution donut
  // pbColor = blue-shade palette used in Portfolio Breakdown donut
  { provider: 'Unstoppable', iconSrc: '/domain/ud.svg',          count: 58, percentage: 30.9, color: '#2639ED', pbColor: '#2639ED' },
  { provider: 'ENS',         iconSrc: '/domain/ethereum.svg',    count: 35, percentage: 18.6, color: '#16A163', pbColor: '#3d56ef' },
  { provider: 'Freename',    iconSrc: '/domain/freename.svg',    count: 25, percentage: 13.3, color: '#FF6B35', pbColor: '#5b7af0' },
  { provider: 'Arbitrum',    iconSrc: '/domain/arb.svg',         count: 20, percentage: 10.6, color: '#28A0F0', pbColor: '#7491f2' },
  { provider: 'Bonfida',     iconSrc: '/domain/bonnfida.svg',    count: 18, percentage: 9.6,  color: '#9945FF', pbColor: '#8fa8ff' },
  { provider: 'Tezos',       iconSrc: '/domain/tezos.svg',       count: 12, percentage: 6.4,  color: '#2C7DF7', pbColor: '#a8beff' },
  { provider: 'Aptos',       iconSrc: '/domain/apt.svg',         count: 8,  percentage: 4.3,  color: '#00C2FF', pbColor: '#bfd0ff' },
  { provider: 'Ton',         iconSrc: '/domain/ton-200.png',     count: 5,  percentage: 2.7,  color: '#0098EA', pbColor: '#c5d5ff' },
  { provider: 'Box',         iconSrc: '/domain/box.svg',         count: 4,  percentage: 2.1,  color: '#E89800', pbColor: '#d4e1ff' },
  { provider: 'Starknet',    iconSrc: '/domain/starknet_icon.png', count: 3, percentage: 1.6, color: '#FF4F00', pbColor: '#e5ecff' },
]

// ── Portfolio Value mock data ─────────────────────────────────────────────────

export interface PVBarProvider {
  key: string
  name: string
  iconSrc: string | null
  value: number
  domains: number
  solid: string | null
}

export const PV_BAR_MAX = 16000
export const PV_TOTAL_VALUE = 92000
export const PV_TOTAL_DOMAINS = 188
export const PV_TOTAL_PROVIDERS = 10
export const PV_MONTHLY_NEW = 22
export const PV_AVG_VALUE = 489
export const PV_AVG_GROWTH_PCT = 6.1

export const pvBarProviders: PVBarProvider[] = [
  { key: 'unstoppable', name: 'Unstoppable', iconSrc: '/domain/ud.svg',            value: 14200, domains: 58, solid: null },
  { key: 'ens',         name: 'ENS',         iconSrc: '/domain/ethereum.svg',       value: 12800, domains: 35, solid: null },
  { key: 'freename',    name: 'Freename',    iconSrc: '/domain/freename.svg',       value: 8600,  domains: 25, solid: null },
  { key: 'arbitrum',    name: 'Arbitrum',    iconSrc: '/domain/arb.svg',            value: 11800, domains: 20, solid: null },
  { key: 'bonfida',     name: 'Bonfida',     iconSrc: '/domain/bonnfida.svg',       value: 15200, domains: 18, solid: null },
  { key: 'tezos',       name: 'Tezos',       iconSrc: '/domain/tezos.svg',          value: 6400,  domains: 12, solid: null },
  { key: 'aptos',       name: 'Aptos',       iconSrc: '/domain/apt.svg',            value: 9200,  domains: 8,  solid: null },
  { key: 'ton',         name: 'Ton',         iconSrc: '/domain/ton-200.png',        value: 4800,  domains: 5,  solid: null },
  { key: 'box',         name: 'Box',         iconSrc: '/domain/box.svg',            value: 3200,  domains: 4,  solid: null },
  { key: 'starknet',    name: 'Starknet',    iconSrc: '/domain/starknet_icon.png',  value: 5800,  domains: 3,  solid: null },
]

export const pvSparklineData = [
  { i: 0,  v: 12000 }, { i: 1,  v: 18500 }, { i: 2,  v: 16200 },
  { i: 3,  v: 24800 }, { i: 4,  v: 31000 }, { i: 5,  v: 38400 },
  { i: 6,  v: 45200 }, { i: 7,  v: 52600 }, { i: 8,  v: 61800 },
  { i: 9,  v: 71400 }, { i: 10, v: 80900 }, { i: 11, v: 86500 },
  { i: 12, v: 92000 },
]

// ── Representative domain list (80 entries across all 10 providers + all statuses) ──

// registrationDate distribution (current date: 2026-05-29):
//   This Week  (≥2026-05-22): IDs 1–8   →  8 domains
//   This Month (≥2026-05-01): IDs 1–15  → 15 domains
//   This Year  (≥2026-01-01): IDs 1–25  → 25 domains
//   All Time                : IDs 1–75  → 75 domains
export const mockAnalyticsDomains: AnalyticsDomain[] = [
  // ── This Week (2026-05-22 → 2026-05-29) ──────────────────────────────────
  { id: '1',  domainName: 'creativecoder.crypto',    status: 'Active',      provider: 'Unstoppable', price: 120,  registrationDate: '2026-05-29' },
  { id: '2',  domainName: 'darkforest.nft',          status: 'Complete',    provider: 'Unstoppable', price: 45,   registrationDate: '2026-05-28' },
  { id: '3',  domainName: 'cryptowave.wallet',       status: 'Active',      provider: 'ENS',         price: 89,   registrationDate: '2026-05-27' },
  { id: '4',  domainName: 'strangerthings.x',        status: 'Pending',     provider: 'Freename',    price: 15,   registrationDate: '2026-05-26' },
  { id: '5',  domainName: 'defimaster.blockchain',   status: 'Active',      provider: 'Unstoppable', price: 200,  registrationDate: '2026-05-25' },
  { id: '6',  domainName: 'pixelwizard.888',         status: 'Expired',     provider: 'Arbitrum',    price: 12,   registrationDate: '2026-05-24' },
  { id: '7',  domainName: 'hellouniverse.og',        status: 'Active',      provider: 'Bonfida',     price: 12,   registrationDate: '2026-05-23' },
  { id: '8',  domainName: 'believeit.dao',           status: 'Pending',     provider: 'ENS',         price: 8,    registrationDate: '2026-05-22' },

  // ── This Month — not this week (2026-05-01 → 2026-05-21) ─────────────────
  { id: '9',  domainName: 'codemint.coin',           status: 'Active',      provider: 'Unstoppable', price: 30,   registrationDate: '2026-05-20' },
  { id: '10', domainName: 'tpenguofficial.hi',       status: 'Expired',     provider: 'Freename',    price: 5,    registrationDate: '2026-05-18' },
  { id: '11', domainName: 'prisonerofazkaban.bitcoin', status: 'Active',    provider: 'Unstoppable', price: 75,   registrationDate: '2026-05-15' },
  { id: '12', domainName: 'skybridge.klever',        status: 'Pending',     provider: 'Tezos',       price: 18,   registrationDate: '2026-05-12' },
  { id: '13', domainName: 'darkforest.eth',          status: 'Active',      provider: 'ENS',         price: 25,   registrationDate: '2026-05-10' },
  { id: '14', domainName: 'cryptowave.eth',          status: 'Active',      provider: 'ENS',         price: 20,   registrationDate: '2026-05-08' },
  { id: '15', domainName: 'deeplayer.eth',           status: 'Expired',     provider: 'ENS',         price: 20,   registrationDate: '2026-05-05' },

  // ── This Year — not this month (2026-01-01 → 2026-04-30) ─────────────────
  { id: '16', domainName: 'blocksync.eth',           status: 'Active',      provider: 'ENS',         price: 15,   registrationDate: '2026-04-20' },
  { id: '17', domainName: 'vaultmaster.eth',         status: 'Active',      provider: 'ENS',         price: 40,   registrationDate: '2026-04-10' },
  { id: '18', domainName: 'neonrider.eth',           status: 'Pending',     provider: 'ENS',         price: 12,   registrationDate: '2026-03-25' },
  { id: '19', domainName: 'infiniteloop.eth',        status: 'Active',      provider: 'ENS',         price: 60,   registrationDate: '2026-03-10' },
  { id: '20', domainName: 'quantumleap.eth',         status: 'Expired',     provider: 'ENS',         price: 8,    registrationDate: '2026-02-28' },
  { id: '21', domainName: 'jay.web3',                status: 'Active',      provider: 'Freename',    price: 35,   registrationDate: '2026-02-15' },
  { id: '22', domainName: 'defiking.meta',           status: 'Active',      provider: 'Freename',    price: 22,   registrationDate: '2026-01-30' },
  { id: '23', domainName: 'blockchainbros.dao',      status: 'Pending',     provider: 'Freename',    price: 18,   registrationDate: '2026-01-20' },
  { id: '24', domainName: 'hodlgang.defi',           status: 'Active',      provider: 'Freename',    price: 10,   registrationDate: '2026-01-10' },
  { id: '25', domainName: 'moonlanding.web3',        status: 'Active',      provider: 'Freename',    price: 28,   registrationDate: '2026-01-05' },

  // ── 2025 ──────────────────────────────────────────────────────────────────
  { id: '26', domainName: 'cryptopunk.nft',          status: 'Expired',     provider: 'Freename',    price: 5,    registrationDate: '2025-12-15' },
  { id: '27', domainName: 'deepspace.meta',          status: 'Active',      provider: 'Freename',    price: 15,   registrationDate: '2025-11-20' },
  { id: '28', domainName: 'codemint.arb',            status: 'Active',      provider: 'Arbitrum',    price: 5,    registrationDate: '2025-10-30' },
  { id: '29', domainName: 'defimaster.arb',          status: 'Pending',     provider: 'Arbitrum',    price: 5,    registrationDate: '2025-09-15' },
  { id: '30', domainName: 'skybridge.arb',           status: 'Active',      provider: 'Arbitrum',    price: 15,   registrationDate: '2025-08-20' },
  { id: '31', domainName: 'vaultguard.arb',          status: 'Active',      provider: 'Arbitrum',    price: 8,    registrationDate: '2025-07-10' },
  { id: '32', domainName: 'protoverse.arb',          status: 'Active',      provider: 'Arbitrum',    price: 22,   registrationDate: '2025-06-25' },
  { id: '33', domainName: 'neongate.arb',            status: 'Expired',     provider: 'Arbitrum',    price: 4,    registrationDate: '2025-05-30' },
  { id: '34', domainName: 'superape.sol',            status: 'Active',      provider: 'Bonfida',     price: 120,  registrationDate: '2025-04-15' },
  { id: '35', domainName: 'cryptoknight.sol',        status: 'Active',      provider: 'Bonfida',     price: 85,   registrationDate: '2025-03-20' },
  { id: '36', domainName: 'solanaverse.sol',         status: 'Active',      provider: 'Bonfida',     price: 200,  registrationDate: '2025-02-10' },
  { id: '37', domainName: 'moonwalk.sol',            status: 'Pending',     provider: 'Bonfida',     price: 45,   registrationDate: '2025-01-25' },

  // ── 2024 ──────────────────────────────────────────────────────────────────
  { id: '38', domainName: 'speedrunner.sol',         status: 'Expired',     provider: 'Bonfida',     price: 30,   registrationDate: '2024-12-20' },
  { id: '39', domainName: 'glitchwave.sol',          status: 'Active',      provider: 'Bonfida',     price: 60,   registrationDate: '2024-11-15' },
  { id: '40', domainName: 'neonrider.tez',           status: 'Active',      provider: 'Tezos',       price: 8,    registrationDate: '2024-10-30' },
  { id: '41', domainName: 'vaultguard.tez',          status: 'Active',      provider: 'Tezos',       price: 8,    registrationDate: '2024-09-20' },
  { id: '42', domainName: 'artblock.tez',            status: 'Active',      provider: 'Tezos',       price: 15,   registrationDate: '2024-08-15' },
  { id: '43', domainName: 'cosmicweb.tez',           status: 'Pending',     provider: 'Tezos',       price: 6,    registrationDate: '2024-07-10' },
  { id: '44', domainName: 'frostbyte.tez',           status: 'Expired',     provider: 'Tezos',       price: 4,    registrationDate: '2024-06-25' },
  { id: '45', domainName: 'flashpoint.apt',          status: 'Active',      provider: 'Aptos',       price: 55,   registrationDate: '2024-05-20' },
  { id: '46', domainName: 'drifter.apt',             status: 'Active',      provider: 'Aptos',       price: 40,   registrationDate: '2024-04-15' },
  { id: '47', domainName: 'zeroday.apt',             status: 'Pending',     provider: 'Aptos',       price: 30,   registrationDate: '2024-03-10' },
  { id: '48', domainName: 'liquidmind.apt',          status: 'Active',      provider: 'Aptos',       price: 70,   registrationDate: '2024-02-25' },
  { id: '49', domainName: 'tonwallet.ton',           status: 'Active',      provider: 'Ton',         price: 20,   registrationDate: '2024-01-20' },

  // ── 2023 ──────────────────────────────────────────────────────────────────
  { id: '50', domainName: 'grailsociety.ton',        status: 'Active',      provider: 'Ton',         price: 35,   registrationDate: '2023-12-15' },
  { id: '51', domainName: 'voidrunner.ton',          status: 'Pending',     provider: 'Ton',         price: 12,   registrationDate: '2023-11-10' },
  { id: '52', domainName: 'openstorage.box',         status: 'Active',      provider: 'Box',         price: 28,   registrationDate: '2023-10-25' },
  { id: '53', domainName: 'chainvault.box',          status: 'Active',      provider: 'Box',         price: 18,   registrationDate: '2023-09-20' },
  { id: '54', domainName: 'nexusbox.box',            status: 'Expired',     provider: 'Box',         price: 10,   registrationDate: '2023-08-15' },
  { id: '55', domainName: 'proofofwork.stark',       status: 'Active',      provider: 'Starknet',    price: 90,   registrationDate: '2023-07-10' },
  { id: '56', domainName: 'validium.stark',          status: 'Active',      provider: 'Starknet',    price: 60,   registrationDate: '2023-06-25' },
  { id: '57', domainName: 'recursion.stark',         status: 'Pending',     provider: 'Starknet',    price: 45,   registrationDate: '2023-05-20' },
  { id: '58', domainName: 'blocksync.polygon',       status: 'Active',      provider: 'Unstoppable', price: 9,    registrationDate: '2023-04-15' },
  { id: '59', domainName: 'metalayer.nft',           status: 'Active',      provider: 'Unstoppable', price: 25,   registrationDate: '2023-03-10' },
  { id: '60', domainName: 'hyperledger.crypto',      status: 'Active',      provider: 'Unstoppable', price: 55,   registrationDate: '2023-02-25' },
  { id: '61', domainName: 'codegarden.wallet',       status: 'Active',      provider: 'Unstoppable', price: 18,   registrationDate: '2023-01-20' },

  // ── 2022 ──────────────────────────────────────────────────────────────────
  { id: '62', domainName: 'zeropointfield.x',        status: 'Expired',     provider: 'Unstoppable', price: 7,    registrationDate: '2022-12-15' },
  { id: '63', domainName: 'futureframe.eth',         status: 'Active',      provider: 'ENS',         price: 35,   registrationDate: '2022-11-10' },
  { id: '64', domainName: 'mirrorworld.eth',         status: 'Active',      provider: 'ENS',         price: 28,   registrationDate: '2022-10-25' },
  { id: '65', domainName: 'alphazero.eth',           status: 'Active',      provider: 'ENS',         price: 90,   registrationDate: '2022-09-20' },
  { id: '66', domainName: 'solarpunk.web3',          status: 'Active',      provider: 'Freename',    price: 20,   registrationDate: '2022-08-15' },
  { id: '67', domainName: 'rocketfuel.dao',          status: 'Active',      provider: 'Freename',    price: 14,   registrationDate: '2022-07-10' },
  { id: '68', domainName: 'warpzone.arb',            status: 'Active',      provider: 'Arbitrum',    price: 10,   registrationDate: '2022-06-25' },
  { id: '69', domainName: 'gridlock.arb',            status: 'Expired',     provider: 'Arbitrum',    price: 3,    registrationDate: '2022-05-20' },
  { id: '70', domainName: 'blazenet.sol',            status: 'Active',      provider: 'Bonfida',     price: 95,   registrationDate: '2022-04-15' },
  { id: '71', domainName: 'phantomkey.sol',          status: 'Active',      provider: 'Bonfida',     price: 40,   registrationDate: '2022-03-10' },
  { id: '72', domainName: 'pixelguild.tez',          status: 'Active',      provider: 'Tezos',       price: 12,   registrationDate: '2022-02-25' },
  { id: '73', domainName: 'binaryrift.apt',          status: 'Expired',     provider: 'Aptos',       price: 20,   registrationDate: '2022-01-20' },
  { id: '74', domainName: 'brightchain.ton',         status: 'Active',      provider: 'Ton',         price: 25,   registrationDate: '2021-12-15' },
  { id: '75', domainName: 'dropzone.box',            status: 'Active',      provider: 'Box',         price: 22,   registrationDate: '2021-11-10' },
]
