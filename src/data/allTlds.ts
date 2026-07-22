import type { DomainProviderKey } from '@helpers/chaincurrency/chaincurrency'

export interface TldEntry {
  tld: string
  provider: DomainProviderKey
  price: string
  desc: string
}

// design-specific: every TLD across all 11 providers, matching the exact grouping used in
// DomainHero's ALL_TLDS list, extended here with the provider/price/desc fields this section's
// browse cards need. TLDs that also have a dedicated /tld/[slug] page (ens, bonfida, arbitrum,
// bnb, tezos, aptos, ton, starknet, box) route "View Page" there; others without a live page yet
// fall back to routing through /domain since no per-TLD page exists for them.
export const ALL_TLD_ENTRIES: TldEntry[] = [
  // ENS — 1 TLD
  { tld: '.eth', provider: 'ENS', price: '$2', desc: 'The original Ethereum identity.' },

  // Bonfida (Solana) — 1 TLD
  { tld: '.sol', provider: 'Bonfida', price: '$2', desc: 'Your identity across the Solana ecosystem.' },

  // Arbitrum — 1 TLD
  { tld: '.arb', provider: 'Arbitrum', price: '$2', desc: 'Built for the Arbitrum community.' },

  // Binance Smart Chain — 1 TLD
  { tld: '.bnb', provider: 'BinanceSmartChain', price: '$2', desc: 'Identity for the BNB Chain ecosystem.' },

  // Tezos — 1 TLD
  { tld: '.tez', provider: 'Tezos', price: '$2', desc: 'Your name on Tezos.' },

  // Aptos — 1 TLD
  { tld: '.apt', provider: 'Aptos', price: '$2', desc: 'Identity for the Aptos network.' },

  // Ton — 1 TLD
  { tld: '.ton', provider: 'Ton', price: '$2', desc: 'Your identity on The Open Network.' },

  // Starknet — 1 TLD
  { tld: '.stark', provider: 'Starknet', price: '$2', desc: 'Native identity for Starknet.' },

  // Box — 1 TLD
  { tld: '.box', provider: 'Box', price: '$2', desc: 'A universal identity across chains.' },

  // Freename — 8 TLDs
  { tld: '.metaverse', provider: 'Freename', price: '$2', desc: 'Your identity across virtual worlds.' },
  { tld: '.hodl', provider: 'Freename', price: '$2', desc: 'For the long-term believers.' },
  { tld: '.satoshi', provider: 'Freename', price: '$2', desc: 'A tribute to the original vision.' },
  { tld: '.genesis', provider: 'Freename', price: '$2', desc: 'Mark the beginning of your on-chain story.' },
  { tld: '.token', provider: 'Freename', price: '$2', desc: 'Identity built for tokenized assets.' },
  { tld: '.sat', provider: 'Freename', price: '$2', desc: 'Short, sharp, and Bitcoin-native.' },
  { tld: '.airdrop', provider: 'Freename', price: '$2', desc: 'Identity for the airdrop economy.' },
  { tld: '.rwa', provider: 'Freename', price: '$2', desc: 'Identity for real-world asset ownership.' },

  // Unstoppable Domains — 55 TLDs
  { tld: '.og', provider: 'UD', price: '$2', desc: 'The native identity of the Endless ecosystem.' },
  { tld: '.crypto', provider: 'UD', price: '$2', desc: 'The original Web3 identity.' },
  { tld: '.nft', provider: 'UD', price: '$2', desc: 'Identity built for the NFT community.' },
  { tld: '.wallet', provider: 'UD', price: '$2', desc: 'A readable address for every wallet.' },
  { tld: '.blockchain', provider: 'UD', price: '$2', desc: 'Identity for the entire blockchain economy.' },
  { tld: '.bitcoin', provider: 'UD', price: '$2', desc: 'Your name in the Bitcoin ecosystem.' },
  { tld: '.dao', provider: 'UD', price: '$2', desc: 'Identity for DAO members and contributors.' },
  { tld: '.zil', provider: 'UD', price: '$2', desc: 'Native identity for the Zilliqa network.' },
  { tld: '.x', provider: 'UD', price: '$2', desc: 'A short, universal Web3 identity.' },
  { tld: '.polygon', provider: 'UD', price: '$2', desc: 'Identity built for the Polygon ecosystem.' },
  { tld: '.binanceus', provider: 'UD', price: '$2', desc: 'Identity for the Binance.US community.' },
  { tld: '.bitget', provider: 'UD', price: '$2', desc: 'Identity for the Bitget community.' },
  { tld: '.anime', provider: 'UD', price: '$2', desc: 'Identity for anime fans and creators.' },
  { tld: '.manga', provider: 'UD', price: '$2', desc: 'Identity for manga fans and creators.' },
  { tld: '.clay', provider: 'UD', price: '$2', desc: 'A creative, expressive identity.' },
  { tld: '.witg', provider: 'UD', price: '$2', desc: 'A distinctive Web3 identity.' },
  { tld: '.wrkx', provider: 'UD', price: '$2', desc: 'Identity for work and collaboration.' },
  { tld: '.austin', provider: 'UD', price: '$2', desc: 'Identity for the Austin community.' },
  { tld: '.mumu', provider: 'UD', price: '$2', desc: 'A playful, memorable identity.' },
  { tld: '.bald', provider: 'UD', price: '$2', desc: 'Bold, simple, and memorable.' },
  { tld: '.chomp', provider: 'UD', price: '$2', desc: 'A fun, community-driven identity.' },
  { tld: '.tball', provider: 'UD', price: '$2', desc: 'Identity for the community.' },
  { tld: '.dfz', provider: 'UD', price: '$2', desc: 'Identity for the DeFi Zone community.' },
  { tld: '.secret', provider: 'UD', price: '$2', desc: 'Identity for the Secret Network.' },
  { tld: '.raiin', provider: 'UD', price: '$2', desc: 'A distinctive community identity.' },
  { tld: '.stepn', provider: 'UD', price: '$2', desc: 'Identity for the STEPN community.' },
  { tld: '.ubu', provider: 'UD', price: '$2', desc: 'A short, modern identity.' },
  { tld: '.pudgy', provider: 'UD', price: '$2', desc: 'Identity for the Pudgy Penguins community.' },
  { tld: '.go', provider: 'UD', price: '$2', desc: 'A short, action-oriented identity.' },
  { tld: '.smobler', provider: 'UD', price: '$2', desc: 'A distinctive community identity.' },
  { tld: '.lfg', provider: 'UD', price: '$2', desc: 'Identity for the LFG community.' },
  { tld: '.pog', provider: 'UD', price: '$2', desc: 'A playful, expressive identity.' },
  { tld: '.dream', provider: 'UD', price: '$2', desc: 'Identity for your on-chain ambitions.' },
  { tld: '.propykeys', provider: 'UD', price: '$2', desc: 'Identity for real estate ownership.' },
  { tld: '.unstoppable', provider: 'UD', price: '$2', desc: 'The flagship Unstoppable Domains identity.' },
  { tld: '.hi', provider: 'UD', price: '$2', desc: 'A short, friendly identity.' },
  { tld: '.u', provider: 'UD', price: '$2', desc: 'The shortest Web3 identity.' },
  { tld: '.wifi', provider: 'UD', price: '$2', desc: 'A modern, connected identity.' },
  { tld: '.metropolis', provider: 'UD', price: '$2', desc: 'Identity for the metaverse city builders.' },
  { tld: '.xmr', provider: 'UD', price: '$2', desc: 'Identity for the Monero community.' },
  { tld: '.boomer', provider: 'UD', price: '$2', desc: 'A playful, generational identity.' },
  { tld: '.npc', provider: 'UD', price: '$2', desc: 'A playful internet-culture identity.' },
  { tld: '.quantum', provider: 'UD', price: '$2', desc: 'A forward-looking, technical identity.' },
  { tld: '.emir', provider: 'UD', price: '$2', desc: 'A distinctive, premium identity.' },
  { tld: '.bay', provider: 'UD', price: '$2', desc: 'Identity for the Bay Area community.' },
  { tld: '.tribe', provider: 'UD', price: '$2', desc: 'Identity for your on-chain community.' },
  { tld: '.doga', provider: 'UD', price: '$2', desc: 'A playful, meme-inspired identity.' },
  { tld: '.podcast', provider: 'UD', price: '$2', desc: 'Identity for podcast creators.' },
  { tld: '.caw', provider: 'UD', price: '$2', desc: 'A distinctive community identity.' },
  { tld: '.onchain', provider: 'UD', price: '$2', desc: 'A statement identity for on-chain natives.' },
  { tld: '.donut', provider: 'UD', price: '$2', desc: 'A playful, sweet identity.' },
  { tld: '.miku', provider: 'UD', price: '$2', desc: 'Identity for the Hatsune Miku community.' },
  { tld: '.bitscrunch', provider: 'UD', price: '$2', desc: 'Identity for the bitsCrunch community.' },
  { tld: '.hub', provider: 'UD', price: '$2', desc: 'A central identity for your on-chain presence.' },
  { tld: '.brave', provider: 'UD', price: '$2', desc: 'Identity for the Brave community.' },
  { tld: '.888', provider: 'UD', price: '$2', desc: 'A lucky, memorable numeric identity.' },
]

export const TLDS_PER_PAGE = 6

export function getPaginatedTlds(page: number, pageSize: number = TLDS_PER_PAGE): TldEntry[] {
  const start = page * pageSize
  return ALL_TLD_ENTRIES.slice(start, start + pageSize)
}

export function getTldsByProvider(provider: DomainProviderKey | 'ALL'): TldEntry[] {
  if (provider === 'ALL') return ALL_TLD_ENTRIES
  return ALL_TLD_ENTRIES.filter(entry => entry.provider === provider)
}

// TLDs whose provider has a dedicated /tld/[slug] page live — routes there; every other TLD
// currently has no per-TLD page of its own, so it falls back to the domain hub itself
const PROVIDER_SLUG: Partial<Record<DomainProviderKey, string>> = {
  ENS: 'ens',
  Bonfida: 'bonfida',
  Arbitrum: 'arbitrum',
  BinanceSmartChain: 'bnb',
  Tezos: 'tezos',
  Aptos: 'aptos',
  Ton: 'ton',
  Starknet: 'starknet',
  Box: 'box',
}

export function getTldHref(entry: TldEntry): string {
  const slug = PROVIDER_SLUG[entry.provider]
  return slug ? `/tld/${slug}` : '/domain'
}
